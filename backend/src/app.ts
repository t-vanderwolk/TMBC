import express from 'express';
import cors from 'cors';

import authRoutes from './routes/auth.routes';
import inviteRoutes from './routes/invite.routes';
import academyRoutes from './routes/academy.routes';
import registryRoutes from './routes/registry.routes';
import communityRoutes from './routes/community.routes';
import mentorRoutes from './routes/mentor.routes';
import adminRoutes from './routes/admin.routes';
import { errorHandler } from './middleware/errorHandler';

const appInstance = express();

appInstance.use(cors());
appInstance.use(express.json());

appInstance.use('/api/auth', authRoutes);
appInstance.use('/api/invite', inviteRoutes);
appInstance.use('/api/academy', academyRoutes);
appInstance.use('/api/registry', registryRoutes);
appInstance.use('/api/community', communityRoutes);
appInstance.use('/api/mentor', mentorRoutes);
appInstance.use('/api/admin', adminRoutes);

appInstance.use(errorHandler);

export const app = appInstance;
