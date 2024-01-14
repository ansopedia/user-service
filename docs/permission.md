# Permission Schema Documentation

## Overview

The Permission Schema defines the structure for managing permissions within the application. Permissions play a crucial role in controlling access to resources and actions, ensuring security and proper authorization.

## Schema Definition

### Core Information

- name: (String, required, unique) - A unique identifier for the permission.
- description: (String) - A brief description providing additional details about the permission.
- type: (String, required, enum: ['resource', 'action']) - Indicates whether the permission is related to a resource or an action.
- resource: (String) - Optional field specifying the resource associated with the permission (for 'resource' type).
- actions: (Array of Strings) - Optional field listing actions associated with the permission (for 'action' type).
- isProtected: (Boolean, default: false) - A flag to prevent accidental deletion of essential permissions.

### Tracking and Metadata

- createdBy: (ObjectId) - Reference to the user who created the permission.
- lastUpdatedBy: (ObjectId) - Reference to the user who last updated the permission.
- createdAt: (Date) - Timestamp indicating when the permission was created.
- updatedAt: (Date) - Timestamp indicating the last update time.

### Versioning and Soft Deletion

- version: (Number, default: 1) - Version number to track changes to the permission.
- isDeleted: (Boolean, default: false) - A flag indicating whether the permission is soft-deleted.
- deletedAt: (Date) - Timestamp indicating when the permission was deleted.
- deletedBy: (ObjectId) - Reference to the user who performed the deletion.

### Indexes

- Index on name and isDeleted for optimized queries.

### Usage

1. Creating Permissions:

   - Use the name, type, and optional fields to define a new permission.
   - Set isProtected to true for critical permissions that should not be deleted.

2. Tracking Changes:

   - createdBy and createdAt fields provide information about the creator and creation time.
   - lastUpdatedBy and updatedAt fields track the last modifier and modification time.

3. Soft Deletion:

   - isDeleted indicates whether a permission is deleted (soft deletion).
   - deletedAt and deletedBy fields record details if a soft deletion occurs.

4. Versioning:

   - version field allows tracking changes to the permission over time.
