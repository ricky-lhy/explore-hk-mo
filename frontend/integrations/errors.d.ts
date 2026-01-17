export type GetPlacesInvalidCursorError = {
    message: 'Invalid cursor'
    cursor: number
}

export type GetPlacesByIdNotFoundError = {
    message: 'Place not found'
    id: number
}

export type PostRoutesInvalidDateFormatError = {
    message: 'Invalid date format'
}

export type PostRoutesSearchingPastDatesError = {
    message: 'Cannot search for past dates'
    inputDate: string
    today: string
    timezone: string
}
export type PostRoutesOnlyOnePlaceError = {
    message: 'At least two places are required'
}

export type PostRoutesNotInSameRegionError = {
    message: 'All places must be in the same region'
    regions: { id: number; region: string }[]
}

export type PostRoutesPlaceNotFoundError = {
    message: 'Place not found'
    id: number
}

export type ServerSideError =
    // GET /places
    | GetPlacesInvalidCursorError
    // GET /places/{id}
    | GetPlacesByIdNotFoundError
    // POST /routes/day
    | PostRoutesInvalidDateFormatError
    | PostRoutesSearchingPastDatesError
    | PostRoutesNotInSameRegionError
    | PostRoutesPlaceNotFoundError
