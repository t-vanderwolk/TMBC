import express from 'express';
import cors from 'cors';

import authRoutes from './routes/auth.routes';
import inviteRoutes from './routes/invite.routes';
import academyRoutes from './routes/academy.routes';
import registryRoutes from './routes/registry.routes';
import communityRoutes from './routes/community.routes';
import mentorRoutes from './routes/mentor.routes';
import adminRoutes from './routes/admin.routes';
import waitlistRoutes from './routes/waitlist.routes';
import dashboardRoutes from './routes/dashboard.routes';
import eventsRoutes from './routes/events.routes';
import journalRoutes from './routes/journal.routes';
import chatRoutes from './routes/chat.routes';
import myRegistryRoutes from './routes/myregistry.routes';

import { errorHandler } from './middleware/errorHandler';

const appInstance = express();
const allowedOrigin = process.env.FRONTEND_URL || 'http://localhost:3000';

appInstance.use(
  cors({
    origin: allowedOrigin,
    credentials: true,
  }),
);
appInstance.use(express.json());

appInstance.use('/api/auth', authRoutes);
appInstance.use('/api/invite', inviteRoutes);
appInstance.use('/api/dashboard', dashboardRoutes);
appInstance.use('/api/academy', academyRoutes);
appInstance.use('/api/registry', registryRoutes);
appInstance.use('/api/community', communityRoutes);
appInstance.use('/api/events', eventsRoutes);
appInstance.use('/api/journal', journalRoutes);
appInstance.use('/api/chat', chatRoutes);
appInstance.use('/api/myregistry', myRegistryRoutes);
appInstance.use('/api/mentor', mentorRoutes);
appInstance.use('/api/admin', adminRoutes);
appInstance.use('/api/waitlist', waitlistRoutes);

appInstance.use(errorHandler);

export const app = appInstance;
