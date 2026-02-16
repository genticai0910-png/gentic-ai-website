import { drizzle } from 'drizzle-orm/node-postgres';
import { Client } from 'pg';

import * as schema from '@/models/Schema';

function createDb() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    // Return a proxy that throws helpful errors if DB is used without config
    return new Proxy({} as ReturnType<typeof drizzle<typeof schema>>, {
      get(_target, prop) {
        if (prop === 'then') return undefined; // Don't break Promise checks
        return (..._args: unknown[]) => {
          throw new Error(`DATABASE_URL is not configured. Set it in .env to use database features.`);
        };
      },
    });
  }

  const client = new Client({ connectionString });
  // Connect on first query via drizzle's lazy connection
  const connected = client.connect().catch((err) => {
    console.error('Failed to connect to database:', err);
  });

  const instance = drizzle(client, { schema });

  // Ensure connection before first query
  const originalSelect = instance.select.bind(instance);
  const originalInsert = instance.insert.bind(instance);

  return Object.assign(instance, {
    _ensureConnected: connected,
  });
}

export const db = createDb();
