'use client'

import { notFound } from 'next/navigation'

import { useItineraryList } from '@/services/itinerary'
import { useLocations } from '@/services/location-hooks'

import { useRegion } from '@/lib/context'
import { isPresent } from '@/lib/utils'

import { RouteMap, RouteMapSkeleton } from './_layout/map'
import { RouteHeader } from './header'

const RouteContent = ({ day }: { day: number }) => {
    const { region } = useRegion()
    const { itinerary } = useItineraryList(region)
    const dailyItinerary = itinerary[day - 1]

    // Validate day index
    if (!dailyItinerary || !dailyItinerary.locations.length) {
        notFound()
    }

    // Fetch details for the locations in the itinerary
    const { date, locations: locationIds } = dailyItinerary
    const { locations: locationDetails, loading: locationsLoading } = useLocations(locationIds)

    const locations = locationIds
        .map((locId) => locationDetails.find((loc) => loc.id === locId))
        .filter(isPresent)

    // Show fallback while loading
    if (locationsLoading) {
        return <RouteMapSkeleton />
    }

    return (
        <main>
            <RouteMap positions={locations.map((loc) => loc.position.coordinates)} />
        </main>
    )
}

export { RouteContent, RouteHeader }
