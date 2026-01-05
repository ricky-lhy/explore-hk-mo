import type { ComponentProps, ReactNode } from 'react'

import {
    type IconDefinition,
    faArrowsTurnToDots,
    faBusSimple,
    faCar,
    faPersonWalking
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { Skeleton } from '@/components/ui/skeleton'

import { cn } from '@/lib/utils'

import type { Coordinates } from '@/types/location'
import type { TransitMethod } from '@/types/route'

import { RouteDirectionButton, RouteDirectionButtonSkeleton } from './direction-button'

const IconLabel = ({ icon, content }: { icon: IconDefinition; content?: ReactNode }) => (
    <p className="flex items-center gap-1 text-xs text-neutral-500">
        <FontAwesomeIcon icon={icon} className="size-2.75!" />
        <span className="line-clamp-1">{content}</span>
    </p>
)

const methodIcons: Record<TransitMethod, IconDefinition> = {
    transit: faBusSimple,
    driving: faCar,
    walking: faPersonWalking
}

// Pluralization helpers
const formatHours = (hr: number) => (hr <= 1 ? `${hr} hour` : `${hr} hours`)
const formatMinutes = (min: number) => (min <= 1 ? `${min} minute` : `${min} minutes`)

const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.round((seconds % 3600) / 60)

    return hours === 0
        ? formatMinutes(minutes)
        : minutes === 0
          ? formatHours(hours)
          : `${formatHours(hours)} ${formatMinutes(minutes)}`
}

const formatDistance = (meters: number) => {
    if (meters >= 1000) return `${parseFloat((meters / 1000).toFixed(1))} km` // Kilometers
    return `${meters} m` // Meters
}

const RouteSegment = ({
    duration,
    distance,
    method,
    origin,
    destination,
    className,
    ...props
}: ComponentProps<'li'> & {
    duration: number
    distance: number
    method: TransitMethod
    origin?: Coordinates
    destination?: Coordinates
}) => {
    return (
        <li className={cn('flex items-center gap-2.5', className)} {...props}>
            <div className="mr-1 flex size-6 items-center justify-center rounded-full bg-white ring-6 ring-white">
                <FontAwesomeIcon icon={methodIcons[method]} className="text-theme size-3" />
            </div>
            <div className="flex flex-1 flex-col gap-0.5">
                <span className="text-sm font-medium">{formatDuration(duration)}</span>
                <IconLabel icon={faArrowsTurnToDots} content={formatDistance(distance)} />
            </div>
            {origin && destination && (
                <RouteDirectionButton origin={origin} destination={destination} method={method} />
            )}
        </li>
    )
}

const RouteSegmentSkeleton = ({ className }: { className?: string }) => (
    <li className={cn('flex items-center gap-2.5', className)}>
        <div className="mr-1 flex size-6 items-center justify-center rounded-full bg-white ring-6 ring-white">
            <Skeleton className="size-3 rounded-full" />
            <RouteDirectionButtonSkeleton />
        </div>
        <Skeleton className="h-3 w-24" />
    </li>
)

export { RouteSegment, RouteSegmentSkeleton }
