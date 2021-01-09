const tracer = require('signalfx-tracing').init({
  service: 'kikeyama_express',
  tags: {stage: 'demo'}
});

//const { tracer } = require('./tracing');

const express = require('express');
const app = express();
const port = 3030;

const bodyParser = require('body-parser');

const logger = require('./logger');
const client = require('./grpc_client');

const gorillaHost = process.env.GORILLA_HOST || 'localhost';
const gorillaPort = process.env.GORILLA_PORT || 9090;

const http = require('http')
const options = {
  host: gorillaHost,
  port: gorillaPort,
  path: '/api/grpc/animal',
  headers: {'Accept': 'application/json'},
  method: 'GET'
};

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: false
}));


app.get('/', (req, res) => {
  logger.info('root request');
  res.send('Hello World!');
});

app.get('/healthz', (req, res) =>{
  logger.info('healthz request');
  res.set('Content-Type', 'application/json');
  res.send({status:"ok"});
});

app.get('/api/gorilla/animal', (req, res) =>{
  logger.info('request handling at /api/gorilla/animal dispatches gorilla at ' + gorillaHost + ':' + gorillaPort);
  var req2 = http.request(options, res2 => {
    res2.on('data', chunk => {
      logger.info(`${chunk}`);
      res.set('Content-Type', 'application/json');
      res.send(chunk);
    });
  });

  req2.on('error', e => {
    logger.error(`Got error: ${e.message}`);
  });

  req2.end();
});

app.get('/api/grpc/animal', (req, res) => {
  logger.info('GET request handling at /api/grpc/animal');

  client.listAnimals({}, (err, response) => {
    logger.info('Request ListAnimals via gRPC');
    res.set('Content-Type', 'application/json');
    res.send(response.animals);
  });
});

app.get('/api/grpc/animal/:animalId([0-9a-f\-]{36})', (req, res) => {
  var animalId = req.params.animalId;
  logger.info('GET request handling at /api/grpc/animal/' + animalId);

  client.getAnimal({id: animalId}, (err, response) => {
    logger.info('Request GetAnimal via gRPC');
    res.set('Content-Type', 'application/json');
    res.send(response);
  });
});

app.post('/api/grpc/animal', (req, res) => {
  logger.info('POST request handling at /api/grpc/animal');
  logger.debug(req.body);

  client.createAnimal(req.body, (err, response) => {
    logger.info('Request CreateAnimal via gRPC');
    res.set('Content-Type', 'application/json');
    res.send(response);
  });
});

app.delete('/api/grpc/animal/:animalId([0-9a-f\-]{36})', (req, res) => {
  var animalId = req.params.animalId;
  logger.info('DELETE request handling at /api/grpc/animal/' + animalId);

  client.deleteAnimal({id: animalId}, (err, response) => {
    logger.info('Request DeleteAnimal via gRPC');
    res.set('Content-Type', 'application/json');
    res.send({status:'ok'});
  });
});


app.use(function (req, res, next) {
  res.status(404).send({
    code: 404,
    message: 'Not Found'
  });
});

app.listen(port, () => {
  logger.info(`App listening at http://localhost:${port}`)
});