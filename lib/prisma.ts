import { PrismaClient } from '@prisma/client';

declare global {
  // eslint-disable-next-line no-var
  var prismaClient: PrismaClient | undefined;
}

const createPrismaClient = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'warn', 'error'] : ['error'],
  });
};

const getOrCreatePrisma = () => {
  if (!globalThis.prismaClient) {
    globalThis.prismaClient = createPrismaClient();
  }
  return globalThis.prismaClient;
};

const prismaProxyHandler: ProxyHandler<PrismaClient> = {
  get(_target, prop, receiver) {
    const client = getOrCreatePrisma();
    const value = Reflect.get(client, prop, receiver);
    if (typeof value === 'function') {
      return value.bind(client);
    }
    return value;
  },
};

export const getPrisma = () => getOrCreatePrisma();
export const prisma = new Proxy({} as PrismaClient, prismaProxyHandler);
