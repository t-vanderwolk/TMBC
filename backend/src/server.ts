import 'dotenv/config';

import { app } from './app';
import healthRoutes from './routes/health.routes';

app.use('/api', healthRoutes);
const PORT = Number(process.env.PORT) || 4000;

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`TMBC backend running at http://localhost:${PORT}`);
});
