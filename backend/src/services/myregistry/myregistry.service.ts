import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

const BASE_URL = "https://api.myregistry.com/RegistryApi/1/0/json/";

const apiToken = process.env.MYREGISTRY_API_TOKEN;
if (!apiToken) {
  throw new Error("Missing MYREGISTRY_API_TOKEN in environment variables.");
}

const axiosConfig: AxiosRequestConfig = {
  baseURL: BASE_URL,
  headers: {
    accept: "application/json",
    "Content-Type": "application/json",
    ApiToken: apiToken,
  },
};

const basicAuthUser = process.env.MYREGISTRY_BASIC_AUTH_USERNAME;
const basicAuthPassword = process.env.MYREGISTRY_BASIC_AUTH_PASSWORD;
if (basicAuthUser && basicAuthPassword) {
  axiosConfig.auth = {
    username: basicAuthUser,
    password: basicAuthPassword,
  };
}

const client: AxiosInstance = axios.create(axiosConfig);

const handleError = (error: unknown): never => {
  if (axios.isAxiosError(error)) {
    throw {
      status: error.response?.status ?? 500,
      message: error.response?.data ?? error.message,
    };
  }

  throw {
    status: 500,
    message: error instanceof Error ? error.message : "Unknown MyRegistry error",
  };
};

const normalizeSignupResponse = (payload: Record<string, unknown>) => {
  const normalizedId =
    (payload["RegistryId"] as string) ??
    (payload["RegistryUserId"] as string) ??
    (payload["UserId"] as string) ??
    (payload["MemberId"] as string) ??
    (payload["memberId"] as string) ??
    (payload["id"] as string) ??
    "";

  const normalizedEmail =
    (payload["Email"] as string) ??
    (payload["email"] as string) ??
    (payload["registryEmail"] as string) ??
    "";

  return {
    myRegistryUserId: normalizedId,
    email: normalizedEmail,
    raw: payload,
  };
};

export type SignupUserPayload = {
  Email: string;
  Password: string;
  FirstName: string;
  LastName: string;
  City?: string;
  State?: string;
  Country?: string;
  RegistryType?: string;
};

export type SignupUserResponse = {
  myRegistryUserId: string;
  email: string;
  raw: Record<string, unknown>;
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

export type AddItemPayload = {
  RegistryId: string;
  ItemName: string;
  Description?: string;
  Price?: number;
  Url?: string;
  ImageUrl?: string;
};

export type UpdateItemPayload = {
  RegistryId: string;
  ItemId: string;
  ItemName?: string;
  Description?: string;
  Price?: number;
  Url?: string;
  ImageUrl?: string;
};

export type RemoveItemPayload = {
  RegistryId: string;
  ItemId: string;
};

export type MarkPurchasedPayload = {
  RegistryId: string;
  ItemId: string;
  Purchased: boolean;
};

export const MyRegistryService = {
  async signupUser(payload: SignupUserPayload): Promise<SignupUserResponse> {
    try {
      const response = await client.post("SignupUser", payload);
      return normalizeSignupResponse(response.data ?? {});
    } catch (error) {
      return handleError(error);
    }
  },

  async searchRegistries(params: SearchRegistriesParams): Promise<unknown> {
    try {
      const response = await client.get("GetRegistries2", { params });
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  async getRegistries(params: GetRegistriesParams): Promise<unknown> {
    try {
      const response = await client.get("GetRegistries", { params });
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  async getRegistryItems(params: GetRegistryItemsParams): Promise<unknown> {
    try {
      const response = await client.get("GetRegistryItems", { params });
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  async addItem(payload: AddItemPayload): Promise<unknown> {
    try {
      const response = await client.post("AddItemToRegistry", payload);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  async updateItem(payload: UpdateItemPayload): Promise<unknown> {
    try {
      const response = await client.post("UpdateItem", payload);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  async removeItem(payload: RemoveItemPayload): Promise<unknown> {
    try {
      const response = await client.post("RemoveItemFromRegistry", payload);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  async markPurchased(payload: MarkPurchasedPayload): Promise<unknown> {
    try {
      const response = await client.post("SetGiftAsPurchased", payload);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },
};
