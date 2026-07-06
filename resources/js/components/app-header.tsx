import { router, usePage } from '@inertiajs/react';
import { Moon, Search, Sun } from 'lucide-react';
import { useRef, useState, useSyncExternalStore } from 'react';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { TeamSwitcher } from '@/components/team-switcher';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { UserMenuContent } from '@/components/user-menu-content';
import { useAppearance } from '@/hooks/use-appearance';
import { useInitials } from '@/hooks/use-initials';
import type { BreadcrumbItem } from '@/types';

type Props = {
    breadcrumbs?: BreadcrumbItem[];
};

export function AppHeader({ breadcrumbs = [] }: Props) {
    const page = usePage();
    const { auth, currentTeam } = page.props;
    const getInitials = useInitials();
    const { resolvedAppearance, updateAppearance } = useAppearance();

    const emptySubscribe = () => () => {};
    const mounted = useSyncExternalStore(
        emptySubscribe,
        () => true,
        () => false,
    );
    const [searchQuery, setSearchQuery] = useState('');
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    function handleSearchChange(value: string) {
        setSearchQuery(value);

        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        debounceRef.current = setTimeout(() => {
            const url = page.url;
            const teamSlug = currentTeam?.slug ?? '';
            const searchableRoutes = [
                'products',
                'categories',
                'customers',
                'transactions',
                'users',
            ];
            const matched = searchableRoutes.find((r) => url.includes(`/${r}`));

            if (matched && teamSlug) {
                router.get(
                    `/${teamSlug}/${matched}`,
                    value ? { q: value } : {},
                    { preserveState: true, replace: true },
                );
            }
        }, 300);
    }

    function toggleDarkMode() {
        updateAppearance(resolvedAppearance === 'dark' ? 'light' : 'dark');
    }

    // Derive the page title from the last breadcrumb
    const pageTitle = breadcrumbs.length > 0 ? breadcrumbs[breadcrumbs.length - 1].title : '';

    return (
        <>
            <div className="border-b border-border-soft bg-white dark:bg-surface">
                <div className="flex h-16 items-center gap-4 px-4 lg:px-6">
                    {/* Page title — shows current page name */}
                    {pageTitle && (
                        <h1 className="text-base font-semibold text-text-primary shrink-0">
                            {pageTitle}
                        </h1>
                    )}

                    {/* Right section */}
                    <div className="ml-auto flex items-center space-x-2">
                        {/* Inline search */}
                        <div className="relative hidden items-center sm:flex">
                            <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-text-muted" strokeWidth={2} />
                            <Input
                                value={searchQuery}
                                onChange={(e) => handleSearchChange(e.target.value)}
                                placeholder="Search anything"
                                className="h-10 w-[280px] rounded-full border border-border-soft bg-canvas pl-10 text-sm text-text-primary placeholder:text-text-muted focus-visible:ring-1 focus-visible:ring-brand/30 dark:bg-surface"
                            />
                        </div>

                        {/* Dark mode toggle */}
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={toggleDarkMode}
                            className="group h-9 w-9 cursor-pointer"
                            aria-label="Toggle dark mode"
                        >
                            {mounted ? (
                                resolvedAppearance === 'dark' ? (
                                    <Sun className="size-5 opacity-80 group-hover:opacity-100" />
                                ) : (
                                    <Moon className="size-5 opacity-80 group-hover:opacity-100" />
                                )
                            ) : (
                                <span className="size-5" />
                            )}
                        </Button>

                        {/* User avatar */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    className="size-10 rounded-full p-1"
                                >
                                    <div className="relative">
                                        <Avatar className="size-8 overflow-hidden rounded-full">
                                            <AvatarImage
                                                src={auth.user.avatar_url ?? auth.user.avatar}
                                                alt={auth.user.name}
                                            />
                                            <AvatarFallback className="rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                                                {getInitials(auth.user.name)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="absolute bottom-0 right-0 size-2.5 rounded-full border-2 border-white bg-success-fg dark:border-surface"></div>
                                    </div>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end">
                                <UserMenuContent user={auth.user} />
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <TeamSwitcher inHeader />
                    </div>
                </div>
            </div>

            {breadcrumbs.length > 1 && (
                <div className="flex w-full border-b border-sidebar-border/70">
                    <div className="flex h-12 w-full items-center justify-start px-4 lg:px-6 text-neutral-500">
                        <Breadcrumbs breadcrumbs={breadcrumbs} />
                    </div>
                </div>
            )}
        </>
    );
}
