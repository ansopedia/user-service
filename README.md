## Ansopedia User Service

The Ansopedia User Service is a backend service responsible for managing user accounts and authentication within the Ansopedia learning platform. It provides functionalities like:

- **User Registration and Login:** Enables users to create new accounts and securely log in to the platform.
- **User Management:** Offers APIs to manage user profiles, preferences, and potentially user roles (if permission levels exist).
- **Authentication:** Implements robust authentication mechanisms (e.g., JWT tokens) to secure access to Ansopedia features and resources.
- **Integration:** Collaborates with other services like Ansopedia Studio API to manage user permissions for content creation and interaction.

## Understanding the Scripts

Before we dive into the steps, let's break down the scripts in your `package.json` file:

- **build:** Transpiles TypeScript code to JavaScript.
- **dev:** Starts the development server with nodemon for hot reloading.
- **lint:** Lints the codebase using ESLint.
- **lint:fix:** Automatically fixes lint errors.
- **prepare:** Runs husky pre-commit hooks.
- **pretest:** Builds the project before running tests.
- **prettier:check:** Checks code formatting.
- **prettier:fix:** Fixes code formatting automatically.
- **prod:** Sets the NODE_ENV to production, builds the project, and starts the server.
- **start:** Starts the development server using ts-node.
- **test:** Runs the test suite.

### Development Environment

1. **Install dependencies:**
   ```bash
   pnpm install
   ```
2. **Start development server:**
   ```bash
   pnpm dev
   ```
   This command will start a nodemon server, which will watch for changes in your TypeScript files and automatically restart the server.

### Production Environment

1. **Start the production server:**
   ```bash
   pnpm prod
   ```
   This command sets the `NODE_ENV` to `production`, builds the project, and starts the server.

#### Test Environment

1. **Run tests:**
   ```bash
   pnpm test
   ```

### Additional Scripts

- **Linting:**
  - Check for code style issues: `pnpm lint`
  - Automatically fix code style issues: `pnpm lint:fix`
- **Formatting:**
  - Check for code formatting issues: `pnpm prettier:check`
  - Automatically fix code formatting issues: `pnpm prettier:fix`

## License

By contributing, you agree that your contributions will be licensed under the project's [LICENSE](./LICENSE).

## Contributing

We welcome contributions to the Ansopedia Creator Studio! Please read our [CONTRIBUTING.md](./CONTRIBUTING.md) for more details.

## Code of Conduct

We have a [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md) that outlines our expectations for behavior in the community. Please read it.

## Contributors

We welcome and recognize all contributors to the Ansopedia Creator Studio.

<a href="https://github.com/ansopedia/user-service/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=ansopedia/user-service" />
</a>
