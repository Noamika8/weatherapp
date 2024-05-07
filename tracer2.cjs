import { BasicTracerProvider, ConsoleSpanExporter, SimpleSpanProcessor } from '@opentelemetry/tracing';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { MeterProvider, PrometheusExporter } from '@opentelemetry/metrics';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';

// Setup for Tracing
const exporter = new OTLPTraceExporter({
    url: "http://localhost:4318/v1/traces"
});
const provider = new BasicTracerProvider({
    resource: new Resource({
        [SemanticResourceAttributes.SERVICE_NAME]: "WeatherService",
        [SemanticResourceAttributes.SERVICE_VERSION]: "1.0.0",  // Example version
    })
});
provider.addSpanProcessor(new SimpleSpanProcessor(new ConsoleSpanExporter()));
provider.addSpanProcessor(new SimpleSpanProcessor(exporter));
provider.register();

// Setup for Metrics
const promExporter = new PrometheusExporter({ port: 9464 }, () => {
  console.log('Prometheus scrape endpoint: http://localhost:9464/metrics');
});
const meter = new MeterProvider({
  exporter: promExporter,
  interval: 5000,
}).getMeter('weather-app-meter');

const requestCounter = meter.createCounter('requests', {
  description: 'Count of requests received',
  unit: '1',
});

// Add labels for metrics
app.use((req, res, next) => {
  res.on('finish', () => {
    requestCounter.add(1, {
      city: req.query.city || 'unknown',  // Assuming city is passed as a query parameter
      'status-code': res.statusCode.toString(),
    });
  });
  next();
});

const sdk = new NodeSDK({
    traceExporter: exporter,
    metricExporter: promExporter,
    instrumentations: [getNodeAutoInstrumentations()]
});

sdk.start()
    .then(() => console.log("Tracing and metrics initialized"))
    .catch((error) => console.error("Error initializing OpenTelemetry SDK", error));

process.on("SIGTERM", () => {
    sdk.shutdown()
        .then(() => console.log("OpenTelemetry SDK terminated"))
        .catch((error) => console.error("Error terminating OpenTelemetry SDK", error))
        .finally(() => process.exit(0));
});
