'use client'

import { use } from 'react'

import { ModalCloseButton, ModalLayout } from '@/components/layout/modal'

import { RouteContent, RouteHeader } from '@/app/[region]/(no-header)/itinerary/route/[day]'

const RouteModal = ({ params }: PageProps<'/[region]/itinerary/route/[day]'>) => {
    const { day } = use(params)

    return (
        <ModalLayout>
            <RouteHeader>
                <ModalCloseButton />
            </RouteHeader>
            <RouteContent day={Number(day)} />
        </ModalLayout>
    )
}

export default RouteModal
