import { Request, Response } from 'express';

import {
  getAcademyJourneys,
  getAcademyModules,
  getAcademyTracks,
  getModulesWithProgress,
  getModuleProducts,
  getModuleRecommendations,
  getModuleRecommendedProductsList,
  getRecommendedModule,
  getUserProgressSummary,
  completeModuleForUser,
} from '../services/academy.service';

export const getJourneysController = async (_req: Request, res: Response) => {
  const journeys = await getAcademyJourneys();
  res.json(journeys);
};

export const getTracksController = async (_req: Request, res: Response) => {
  const tracks = await getAcademyTracks();
  res.json(tracks);
};

export const getModulesController = async (req: Request, res: Response) => {
  const user = (req as any).user;
  const modules = await getModulesWithProgress(user?.id);
  res.json(modules);
};

export const getRecommendedModuleController = async (_req: Request, res: Response) => {
  const module = await getRecommendedModule();
  res.json(module);
};

export const getModuleProductsController = async (req: Request, res: Response) => {
  try {
    const { moduleCode } = req.params;
    const data = await getModuleProducts(moduleCode);
    res.json(data);
  } catch (error: any) {
    res.status(404).json({ error: error?.message || 'Module not found' });
  }
};

export const getModuleRecommendationsController = async (req: Request, res: Response) => {
  try {
    const { moduleCode } = req.params;
    const data = await getModuleRecommendations(moduleCode);
    res.json(data);
  } catch (error: any) {
    res.status(404).json({ error: error?.message || 'Module not found' });
  }
};

export const getModuleRecommendedListController = async (req: Request, res: Response) => {
  try {
    const { moduleCode } = req.params;
    const products = await getModuleRecommendedProductsList(moduleCode);
    res.json({
      moduleCode,
      products,
    });
  } catch (error: any) {
    res.status(404).json({ error: error?.message || 'Module not found' });
  }
};

export const completeModuleController = async (req: Request, res: Response) => {
  const user = (req as any).user;
  const userId = user?.id;
  const { moduleId } = req.body || {};

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (!moduleId) {
    return res.status(400).json({ error: 'moduleId is required' });
  }

  try {
    const completedModuleId = await completeModuleForUser(userId, moduleId);
    const summary = await getUserProgressSummary(userId);
    return res.json({ moduleId: completedModuleId, summary });
  } catch (error: any) {
    return res.status(400).json({ error: error?.message || 'Unable to complete module' });
  }
};

export const getProgressController = async (req: Request, res: Response) => {
  const user = (req as any).user;
  const progress = await getUserProgressSummary(user?.id);
  return res.json(progress);
};
