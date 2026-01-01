'use client'

import { faPlane, faPlaneDeparture } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import dayjs from 'dayjs'

import { ProgressiveBlur } from '@/components/custom/progressive-blur'
import { Skeleton } from '@/components/ui/skeleton'

import { useItineraryDuration } from '@/services/itinerary'

import { getAppConfigByRegion } from '@/lib/config'
import { useRegion } from '@/lib/context'
import { cn } from '@/lib/utils'

const formatPeriod = (_start: string, _end: string) => {
    const start = dayjs(_start)
    const end = dayjs(_end)
    if (start.isSame(end, 'day')) return start.format('MMM D, YYYY')
    if (start.isSame(end, 'year')) return `${start.format('MMM D')} -> ${end.format('MMM D, YYYY')}`
    return `${start.format('MMM D, YYYY')} -> ${end.format('MMM D, YYYY')}`
}

const ItineraryCover = () => {
    const { region } = useRegion()
    const { name, cover } = getAppConfigByRegion(region)
    const { start, end } = useItineraryDuration(region)

    return (
        <div
            className={cn(
                'relative z-0 h-72 shrink-0',
                'flex flex-col justify-end gap-0.5',
                'px-4.5 py-4 text-white *:not-[div]:drop-shadow-lg'
            )}
        >
            {/* Content */}
            <h1 className="-ml-[0.5px] text-3xl font-bold tracking-[-0.5px]">{name}</h1>
            <h2 className="font-medium">{formatPeriod(start, end)}</h2>

            {/* Background layers */}
            <div className="absolute inset-0 bottom-0 -z-5 bg-linear-to-b via-transparent via-60% to-black/25" />
            <div
                className="absolute inset-0 -z-10 bg-cover bg-center"
                style={{ backgroundImage: `url('${cover}')` }}
            />
        </div>
    )
}

const ItineraryCoverSkeleton = () => {
    return <Skeleton className="h-72 shrink-0" />
}

export { ItineraryCover, ItineraryCoverSkeleton }
