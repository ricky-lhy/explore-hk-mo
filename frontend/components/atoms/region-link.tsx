'use client'

import type { ComponentProps } from 'react'

import Link from 'next/link'

import { useRegion } from '@/lib/context'

const RegionLink = ({ href, ...props }: ComponentProps<typeof Link>) => {
    const { region } = useRegion()

    return <Link href={`/${region}${href}`} {...props} />
}

export { RegionLink }
