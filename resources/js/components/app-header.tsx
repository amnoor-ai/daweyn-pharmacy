import { Link, router, usePage } from '@inertiajs/react';
import { Loader2, Moon, Search, Sun, PanelLeftClose, PanelLeftOpen, LayoutDashboard, Calculator, Package, Tags, ReceiptText, Users, BarChart3, Settings, UserCog } from 'lucide-react';
import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { Breadcrumbs } from '@/components/breadcrumbs';
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
    const [searchResults, setSearchResults] = useState<{ pages: any[], products: any[], customers: any[], transactions: any[] } | null>(null);
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

                if (!teamSlug) {
return;
}
                
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
            <div className="border-b border-border bg-white dark:bg-card">
                <div className="flex h-16 items-center gap-4 px-4 lg:px-6">
                    {/* Sidebar toggle */}
                    {setCollapsed && (
                        <button
                            type="button"
                            onClick={() => setCollapsed(!collapsed)}
                            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                            className="flex shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors size-8"
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
                            <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" strokeWidth={2} />
                            {isSearching && (
                                <Loader2 className="absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground animate-spin" strokeWidth={2} />
                            )}
                            <Input
                                value={searchQuery}
                                onChange={(e) => handleSearchChange(e.target.value)}
                                onFocus={() => searchQuery.trim() && setIsDropdownOpen(true)}
                                placeholder="Search anything..."
                                className="h-10 w-[320px] rounded-full border border-border bg-muted/30 pl-10 pr-10 text-sm text-foreground placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-primary/30 dark:bg-card"
                            />
                            
                            {/* Search Dropdown */}
                            {isDropdownOpen && searchResults && (
                                <div className="absolute top-[120%] mt-2 w-[400px] right-0 rounded-xl border border-border bg-white p-2 shadow-lg dark:bg-card z-50 max-h-[400px] overflow-y-auto">
                                    {searchResults.pages?.length === 0 && searchResults.products.length === 0 && searchResults.customers.length === 0 && searchResults.transactions.length === 0 && !isSearching ? (
                                        <div className="p-4 text-center text-sm text-muted-foreground">No results found for &quot;{searchQuery}&quot;</div>
                                    ) : (
                                        <div className="space-y-4">
                                            {searchResults.pages?.length > 0 && (
                                                <div>
                                                    <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Pages</div>
                                                    {searchResults.pages.map(p => {
                                                        const IconMap: any = {
                                                            LayoutDashboard, Calculator, Package, Tags, ReceiptText, Users, BarChart3, Settings, UserCog
                                                        };
                                                        const Icon = IconMap[p.icon] || LayoutDashboard;

                                                        return (
                                                            <Link 
                                                                key={p.name} 
                                                                href={p.url}
                                                                onClick={() => setIsDropdownOpen(false)}
                                                                className="flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-primary/10 transition-colors"
                                                            >
                                                                <div className="size-8 rounded-md bg-primary-100 flex items-center justify-center text-primary">
                                                                    <Icon className="size-4" />
                                                                </div>
                                                                <div className="flex-1 overflow-hidden">
                                                                    <div className="text-sm font-medium text-foreground truncate">{p.name}</div>
                                                                </div>
                                                            </Link>
                                                        );
                                                    })}
                                                </div>
                                            )}

                                            {searchResults.products.length > 0 && (
                                                <div>
                                                    <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Products</div>
                                                    {searchResults.products.map(p => (
                                                        <Link 
                                                            key={p.id} 
                                                            href={`/${currentTeam?.slug}/products?q=${p.sku}`}
                                                            onClick={() => setIsDropdownOpen(false)}
                                                            className="flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-primary/10 transition-colors"
                                                        >
                                                            {p.image_url ? (
                                                                <img src={p.image_url} alt={p.name} className="size-8 rounded-md object-cover" />
                                                            ) : (
                                                                <div className="size-8 rounded-md bg-primary-100 flex items-center justify-center text-primary-700 text-xs font-bold">{p.name.charAt(0)}</div>
                                                            )}
                                                            <div className="flex-1 overflow-hidden">
                                                                <div className="text-sm font-medium text-foreground truncate">{p.name}</div>
                                                                <div className="text-xs text-muted-foreground truncate">SKU: {p.sku}</div>
                                                            </div>
                                                            <div className="text-sm font-medium">${p.selling_price}</div>
                                                        </Link>
                                                    ))}
                                                </div>
                                            )}

                                            {searchResults.customers.length > 0 && (
                                                <div>
                                                    <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Customers</div>
                                                    {searchResults.customers.map(c => (
                                                        <Link 
                                                            key={c.id} 
                                                            href={`/${currentTeam?.slug}/customers/${c.id}`}
                                                            onClick={() => setIsDropdownOpen(false)}
                                                            className="flex items-center justify-between rounded-lg px-2 py-2 hover:bg-primary/10 transition-colors"
                                                        >
                                                            <div className="overflow-hidden">
                                                                <div className="text-sm font-medium text-foreground truncate">{c.name}</div>
                                                                <div className="text-xs text-muted-foreground truncate">{c.phone}</div>
                                                            </div>
                                                        </Link>
                                                    ))}
                                                </div>
                                            )}

                                            {searchResults.transactions.length > 0 && (
                                                <div>
                                                    <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Transactions</div>
                                                    {searchResults.transactions.map(t => (
                                                        <Link 
                                                            key={t.id} 
                                                            href={`/${currentTeam?.slug}/transactions/${t.id}`}
                                                            onClick={() => setIsDropdownOpen(false)}
                                                            className="flex items-center justify-between rounded-lg px-2 py-2 hover:bg-primary/10 transition-colors"
                                                        >
                                                            <div className="overflow-hidden">
                                                                <div className="text-sm font-medium text-foreground truncate">#{t.invoice_number}</div>
                                                                <div className="text-xs text-muted-foreground truncate">{t.customer?.name ?? 'Walk-in'}</div>
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
                                    className="h-10 px-2 rounded-full flex items-center gap-2 hover:bg-primary/10"
                                >
                                    <span className="text-sm font-medium hidden sm:block text-foreground pl-2">
                                        {auth.user.name}
                                    </span>
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
                    </div>
                </div>
            </div>

        </>
    );
}
