import Image from 'next/image'

import { faCompass, faMapLocationDot } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import {
    PortalSection,
    PortalSectionContent,
    PortalSectionHeader,
    PortalSectionItem
} from './_components/section'

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
        <PortalSection>
            <PortalSectionHeader
                title="Features"
                description="Everything you need to plan your perfect trip."
            />
            <PortalSectionContent className="md:grid-cols-2 lg:gap-x-7">
                {features.map(({ id, icon, title, description, image }) => (
                    <PortalSectionItem key={id} className="p-3">
                        <Image
                            className="w-full"
                            src={image}
                            alt={title}
                            width={350}
                            height={175}
                        />
                        <div className="flex flex-col gap-1.25 p-2.5 pt-px">
                            <FontAwesomeIcon icon={icon} />
                            <h3>{title}</h3>
                            <p>{description}</p>
                        </div>
                    </PortalSectionItem>
                ))}
            </PortalSectionContent>
        </PortalSection>
    )
}

export { PortalFeatures }
