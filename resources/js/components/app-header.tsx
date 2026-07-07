import { Link, router, usePage } from '@inertiajs/react';
import { Loader2, Moon, Search, Sun, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
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
    collapsed?: boolean;
    setCollapsed?: (collapsed: boolean) => void;
};

export function AppHeader({ breadcrumbs = [], collapsed, setCollapsed }: Props) {
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
    const [searchResults, setSearchResults] = useState<{ products: any[], customers: any[], transactions: any[] } | null>(null);
    const [isSearching, setIsSearching] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const searchContainerRef = useRef<HTMLDivElement>(null);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Close dropdown on outside click
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    function handleSearchChange(value: string) {
        setSearchQuery(value);

        if (!value.trim()) {
            setSearchResults(null);
            setIsDropdownOpen(false);
            return;
        }

        setIsSearching(true);
        setIsDropdownOpen(true);

        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        debounceRef.current = setTimeout(async () => {
            try {
                const teamSlug = currentTeam?.slug ?? '';
                if (!teamSlug) return;
                
                const response = await fetch(`/${teamSlug}/search?q=${encodeURIComponent(value)}`);
                if (response.ok) {
                    const data = await response.json();
                    setSearchResults(data);
                }
            } catch (error) {
                console.error('Search error:', error);
            } finally {
                setIsSearching(false);
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
                    {/* Sidebar toggle */}
                    {setCollapsed && (
                        <button
                            type="button"
                            onClick={() => setCollapsed(!collapsed)}
                            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                            className="flex shrink-0 items-center justify-center rounded-md text-text-secondary hover:bg-primary-50 hover:text-brand transition-colors size-8"
                        >
                            {collapsed ? (
                                <PanelLeftOpen size={18} strokeWidth={1.8} />
                            ) : (
                                <PanelLeftClose size={18} strokeWidth={1.8} />
                            )}
                        </button>
                    )}

                    {/* Breadcrumbs inside navbar */}
                    {breadcrumbs.length > 0 && (
                        <div className="hidden md:flex items-center text-sm">
                            <Breadcrumbs breadcrumbs={breadcrumbs} />
                        </div>
                    )}

                    {/* Right section */}
                    <div className="ml-auto flex items-center space-x-2">
                        {/* Inline search */}
                        <div className="relative hidden items-center sm:flex" ref={searchContainerRef}>
                            <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-text-muted" strokeWidth={2} />
                            {isSearching && (
                                <Loader2 className="absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-text-muted animate-spin" strokeWidth={2} />
                            )}
                            <Input
                                value={searchQuery}
                                onChange={(e) => handleSearchChange(e.target.value)}
                                onFocus={() => searchQuery.trim() && setIsDropdownOpen(true)}
                                placeholder="Search anything..."
                                className="h-10 w-[320px] rounded-full border border-border-soft bg-canvas pl-10 pr-10 text-sm text-text-primary placeholder:text-text-muted focus-visible:ring-1 focus-visible:ring-brand/30 dark:bg-surface"
                            />
                            
                            {/* Search Dropdown */}
                            {isDropdownOpen && searchResults && (
                                <div className="absolute top-[120%] mt-2 w-[400px] right-0 rounded-xl border border-border-soft bg-white p-2 shadow-lg dark:bg-surface z-50 max-h-[400px] overflow-y-auto">
                                    {searchResults.products.length === 0 && searchResults.customers.length === 0 && searchResults.transactions.length === 0 && !isSearching ? (
                                        <div className="p-4 text-center text-sm text-text-muted">No results found for &quot;{searchQuery}&quot;</div>
                                    ) : (
                                        <div className="space-y-4">
                                            {searchResults.products.length > 0 && (
                                                <div>
                                                    <div className="px-2 py-1.5 text-xs font-semibold text-text-secondary uppercase tracking-wider">Products</div>
                                                    {searchResults.products.map(p => (
                                                        <Link 
                                                            key={p.id} 
                                                            href={`/${currentTeam?.slug}/products?q=${p.sku}`}
                                                            onClick={() => setIsDropdownOpen(false)}
                                                            className="flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-primary-50 transition-colors"
                                                        >
                                                            {p.image_url ? (
                                                                <img src={p.image_url} alt={p.name} className="size-8 rounded-md object-cover" />
                                                            ) : (
                                                                <div className="size-8 rounded-md bg-primary-100 flex items-center justify-center text-primary-700 text-xs font-bold">{p.name.charAt(0)}</div>
                                                            )}
                                                            <div className="flex-1 overflow-hidden">
                                                                <div className="text-sm font-medium text-text-primary truncate">{p.name}</div>
                                                                <div className="text-xs text-text-muted truncate">SKU: {p.sku}</div>
                                                            </div>
                                                            <div className="text-sm font-medium">${p.selling_price}</div>
                                                        </Link>
                                                    ))}
                                                </div>
                                            )}

                                            {searchResults.customers.length > 0 && (
                                                <div>
                                                    <div className="px-2 py-1.5 text-xs font-semibold text-text-secondary uppercase tracking-wider">Customers</div>
                                                    {searchResults.customers.map(c => (
                                                        <Link 
                                                            key={c.id} 
                                                            href={`/${currentTeam?.slug}/customers/${c.id}`}
                                                            onClick={() => setIsDropdownOpen(false)}
                                                            className="flex items-center justify-between rounded-lg px-2 py-2 hover:bg-primary-50 transition-colors"
                                                        >
                                                            <div className="overflow-hidden">
                                                                <div className="text-sm font-medium text-text-primary truncate">{c.name}</div>
                                                                <div className="text-xs text-text-muted truncate">{c.phone}</div>
                                                            </div>
                                                        </Link>
                                                    ))}
                                                </div>
                                            )}

                                            {searchResults.transactions.length > 0 && (
                                                <div>
                                                    <div className="px-2 py-1.5 text-xs font-semibold text-text-secondary uppercase tracking-wider">Transactions</div>
                                                    {searchResults.transactions.map(t => (
                                                        <Link 
                                                            key={t.id} 
                                                            href={`/${currentTeam?.slug}/transactions/${t.id}`}
                                                            onClick={() => setIsDropdownOpen(false)}
                                                            className="flex items-center justify-between rounded-lg px-2 py-2 hover:bg-primary-50 transition-colors"
                                                        >
                                                            <div className="overflow-hidden">
                                                                <div className="text-sm font-medium text-text-primary truncate">#{t.invoice_number}</div>
                                                                <div className="text-xs text-text-muted truncate">{t.customer?.name ?? 'Walk-in'}</div>
                                                            </div>
                                                            <div className="text-sm font-medium">${t.total}</div>
                                                        </Link>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
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

        </>
    );
}
