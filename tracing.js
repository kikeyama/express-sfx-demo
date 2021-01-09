const api = require("@opentelemetry/api");
const { NodeTracerProvider } = require('@opentelemetry/node');
const { B3Propagator } = require("@opentelemetry/core");
const { ZipkinExporter } = require('@opentelemetry/exporter-zipkin');
const { BatchSpanProcessor, ConsoleSpanExporter } = require('@opentelemetry/tracing');

api.propagation.setGlobalPropagator(new B3Propagator());

const provider = new NodeTracerProvider();
provider.register({
  propagator: new B3Propagator(),
});

const service = process.env.SIGNALFX_SERVICE_NAME || 'kikeyama_express_otel';

const exporter = new ZipkinExporter({
  serviceName: service,
  url: process.env.SIGNALFX_ENDPOINT_URL || 'http://localhost:9080/v1/trace',
});

const tracer = provider.getTracer(service)
provider.addSpanProcessor(new BatchSpanProcessor(exporter));

const CONSOLE_SPAN = process.env['CONSOLE_SPAN'];
if (CONSOLE_SPAN === 'true') {
  provider.addSpanProcessor(new BatchSpanProcessor(new ConsoleSpanExporter(), { bufferTimeout: 1000 }));
}

module.exports = {
  tracer
}