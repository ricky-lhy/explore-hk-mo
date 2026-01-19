'use client'

import { createContext, useContext } from 'react'

import { Toaster } from '@/components/ui/sonner'

import type { Region } from '@/types/region'

import { SWRConfigProvider } from './swr-config'

type RegionContextType = {
    region: Region
}

const RegionContext = createContext<RegionContextType | null>(null)

export const useRegion = () => {
    const context = useContext(RegionContext)
    if (!context) {
        throw new Error('useRegion must be used within a RegionProvider')
    }
    return context
}

export const AppProvider = ({
    children,
    region
}: {
    children: React.ReactNode
    region: Region
}) => {
    return (
        <RegionContext.Provider value={{ region }}>
            <SWRConfigProvider>
                {children}
                <Toaster />
            </SWRConfigProvider>
        </RegionContext.Provider>
    )
}
