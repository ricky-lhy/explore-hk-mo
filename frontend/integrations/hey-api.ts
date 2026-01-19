import { AppError, toAppError } from '@/lib/errors'

import type { CreateClientConfig } from './client/client.gen'

export const createClientConfig: CreateClientConfig = (config) => ({
    ...config,
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5019',
    // Add error handling logic
    fetch: async (input, init) => {
        try {
            const response = await fetch(input, init)
            return response
        } catch (error) {
            if (error instanceof Error && error.name === 'AbortError') {
                throw new AppError('TIMEOUT', error.message)
            }
            if (error instanceof TypeError) {
                throw new AppError('NETWORK', error.message)
            }
            throw toAppError(error)
        }
    }
})
