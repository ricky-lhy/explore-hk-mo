import { hasErrorMessage } from './utils'

export type AppErrorCode =
    // 404
    | 'LOCATION_NOT_FOUND'
    // 422
    | 'INVALID_DATE_FORMAT'
    | 'INVALID_DATE_RANGE'
    | 'INVALID_LOCATION_CURSOR'
    | 'INVALID_LOCATION_PAIRS'
    // Non-HTTP
    | 'NETWORK'
    | 'TIMEOUT'
    | 'UNKNOWN'

export class AppError extends Error {
    code: AppErrorCode
    details?: string

    constructor(code: AppErrorCode, message?: string, details?: string) {
        super(message)
        this.code = code
        this.details = details
    }
}

/**
 * Checks if the given error is an instance of AppError.
 * @param e - The error to check.
 * @returns True if the error is an AppError, false otherwise.
 */
export const isAppError = (e: unknown): e is AppError => {
    return e instanceof AppError
}

/**
 * Converts an unknown error to an AppError.
 * @param e - The error to convert.
 * @returns The converted AppError.
 */
export const toAppError = (e: unknown): AppError => {
    // Already an AppError, return as is
    if (isAppError(e)) return e
    // Extract message if available
    const errorMessage = hasErrorMessage(e) ? e.message : String(e)
    return new AppError('UNKNOWN', errorMessage)
}
