# Proxy Configuration Update

## Overview

This document explains the changes made to update the frontend proxy configuration to point to the new backend URL: `web-production-50913.up.railway.app`.

## Changes Made

### 1. vite.config.ts

Updated the proxy configuration in the Vite configuration file:

**Before:**
```typescript
proxy: {
  "/api": {
    target: "web-production-50913.up.railway.app",
    changeOrigin: true,
    secure: false,
    rewrite: (path) => path.replace(/^\/api/, '/api')
  },
},
```

**After:**
```typescript
proxy: {
  "/api": {
    target: "https://web-production-50913.up.railway.app",
    changeOrigin: true,
    secure: true,
    rewrite: (path) => path.replace(/^\/api/, '/api')
  },
},
```

### Key Changes:
1. **Added HTTPS protocol** - The target URL now includes `https://` prefix
2. **Updated secure setting** - Changed from `secure: false` to `secure: true` since we're using HTTPS
3. **Maintained relative paths** - API calls in the frontend still use relative paths (`/api/endpoint`) which works with the proxy

## How It Works

### Development Mode
- Frontend runs on `http://localhost:5173`
- API requests to `/api/*` are automatically proxied to `https://web-production-50913.up.railway.app/api/*`
- This eliminates CORS issues during development

### Production Mode
- The same relative paths (`/api/endpoint`) work because the frontend and backend are served from the same domain
- No proxy is needed in production

## Testing the Configuration

To verify the proxy is working correctly:

1. Start the frontend development server:
   ```bash
   npm run dev
   ```

2. Open the browser and navigate to `http://localhost:5173`

3. Try making an API call (e.g., login or fetch user data)

4. Check the browser's developer tools Network tab to see:
   - Request URL should show `http://localhost:5173/api/endpoint`
   - The actual request should be proxied to `https://web-production-50913.up.railway.app/api/endpoint`

## Benefits of This Configuration

1. **Eliminates CORS Issues** - All API requests appear to come from the same origin
2. **Consistent API Calls** - Same relative paths work in both development and production
3. **Secure Communication** - Uses HTTPS for communication with the backend
4. **Easy Maintenance** - Only one place to update if the backend URL changes

## Troubleshooting

### If API Calls Fail
1. Check that the Railway.app backend is running
2. Verify the URL is correct: `https://web-production-50913.up.railway.app`
3. Ensure the backend has the proper CORS configuration to accept requests

### If Proxy Doesn't Work
1. Verify the proxy configuration in `vite.config.ts`
2. Check that the development server is running on port 5173
3. Ensure no firewall is blocking the connection

## Related Files

- `vite.config.ts` - Contains the proxy configuration
- `src/utils/api.ts` - Uses relative paths that work with the proxy
- `src/utils/auth.ts` - Authentication utilities that make API calls

## Future Considerations

If you need to switch back to a different backend URL, simply update the `target` property in the proxy configuration in `vite.config.ts`.