# AIVA Chat Application

AIVA (AI Virtual Assistant) is an intelligent chat application that connects workers and clients in a unified ecosystem, streamlining workflows and enhancing productivity for businesses of all sizes.

## Features

- AI-powered chat interface
- Microsoft Entra ID (Azure AD) authentication
- Workspace management
- File upload and management
- Message history and search
- Admin dashboard for system management
- Integration with Azure services (SQL Database, Blob Storage, OpenAI)

## Prerequisites

- Node.js 18.x or later
- Azure subscription with:
  - Azure SQL Database
  - Azure Storage Account
  - Azure OpenAI Service
  - Azure Key Vault (optional)
  - Microsoft Entra ID (Azure AD) tenant

## Setup Instructions

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd web-app
   ```

2. Install dependencies:
   ```bash
   npm install
   cd server
   npm install
   cd ..
   ```

3. Configure environment variables:
   Copy `.env.example` to `.env` and fill in the required values:
   ```bash
   cp .env.example .env
   ```

4. Build the application:
   ```bash
   npm run build
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

## Deployment

### Railway.app Deployment

1. Install Railway CLI:
   ```bash
   npm install -g @railway/cli
   ```

2. Login to Railway:
   ```bash
   railway login
   ```

3. Create a new project:
   ```bash
   railway init
   ```

4. Deploy the application:
   ```bash
   railway up
   ```

5. Add environment variables in the Railway dashboard.

### Azure App Service Deployment

1. Login to Azure CLI:
   ```bash
   az login
   ```

2. Create a resource group:
   ```bash
   az group create --name aiva-rg --location "East US"
   ```

3. Create an App Service plan:
   ```bash
   az appservice plan create --name aiva-plan --resource-group aiva-rg --sku B1 --is-linux
   ```

4. Create a web app:
   ```bash
   az webapp create --resource-group aiva-rg --plan aiva-plan --name aiva-app --runtime "NODE:18-lts"
   ```

5. Configure deployment settings:
   ```bash
   az webapp config appsettings set --resource-group aiva-rg --name aiva-app --settings PORT=8080
   ```

6. Deploy the application:
   ```bash
   az webapp deployment source config-local-git --resource-group aiva-rg --name aiva-app
   ```

7. Get the deployment URL:
   ```bash
   az webapp deployment list-publishing-credentials --resource-group aiva-rg --name aiva-app --query scmUri --output tsv
   ```

8. Add the remote and push:
   ```bash
   git remote add azure <deployment-url>
   git add .
   git commit -m "Initial deployment"
   git push azure main
   ```

9. Set environment variables in Azure Portal.

### Environment Variables

The following environment variables must be set:

- `AZURE_CLIENT_ID` - Your Azure AD application client ID
- `AZURE_CLIENT_SECRET` - Your Azure AD application client secret
- `AZURE_TENANT_ID` - Your Azure AD tenant ID
- `SQL_SERVER` - Your Azure SQL Server hostname
- `SQL_DATABASE` - Your database name
- `SQL_USERNAME` - Database username
- `SQL_PASSWORD` - Database password
- `AZURE_STORAGE_ACCOUNT_NAME` - Your Azure Storage account name
- `AZURE_STORAGE_ACCOUNT_KEY` - Your Azure Storage account key
- `AZURE_OPENAI_ENDPOINT` - Your Azure OpenAI endpoint
- `AZURE_OPENAI_API_KEY` - Your Azure OpenAI API key
- `JWT_SECRET` - Secret key for JWT token signing

## Architecture

The application consists of:
1. **Frontend**: React application built with Vite
2. **Backend**: Node.js/Express API server
3. **Database**: Azure SQL Database
4. **Authentication**: Microsoft Entra ID (Azure AD)
5. **Storage**: Azure Blob Storage
6. **AI Services**: Azure OpenAI

## Development

To start the development server:
```bash
npm run dev
```

This will start both the frontend and backend servers concurrently.

## Troubleshooting

### Common Issues

1. **Port conflicts**: The application uses ports 5173 (frontend) and 3001 (backend) by default
2. **Database connection errors**: Verify firewall settings and connection strings
3. **Authentication issues**: Check Azure AD app registration settings

### Viewing Logs

```bash
# For Railway
railway logs

# For Azure
az webapp log tail --resource-group aiva-rg --name aiva-app
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a pull request

## License

This project is licensed under the MIT License.