# Office AI Assistant

AI-assisted document processing inside Microsoft Word.

## Quick Start

### Prerequisites
- Node.js 16+ and npm
- Microsoft Word (desktop or online)

### Development Setup

1. Install dependencies for both client and API:
```bash
# Install client dependencies
npm install

# Install API dependencies
cd backend-api
npm install
cd ..
```

2. Start both development servers:
```bash
# Option 1: Use the convenience script
./start-dev.sh

# Option 2: Start manually in separate terminals
# Terminal 1 - API
cd backend-api
npm run dev

# Terminal 2 - Client
npm run dev
```

3. Load the add-in in Word:
```bash
npm run start
```

This will open Word and automatically load the add-in from `https://localhost:3000`.

### Login Credentials (Demo Mode)
- Email: `demo@yourcompany.com`
- Password: `demo`

## Features

- **AI Assistant**: Ask questions about your document and get intelligent responses
- **Document Review**: Automated analysis with issue detection and recommendations
- **Quick Actions**: 
  - Analyze selected text
  - Improve text with AI suggestions
  - Draft new clauses
  - Get smart suggestions

## Development

### Available Scripts

- `npm run dev` - Start Vite development server
- `npm run build` - Build for production
- `npm run start` - Start Office Add-in debugging
- `npm run stop` - Stop Office Add-in debugging
- `npm run validate` - Validate manifest.xml
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking

### Project Structure

```
office-ai-assistant/
├── Documents/          # HTML entry points
├── Scripts/           # Legacy scripts and API helpers
├── src/
│   ├── components/    # React components
│   ├── contexts/      # React contexts (Auth, Theme)
│   ├── pages/         # Page components
│   └── services/      # API services
├── manifest.xml       # Office Add-in manifest
└── vite.config.ts     # Vite configuration
```

### API Configuration

The add-in connects to the local API server by default. The API provides:
- GraphQL endpoint at `http://localhost:4000/graphql`
- Mock AI responses for testing
- JWT-based authentication
- Rate limiting and security features

To use mock mode without the API:
1. Edit `src/services/authService.ts` and `src/services/aiService.ts`
2. Change `const USE_MOCK = false` to `true`

## Building for Production

1. Build the project:
```bash
npm run build
```

2. The built files will be in the `dist/` directory

3. Deploy the files to a web server with HTTPS

4. Update `manifest.xml` to point to your production URLs

## Troubleshooting

### Certificate Issues
If you encounter HTTPS certificate errors:
```bash
npx office-addin-dev-certs install
```

### Add-in Not Loading
1. Check that the development server is running on https://localhost:3000
2. Verify the manifest is valid: `npm run validate`
3. Clear the Office cache and reload

### API Connection Issues
- The add-in uses mock data by default
- Check browser console for detailed error messages
- Ensure CORS is properly configured on API endpoints

## Contributing

See [ROADMAP.md](ROADMAP.md) for planned features and improvements.