'use client'

import Image from 'next/image'

import { faCompass, faMapLocationDot } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { cn } from '@/lib/utils'

const features = [
    {
        id: 'home',
        icon: faCompass,
        title: 'Discover & Explore',
        description: 'Discover curated attractions and hidden gems in Hong Kong and Macau.',
        image: '/assets/portal/features-locations.webp'
    },
    {
        id: 'itinerary',
        icon: faMapLocationDot,
        title: 'Plan & Route',
        description: 'Plan daily trips with drag-and-drop and visualize the routes instantly.',
        image: '/assets/portal/features-routes.webp'
    }
]

const PortalFeatures = () => {
    return (
        <section className="grid gap-x-7 gap-y-6 px-2 md:grid-cols-2 md:gap-y-8">
            <div className="flex flex-col gap-2 text-balance md:col-span-2">
                <h2 className="-ml-px text-4xl font-bold tracking-tight md:text-[40px]">
                    Features
                </h2>
                <p className="md:text-lg">Everything you need to plan your perfect trip.</p>
            </div>
            {features.map(({ id, icon, title, description, image }) => (
                <article
                    key={id}
                    className={cn(
                        '-mx-px flex flex-col items-start gap-x-8 gap-y-1.5 p-3', // Layout
                        'bg-accent/80 rounded-2xl' // Appearance
                    )}
                >
                    <Image className="w-full" src={image} alt={title} width={350} height={175} />
                    <div className="flex flex-col gap-1.25 p-2.5 pt-0">
                        <FontAwesomeIcon className="text-theme mb-1.5 -ml-px text-xl" icon={icon} />
                        <h3 className="text-lg font-bold tracking-tight md:text-xl">{title}</h3>
                        <p>{description}</p>
                    </div>
                </article>
            ))}
        </section>
    )
}

export { PortalFeatures }
