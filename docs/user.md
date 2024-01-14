# User Schema Documentation

## Overview

The **User Schema** defines the structure for representing user information within the application. This schema encompasses core user details, points, notifications, additional information, verification, security, and OAuth provider integration.

## Schema Definition

### Core User Information

- **name**: (String, required) - The user's name.
- **username**: (String) - Optional username.
- **email**: (String, required, unique) - The user's email address.
- **password**: (String, required) - The user's password.
- **mobile**: (String) - The user's mobile number (optional).

### Points and Notifications

- **points**: (Object) - User's points information.
  - **totalCoins**: (Number, default: 100) - Total coins associated with the user.
- **notifications**: (Array of ObjectIds) - References to user-specific notifications.

### Additional Information

- **designation**: (String) - Optional designation or role.
- **roles**: (Array of ObjectIds) - References to user roles.
- **avatar**: (Object) - User's avatar or profile picture.

### Verification and Security

- **isAccountVerified**: (Boolean, default: false) - Flag indicating whether the user's account is verified.
- **isProfileComplete**: (Boolean, default: false) - Flag indicating whether the user's profile is complete.
- **tokens**: (Array of Objects) - User's authentication tokens.
- **otp**: (Object) - One-time password details.
- **tc**: (Boolean, required) - Flag indicating acceptance of terms and conditions.

### OAuth Providers

- **oauthProviders**: (Array of Objects) - Details about OAuth providers associated with the user.

## Usage

1. **User Creation:**

   - Use the required and optional fields to create a new user.

2. **Managing Points and Notifications:**

   - Update the `points` and `notifications` fields as needed.

3. **Verification and Security:**

   - Set the `isAccountVerified` flag upon successful account verification.
   - Update the `isProfileComplete` flag when the user completes their profile.
   - Manage authentication tokens and OTP details.

4. **OAuth Integration:**
   - Utilize the `oauthProviders` field to store information about OAuth providers associated with the user.
