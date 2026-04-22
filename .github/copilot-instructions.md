# User Service — Copilot Instructions

Guidelines for AI agents working in this workspace.

## Architecture

**Three-layer design**: Request → Controller → Service → DAL → MongoDB

- **Entry points**: [src/index.ts](../src/index.ts) (app startup), [src/server.ts](../src/server.ts) (HTTP/Socket.IO), [src/app.ts](../src/app.ts) (Express setup)
- **Database**: MongoDB via Mongoose, auto-migrated on startup ([src/config/migrate.ts](../src/config/migrate.ts))
- **Middleware stack**: Helmet, CORS, rate-limiting, Passport (OAuth + JWT), Morgan logging, bot detection
- **Testing**: Vitest, test DBs auto-created with unique names and dropped on disconnect

## File Organization by Feature

Every API feature (e.g., `/api/v1/user/`) follows this structure:

```
entity.constant.ts   ← Success/error messages, RBAC constants
entity.controller.ts ← Request handlers, validation, response formatting
entity.service.ts    ← Business logic, static methods, DAL delegation
entity.dal.ts        ← Mongoose queries only (data persistence)
entity.model.ts      ← Mongoose schema definitions
entity.route.ts      ← Express route definitions
entity.dto.ts        ← Response transformers (optional)
__test__/            ← All tests for the feature
```

**Exemplar files**:
- [src/api/v1/user/user.service.ts](../src/api/v1/user/user.service.ts) — Business logic, DTO transformation
- [src/api/v1/user/user.controller.ts](../src/api/v1/user/user.controller.ts) — Request validation, response handling
- [src/api/v1/user/user.dal.ts](../src/api/v1/user/user.dal.ts) — Mongoose aggregation pipelines, soft deletes

## Build & Test Commands

| Task | Command | Notes |
|------|---------|-------|
| **Install** | `pnpm install` | Uses pnpm v9+ workspaces |
| **Setup** | `pnpm setup` | Generates .env files + RSA keys (one-time) |
| **Development** | `pnpm local:dev` | NODE_ENV=development, auto-restart via nodemon |
| **Production** | `pnpm prod` | NODE_ENV=production, compiles then runs dist/index.js |
| **Build** | `pnpm build` | Compiles TS → JS, resolves path aliases |
| **Test** | `pnpm test` | NODE_ENV=test, Vitest runner |
| **Coverage** | `pnpm test:coverage` | Vitest coverage reports |
| **Migrate DB** | `pnpm migrate:local` or `:prod` | Runs seeders + schema creation |
| **Lint** | `pnpm lint` / `lint:fix` | ESLint + TypeScript, enforces strict mode |
| **Format** | `pnpm prettier:fix` | Prettier code formatting |

## Code Style & Conventions

**TypeScript**:
- Full strict mode: no implicit any, no unused parameters
- `verbatimModuleSyntax` enforced — use `export type` for types
- Path alias resolution: `@/api`, `@/config`, `@/constants`, `@/utils`, `@/middlewares`, `@/types`, `@/routes`
- ESLint `check-file` plugin enforces naming: `entity.controller.ts`, `entity.service.ts`, etc.

**Error Handling**:
- Services throw `ErrorTypeEnum` errors (defined in constants)
- Controllers let errors propagate to `errorHandler` middleware
- Use `sendResponse()` utility for all HTTP responses

**Input Validation**:
- Use Zod schemas (imported from `@ansospace/types`)
- Validate in controller before calling service

**Testing**:
- Test files: `src/**/*.test.ts` or `src/__test__/*.test.ts`
- Setup: [src/vitest.setup.ts](../src/vitest.setup.ts)
- Test timeout: 10 seconds per test
- Test DBs auto-cleaned per test run

## Environment Configuration

**Setup**:
- Base `.env` + environment-specific `.env.{NODE_ENV}`
- Zod schema validation in [src/constants/env.constant.ts](../src/constants/env.constant.ts)
- Supports: `local`, `development`, `test`, `production`

**Required keys**: DATABASE_URI, RSA keys, Redis config, Google OAuth credentials

**Missing env files?** Run `pnpm setup` to auto-generate.

## Common Gotchas

| Problem | Fix |
|---------|-----|
| **Missing env files** | `pnpm setup` generates .env.local, .env.development, .env.test |
| **Missing RSA keys** | Run `pnpm setup` or `pnpm generate-keys` |
| **DB connection fails** | Verify DATABASE_URI is valid, MongoDB server is running |
| **Path aliases not resolving** | Run `pnpm build` (tsc-alias fixes imports), restart TS server |
| **Monorepo import errors** | `@ansospace/types` is a workspace package; verify pnpm-workspace.yaml |
| **Socket.IO not initialized** | Must be created in src/server.ts **after** HTTP server listens |
| **Test DB not cleaned up** | Vitest config auto-drops test DBs; check MongoDB connection |

## Key Dependencies

- **Express**: HTTP server framework
- **Mongoose**: MongoDB ODM
- **Socket.IO**: Real-time WebSocket server
- **Passport**: Authentication (OAuth + JWT)
- **JWT**: Token generation/validation
- **Zod**: Schema validation
- **Pino**: Structured logging
- **Helmet**: Security headers
- **MaxMind**: Geolocation (IP → location)
- **Redis**: Caching + session store

## Tips for Agents

1. **Always check environment**: Tests run with `NODE_ENV=test`; verify config before assuming paths
2. **Follow the three-layer pattern**: Don't put business logic in controllers or queries in services
3. **Use sendResponse()**: All HTTP responses must go through the utility for consistency
4. **Path aliases are mandatory**: Use `@/` imports; avoid relative paths
5. **Database is mandatory**: Most features require MongoDB connection; check migrations
6. **Test first**: Run `pnpm test` before `pnpm build` to catch TypeScript errors early
