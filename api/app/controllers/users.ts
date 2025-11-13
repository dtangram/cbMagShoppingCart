import type { Request, Response } from 'express';
import db from '../models';

const { Users } = db;

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface ValidationError {
  message: string;
}

interface SequelizeError extends Error {
  errors?: ValidationError[];
}

// ============================================================================
// PURE HELPER FUNCTIONS
// ============================================================================

const sendSuccess = (
  res: Response,
  data: object | object[] | null,
  statusCode: number = 200
): Response => {
  if (data === null) {
    return res.status(404).json({ error: 'Resource not found' });
  }
  return res.status(statusCode).json(data);
};

const sendError = (res: Response, message: string, statusCode: number = 400): Response => {
  return res.status(statusCode).json({ error: message });
};

const sendValidationErrors = (res: Response, errors: string[]): Response => {
  return res.status(400).json({ errors });
};

const validateUUID = (id: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
};

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidUsername = (username: string): boolean => {
  return username.length >= 3 && username.length <= 50;
};

const extractValidationErrors = (error: SequelizeError): string[] => {
  if (!error.errors || !Array.isArray(error.errors)) {
    return ['An unexpected error occurred'];
  }
  return error.errors.map(({ message }) => message);
};

const asyncHandler = (fn: Function) => {
  return async (req: Request, res: Response): Promise<Response | void> => {
    try {
      return await fn(req, res);
    } catch (error) {
      console.error('Unhandled error:', error);
      return sendError(res, 'Internal server error', 500);
    }
  };
};

const hasProtectedFields = (updateData: any): boolean => {
  const protectedFields = ['id', 'createdAt', 'updatedAt'];
  return protectedFields.some(field => field in updateData);
};

// ============================================================================
// CONTROLLER FUNCTIONS
// ============================================================================

export const getUsers = asyncHandler(
  async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;

    if (!id || !validateUUID(id)) {
      return sendError(res, 'Invalid user ID format', 400);
    }

    const userUsers = await Users.findAll({ where: { id } });

    return sendSuccess(res, userUsers);
  }
);

export const getOneById = asyncHandler(
  async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;

    if (!id || !validateUUID(id)) {
      return sendError(res, 'Invalid user ID format', 400);
    }

    const user = await Users.findByPk(id);

    if (!user) {
      return sendError(res, 'User not found', 404);
    }

    return sendSuccess(res, user);
  }
);

export const createUser = asyncHandler(
  async (req: Request, res: Response): Promise<Response> => {
    const { firstname, lastname, username, email, password } = req.body;

    if (!firstname || !lastname || !username || !email) {
      return sendError(
        res,
        'Missing required fields: firstname, lastname, username, and email are required',
        400
      );
    }

    if (
      typeof firstname !== 'string' ||
      typeof lastname !== 'string' ||
      typeof username !== 'string' ||
      typeof email !== 'string'
    ) {
      return sendError(res, 'Invalid field types: all fields must be strings', 400);
    }

    if (!validateEmail(email)) {
      return sendError(res, 'Invalid email format', 400);
    }

    if (!isValidUsername(username)) {
      return sendError(res, 'Username must be between 3 and 50 characters', 400);
    }

    try {
      const newUser = await Users.create({
        firstname,
        lastname,
        username,
        email,
        password: password || null,
      });

      return sendSuccess(res, { id: newUser.id }, 201);
    } catch (error) {
      const errors = extractValidationErrors(error as SequelizeError);
      return sendValidationErrors(res, errors);
    }
  }
);

export const updateUser = asyncHandler(
  async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    const updateData = req.body;

    if (!id || !validateUUID(id)) {
      return sendError(res, 'Invalid user ID format', 400);
    }

    if (!updateData || Object.keys(updateData).length === 0) {
      return sendError(res, 'No update data provided', 400);
    }

    if (hasProtectedFields(updateData)) {
      return sendError(
        res,
        'Cannot update protected fields: id, createdAt, updatedAt',
        400
      );
    }

    const existingUser = await Users.findByPk(id);
    if (!existingUser) {
      return sendError(res, 'User not found', 404);
    }

    try {
      await Users.update(updateData, {
        where: { id },
      });

      const updatedUser = await Users.findByPk(id);

      return sendSuccess(res, updatedUser);
    } catch (error) {
      const errors = extractValidationErrors(error as SequelizeError);
      return sendValidationErrors(res, errors);
    }
  }
);

export const removeUser = asyncHandler(
  async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;

    if (!id || !validateUUID(id)) {
      return sendError(res, 'Invalid user ID format', 400);
    }

    const existingUser = await Users.findByPk(id);
    if (!existingUser) {
      return sendError(res, 'User not found', 404);
    }

    await Users.destroy({ where: { id } });

    return sendSuccess(res, { message: 'User deleted successfully' });
  }
);