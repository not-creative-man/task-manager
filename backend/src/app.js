import express from 'express';
import cors from 'cors';
import client from 'prom-client';
import userRoutes from './routes/UserRoutes.js';
import todoRoutes from './routes/TodoRoutes.js';
import healthRoutes from './routes/HealthRoutes.js';

const app = express();
app.use(express.json());
app.use(cors());

// Prometheus metrics setup
client.collectDefaultMetrics();
const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'HTTP request duration in seconds',
  labelNames: ['method', 'route', 'code'],
  buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2, 5]
});

app.use((req, res, next) => {
  const end = httpRequestDuration.startTimer();
  res.on('finish', () => {
    const route = req.route?.path || req.path || 'unknown';
    end({ method: req.method, route, code: res.statusCode });
  });
  next();
});

app.get('/metrics', async (_req, res) => {
  try {
    res.set('Content-Type', client.register.contentType);
    res.end(await client.register.metrics());
  } catch (e) {
    res.status(500).send('metrics_error');
  }
});

app.use('/api/user', userRoutes);
app.use('/api/todo', todoRoutes);
app.use('/api/health', healthRoutes);

app.listen(3000, () => console.log('Server started on port 3000'));