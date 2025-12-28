import type { ComponentProps } from 'react'

import { cn } from '@/lib/utils'

const PageHeader = ({
    floating = false,
    className,
    containerClassName,
    children,
    ...props
}: ComponentProps<'header'> & {
    /** Whether the header should float over content. */
    floating?: boolean
    /** Additional class names for the container div. */
    containerClassName?: typeof className
}) => {
    return (
        <header className={cn('sticky inset-x-0 top-0 z-50', className)} {...props}>
            <div
                className={cn(
                    'flex flex-row justify-between p-4.5',
                    floating
                        ? 'absolute inset-x-0 top-0' // Floating
                        : 'bg-linear-to-b from-white to-white/0', // Background
                    containerClassName
                )}
            >
                {children}
            </div>
        </header>
    )
}

export { PageHeader }
