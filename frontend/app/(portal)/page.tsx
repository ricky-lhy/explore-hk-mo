// AI-generated placeholder page.
import Link from 'next/link'

export default function PortalPage() {
    return (
        <main className="flex min-h-dvh w-full grow flex-col items-center justify-center p-6">
            <h1 className="mb-2 text-center text-3xl font-bold tracking-tight text-gray-900">
                Explore Hong Kong | Macau
            </h1>
            <p className="mb-8 text-center text-lg text-gray-600">
                Start your journey by selecting a region
            </p>

            <div className="flex w-full flex-col gap-4">
                <Link
                    href="/hk"
                    className="group relative flex w-full flex-row items-center gap-6 overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:bg-red-50/50 hover:shadow-md active:scale-[0.98]"
                >
                    <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-red-50 text-5xl">
                        🇭🇰
                    </div>
                    <div className="flex flex-col">
                        <h2 className="text-xl font-bold text-gray-900">Hong Kong</h2>
                        <p className="text-sm font-medium text-gray-500">Pearl of the Orient</p>
                    </div>
                    <div className="absolute inset-y-0 right-0 w-1.5 bg-red-500 opacity-80" />
                </Link>

                <Link
                    href="/mo"
                    className="group relative flex w-full flex-row items-center gap-6 overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:bg-emerald-50/50 hover:shadow-md active:scale-[0.98]"
                >
                    <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-5xl">
                        🇲🇴
                    </div>
                    <div className="flex flex-col">
                        <h2 className="text-xl font-bold text-gray-900">Macau</h2>
                        <p className="text-sm font-medium text-gray-500">Las Vegas of Asia</p>
                    </div>
                    <div className="absolute inset-y-0 right-0 w-1.5 bg-emerald-500 opacity-80" />
                </Link>
            </div>
        </main>
    )
}
