import useSWR from 'swr'

import { AppError, toAppError } from '@/lib/errors'

import type { LocationID } from '@/types/location'
import type { Route, TransitMethod } from '@/types/route'

import { computeRoutes } from './route'

export const useRoutes = (
    date: string,
    method: TransitMethod,
    locations: LocationID[]
): {
    /** Array of fetched locations, sorted by their IDs. */
    routes: Route[]
    /** Indicates whether the data is currently being loaded. */
    loading: boolean
    /** AppError object thrown by fetcher. `undefined` if no error occurred. */
    error: AppError | undefined
} => {
    const { data, error, isLoading } = useSWR(
        ['itinerary-routes', date, method, locations.join(',')], // SWR key
        () => computeRoutes(date, method, locations) // Fetcher
    )

    return {
        routes: data ?? [],
        loading: isLoading,
        error: error ? toAppError(error) : undefined
    }
}
