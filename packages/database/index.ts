import 'server-only';

import { PrismaClient } from '@prisma/client';
import { env } from '@repo/env';

declare global {
  var cachedPrisma: PrismaClient | undefined;
}

// Directly initialize PrismaClient without an adapter
export const database = new PrismaClient({
  // If you have any specific configurations for Accelerate, add them here
});