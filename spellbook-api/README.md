# Spellbook API

Backend GraphQL API for the Spellbook Word Add-in.

## Features

- 🔐 JWT-based authentication
- 🚀 GraphQL API with Apollo Server
- 🤖 AI-powered document analysis (mock implementation)
- 🔒 Rate limiting and security headers
- 🐳 Docker support
- 📝 TypeScript

## Quick Start

### Prerequisites
- Node.js 18+
- Redis (optional, for caching)
- Docker & Docker Compose (optional)

### Development Setup

1. Install dependencies:
```bash
npm install
```

2. Copy environment variables:
```bash
cp .env.example .env
```

3. Start the development server:
```bash
npm run dev
```

The API will be available at `http://localhost:4000/graphql`

### Using Docker

```bash
docker-compose up
```

## API Endpoints

### GraphQL Endpoint
- URL: `http://localhost:4000/graphql`
- Method: POST

### Health Check
- URL: `http://localhost:4000/health`
- Method: GET

## Authentication

The API uses JWT tokens for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Demo Credentials
- Email: `demo@spellbook.legal`
- Password: `demo`

## GraphQL Schema

### Queries
- `currentUser`: Get current authenticated user
- `health`: Health check

### Mutations

#### Authentication
- `login(email: String!, password: String!)`: Login user
- `signup(email: String!, password: String!, name: String!)`: Create new account
- `refreshToken(refreshToken: String!)`: Refresh access token
- `logout`: Logout user

#### AI Operations
- `analyzeText(input: AnalysisInput!)`: Analyze document text
- `askQuestion(documentText: String!, question: String!)`: Ask questions about document
- `draftClause(clauseType: String!, context: String!)`: Draft new clause
- `improveText(text: String!, instruction: String!)`: Improve existing text
- `generalReview(documentText: String!)`: General document review

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 4000 |
| NODE_ENV | Environment | development |
| JWT_SECRET | Secret for JWT signing | - |
| JWT_EXPIRY | JWT expiration time | 7d |
| OPENAI_API_KEY | OpenAI API key (not used in mock) | - |
| REDIS_URL | Redis connection URL | redis://localhost:6379 |
| ALLOWED_ORIGINS | CORS allowed origins | http://localhost:3000 |

## Testing

### Manual Testing with GraphQL Playground

1. Start the server
2. Navigate to `http://localhost:4000/graphql`
3. Run queries:

```graphql
# Login
mutation {
  login(email: "demo@spellbook.legal", password: "demo") {
    user {
      id
      email
      name
    }
    token
  }
}

# Analyze Text
mutation {
  analyzeText(input: {
    text: "The party shall use best efforts..."
    type: review
  }) {
    suggestions {
      type
      originalText
      suggestedText
      explanation
    }
  }
}
```

## Production Deployment

1. Build the Docker image:
```bash
docker build -t spellbook-api .
```

2. Run with production environment:
```bash
docker run -p 4000:4000 \
  -e NODE_ENV=production \
  -e JWT_SECRET=your-production-secret \
  -e OPENAI_API_KEY=your-api-key \
  spellbook-api
```

## Security Notes

- Change the JWT_SECRET in production
- Use HTTPS in production
- Configure proper CORS origins
- Enable rate limiting
- Use environment variables for sensitive data
- Consider adding helmet.js for additional security headers

## Future Enhancements

- [ ] Replace in-memory storage with PostgreSQL/MongoDB
- [ ] Integrate real OpenAI API
- [ ] Add request validation with Zod
- [ ] Implement subscription support
- [ ] Add comprehensive test suite
- [ ] Set up CI/CD pipeline
- [ ] Add API documentation with GraphQL introspection