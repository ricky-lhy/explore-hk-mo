import dayjs from 'dayjs'

import { useItineraryStore } from '@/store'
import { isLocationInItinerary } from '@/store/utils'

import type { Itinerary } from '@/types/itinerary'
import type { LocationID } from '@/types/location'
import type { Region } from '@/types/region'

import { dayjsToDate, stringToDate } from './date'

/**
 * Hook to manage a specific location in the itinerary for a given region.
 *
 * @param region - The region of the itinerary
 * @param location - The location ID
 * @returns A tuple containing: a boolean indicating if the location is in the itinerary, a function to add the location, and a function to remove the location.
 */
export const useItineraryItem = (
    region: Region,
    location: LocationID
): readonly [boolean, () => void, () => void] => {
    const { itineraries, addLocation, removeLocation } = useItineraryStore()
    return [
        // Whether the location is in the itinerary list
        isLocationInItinerary(itineraries[region], location),
        // Append the location to the itinerary list
        () => addLocation(region, location),
        // Remove the location from the itinerary list
        () => removeLocation(region, location)
    ] as const
}

/**
 * Hook to manage the duration of the itinerary for a given region.
 *
 * @param region - The region of the itinerary
 * @returns An object containing the start date, end date, and a function to set the duration.
 */
export const useItineraryDuration = (
    region: Region
): {
    /** The start date of the itinerary */
    start: string
    /** The end date of the itinerary */
    end: string
    /** Function to set the duration of the itinerary */
    setDuration: (start: string, end: string) => void
} => {
    const { itineraries, changeDates } = useItineraryStore()
    const { start: _start, locations } = itineraries[region]

    const start = stringToDate(_start) // Format ensurance

    return {
        start,
        end: dayjsToDate(dayjs(start).add(locations.length - 1, 'day')),
        setDuration: (start: string, end: string) => changeDates(region, start, end)
    }
}

/**
 * Hook to get the itinerary list for a specific region.
 *
 * @param region - The region of the itinerary list
 * @returns An object containing the itinerary list of location IDs for the specified region.
 */
export const useItineraryList = (region: Region): { itinerary: Itinerary } => {
    const { itineraries } = useItineraryStore()
    return { itinerary: itineraries[region] }
}
