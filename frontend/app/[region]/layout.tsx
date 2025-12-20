import { redirect } from 'next/navigation'

import { validateRegion } from '@/services/region'

import { defaultRegion } from '@/lib/config'
import { RegionProvider } from '@/lib/context'

const RegionLayout = async ({ children, modal, params }: LayoutProps<'/[region]'>) => {
    const { region } = await params

    // If the region is invalid, redirect to the default region
    if (!validateRegion(region)) {
        redirect(`/${defaultRegion}`)
    }

    return (
        <RegionProvider region={region}>
            {modal}
            {children}
        </RegionProvider>
    )
}

export default RegionLayout
