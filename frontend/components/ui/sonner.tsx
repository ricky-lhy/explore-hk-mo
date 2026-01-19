'use client'

import { useTheme } from 'next-themes'

import {
    faCircleCheck,
    faCircleExclamation,
    faCircleInfo,
    faTriangleExclamation
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Toaster as Sonner, type ToasterProps } from 'sonner'

const Toaster = ({ ...props }: ToasterProps) => {
    const { theme = 'system' } = useTheme()
    return (
        <Sonner
            theme={theme as ToasterProps['theme']}
            className="toaster"
            position="bottom-center"
            visibleToasts={1}
            mobileOffset={{ bottom: 20 }}
            toastOptions={{ unstyled: true, duration: 4000 }}
            icons={{
                success: <FontAwesomeIcon icon={faCircleCheck} />,
                info: <FontAwesomeIcon icon={faCircleInfo} />,
                warning: <FontAwesomeIcon icon={faTriangleExclamation} />,
                error: <FontAwesomeIcon icon={faCircleExclamation} />
            }}
            {...props}
        />
    )
}

export { Toaster }
