"use client";

import { useMemo } from "react";
import axios from "axios";

import { Auth } from "@/lib/auth.client";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = Auth.get();
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

type ApiResponse<T = unknown> = {
  status: "ok";
  data: T;
};

export type SignupUserInput = {
  Email: string;
  Password: string;
  FirstName: string;
  LastName: string;
  City?: string;
  State?: string;
  Country?: string;
  RegistryType?: string;
};

export type SearchRegistriesParams = {
  FirstName?: string;
  LastName?: string;
  City?: string;
  State?: string;
  Country?: string;
  RegistryType?: string;
};

export type GetRegistriesParams = {
  Email: string;
};

export type GetRegistryItemsParams = {
  RegistryId: string;
};

export type AddItemInput = {
  RegistryId: string;
  ItemName: string;
  Description?: string;
  Price?: number;
  Url?: string;
  ImageUrl?: string;
};

export type UpdateItemInput = {
  RegistryId: string;
  ItemId: string;
  ItemName?: string;
  Description?: string;
  Price?: number;
  Url?: string;
  ImageUrl?: string;
};

export type RemoveItemInput = {
  RegistryId: string;
  ItemId: string;
};

export type MarkPurchasedInput = {
  RegistryId: string;
  ItemId: string;
  Purchased: boolean;
};

export const useMyRegistry = () => {
  return useMemo(() => {
    const signupUser = async (payload: SignupUserInput): Promise<ApiResponse> => {
      const response = await api.post<ApiResponse>("/api/registry/myregistry/signup", payload);
      return response.data;
    };

    const searchRegistries = async (params: SearchRegistriesParams): Promise<ApiResponse> => {
      const response = await api.get<ApiResponse>("/api/registry/myregistry/search", { params });
      return response.data;
    };

    const getRegistries = async (params: GetRegistriesParams): Promise<ApiResponse> => {
      const response = await api.get<ApiResponse>("/api/registry/myregistry/registries", { params });
      return response.data;
    };

    const getRegistryItems = async (params: GetRegistryItemsParams): Promise<ApiResponse> => {
      const response = await api.get<ApiResponse>("/api/registry/myregistry/items", { params });
      return response.data;
    };

    const addItem = async (payload: AddItemInput): Promise<ApiResponse> => {
      const response = await api.post<ApiResponse>("/api/registry/myregistry/items/add", payload);
      return response.data;
    };

    const updateItem = async (payload: UpdateItemInput): Promise<ApiResponse> => {
      const response = await api.post<ApiResponse>("/api/registry/myregistry/items/update", payload);
      return response.data;
    };

    const removeItem = async (payload: RemoveItemInput): Promise<ApiResponse> => {
      const response = await api.post<ApiResponse>("/api/registry/myregistry/items/remove", payload);
      return response.data;
    };

    const markPurchased = async (payload: MarkPurchasedInput): Promise<ApiResponse> => {
      const response = await api.post<ApiResponse>("/api/registry/myregistry/items/purchased", payload);
      return response.data;
    };

    return {
      signupUser,
      searchRegistries,
      getRegistries,
      getRegistryItems,
      addItem,
      updateItem,
      removeItem,
      markPurchased,
    };
  }, []);
};
