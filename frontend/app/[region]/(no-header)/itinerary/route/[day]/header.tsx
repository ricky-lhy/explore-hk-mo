import type { ComponentProps } from 'react'

import { PageHeader } from '@/components/custom/page-header'

const RouteHeader = ({ children: closeButton, ...props }: ComponentProps<typeof PageHeader>) => {
    return (
        <PageHeader floating masking {...props}>
            {closeButton}
        </PageHeader>
    )
}

export { RouteHeader }
