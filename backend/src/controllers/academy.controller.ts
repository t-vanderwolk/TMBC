import { Request, Response } from 'express';

import {
  getAcademyJourneys,
  getAcademyModules,
  getAcademyTracks,
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
