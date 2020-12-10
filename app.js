const tracer = require('signalfx-tracing').init({
  service: 'kikeyama_express',
  tags: {stage: 'demo'}
})

const express = require('express')
const app = express()
const port = 3030

const winston = require('winston');
const { combine, timestamp, json } = winston.format;
const logger = winston.createLogger({
	level: 'info',
	format: combine(
		timestamp(),
		json()
	),
	transports: [
		new winston.transports.Console()
	],
});

const gorillaHost = process.env.GORILLA_HOST || 'localhost'
const gorillaPort = process.env.GORILLA_PORT || 9090

const http = require('http')
const options = {
  host: gorillaHost,
  port: gorillaPort,
  path: '/api/grpc/animal',
  headers: {'Accept': 'application/json'},
  method: 'GET'
}

app.get('/', (req, res) => {
	logger.info('root request')
	res.send('Hello World!')
})

app.get('/healthz', (req, res) =>{
	logger.info('healthz request')
	res.set('Content-Type', 'application/json')
	res.send({status:"ok"})
})

app.get('/api/gorilla/animal', (req, res) =>{
	logger.info('gorilla request')
	var req2 = http.request(options, res2 => {
		res2.on('data', chunk => {
			logger.info(`${chunk}`);
			res.set('Content-Type', 'application/json')
			res.send(chunk)
		});
	})

	req2.on('error', e => {
		logger.error(`Got error: ${e.message}`);
	});

	req2.end()
})

app.listen(port, () => {
	logger.info(`Example app listening at http://localhost:${port}`)
})