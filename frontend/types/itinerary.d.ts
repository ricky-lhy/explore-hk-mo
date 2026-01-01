import type { LocationID } from '@/types/location'

export type DailyItinerary = {
    /** The date of the itinerary day in ISO format */
    date: string
    /** The list of location IDs for the day */
    locations: LocationID[]
}

export type Itinerary = {
    /** The start date of the itinerary in ISO format */
    start: string
    /** Lists of location IDs for each day */
    locations: LocationID[][]
}
