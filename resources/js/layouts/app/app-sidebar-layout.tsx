import { usePage } from '@inertiajs/react';
import { Menu, Moon, PillBottle, Search, Sun } from 'lucide-react';
import { useState, useSyncExternalStore } from 'react';
import { AppHeader } from '@/components/app-header';
import Appsidebar from '@/components/app-sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import { UserMenuContent } from '@/components/user-menu-content';
import { useAppearance } from '@/hooks/use-appearance';
import { useInitials } from '@/hooks/use-initials';
import type { AppLayoutProps } from '@/types';

export default function AppSidebarLayout({
    children,
    breadcrumbs = [],
}: AppLayoutProps) {
    const { props, url } = usePage();
    const { auth } = props;
    const isPos = url.split('?')[0].endsWith('/pos');
    const getInitials = useInitials();
    const { resolvedAppearance, updateAppearance } = useAppearance();
    const [mobileOpen, setMobileOpen] = useState(false);
    const emptySubscribe = () => () => {};
    const mounted = useSyncExternalStore(
        emptySubscribe,
        () => true,
        () => false,
    );

    function toggleDarkMode() {
        updateAppearance(resolvedAppearance === 'dark' ? 'light' : 'dark');
    }

    return (
        <div className="flex h-screen overflow-hidden bg-canvas">
            {/* Desktop sidebar — hidden on mobile, collapsible */}
            <div className="hidden lg:flex">
                <Appsidebar />
            </div>

            {/* Mobile sidebar — Sheet drawer, always full width/labels */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                <SheetContent
                    side="left"
                    className="w-64 border-r border-border-soft p-0"
                >
                    <SheetTitle className="sr-only">Navigation menu</SheetTitle>
                    <Appsidebar collapsible={false} />
                </SheetContent>
            </Sheet>

            {/* Right side: top bar + main content — scrolls as a unit */}
            <div className="flex min-w-0 flex-1 flex-col overflow-y-auto">
                {/* Mobile top bar — hamburger + logo + actions, hidden on lg+ */}
                <div className="sticky top-0 z-50 flex items-center justify-between border-b border-border-soft bg-white px-4 py-3 lg:hidden dark:bg-background">
                    {/* Left: hamburger + logo */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setMobileOpen(true)}
                            className="flex h-9 w-9 items-center justify-center rounded-[10px] text-brand transition-colors hover:bg-primary-50"
                            aria-label="Open navigation"
                        >
                            <Menu size={20} strokeWidth={1.8} />
                        </button>
                        <div className="flex items-center gap-2.5">
                            <div className="flex h-7 w-7 items-center justify-center rounded-[8px] bg-brand">
                                <PillBottle
                                    size={16}
                                    stroke="#fff"
                                    strokeWidth={1.8}
                                />
                            </div>
                            <span className="text-base font-bold tracking-tight text-brand">
                                Daaweyn
                            </span>
                        </div>
                    </div>

                    {/* Right: search + dark mode + avatar */}
                    <div className="flex items-center gap-1">
                        {/* Search */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-text-secondary"
                            aria-label="Search"
                        >
                            <Search size={18} strokeWidth={1.8} />
                        </Button>

                        {/* Dark mode toggle */}
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={toggleDarkMode}
                            className="h-8 w-8 text-text-secondary"
                            aria-label="Toggle dark mode"
                        >
                            {mounted ? (
                                resolvedAppearance === 'dark' ? (
                                    <Sun size={18} strokeWidth={1.8} />
                                ) : (
                                    <Moon size={18} strokeWidth={1.8} />
                                )
                            ) : (
                                <span className="size-[18px]" />
                            )}
                        </Button>

                        {/* User avatar */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    className="size-8 rounded-full p-0.5"
                                >
                                    <Avatar className="size-7 overflow-hidden rounded-full">
                                        <AvatarImage
                                            src={auth.user.avatar}
                                            alt={auth.user.name}
                                        />
                                        <AvatarFallback className="rounded-full bg-primary-50 text-xs font-semibold text-brand">
                                            {getInitials(auth.user.name)}
                                        </AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end">
                                <UserMenuContent user={auth.user} />
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                {/* Desktop header bar — sticky, hidden on mobile */}
                <div className="sticky top-0 z-50 hidden lg:block">
                    <AppHeader breadcrumbs={breadcrumbs} />
                </div>

                <main className={`flex-1 ${isPos ? 'p-0' : 'p-4 lg:p-6'}`}>{children}</main>
            </div>
        </div>
    );
}