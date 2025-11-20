import { Request, Response } from "express";
import {
  AddItemPayload,
  GetRegistriesParams,
  GetRegistryItemsParams,
  MarkPurchasedPayload,
  MyRegistryService,
  RemoveItemPayload,
  SearchRegistriesParams,
  SignupUserPayload,
  UpdateItemPayload,
} from "../services/myregistry/myregistry.service";

const respondWithError = (res: Response, error: unknown) => {
  const normalized = error as { status?: number; message?: string };
  res.status(normalized.status ?? 500).json(normalized);
};

export const signup = async (req: Request, res: Response) => {
  try {
    const payload = req.body as SignupUserPayload;
    const data = await MyRegistryService.signupUser(payload);
    res.json({ status: "ok", data });
  } catch (error) {
    respondWithError(res, error);
  }
};

export const search = async (req: Request, res: Response) => {
  try {
    const params = req.query as SearchRegistriesParams;
    const data = await MyRegistryService.searchRegistries(params);
    res.json({ status: "ok", data });
  } catch (error) {
    respondWithError(res, error);
  }
};

export const registries = async (req: Request, res: Response) => {
  try {
    const params = req.query as GetRegistriesParams;
    const data = await MyRegistryService.getRegistries(params);
    res.json({ status: "ok", data });
  } catch (error) {
    respondWithError(res, error);
  }
};

export const items = async (req: Request, res: Response) => {
  try {
    const params = req.query as GetRegistryItemsParams;
    const data = await MyRegistryService.getRegistryItems(params);
    res.json({ status: "ok", data });
  } catch (error) {
    respondWithError(res, error);
  }
};

export const addItem = async (req: Request, res: Response) => {
  try {
    const payload = req.body as AddItemPayload;
    const data = await MyRegistryService.addItem(payload);
    res.json({ status: "ok", data });
  } catch (error) {
    respondWithError(res, error);
  }
};

export const updateItem = async (req: Request, res: Response) => {
  try {
    const payload = req.body as UpdateItemPayload;
    const data = await MyRegistryService.updateItem(payload);
    res.json({ status: "ok", data });
  } catch (error) {
    respondWithError(res, error);
  }
};

export const removeItem = async (req: Request, res: Response) => {
  try {
    const payload = req.body as RemoveItemPayload;
    const data = await MyRegistryService.removeItem(payload);
    res.json({ status: "ok", data });
  } catch (error) {
    respondWithError(res, error);
  }
};

export const purchased = async (req: Request, res: Response) => {
  try {
    const payload = req.body as MarkPurchasedPayload;
    const data = await MyRegistryService.markPurchased(payload);
    res.json({ status: "ok", data });
  } catch (error) {
    respondWithError(res, error);
  }
};
