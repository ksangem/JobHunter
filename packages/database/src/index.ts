// ============================================================================
// JobHunter — Prisma client singleton + tenant context helper (Tech Specs §3).
//
// A single PrismaClient is reused across the process (hot-reload safe). The
// `withTenant` helper sets the per-transaction Postgres GUC `app.org_id` that
// the RLS policies in prisma/rls.sql key on.
//
// IMPORTANT: tenant context must be established in request middleware BEFORE any
// controller/repository runs. RLS is the LAST line of defence — application
// queries should still filter by org_id explicitly. Candidate (global pool,
// G-025) is NOT under RLS; PII access there is masked-until-consent + audited.
// ============================================================================
import { PrismaClient } from '@prisma/client';

// Reuse the client across hot reloads / Lambda warm starts.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma: PrismaClient =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

/**
 * Run callbacks with the tenant GUC set so RLS policies resolve `app.org_id`.
 *
 * Usage (in middleware, wrapping the request handler):
 *   await withTenant(orgId, (tx) => repository.findJds(tx));
 *
 * `set_config(key, value, true)` => the setting is LOCAL to the surrounding
 * transaction, so it cannot leak between pooled connections. We therefore run
 * inside an interactive transaction and hand the transactional client back to
 * the caller.
 */
export async function withTenant<T>(
  orgId: string,
  fn: (tx: Omit<PrismaClient, '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'>) => Promise<T>,
): Promise<T> {
  return prisma.$transaction(async (tx) => {
    // Parameterised to avoid injection; `true` = transaction-local.
    await tx.$executeRaw`SELECT set_config('app.org_id', ${orgId}, true)`;
    return fn(tx);
  });
}

export * from '@prisma/client';
