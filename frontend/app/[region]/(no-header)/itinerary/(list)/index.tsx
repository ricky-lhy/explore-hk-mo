'use client'

import dayjs from 'dayjs'

import { useItineraryList } from '@/services/itinerary'
import { useLocations } from '@/services/location-hooks'

import { useRegion } from '@/lib/context'
import { isPresent } from '@/lib/utils'

import { ItineraryLocations, ItineraryLocationsSkeleton } from './_layout/locations'
import { ItineraryHeader } from './header'

const ItineraryContent = () => {
    const { region } = useRegion()
    const { itinerary } = useItineraryList(region)

    // Fetch details for all locations in the itinerary
    const { locations, loading } = useLocations(itinerary.locations.flat())

    if (loading) {
        // Show fallback while loading
        return <ItineraryLocationsSkeleton />
    }

    return itinerary.locations.map((dailyLocations, index) => (
        <ItineraryLocations
            key={index}
            day={index + 1}
            date={dayjs(itinerary.start).add(index, 'day').format('YYYY-MM-DD')}
            locations={dailyLocations
                .map((locId) => locations.find((loc) => loc.id === locId))
                .filter(isPresent)}
        />
    ))
}

export { ItineraryContent, ItineraryHeader }
