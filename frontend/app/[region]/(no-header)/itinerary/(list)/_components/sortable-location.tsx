import type { ComponentProps } from 'react'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

import { DragHandle } from './drag-handle'
import { ItineraryLocation } from './location'

const SortableItineraryLocation = ({
    identifier,
    ...props
}: ComponentProps<typeof ItineraryLocation>) => {
    const {
        attributes,
        listeners,
        setNodeRef: sortableRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: identifier })

    return (
        <div
            ref={sortableRef}
            className="flex"
            style={{
                transform: CSS.Transform.toString(transform),
                transition,
                opacity: isDragging ? 0 : 1
            }}
        >
            <ItineraryLocation identifier={identifier} className="flex-1" {...props} />
            <DragHandle {...attributes} {...listeners} />
        </div>
    )
}

export { SortableItineraryLocation }
