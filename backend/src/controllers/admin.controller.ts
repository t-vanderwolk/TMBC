import { Request, Response } from 'express';

import {
  AdminEvent,
  AdminMentor,
  AdminModule,
  AdminSettingsPayload,
  AdminStatsPayload,
  getAdminEvents,
  createAdminEvent,
  updateAdminEvent,
  deleteAdminEvent,
  getAdminMentors,
  updateAdminMentor,
  getAdminModules,
  updateAdminModule,
  getAdminRegistryMonitor,
  getAdminSettings,
  updateAdminSettings,
  getAdminStats,
  getAdminUsers,
  updateAdminUser,
  deleteAdminUser,
  getAdminWaitlistEntries,
  approveWaitlistEntry,
  rejectWaitlistEntry,
} from '../services/admin.service';

const respond = <T>(res: Response, data: T, status = 200) => res.status(status).json({ data });

export const getAdminStatsController = async (_req: Request, res: Response) => {
  const data = await getAdminStats();
  return respond<AdminStatsPayload>(res, data);
};

export const getAdminUsersController = async (_req: Request, res: Response) => {
  const data = await getAdminUsers();
  return respond(res, data);
};

export const updateAdminUserController = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: 'user id is required' });
  }
  const payload = req.body;
  const updated = await updateAdminUser(id, payload);
  return respond(res, updated);
};

export const deleteAdminUserController = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: 'user id is required' });
  }
  await deleteAdminUser(id);
  return res.status(204).json({});
};

export const getAdminMentorsController = async (_req: Request, res: Response) => {
  const data = await getAdminMentors();
  return respond<AdminMentor[]>(res, data);
};

export const updateAdminMentorController = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: 'mentor id is required' });
  }
  const payload = req.body;
  const updated = await updateAdminMentor(id, payload);
  return respond(res, updated);
};

export const getAdminEventsController = async (_req: Request, res: Response) => {
  const data = await getAdminEvents();
  return respond<AdminEvent[]>(res, data);
};

export const createAdminEventController = async (req: Request, res: Response) => {
  const user = (req as any).user;
  const payload = req.body;
  if (!payload?.name || !payload?.date) {
    return res.status(400).json({ error: 'name and date are required' });
  }
  const event = await createAdminEvent(payload, user?.id, user?.name ?? user?.email);
  return respond(res, event, 201);
};

export const updateAdminEventController = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: 'event id is required' });
  }
  const payload = req.body;
  const event = await updateAdminEvent(id, payload);
  return respond(res, event);
};

export const deleteAdminEventController = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: 'event id is required' });
  }
  await deleteAdminEvent(id);
  return res.status(204).json({});
};

export const getAdminRegistryController = async (_req: Request, res: Response) => {
  const data = await getAdminRegistryMonitor();
  return respond(res, data);
};

export const getAdminModulesController = async (_req: Request, res: Response) => {
  const data = await getAdminModules();
  return respond<AdminModule[]>(res, data);
};

export const updateAdminModuleController = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: 'module id is required' });
  }
  const data = await updateAdminModule(id, req.body);
  return respond(res, data);
};

export const getAdminSettingsController = async (_req: Request, res: Response) => {
  const data = await getAdminSettings();
  return respond<AdminSettingsPayload>(res, data);
};

export const updateAdminSettingsController = async (req: Request, res: Response) => {
  const data = await updateAdminSettings(req.body);
  return respond<AdminSettingsPayload>(res, data);
};

export const getAdminWaitlistController = async (_req: Request, res: Response) => {
  const entries = await getAdminWaitlistEntries();
  return respond(res, entries);
};

export const approveAdminWaitlistController = async (req: Request, res: Response) => {
  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ error: 'id is required' });
  }
  const entry = await approveWaitlistEntry(id);
  return respond(res, entry);
};

export const rejectAdminWaitlistController = async (req: Request, res: Response) => {
  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ error: 'id is required' });
  }
  const entry = await rejectWaitlistEntry(id);
  return respond(res, entry);
};
