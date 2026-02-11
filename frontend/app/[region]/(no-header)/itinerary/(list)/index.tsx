'use client'

import { DndContext, DragOverlay, closestCorners } from '@dnd-kit/core'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'

import { useItineraryList } from '@/services/itinerary'
import { useLocations } from '@/services/location-hooks'
import { showToast } from '@/services/toast'

import { useRegion } from '@/lib/context'
import { getAppErrorDescription } from '@/lib/errors'

import { locationToItineraryLocationProps } from './_components/location-utils'
import { SortableItineraryLocationOverlay } from './_components/sortable-location'
import { useItineraryDnd } from './_hooks/use-dnd'
import { ItineraryLayout, ItineraryLayoutSkeleton } from './_layout'
import { ItineraryHeader } from './header'

const ItineraryContent = () => {
    const { region } = useRegion()
    const { itinerary, arrangeLocation } = useItineraryList(region)

    // Fetch details for all locations in the itinerary
    const {
        locations: details,
        loading,
        error
    } = useLocations(itinerary.flatMap((day) => day.locations))

    const { activeId, sensors, handleDragStart, handleDragOver, handleDragEnd, findContainer } =
        useItineraryDnd(itinerary, arrangeLocation)

    // Show fallback while loading
    if (loading) {
        return <ItineraryLayoutSkeleton />
    }

    // Handle errors
    if (error) {
        showToast({
            type: 'error',
            message: {
                title: 'Failed to load location details',
                description: getAppErrorDescription(error)
            }
        })
    }

    const activeLocation = activeId ? details.find((loc) => loc.id === activeId) : null

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToVerticalAxis]}
        >
            <ItineraryLayout itinerary={itinerary} details={details} />
            <DragOverlay>
                {activeLocation && (
                    <SortableItineraryLocationOverlay
                        {...locationToItineraryLocationProps(
                            activeLocation,
                            findContainer(activeId!)! // Date of the container
                        )}
                    />
                )}
            </DragOverlay>
        </DndContext>
    )
}

export { ItineraryContent, ItineraryHeader }
