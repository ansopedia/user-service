# Ansopedia User Service

The Ansopedia User Service is a backend service responsible for managing user accounts and authentication within the Ansopedia learning platform.  
It provides functionalities like:

- **User Registration and Login:** Create accounts and log in securely.
- **User Management:** Manage profiles, preferences, and roles.
- **Authentication:** Secure access with JWT-based authentication.
- **Integration:** Works with other services like Ansopedia Studio API to manage user permissions.

## Understanding the Scripts

- **build:** Transpiles TypeScript and fixes path aliases.
- **local:** Starts the server with `NODE_ENV=local`.
- **local:dev:** Starts the server with `NODE_ENV=development`.
- **local:prod:** Starts the server with `NODE_ENV=production` and runs the production build.
- **generate-keys:** Generates RSA keys for JWT authentication.
- **generate-env:** Generates `.env` files from templates.
- **migrate:** Runs migrations for the current `NODE_ENV` (used internally by other migrate scripts).
- **migrate:local:** Runs migrations for `NODE_ENV=local`.
- **migrate:prod:** Runs migrations for `NODE_ENV=production`.
- **setup:** Generates environment files and RSA keys.
- **lint / lint:fix:** Lint code and optionally fix issues.
- **prettier:check / prettier:fix:** Check or fix formatting.
- **prepare:** Runs Husky hooks.
- **prod:** Builds the app and starts in production.
- **start:** Runs the built app.
- **test / test:coverage:** Run tests, optionally with coverage.

## Project Setup

Follow these steps to set up the project:

1. **Clone the repository**

   ```bash
   git clone https://github.com/ansopedia/user-service.git
   cd user-service
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Automated setup**

   ```bash
   pnpm run setup
   ```

   This:
   - Creates `.env` files for local, development, and test.
   - Generates RSA keys.
   - Injects keys into `.env` files.

4. **Run database migrations**

   ```bash
   pnpm migrate:local
   ```

   Or for production:

   ```bash
   pnpm migrate:prod
   ```

5. **Verify setup**

   ```bash
   pnpm test
   ```

6. **Start development server**

   ```bash
   pnpm local
   ```

   Or:

   ```bash
   pnpm local:dev
   ```

---

## Available Scripts

- **Setup:**
  - `pnpm setup` → Generate env files & RSA keys.
  - `pnpm generate-env` → Env files only.
  - `pnpm generate-keys` → RSA keys only.

- **Migrations:**
  - `pnpm migrate` → Run for current `NODE_ENV`.
  - `pnpm migrate:local` → Run for local.
  - `pnpm migrate:prod` → Run for production.

- **Development:**
  - `pnpm local` → Local environment.
  - `pnpm local:dev` → Development environment.
  - `pnpm local:prod` → Production environment (locally).

- **Production:**
  - `pnpm build` → Build app.
  - `pnpm prod` → Build & run.
  - `pnpm start` → Start built app.

- **Testing:**
  - `pnpm test`
  - `pnpm test:coverage`

- **Code Quality:**
  - `pnpm lint`
  - `pnpm lint:fix`
  - `pnpm prettier:check`
  - `pnpm prettier:fix`

## Environment Configuration

The service uses multiple environment configs:

- `.env.local` → Local development
- `.env.development` → Dev server deployment
- `.env.test` → Testing
- `.env.production` → Production (manually or via secrets in deployment)

These are loaded based on `NODE_ENV`.
Never commit `.env` files with real credentials.

## Running with Docker

You can build and run the Ansopedia User Service using Docker. This ensures a consistent environment and makes deployment easier.

### Build the Docker image

```bash
docker build -t ansopedia-user-service .
```

### Run the container with environment variables

You should pass environment variables like `NODE_ENV` and any secrets (database URLs, API keys) at runtime.

Example using environment variables inline:

```bash
docker run -d -p 3000:3000 \
  -e NODE_ENV=production \
  -e DATABASE_URI=your_DATABASE_URI \
  -e JWT_PRIVATE_KEY="your_jwt_private_key" \
  ansopedia-user-service
```

Alternatively, use an `.env` file to manage environment variables:

1. Create a `.env` file with the needed variables:

   ```env
     NODE_ENV=production
     DATABASE_URI=your_DATABASE_URI
     JWT_PRIVATE_KEY="your_jwt_private_key"
   ```

2. Run the container with the env file:

   ```bash
   docker run -d -p 3000:3000 --env-file .env ansopedia-user-service
   ```

### Notes

- The Dockerfile already sets `NODE_ENV=production` by default, but explicitly passing it at runtime is a good practice for clarity.
- Never commit secrets or private keys into your Docker image or source control.
- Use Docker secrets or your cloud provider’s secret management for production deployments.
- The container exposes port `3000` by default; you can map it to any host port you prefer.

## Security Notes

- Never commit RSA keys.
- Use a secure key vault in production.
- Rotate keys periodically.
- Restrict access to private keys.

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md).

## Code of Conduct

See [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md)

## Contributors

<a href="https://github.com/ansopedia/user-service/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=ansopedia/user-service" />
</a>

## License

This project is licensed under the terms in [LICENSE](./LICENSE).
