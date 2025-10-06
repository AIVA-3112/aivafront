# API Comparison: combined.js vs index.ts + Routes

This document compares the API endpoints available in the two server implementations:
1. `combined.js` - Simplified single-file server implementation
2. `index.ts` + route files - Modular TypeScript implementation

## Authentication APIs

### combined.js
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/verify` - Token verification

### index.ts + Routes
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/microsoft/callback` - Microsoft OAuth callback
- `POST /api/auth/logout` - User logout
- `GET /api/auth/verify` - Token verification

**Comparison**: The modular implementation has additional Microsoft OAuth and logout functionality.

## Chat APIs

### combined.js
- `GET /api/chat` - Get user chats
- `POST /api/chat` - Create new chat
- `POST /api/chat/message` - Send message
- `GET /api/chat/:chatId/messages` - Get chat messages
- `DELETE /api/chat/:chatId` - Delete chat

### index.ts + Routes
- `GET /api/chat` - Get user chats with pagination
- `POST /api/chat` - Create new chat with workspace support
- `POST /api/chat/message` - Send message with AI integration
- `GET /api/chat/:chatId/messages` - Get chat messages with pagination
- `DELETE /api/chat/:chatId` - Delete chat
- `GET /api/chat/:chatId` - Get specific chat details
- Additional advanced features for chat management

**Comparison**: The modular implementation has more advanced features including pagination, workspace integration, and better error handling.

## User APIs

### combined.js
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile

### index.ts + Routes
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile
- `GET /api/user/stats` - Get user statistics

**Comparison**: The modular implementation includes user statistics endpoint.

## Message Actions APIs

### combined.js
- No dedicated message actions endpoints (likes, dislikes, bookmarks)

### index.ts + Routes
- `GET /api/message-actions/liked` - Get liked messages
- `GET /api/message-actions/disliked` - Get disliked messages
- `POST /api/message-actions/:messageId/:actionType` - Add message action
- `DELETE /api/message-actions/:messageId/:actionType` - Remove message action

**Comparison**: The modular implementation has full message actions functionality which is missing in combined.js.

## Bookmarks APIs

### combined.js
- No dedicated bookmarks endpoints

### index.ts + Routes
- `GET /api/bookmarks` - Get user bookmarks
- `POST /api/bookmarks/:messageId` - Add bookmark
- `DELETE /api/bookmarks/:messageId` - Remove bookmark

**Comparison**: The modular implementation has full bookmarks functionality which is missing in combined.js.

## Chat History APIs

### combined.js
- No dedicated chat history endpoints

### index.ts + Routes
- `GET /api/history` - Get user chat history
- `GET /api/history/:chatId` - Get specific chat details with messages

**Comparison**: The modular implementation has dedicated history functionality which is missing in combined.js.

## Admin APIs

### combined.js
- `GET /api/admin/stats` - Get system statistics
- `GET /api/admin/users` - Get all users
- `GET /api/admin/azure-services` - Get Azure service status
- `GET /api/admin/feedback` - Get all feedback

### index.ts + Routes
- Multiple admin endpoints in:
  - `admin.ts` - User management, system stats, monitoring
  - `adminData.ts` - Data operations, SQL queries, dataset management
  - `config.ts` - Configuration management
  - `keyVault.ts` - Azure Key Vault integration

**Comparison**: The modular implementation has much more comprehensive admin functionality.

## File APIs

### combined.js
- `GET /api/files` - List files
- `POST /api/files/upload` - Upload file

### index.ts + Routes
- `GET /api/files` - List files with better Azure integration
- `POST /api/files/upload` - Upload file with multipart support
- `DELETE /api/files/:fileId` - Delete file
- `GET /api/files/download/:fileId` - Download file
- Additional file management endpoints

**Comparison**: The modular implementation has more comprehensive file management.

## Workspace APIs

### combined.js
- `GET /api/workspaces` - Get workspaces
- `POST /api/workspaces` - Create workspace

### index.ts + Routes
- Comprehensive workspace management with:
  - Create, update, delete workspaces
  - File management within workspaces
  - User assignment to workspaces
  - Workspace indexing for search