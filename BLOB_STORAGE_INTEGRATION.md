# Azure Blob Storage Integration for Workspaces

This document describes how Azure Blob Storage is integrated with workspace creation in the AIVA application.

## Overview

When an admin creates a workspace, the system automatically creates a corresponding Azure Blob Storage container for that workspace. This allows for organized file storage where each workspace has its own dedicated storage container.

## Implementation Details

### 1. Container Creation

When a workspace is created:
1. A unique container name is generated using the workspace ID: `workspace-{workspaceId}`
2. The container is created in Azure Blob Storage
3. The container name is stored with the workspace data

### 2. Container Deletion

When a workspace is deleted:
1. The corresponding Azure Blob Storage container is also deleted
2. All files stored in that container are removed

## Services

### WorkspaceStorageService

A dedicated service (`WorkspaceStorageService`) handles all blob storage operations for workspaces:

- `createWorkspaceContainer(workspaceId, workspaceName)`: Creates a container for a workspace
- `deleteWorkspaceContainer(workspaceId)`: Deletes a workspace's container
- `containerExists(workspaceId)`: Checks if a container exists
- `listWorkspaceBlobs(workspaceId)`: Lists all blobs in a workspace container

## Testing

Several test scripts are available to verify the blob storage integration:

### 1. Basic Blob Storage Test
```bash
npm run test-blob-storage
```

### 2. Workspace Blob Storage Test
```bash
npm run test-workspace-blob-storage
```

### 3. Verification Script
```bash
npm run verify-blob-storage
```

### 4. Admin Workspace Creation Test
```bash
npm run test-admin-workspace-creation
```

## Configuration

To enable Azure Blob Storage integration, set the following environment variables in your `.env` file:

```env
AZURE_STORAGE_ACCOUNT_NAME=your-storage-account-name
AZURE_STORAGE_ACCOUNT_KEY=your-storage-account-key
AZURE_STORAGE_CONNECTION_STRING=your-storage-connection-string
AZURE_STORAGE_CONTAINER_NAME=aiva-files
```

If these variables are not set, the system will fall back to mock storage mode.

## Security

- Each workspace container is uniquely named using the workspace ID
- Containers are not publicly accessible by default
- Access to containers is controlled through the application's authentication system

## Error Handling

- If blob storage operations fail, the workspace creation/deletion still succeeds
- Errors are logged but don't prevent the main operation
- The system gracefully falls back to mock mode if Azure services are unavailable

## Future Enhancements

- Add file upload/download functionality directly to workspace containers
- Implement access control for container contents
- Add metrics and monitoring for storage usage per workspace