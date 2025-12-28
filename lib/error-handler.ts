import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

type ErrorWithMessage = {
    message: string;
    statusCode?: number;
};

export class AppError extends Error {
    statusCode: number;
    isOperational: boolean;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

export const createError = (status: number, message: string) => {
    return new AppError(message, status);
};

export const errorHandler = (err: unknown) => {
    // Log error for debugging
    console.error('Error Handler:', err);

    // Default error response
    const error: ErrorWithMessage = {
        message: 'Une erreur est survenue',
        statusCode: 500,
    };

    // Handle different types of errors
    if (err instanceof AppError) {
        error.message = err.message;
        error.statusCode = err.statusCode;
    } else if (err instanceof ZodError) {
        error.message = 'Validation error';
        error.statusCode = 400;
    } else if (err instanceof Error) {
        error.message = err.message;
    }

    return error;
};

export const errorResponse = (err: unknown) => {
    const error = errorHandler(err);
    return NextResponse.json(
        {
            success: false,
            message: error.message,
            ...(process.env.NODE_ENV === 'development' && { stack: err instanceof Error ? err.stack : undefined })
        },
        { status: error.statusCode || 500 }
    );
};
