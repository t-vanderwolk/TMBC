import { Router } from 'express';

import {
  approveAdminWaitlistController,
  createAdminEventController,
  deleteAdminEventController,
  getAdminEventsController,
  getAdminMentorsController,
  getAdminModulesController,
  getAdminRegistryController,
  getAdminSettingsController,
  getAdminStatsController,
  getAdminUsersController,
  getAdminWaitlistController,
  rejectAdminWaitlistController,
  updateAdminEventController,
  updateAdminModuleController,
  updateAdminMentorController,
  updateAdminSettingsController,
  updateAdminUserController,
  deleteAdminUserController,
} from '../controllers/admin.controller';

const router = Router();

router.get('/stats', getAdminStatsController);

router.get('/users', getAdminUsersController);
router.patch('/users/:id', updateAdminUserController);
router.delete('/users/:id', deleteAdminUserController);

router.get('/mentors', getAdminMentorsController);
router.patch('/mentors/:id', updateAdminMentorController);

router.get('/events', getAdminEventsController);
router.post('/events', createAdminEventController);
router.patch('/events/:id', updateAdminEventController);
router.delete('/events/:id', deleteAdminEventController);

router.get('/registry', getAdminRegistryController);

router.get('/modules', getAdminModulesController);
router.patch('/modules/:id', updateAdminModuleController);

router.get('/settings', getAdminSettingsController);
router.patch('/settings', updateAdminSettingsController);

router.get('/waitlist', getAdminWaitlistController);
router.post('/waitlist/approve', approveAdminWaitlistController);
router.post('/waitlist/reject', rejectAdminWaitlistController);

export default router;
