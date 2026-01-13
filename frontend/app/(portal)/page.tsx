import { PortalFeatures } from './features'
import { PortalHero } from './hero'
import { PortalIntegrations } from './integrations'

const PortalPage = () => {
    return (
        <main className="flex min-h-dvh flex-col items-center gap-16 px-4 py-4.5 md:gap-20 md:px-9 lg:px-14">
            <PortalHero />
            <PortalFeatures />
            <PortalIntegrations />
        </main>
    )
}

export default PortalPage
