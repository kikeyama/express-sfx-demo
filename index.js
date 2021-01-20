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
    if (!err) {
      logger.error('gRPC ListAnimals request success');
      res.set('Content-Type', 'application/json');
      res.send(response.animals);
    } else {
      logger.error('gRPC ListAnimals request failed');
      res.set('Content-Type', 'application/json');
      res.status(500).send({
        code: 500,
        status: 'error',
        message: 'grpc error: ' + err
      });
    }
  });
});

app.get('/api/grpc/animal/:animalId([0-9a-f\-]{36})', (req, res) => {
  var animalId = req.params.animalId;
  logger.info('GET request handling at /api/grpc/animal/' + animalId);

  client.getAnimal({id: animalId}, (err, response) => {
    logger.info('Request GetAnimal via gRPC');
    if (!err) {
      logger.error('gRPC GetAnimal request success');
      res.set('Content-Type', 'application/json');
      res.send(response);
    } else {
      logger.error('gRPC GetAnimal request failed');
      res.set('Content-Type', 'application/json');
      res.status(500).send({
        code: 500,
        status: 'error',
        message: 'grpc error: ' + err
      });
    }
  });
});

app.post('/api/grpc/animal', (req, res) => {
  logger.info('POST request handling at /api/grpc/animal');
  logger.debug(req.body);

  client.createAnimal(req.body, (err, response) => {
    logger.info('Request CreateAnimal via gRPC');
    if (!err) {
      logger.error('gRPC CreateAnimal request success');
      res.set('Content-Type', 'application/json');
      res.send(response);
    } else {
      logger.error('gRPC CreateAnimal request failed');
      res.set('Content-Type', 'application/json');
      res.status(500).send({
        code: 500,
        status: 'error',
        message: 'grpc error: ' + err
      });
    }
  });
});

app.delete('/api/grpc/animal/:animalId([0-9a-f\-]{36})', (req, res) => {
  var animalId = req.params.animalId;
  logger.info('DELETE request handling at /api/grpc/animal/' + animalId);

  client.deleteAnimal({id: animalId}, (err, response) => {
    logger.info('Request DeleteAnimal via gRPC');
    if (!err) {
      logger.error('gRPC DeleteAnimal request success');
      res.set('Content-Type', 'application/json');
      res.send({status:'ok'});
    } else {
      logger.error('gRPC DeleteAnimal request failed');
      res.set('Content-Type', 'application/json');
      res.status(500).send({
        code: 500,
        status: 'error',
        message: 'grpc error: ' + err
      });
    }
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