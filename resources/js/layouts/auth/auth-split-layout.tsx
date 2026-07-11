import { Link } from '@inertiajs/react';
import { PillBottle, Moon, Sun } from 'lucide-react';
import { useSyncExternalStore } from 'react';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';
import { useAppearance } from '@/hooks/use-appearance';

export default function AuthSplitLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    const { resolvedAppearance, updateAppearance } = useAppearance();
    const emptySubscribe = () => () => {};
    const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);

    function toggleDarkMode() {
        updateAppearance(resolvedAppearance === 'dark' ? 'light' : 'dark');
    }

    return (
        <div className="relative grid h-dvh flex-col items-center justify-center bg-background px-8 sm:px-0 lg:max-w-none lg:grid-cols-2 lg:px-0">
            {/* Dark mode toggle */}
            <button
                type="button"
                onClick={toggleDarkMode}
                className="absolute top-5 right-5 z-50 cursor-pointer rounded-lg p-2 text-foreground/50 transition-colors duration-150 hover:text-foreground/80"
                aria-label="Toggle dark mode"
            >
                {mounted ? (
                    resolvedAppearance === 'dark' ? (
                        <Sun size={20} />
                    ) : (
                        <Moon size={20} />
                    )
                ) : (
                    <span className="block size-5" />
                )}
            </button>

            {/* Left Panel (Desktop only) */}
            <div className="relative hidden h-full flex-col text-white lg:flex">
                <img
                    src="/images/pharmacy-login-bg.jpg"
                    alt="Pharmacy"
                    className="absolute inset-0 h-full w-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />
                <div className="relative z-20 flex flex-1 flex-col justify-between p-10">
                    {/* Brand Logo header */}
                    <Link
                        href={home()}
                        className="flex items-center gap-2.5 text-lg font-bold tracking-tight text-white"
                    >
                        <div className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-white">
                            <PillBottle size={18} className="text-primary" />
                        </div>
                        <span className="text-xl">Daaweyn</span>
                    </Link>

                    {/* Tagline footer */}
                    <div className="mt-auto mb-2">
                        <p className="text-white font-bold text-3xl leading-tight max-w-xs">
                            Smart pharmacy management, simplified.
                        </p>
                        <p className="text-white/70 text-sm mt-3 max-w-xs leading-relaxed">
                            Trusted by pharmacies nationwide.
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Panel (Form) */}
            <div className="flex w-full items-center justify-center lg:p-8 relative">
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                    {/* Mobile Logo */}
                    <Link
                        href={home()}
                        className="relative z-20 mb-4 flex items-center justify-center gap-2.5 lg:hidden"
                    >
                        <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-primary text-white">
                            <PillBottle size={22} />
                        </div>
                        <span className="text-2xl font-bold text-primary">
                            Daaweyn
                        </span>
                    </Link>

                    {/* Header title / subtitle */}
                    <div className="flex flex-col items-start gap-2 text-left sm:items-center sm:text-center">
                        <h1 className="text-xl font-bold text-foreground">
                            {title}
                        </h1>
                        <p className="text-sm text-balance text-muted-foreground">
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
