import type {
    GetPlacesByIdNotFoundError,
    GetPlacesInvalidCursorError,
    PostRoutesInvalidDateFormatError,
    PostRoutesNotInSameRegionError,
    PostRoutesOnlyOnePlaceError,
    PostRoutesPlaceNotFoundError,
    PostRoutesSearchingPastDatesError
} from './errors.d'

const isObject = (value: unknown): value is Record<string, unknown> =>
    typeof value === 'object' && value !== null

/** Checks if the error is about invalid cursor in `GET /places` */
export const isGetPlacesInvalidCursorError = (
    error: unknown
): error is GetPlacesInvalidCursorError => {
    return isObject(error) && error.message === 'Invalid cursor' && typeof error.cursor === 'number'
}

/** Checks if the error is about place with given ID not found in `GET /places/{id}` */
export const isGetPlacesByIdNotFoundError = (
    error: unknown
): error is GetPlacesByIdNotFoundError => {
    return isObject(error) && error.message === 'Place not found' && typeof error.id === 'number'
}

/** Checks if the error is about invalid date format in `POST /routes/day` */
export const isPostRoutesInvalidDateFormatError = (
    error: unknown
): error is PostRoutesInvalidDateFormatError => {
    return isObject(error) && error.message === 'Invalid date format'
}

/** Checks if the error is about invalid date range (before today) in `POST /routes/day` */
export const isPostRoutesSearchingPastDatesError = (
    error: unknown
): error is PostRoutesSearchingPastDatesError => {
    return (
        isObject(error) &&
        error.message === 'Cannot search for past dates' &&
        typeof error.inputDate === 'string' &&
        typeof error.today === 'string' &&
        typeof error.timezone === 'string'
    )
}

/** Checks if the error is about at least two places required in `POST /routes/day` */
export const isPostRoutesOnlyOnePlaceError = (
    error: unknown
): error is PostRoutesOnlyOnePlaceError => {
    return isObject(error) && error.message === 'At least two places are required'
}

/** Checks if the error is about invalid location pairs (not in the same region) in `POST /routes/day` */
export const isPostRoutesNotInSameRegionError = (
    error: unknown
): error is PostRoutesNotInSameRegionError => {
    return (
        isObject(error) &&
        error.message === 'All places must be in the same region' &&
        Array.isArray(error.regions) &&
        error.regions.every(
            (region) =>
                isObject(region) &&
                typeof region.id === 'number' &&
                typeof region.region === 'string'
        )
    )
}

/** Checks if the error is about place id not found in `POST /routes/day` */
export const isPostRoutesPlaceNotFoundError = (
    error: unknown
): error is PostRoutesPlaceNotFoundError => {
    return isObject(error) && error.message === 'Place not found' && typeof error.id === 'number'
}
