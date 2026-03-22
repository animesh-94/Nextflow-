import { PrismaClient } from '@prisma/client';

const prismaClientSingleton = () => {
  // If we are building and the URL is missing, we pass an empty string 
  // to prevent the "non-empty" constructor error, but keep the 
  // actual DATABASE_URL for runtime.
  return new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL || "postgres://dummy:dummy@localhost:5432/dummy"
      }
    }
  } as any);
};

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prisma ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma;