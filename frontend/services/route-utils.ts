import type { RouteLegDto } from '@/integrations/client'

import type { Route, TransitMethod } from '@/types/route'

/**
 * Converts a travel mode string to a TransitMethod.
 *
 * @param mode - Travel mode as a string
 * @returns Corresponding transit method
 */
export const travelModeToTransitMethod = (mode: string): TransitMethod =>
    mode === 'Drive' ? 'driving' : mode === 'Walk' ? 'walking' : 'transit' // Default to 'transit'

/**
 * Converts a TransitMethod to a travel mode string.
 *
 * @param method - Transit method
 * @returns - Corresponding travel mode as a string
 */
export const transitMethodToTravelMode = (method: TransitMethod): string =>
    method === 'driving' ? 'Drive' : method === 'walking' ? 'Walk' : 'Transit' // Default to 'Transit'

/**
 * Converts a RouteLegDto to a Route object.
 *
 * @param leg - Route leg data transfer object
 * @returns Converted Route object
 */
export const routeLegToRoute = (leg: RouteLegDto): Route => ({
    locations: {
        origin: leg.fromPlaceId?.toString() ?? '', // This should never be missing...
        destination: leg.toPlaceId?.toString() ?? '' // and so should this
    },
    method: travelModeToTransitMethod(
        leg.steps?.every((step) => step.stepTravelMode === 'Walk')
            ? 'Walk' // All walking steps (to handle transit legs with only walking)
            : (leg.travelMode ?? '') // Otherwise use leg travel mode
    ),
    distance: leg.distance ?? -1,
    duration: leg.duration ?? -1
})
