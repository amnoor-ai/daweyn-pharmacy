import { Link } from '@inertiajs/react';
import { PillBottle } from 'lucide-react';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

export default function AuthSplitLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    return (
        <div className="relative grid h-dvh flex-col items-center justify-center bg-canvas px-8 sm:px-0 lg:max-w-none lg:grid-cols-2 lg:px-0">
            {/* Left Panel (Desktop only) */}
            <div className="relative hidden h-full flex-col bg-gradient-to-br from-brand to-accent-indigo p-10 text-white lg:flex">
                <div className="relative z-20 flex flex-1 flex-col justify-between">
                    {/* Brand Logo header */}
                    <Link
                        href={home()}
                        className="flex items-center gap-2.5 text-lg font-bold tracking-tight text-white"
                    >
                        <div className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-white">
                            <PillBottle size={18} className="text-brand" />
                        </div>
                        <span className="text-xl">Daaweyn</span>
                    </Link>

                    {/* Tagline footer */}
                    <div className="mt-auto">
                        <p className="text-2xl font-bold tracking-tight text-white">
                            Care begins with clarity.
                        </p>
                        <p className="mt-2 text-sm text-info-bg/80">
                            Pharmacy intelligence, simplified.
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Panel (Form) */}
            <div className="flex w-full items-center justify-center lg:p-8">
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                    {/* Mobile Logo */}
                    <Link
                        href={home()}
                        className="relative z-20 mb-4 flex items-center justify-center gap-2.5 lg:hidden"
                    >
                        <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-brand text-white">
                            <PillBottle size={22} />
                        </div>
                        <span className="text-2xl font-bold text-brand">
                            Daaweyn
                        </span>
                    </Link>

                    {/* Header title / subtitle */}
                    <div className="flex flex-col items-start gap-2 text-left sm:items-center sm:text-center">
                        <h1 className="text-xl font-bold text-text-primary">
                            {title}
                        </h1>
                        <p className="text-sm text-balance text-text-secondary">
                            {description}
                        </p>
                    </div>

                    {/* Form content */}
                    {children}
                </div>
            </div>
        </div>
    );
}
