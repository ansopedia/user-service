# Changelog

All notable changes to the User Service will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased

### New feature

- Allow User to Make Their Profile Public or Private ([#63](https://github.com/ansopedia/user-service/issues/63))
- Protect User Routes ([#67](https://github.com/ansopedia/user-service/issues/67))
- Support Multi-Device Login by Allowing Multiple Refresh Tokens per User ([#123](https://github.com/ansopedia/user-service/issues/123))

## [1.1.0] - 2025-07-03

### Changed

- Updated dependencies to latest versions (#113)
  - Notable: `Express - v5x`, `bcrypt - v6x`, `jest - v30x`, `dotenv - v17x` & more.
- Use upsert operations for token and OTP database interactions for better consistency.
- Standardize token names and improve token invalidation logic.
- Centralize event type definitions for better maintainability.
- Improve OTP verification response and `AuthService` method accessibility.
- Refactor logger and utility imports for consistency.

### Fixed

- Enhanced notification system with improved error handling and service integration
- Validate NODE_ENV with enum in env.constant.ts
- Extend MongoDB debug mode to include "local" environment
- Improve error handling for unmatched API routes.
- Correct logger configuration for multi-environment setup.

### Added

- Optimize test script. (#110)
- Improve error logging for 500 errors (#108)
- Migrate Initial Data Setup to Migration Script (#116)
  - remove initial setup flag and related code
- Add `morgan` logger for request logging
- Add `refresh-token` & `user-id` cookies to `login` response
- Implemented multi-environment configuration system with automated setup (#111)
  - Added support for test, development, and local environment configurations
  - Created scripts to automatically generate environment files from templates
  - Integrated RSA key generation into environment setup process
  - Added comprehensive documentation for environment management
- Added username availability check endpoint (#103)
  - New GET `/users/check-username/:username` endpoint
  - Comprehensive test coverage for validation cases
- Enhanced Google OAuth profile data storage (#66)
  - Added name fields to profile schema (name, givenName, familyName)
  - Store Google user's display name and name components
  - Update profile dto to include name fields
- Improve OTP verification flow with descriptive success messages and appropriate token returns.
  - Include `OTP Time-to-Live (TTL)` in email payloads.
  - Add `otpTTL` field to notification validation.

### Removed

- Remove deprecated phone verification and email magic link features.

## [1.0.1] - 2025-01-03

### Security

- Move JWT encryption keys to environment variables for cloud compatibility

## [1.0.0] - 2024-03-19

### Added

- Integrated Socket.IO for real-time interactions (#86)
- Enhanced Google Sign-In API with redirect support (#77)
- Implemented pagination for Get Users endpoint (#68)
- Added Profile Management APIs:
  - Create Profile API (#60)
  - Get Profile Data API (#61)
  - Update Profile Data API (#62)
- Implemented decentralized JWT token validation across microservices (#55)
- Integrated Notification Service API (#32)
- Implemented OTP verification for user registration (#23)
- Implemented secure master OTP for development/staging environments (#24)
- Implemented basic CRUD operations for user management (#1)
- Set up database connection and test server (#2)
- Implemented sendResponse function (#4)
- Implemented error handler middleware and error constants (#6)
- Implemented scalable role and permission schema for RBAC (#12)
- Implemented user authentication (Login, Register, Forgot Password) (#14)
- Logging system using Pino
- Test coverage with Jest
- ESLint and Prettier configuration
- Husky pre-commit hooks
- Docker support
- TypeScript configuration and type safety
- MongoDB integration with Mongoose
- API versioning (v1)
- Express.js server setup with middleware
- Environment configuration management
- Response standardisation utilities

### Changed

- Updated API response structure to namespace payload under data (#83)
- Optimized function names to use "Upsert" instead of "UpdateOrCreate" (#47)
- Enhanced login API to support both email and username authentication (#41)
- Updated dependencies (#25)

### Security

- Configured global rate limiting (#71)
- Created scalable and dynamic schema for storing tokens (#53)
- Added route protection using validateAccessToken and checkPermission middleware (#51)
- Implemented strong password policy (#40, #48)
- Encrypted JWT tokens (#37)
- Implemented Role-Based Access Control (RBAC) with default roles and permissions (#28, #36)
- Implemented middleware for access token validation and refresh (#21)
- Integrated Helmet and CORS middleware (#16)
- Implemented bcrypt for password hashing (#10)
- Added JWT-based authentication
- Configured CORS protection

### Fixed

- Fixed weak password acceptance during sign-up (#48)

### Developer Experience

- Added TypeScript support with strict type-checking
- Configured ESLint and Prettier for code quality
- Set up Jest for testing
- Added Husky for pre-commit hooks
- Configured Docker for containerization
- Added comprehensive README with setup instructions
- Added VSCode settings
