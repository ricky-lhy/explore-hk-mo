import dayjs from 'dayjs'

import type { Location } from '@/types/location'

import type { ItineraryLocationProps } from './location'

/**
 * Adapts a Location object to ItineraryLocationProps.
 *
 * @param location - The location object to adapt
 * @returns The adapted ItineraryLocationProps object
 */
export const locationToItineraryLocationProps = (
    { id, name, position, hours, images }: Location,
    date: string
): ItineraryLocationProps => ({
    identifier: id,
    name: name,
    address: position.address,
    hours: !hours ? 'Open 24 hours' : hours[dayjs(date).day()]?.formatted,
    image: images[0]
})
