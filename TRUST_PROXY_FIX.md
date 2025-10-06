# Trust Proxy Configuration Fix

## Problem Description

When deploying Express applications to cloud platforms like Azure App Service, you may encounter the following error:

```
ValidationError: The 'X-Forwarded-For' header is set but the Express 'trust proxy' setting is false (default). This could indicate a misconfiguration which would prevent express-rate-limit from accurately identifying users.
```

## Root Cause

This error occurs because:

1. **Reverse Proxy Usage**: Cloud platforms like Azure App Service use reverse proxies to route traffic to your application
2. **Header Injection**: These proxies add headers like `X-Forwarded-For`, `X-Forwarded-Host`, and `X-Forwarded-Proto` to requests
3. **Security Feature**: Express rate-limiting libraries (like express-rate-limit) have a security feature that warns when these headers are present but Express isn't configured to trust them
4. **IP Address Misidentification**: Without trusting the proxy, Express can't accurately determine the real client IP address, which breaks rate limiting by IP

## Solution

The fix is to configure Express to trust proxy headers by adding this line to your Express application setup:

```javascript
app.set('trust proxy', true);
```

## Implementation Details

### For TypeScript Applications (index.ts)

```typescript
import express from 'express';
// ... other imports

export const app = express();

// Configure Express to trust proxy headers
// This is needed when running behind a reverse proxy like Azure App Service
app.set('trust proxy', true);

// ... rest of your middleware and routes
```

### For JavaScript Applications (combined.js)

```javascript
const express = require('express');
const app = express();

// Configure Express to trust proxy headers
// This is needed when running behind a reverse proxy like Azure App Service
app.set('trust proxy', true);

// ... rest of your middleware and routes
```

## Security Considerations

While setting `trust proxy` to `true` solves the immediate problem, consider these security implications:

1. **Only use in trusted environments**: This setting should only be used when you're confident that requests are coming through a trusted proxy
2. **Environment-specific configuration**: You might want to conditionally enable this based on environment:

```javascript
// Only trust proxy in production/ cloud environments
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', true);
}
```

3. **Specific proxy configuration**: For more control, you can specify the exact number of trusted proxies:

```javascript
// Trust the first proxy hop
app.set('trust proxy', 1);
```

## Additional Configuration

If you're using express-rate-limit, you might also want to configure it to handle proxies properly:

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  // This ensures the rate limiter uses the real IP even behind a proxy
  keyGenerator: (req) => {
    // Use the real IP address from X-Forwarded-For if available
    return req.ip || req.connection.remoteAddress;
  }
});
```

## Verification

After implementing the fix:

1. Deploy your application to the cloud platform
2. Monitor logs to ensure the error no longer appears
3. Test rate limiting functionality to ensure it's working correctly
4. Verify that client IP addresses are being correctly identified

## References

- [Express "trust proxy" documentation](https://expressjs.com/en/guide/behind-proxies.html)
- [express-rate-limit proxy documentation](https://express-rate-limit.mintlify.app/guides/troubleshooting#unexpected-x-forwarded-for)
- [Azure App Service networking documentation](https://learn.microsoft.com/en-us/azure/app-service/networking-features)