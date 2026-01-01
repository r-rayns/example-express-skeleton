# Example Express Skeleton

A [blog post](https://rrayns.co.uk/posts/20251228-express-skeleton-app/) accompanies this repo. In the post the design and structure of this project is discussed in greater detail.

## Purpose

A structured starting point for building Express.js REST APIs with TypeScript. This skeleton serves as an example or starting point for Express apps it comes with validation, error handling, and request flow without prescribing authentication or database implementations.

This project is intentionally minimal. It demonstrates patterns for organizing an Express application while leaving room for project-specific choices around authentication, databases, and other concerns. By no means is this project meant to be prescriptive, there is always another method or approach, this is just one I've come to use.

## Key Features

- **Defined Structure** - A clear separation of concerns with routes handling paths/middleware, controllers managing requests, and services executing business logic
- **Zod Validation** - Schema-based request validation with type inference
- **Centralised Error Handling** - Error handling middleware with consistent error responses across the application
- **Environment Validation** - Type-safe environment variables validated at startup
- **Request/Response Logging** - Centralised request & response logging, with coloured output for development
- **Testing** - Setup to use the Vitest framework with unit and integration test examples
- **TypeScript with ES Modules** - TypeScript with full type safety and strict mode enabled


## Quick Start

```bash
# Install dependencies
npm install

# Development mode with hot reload
npm run dev

# Production mode
npm start

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Lint code
npm run lint
```

## Project Structure

```
src/
├── app.ts                    # Application entry point
├── express-server.ts         # Express configuration and middleware setup
│
├── controllers/              # Request handlers - delegate to services
│   └── menu.controller.ts
│
├── middleware/               # Express middleware
│   ├── error-handler.ts      # Centralized error handling
│   ├── request-response-logger.ts
│   └── validator.ts          # Zod validation middleware factory
│
├── routes/                   # Route definitions with validation
│   ├── api.ts               # Main router (aggregates all routes)
│   ├── menu/
│   └── utility/
│
├── services/                 # Business logic and data operations
│   ├── env-loader.service.ts # Environment variable validation
│   └── menu.service.ts
│
├── types/                    # Type definitions
│   ├── common.ts
│   ├── errors.ts
│   ├── menu.ts
│   ├── request.ts
│   ├── response-codes.ts
│   └── validation-property.ts
│
├── utils/                   # Shared utilities
│   ├── api-error.ts         # Custom error class for expected API errors
│   ├── errors.ts            # Predefined error instances
│   └── logger.ts            # Environment-aware logger with timestamps and debug mode
│
└── validation-schema/       # Zod schemas for request validation
    ├── env.schema.ts
    ├── menu.schema.ts
    ├── transforms.schema.ts # Reusable Zod transforms
    └── utility.schema.ts
```
## Design

### Request Flow

All requests flow through a consistent pipeline:

1. Request/response logging middleware captures all traffic
2. Routes are mounted under `/api`
3. Route-specific validation middleware runs (using Zod schemas)
4. Controllers handle the request and delegate to services
5. Services perform business logic and data operations
6. Error handler middleware catches and formats any errors

### Validation

Routes declare validation requirements upfront using Zod schemas. The
`validate()` middleware factory validates request data (body, params, or query) before controllers execute, ensuring type safety throughout the request lifecycle.

### Error Handling

All errors flow through a single error handler middleware. Use the
`ApiError` class for expected errors with specific status codes. Unknown errors are caught and returned as generic 500 responses.

### Environment Configuration

Environment variables are validated against a Zod schema at application startup. The application exits immediately if validation fails, ensuring runtime configuration is always complete and type-safe.

## What's Not Included

This example project intentionally omits:

- Authentication/authorization & Session management
- Database integration
- Rate limiting
- API documentation generation
- Project specific CORS configuration such as allowedOrigins

These are typically individual to each project and should be considered based on the projects requirements.
