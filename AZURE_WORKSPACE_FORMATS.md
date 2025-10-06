# Azure Workspace Formats Documentation

This document describes the standardized formats used for workspace folders in Azure Blob Storage, Azure AI Search indexes, and semantic configurations when a workspace is created in the AIVA application.

## 1. Azure Blob Storage Workspace Folder Format

When a workspace is created, a dedicated folder is created within the main Azure Blob Storage container to organize all files for that workspace.

### Format Structure
```
workspace/{workspaceName}-{workspaceId(first 7 digits)}/
```

### Components
- **workspace/**: Parent folder that contains all workspace folders
- **{workspaceName}**: The name of the workspace (sanitized to remove special characters)
- **{workspaceId(first 7 digits)}**: The first 7 characters of the workspace's unique ID
- **/**: Directory separator

### Example
For a workspace named "Naruto" with ID "naruto-a1b2c3d4-e5f6-7890-g1h2-i3j4k5l6m7n8":
```
workspace/naruto-a1b2c3d/
```

### File Storage Within Workspace Folder
When files are uploaded to a workspace, they are stored using this format:
```
workspace/{workspaceName}-{workspaceId(first 7 digits)}/{fileId}-{originalFileName}
```

### Implementation Details
- The workspace folder is created within the main container specified by `AZURE_STORAGE_CONTAINER_NAME` environment variable (default: 'aiva-files')
- A placeholder blob (`.placeholder`) is created within each workspace folder to ensure the folder structure exists
- Special characters in workspace names are sanitized and replaced with hyphens
- Workspace names are converted to lowercase for consistency

## 2. Azure AI Search Index Format

Each workspace has a dedicated Azure AI Search index to enable semantic search capabilities for its documents.

### Format Structure
```
{workspaceFolderName}index
```

### Components
- **{workspaceFolderName}**: The workspace folder name as generated for Blob Storage (e.g., `naruto-a1b2c3d`)
- **index**: Literal suffix to indicate this is a search index

### Example
For the "Naruto" workspace with ID "naruto-a1b2c3d4-e5f6-7890-g1h2-i3j4k5l6m7n8":
```
naruto-a1b2c3dindex
```

### Implementation Details
- The index name is derived from the workspace folder name to maintain consistency
- Each index is created with a specific schema optimized for document search
- Indexes are created using the Azure Search REST API to enable semantic search capabilities

## 3. Semantic Configuration Format

Each Azure AI Search index includes a semantic configuration that enhances search results with AI-powered understanding.

### Format Structure
```
search{indexName}
```

### Components
- **search**: Literal prefix for semantic configurations
- **{indexName}**: The full index name (e.g., `naruto-a1b2c3dindex`)

### Example
For the "Naruto" workspace index `naruto-a1b2c3dindex`:
```
searchnaruto-a1b2c3dindex
```

### Schema Structure
The semantic configuration includes the following field prioritization:

#### Title Field
- **fileName**: The name of the uploaded file

#### Content Fields (Prioritized for semantic understanding)
- **content**: The extracted text content of the document
- **summary**: AI-generated summary of the document

#### Keywords Fields (Prioritized for keyword matching)
- **fileName**: The name of the uploaded file
- **workspaceName**: The name of the workspace
- **fileType**: The MIME type of the file
- **keyPoints**: AI-extracted key points from the document

### Implementation Details
- Semantic configurations are created using the Azure Search REST API with the 2023-07-01-Preview API version
- The configuration is applied when the index is created
- Semantic search enhances query results by understanding the meaning and context of both the documents and search terms

## Summary

When a workspace is created in the AIVA application:

1. **Blob Storage Folder**: `workspace/{sanitized-workspace-name}-{7-char-id}/`
2. **Search Index**: `{sanitized-workspace-name}-{7-char-id}index`
3. **Semantic Config**: `search{sanitized-workspace-name}-{7-char-id}index`

This standardized approach ensures consistent naming across all Azure services and enables proper organization and retrieval of workspace-specific data.