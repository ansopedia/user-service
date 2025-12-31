# Changelog

All notable changes to the User Service will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - Unreleased

### Added

- Add access control profile endpoint and refactor permission checks ([#161](https://github.com/ansopedia/user-service/issues/161))
- Add Proper Permission Descriptions with a 255-Character Limit ([#58](https://github.com/ansopedia/user-service/issues/58))
- Add Platform Model & API Endpoints ([#145](https://github.com/ansopedia/user-service/issues/145))
- Protect Permission Routes ([#69](https://github.com/ansopedia/user-service/issues/69))
- Add centralized routes constants file for improved maintainability
- Add new test utility functions for role permission and user role creation
- Add session DTO for data transformation
- Add SECURITY_TOKEN_REUSE_DETECTED error type for security alerts
- Add `api/v1/auth/change-password` api end-point

### Changed

- Refactor test utilities by consolidating role-permission and user-role functions into respective modules
- Update API endpoint paths in test utilities to use centralized route constants
- Change authentication response fields from 'token' to 'actionToken'
- Update type imports (e.g., RegisterSchema to RegisterRequest)
- Update dependencies to latest versions (mongoose 9.0.2, maxmind 5.0.1, ms 2.1.3, ua-parser-js 2.0.7, zod 4.2.1, and dev dependencies)
- Refactor OTP verification to use eventType instead of otpType
- Enhance session DAL with pagination, sorting, and DTO transformation
- Update ua-parser-js bot detection import

### Removed

- Remove deprecated test utility files for role-permission and user-role management
- Remove pre-save validation hooks from user-role model

## [1.3.1] - 2025-10-06

### Added

- Replace MongooseObjectId with ObjectId and update @ansospace/types package ([#141](https://github.com/ansopedia/user-service/issues/141))

## [1.3.0] - 2025-10-03

### Added

- Integrate @ansospace/types package into user-service ([#138](https://github.com/ansopedia/user-service/issues/138))

## [1.2.0] - 2025-09-10

### New feature

- Allow User to Make Their Profile Public or Private ([#63](https://github.com/ansopedia/user-service/issues/63))
- Protect User Routes ([#67](https://github.com/ansopedia/user-service/issues/67))
- Support Multi-Device Login by Allowing Multiple Refresh Tokens per User ([#123](https://github.com/ansopedia/user-service/issues/123))
- Add API to List and Track Active User Sessions ([#125](https://github.com/ansopedia/user-service/issues/125))
- Integrate Redis into User Service ([#126](https://github.com/ansopedia/user-service/issues/126))
- Improve Test Reliability with Enhanced Server Shutdown, Port Allocation, and Test Database Handling ([#130](https://github.com/ansopedia/user-service/issues/130))
- Add TypeScript v8 Feature: "erasableSyntaxOnly" and Update Codebase ([#122](https://github.com/ansopedia/user-service/issues/122))

### Changed

- Migrate from Jest to Vitest for improved ESM support ([#129](https://github.com/ansopedia/user-service/issues/129))
- Migrate project to use ECMAScript Modules (ESM) ([#128](https://github.com/ansopedia/user-service/issues/128))

### Security

- Implement Token Revocation List to Invalidate Access Tokens on Logout ([#127](https://github.com/ansopedia/user-service/issues/127))

## [1.1.0] - 2025-07-03

### Changed

- Updated dependencies to latest versions ([#113](https://github.com/ansopedia/user-service/issues/113))
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

- Optimize test script. ([#110](https://github.com/ansopedia/user-service/issues/110))
- Improve error logging for 500 errors ([#108](https://github.com/ansopedia/user-service/issues/108))
- Migrate Initial Data Setup to Migration Script ([#116](https://github.com/ansopedia/user-service/issues/116))
  - remove initial setup flag and related code
- Add `morgan` logger for request logging
- Add `refresh-token` & `user-id` cookies to `login` response
- Implemented multi-environment configuration system with automated setup ([#111](https://github.com/ansopedia/user-service/issues/111))
  - Added support for test, development, and local environment configurations
  - Created scripts to automatically generate environment files from templates
  - Integrated RSA key generation into environment setup process
  - Added comprehensive documentation for environment management
- Added username availability check endpoint ([#103](https://github.com/ansopedia/user-service/issues/103))
  - New GET `/users/check-username/:username` endpoint
  - Comprehensive test coverage for validation cases
- Enhanced Google OAuth profile data storage ([#66](https://github.com/ansopedia/user-service/issues/66))
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

- Integrated Socket.IO for real-time interactions ([#86](https://github.com/ansopedia/user-service/issues/86))
- Enhanced Google Sign-In API with redirect support ([#77](https://github.com/ansopedia/user-service/issues/77))
- Implemented pagination for Get Users endpoint ([#68](https://github.com/ansopedia/user-service/issues/68))
- Added Profile Management APIs:
  - Create Profile API ([#60](https://github.com/ansopedia/user-service/issues/60))
  - Get Profile Data API ([#61](https://github.com/ansopedia/user-service/issues/61))
  - Update Profile Data API ([#62](https://github.com/ansopedia/user-service/issues/62))
- Implemented decentralized JWT token validation across microservices ([#55](https://github.com/ansopedia/user-service/issues/55))
- Integrated Notification Service API ([#32](https://github.com/ansopedia/user-service/issues/32))
- Implemented OTP verification for user registration ([#23](https://github.com/ansopedia/user-service/issues/23))
- Implemented secure master OTP for development/staging environments ([#24](https://github.com/ansopedia/user-service/issues/24))
- Implemented basic CRUD operations for user management ([#1](https://github.com/ansopedia/user-service/issues/1))
- Set up database connection and test server ([#2](https://github.com/ansopedia/user-service/issues/2))
- Implemented sendResponse function ([#4](https://github.com/ansopedia/user-service/issues/4))
- Implemented error handler middleware and error constants ([#6](https://github.com/ansopedia/user-service/issues/6))
- Implemented scalable role and permission schema for RBAC ([#12](https://github.com/ansopedia/user-service/issues/12))
- Implemented user authentication (Login, Register, Forgot Password) ([#14](https://github.com/ansopedia/user-service/issues/14))
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

- Updated API response structure to namespace payload under data ([#83](https://github.com/ansopedia/user-service/issues/83))
- Optimized function names to use "Upsert" instead of "UpdateOrCreate" ([#47](https://github.com/ansopedia/user-service/issues/47))
- Enhanced login API to support both email and username authentication ([#41](https://github.com/ansopedia/user-service/issues/41))
- Updated dependencies ([#25](https://github.com/ansopedia/user-service/issues/25))

### Security

- Configured global rate limiting ([#71](https://github.com/ansopedia/user-service/issues/71))
- Created scalable and dynamic schema for storing tokens ([#53](https://github.com/ansopedia/user-service/issues/53))
- Added route protection using authenticate and checkPermission middleware ([#51](https://github.com/ansopedia/user-service/issues/51))
- Implemented strong password policy ([#40](https://github.com/ansopedia/user-service/issues/40), [#48](https://github.com/ansopedia/user-service/issues/48))
- Encrypted JWT tokens ([#37](https://github.com/ansopedia/user-service/issues/37))
- Implemented Role-Based Access Control (RBAC) with default roles and permissions ([#28](https://github.com/ansopedia/user-service/issues/28), [#36](https://github.com/ansopedia/user-service/issues/36))
- Implemented middleware for access token validation and refresh ([#21](https://github.com/ansopedia/user-service/issues/21))
- Integrated Helmet and CORS middleware ([#16](https://github.com/ansopedia/user-service/issues/16))
- Implemented bcrypt for password hashing ([#10](https://github.com/ansopedia/user-service/issues/10))
- Added JWT-based authentication
- Configured CORS protection

### Fixed

- Fixed weak password acceptance during sign-up [#48](https://github.com/ansopedia/user-service/issues/48)

### Developer Experience

- Added TypeScript support with strict type-checking
- Configured ESLint and Prettier for code quality
- Set up Jest for testing
- Added Husky for pre-commit hooks
- Configured Docker for containerization
- Added comprehensive README with setup instructions
- Added VSCode settings
