# Ansopedia User Service

The Ansopedia User Service is a backend service responsible for managing user accounts and authentication within the Ansopedia learning platform. It provides functionalities like:

- **User Registration and Login:** Enables users to create new accounts and securely log in to the platform.
- **User Management:** Offers APIs to manage user profiles, preferences, and potentially user roles (if permission levels exist).
- **Authentication:** Implements robust authentication mechanisms (e.g., JWT tokens) to secure access to Ansopedia features and resources.
- **Integration:** Collaborates with other services like Ansopedia Studio API to manage user permissions for content creation and interaction.

## Understanding the Scripts

Before we dive into the setup steps, let's break down the scripts in your `package.json` file:

- **build:** Transpiles TypeScript code to JavaScript.
- **dev:local:** Starts the development server with nodemon in local environment.
- **dev:development:** Starts the development server with nodemon in development environment.
- **generate-keys:** Generates RSA keys for JWT authentication.
- **generate-env:** Generates environment files from the example template.
- **setup:** Runs a complete project setup (generates environment files and RSA keys).
- **lint:** Lints the codebase using ESLint.
- **lint:fix:** Automatically fixes lint errors.
- **prepare:** Runs husky pre-commit hooks.
- **pretest:** Builds the project before running tests.
- **prettier:check:** Checks code formatting.
- **prettier:fix:** Fixes code formatting automatically.
- **prod:** Sets the NODE_ENV to production, builds the project, and starts the server.
- **start:** Starts the development server using ts-node.
- **test:** Runs the test suite.

## Project Setup

Follow these steps to set up the project:

1. **Clone the repository:**

   ```bash
   git clone https://github.com/ansopedia/user-service.git
   cd user-service
   ```

2. **Install dependencies:**

   ```bash
   pnpm install
   ```

3. **Automated Setup:**

   ```bash
   pnpm run setup
   ```

   **This script:**

   - Generates environment files for test, development, and local environments
   - Generates RSA keys for JWT authentication
   - Automatically updates environment files with the generated RSA keys

4. **Verify Setup:**

   ```bash
   pnpm test
   ```

   All test cases should pass if the setup is correct.

5. **Start Development Server:**

   ```bash
   pnpm dev:local
   ```

   or

   ```bash
   pnpm dev:development
   ```

   Your server should now be running locally.

## Available Scripts

- **Setup:**

  - `pnpm run setup`: Complete project setup (environment files and RSA keys)
  - `pnpm generate-env`: Generate environment files only
  - `pnpm generate-keys`: Generate RSA keys only

- **Development:**

  - `pnpm dev:local`: Start development server in local environment
  - `pnpm dev:development`: Start development server in development environment
  - `pnpm start`: Start server using ts-node

- **Production:**

  - `pnpm build`: Build the project
  - `pnpm prod`: Run in production mode

- **Testing:**

  - `pnpm test`: Run test suite
  - `pnpm test:coverage`: Run tests with coverage report

- **Code Quality:**
  - `pnpm lint`: Check code style
  - `pnpm lint:fix`: Fix code style issues
  - `pnpm prettier:check`: Check formatting
  - `pnpm prettier:fix`: Fix formatting issues

## Environment Configuration

The project uses different environment configurations for various deployment scenarios:

- **Local**: For local development (.env.local)
- **Development**: For development server deployment (.env.development)
- **Test**: For running tests (.env.test)
- **Production**: For production deployment (configure manually)

The environment files are stored in the **environments** directory and are automatically loaded based on the **NODE_ENV** value.

## Security Notes

- Never commit your RSA keys to version control
- In production, use a secure key management service
- Rotate keys periodically following security best practices
- Keep your private key secure and restrict access

## Contributing

We welcome contributions! Please read our [CONTRIBUTING.md](./CONTRIBUTING.md) for details.

## Code of Conduct

Please read our [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md) for community guidelines.

## Contributors

<a href="https://github.com/ansopedia/user-service/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=ansopedia/user-service" />
</a>

## License

This project is licensed under the terms specified in [LICENSE](./LICENSE).
