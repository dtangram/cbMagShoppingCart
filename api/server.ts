import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import createDebug from 'debug';
import usersRouter from './app/routes/users';

const error = createDebug('api:error');

// CREATE EXPRESS APP
const app = express();

// MIDDLEWARE
// Use cross origin to access token in header
app.use(cors({ credentials: true }));

// Checks to see if the content-type is json and parses it into req.body
app.use(express.json());

// Simple request logger (replaces morgan)
app.use((req: Request, res: Response, next: NextFunction): void => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const statusColor = res.statusCode >= 400 ? '\x1b[31m' : '\x1b[32m';
    const reset = '\x1b[0m';
    
    console.log(
      `${req.method} ${req.path} ${statusColor}${res.statusCode}${reset} - ${duration}ms`
    );
  });
  
  next();
});

// ROUTES
// Setup the app to use the router at /users
app.use('/users', usersRouter);

// ERROR HANDLING MIDDLEWARE
// Four params are required to mark this as error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction): void => {
  error('ERROR FOUND:', err);
  res.sendStatus(500);
});

export default app;