import type { Request, Response } from 'express';
import db from '../models';

const { ComicBooks } = db;

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

const validateId = (id: string): number | null => {
  const parsedId = parseInt(id, 10);
  return !isNaN(parsedId) && parsedId > 0 ? parsedId : null;
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

// ============================================================================
// CONTROLLER FUNCTIONS
// ============================================================================

export const getQuestionComicBooks = asyncHandler(
  async (req: Request, res: Response): Promise<Response> => {
    const { questionId } = req.query;

    if (!questionId || typeof questionId !== 'string') {
      return sendError(res, 'Question ID is required', 400);
    }

    const validQuestionId = validateId(questionId);
    if (validQuestionId === null) {
      return sendError(res, 'Invalid question ID format', 400);
    }

    const questionComicBooks = await ComicBooks.findAll({
      where: { questionId: validQuestionId },
    });

    return sendSuccess(res, questionComicBooks);
  }
);

export const getOneById = asyncHandler(
  async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;

    const validId = validateId(id);
    if (validId === null) {
      return sendError(res, 'Invalid comic book ID format', 400);
    }

    const comicBook = await ComicBooks.findByPk(validId);

    if (!comicBook) {
      return sendError(res, 'Comic book not found', 404);
    }

    return sendSuccess(res, comicBook);
  }
);

export const createComicBook = asyncHandler(
  async (req: Request, res: Response): Promise<Response> => {
    const { title, publisher, year, userId } = req.body;

    if (!title || !publisher || !year || !userId) {
      return sendError(
        res,
        'Missing required fields: title, publisher, year, and userId are required',
        400
      );
    }

    if (typeof title !== 'string' || typeof publisher !== 'string') {
      return sendError(res, 'Title and publisher must be strings', 400);
    }

    const parsedYear = parseInt(year, 10);
    const parsedUserId = parseInt(userId, 10);

    if (isNaN(parsedYear) || isNaN(parsedUserId)) {
      return sendError(res, 'Year and userId must be valid numbers', 400);
    }

    try {
      const newComicBook = await ComicBooks.create({
        title,
        publisher,
        year: parsedYear,
        userId: parsedUserId,
      });

      return sendSuccess(res, { id: newComicBook.id }, 201);
    } catch (error) {
      const errors = extractValidationErrors(error as SequelizeError);
      return sendValidationErrors(res, errors);
    }
  }
);

export const updateComicBook = asyncHandler(
  async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    const updateData = req.body;

    const validId = validateId(id);
    if (validId === null) {
      return sendError(res, 'Invalid comic book ID format', 400);
    }

    if (!updateData || Object.keys(updateData).length === 0) {
      return sendError(res, 'No update data provided', 400);
    }

    const existingComicBook = await ComicBooks.findByPk(validId);
    if (!existingComicBook) {
      return sendError(res, 'Comic book not found', 404);
    }

    try {
      await ComicBooks.update(updateData, {
        where: { id: validId },
      });

      const updatedComicBook = await ComicBooks.findByPk(validId);

      return sendSuccess(res, updatedComicBook);
    } catch (error) {
      const errors = extractValidationErrors(error as SequelizeError);
      return sendValidationErrors(res, errors);
    }
  }
);

export const removeComicBook = asyncHandler(
  async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;

    const validId = validateId(id);
    if (validId === null) {
      return sendError(res, 'Invalid comic book ID format', 400);
    }

    const existingComicBook = await ComicBooks.findByPk(validId);
    if (!existingComicBook) {
      return sendError(res, 'Comic book not found', 404);
    }

    await ComicBooks.destroy({ where: { id: validId } });

    return sendSuccess(res, { message: 'Comic book deleted successfully' });
  }
);