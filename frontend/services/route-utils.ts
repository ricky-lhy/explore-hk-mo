import type { RouteLegDto } from '@/integrations/client'

import type { Route, TransitMethod } from '@/types/route'

/**
 * Converts a travel mode string to a TransitMethod.
 *
 * @param mode - Travel mode as a string
 * @returns Corresponding transit method
 */
export const travelModeToTransitMethod = (mode: string): TransitMethod =>
    mode === 'Transit' ? 'transit' : mode === 'Drive' ? 'driving' : 'walking'

/**
 * Converts a TransitMethod to a travel mode string.
 *
 * @param method - Transit method
 * @returns - Corresponding travel mode as a string
 */
export const transitMethodToTravelMode = (method: TransitMethod): string =>
    method === 'transit' ? 'Transit' : method === 'driving' ? 'Drive' : 'Walk'

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
    method: travelModeToTransitMethod(leg.travelMode ?? ''), // Use default value if missing
    distanceMeters: leg.distance ?? 0,
    durationSeconds: leg.duration ?? 0
})
