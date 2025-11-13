import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import createDebug from 'debug';
import usersRouter from './routes/users';

// ============================================================================
// DEBUG SETUP
// ============================================================================

const error = createDebug('api:error');

// ============================================================================
// CUSTOM LOGGING MIDDLEWARE (FUNCTIONAL)
// ============================================================================

const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  const start = Date.now();
  
  // Log when response finishes
  res.on('finish', () => {
    const duration = Date.now() - start;
    const statusColor = res.statusCode >= 400 ? '\x1b[31m' : '\x1b[32m';
    const reset = '\x1b[0m';
    
    console.log(
      `${req.method} ${req.path} ${statusColor}${res.statusCode}${reset} - ${duration}ms`
    );
  });
  
  next();
};

// ============================================================================
// CREATE EXPRESS APP
// ============================================================================

const app = express();

// ============================================================================
// MIDDLEWARE
// ============================================================================

// Use cross origin to access token in header
app.use(cors({ credentials: true }));

// Checks to see if the content-type is json and parses it into req.body
app.use(express.json());

// Log all requests (custom lightweight logger)
app.use(requestLogger);

// ============================================================================
// ROUTES
// ============================================================================

// Setup the app to use the router at /users
app.use('/users', usersRouter);

// ============================================================================
// ERROR HANDLING MIDDLEWARE
// ============================================================================

// Four params are required to mark this as error handling middleware
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  error('ERROR FOUND:', err);
  res.sendStatus(500);
});

// ============================================================================
// EXPORT
// ============================================================================

export default app;