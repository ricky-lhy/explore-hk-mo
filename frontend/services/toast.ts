import { toast as sonnerToast } from 'sonner'

type ToastId = string | number
type ToastType = 'success' | 'error' | 'warning' | 'info' | 'default'

/**
 * Shows a toast notification.
 * Automatically dismisses any existing toasts before showing the new one.
 *
 * @param options - Toast configuration options
 * @returns The toast identifier
 */
export const showToast = ({
    id,
    type,
    message: { title, description }
}: {
    /** Optional custom identifier for the toast */
    id?: ToastId
    /** Type of the toast */
    type: ToastType
    /** Text content of the toast */
    message: {
        /** Title of the message */
        title: string
        /** Optional description of the message */
        description?: string
    }
}): ToastId => {
    // Dismiss existing toasts
    sonnerToast.dismiss()

    // Build toast parameters
    const params = [title, { id, description, closeButton: true }] as const

    // Show toast based on type
    switch (type) {
        case 'success':
            return sonnerToast.success(...params)
        case 'error':
            return sonnerToast.error(...params)
        case 'warning':
            return sonnerToast.warning(...params)
        case 'info':
            return sonnerToast.info(...params)
        case 'default':
        default:
            return sonnerToast(...params)
    }
}

/**
 * Manually dismisses a specific toast by ID.
 *
 * @param id - The toast identifier
 */
export const dismissToast = (id?: ToastId): void => {
    sonnerToast.dismiss(id)
}
