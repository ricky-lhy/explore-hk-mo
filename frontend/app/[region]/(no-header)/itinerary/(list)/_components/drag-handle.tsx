import type { ComponentProps } from 'react'

import { faGripLines } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { cn } from '@/lib/utils'

const DragHandle = ({ className, ...props }: ComponentProps<'button'>) => (
    <button
        className={cn(
            '-mr-2 px-2',
            'text-neutral-200 hover:text-neutral-300', // Icon colors
            'cursor-grab touch-none active:cursor-grabbing', // Cursor styles & actions
            className
        )}
        {...props}
    >
        <FontAwesomeIcon icon={faGripLines} size="lg" />
    </button>
)

export { DragHandle }
