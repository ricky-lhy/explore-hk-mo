import { getPlaces } from '@/integrations/client'
import { getPlacesById } from '@/integrations/client'
import { isGetPlacesByIdNotFoundError, isGetPlacesInvalidCursorError } from '@/integrations/errors'

import { AppError } from '@/lib/errors'
import { hasErrorMessage } from '@/lib/utils'

import type { CategoryKey } from '@/types/category'
import type { Location, LocationID, LocationSortOption, LocationsPage } from '@/types/location'
import type { Region } from '@/types/region'

import { placeToLocation } from './location-utils'

const sortQueryMap = {
    ranking: { orderBy: 'ranking', orderDir: 'asc' },
    rating: { orderBy: 'rating', orderDir: 'desc' }
}

/**
 * Gets locations for a specific region.
 *
 * @param region - The region to fetch locations for
 * @param sort - The field to order by (default: 'ranking')
 * @param categories - Optional array of categories to filter by
 * @param startCursor - Optional start cursor for pagination
 * @returns Array of places ordered by the specified field
 */
export const getLocationsByRegion = async (
    region: Region,
    sort: LocationSortOption,
    categories?: CategoryKey[],
    startCursor?: LocationID
): Promise<LocationsPage> => {
    const cursor = startCursor
        ? parseInt(startCursor) || undefined // Handle invalid cursor
        : undefined

    // Fetch locations of the specified region
    const { data, error } = await getPlaces({
        query: {
            region,
            cursor,
            categories: categories?.join(','),
            ...sortQueryMap[sort]
        }
    })

    if (error) {
        // Domain-specific error handling
        if (isGetPlacesInvalidCursorError(error)) throw new AppError('INVALID_LOCATION_CURSOR')

        // General error
        const errorMessage = hasErrorMessage(error) ? error.message : String(error)
        throw new AppError('UNKNOWN', errorMessage)
    }

    const places = data?.places ?? []
    const nextCursor = data?.nextCursor?.toString()

    return {
        locations: places.map(placeToLocation),
        nextCursor
    }
}

/**
 * Get a single location by its ID.
 *
 * @param id - The ID of the location to fetch
 * @returns The location with the specified ID or undefined if not found
 */
export const getLocationById = async (id: LocationID): Promise<Location | undefined> => {
    // Fetch place with the specified ID
    const { data: place, error } = await getPlacesById({ path: { id: parseInt(id) } })

    if (error) {
        // Domain-specific error handling
        if (isGetPlacesByIdNotFoundError(error)) throw new AppError('LOCATION_NOT_FOUND')

        // General error
        const errorMessage = hasErrorMessage(error) ? error.message : String(error)
        throw new AppError('UNKNOWN', errorMessage)
    }

    return place
        ? placeToLocation(place) // Convert to Location object
        : undefined
}
