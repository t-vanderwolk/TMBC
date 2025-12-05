import { Request, Response } from 'express';

import {
  getAcademyJourneys,
  getAcademyModules,
  getAcademyTracks,
  getModuleProducts,
  getModuleRecommendations,
  getModuleRecommendedProductsList,
  getRecommendedModule,
} from '../services/academy.service';

export const getJourneysController = async (_req: Request, res: Response) => {
  const journeys = await getAcademyJourneys();
  res.json(journeys);
};

export const getTracksController = async (_req: Request, res: Response) => {
  const tracks = await getAcademyTracks();
  res.json(tracks);
};

export const getModulesController = async (_req: Request, res: Response) => {
  const modules = await getAcademyModules();
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

export const getProgressController = async (_req: Request, res: Response) => {
  return res.json({ completed: 3, total: 12 });
};
