// lib/prisma.ts
export async function getPrisma() {
  const { PrismaClient } = await import('@prisma/client');
  const g = global as unknown as { __prisma?: InstanceType<typeof PrismaClient> };
  if (!g.__prisma) {
    g.__prisma = new PrismaClient();
  }
  return g.__prisma;
}
