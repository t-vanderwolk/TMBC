import 'dotenv/config';

import http from 'http';

import { app } from './app';
import healthRoutes from './routes/health.routes';
import mvpHealthRoutes from './routes/mvp/health.routes';
import { initChatWebSocket } from './ws/chat.server';

app.use('/api', healthRoutes);
app.use('/api/health', mvpHealthRoutes);
const PORT = Number(process.env.PORT) || 4000;
const server = http.createServer(app);

initChatWebSocket(server);

server.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`TMBC backend running at http://localhost:${PORT}`);
});
