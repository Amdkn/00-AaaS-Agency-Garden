// src/repos/index.ts
// Phase D — CLIENT-ONLY barrel re-export.
//
// Important: This barrel ONLY re-exports from the `*.client.ts` files.
// It is safe to import from Client Components (views, interactive UI).
//
// For the server-side cached queries (`listX`, `getX`, `createX`, etc.),
// import directly from the corresponding `*.server.ts` file. Those files
// use `next/cache` and `createServerClient` and are guarded by
// `import 'server-only';` — they cannot be bundled into a Client Component.

export * from './clients.client';
export * from './dashboard.client';
export * from './finance.client';
export * from './growth.client';
export * from './itdata.client';
export * from './legal.client';
export * from './marketplace.client';
export * from './people.client';
export * from './sales.client';
export * from './settings.client';
export * from './sop.client';
export * from './tasks.client';
