import { Link, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import {
    PillBottle,
    LayoutDashboard,
    Shapes,
    Pill,
    Receipt,
    ShoppingCart,
    Users,
    UserCog,
    Settings,
    PanelLeftClose,
    PanelLeftOpen,
} from 'lucide-react';

type NavItem = {
    label: string;
    icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
    path: string;
};

const navItems: { section: string; links: NavItem[] }[] = [
    {
        section: 'Menu',
        links: [
            { label: 'Dashboard', icon: LayoutDashboard, path: 'dashboard' },
            { label: 'Categories', icon: Shapes, path: 'categories' },
            { label: 'Products', icon: Pill, path: 'products' },
            { label: 'POS', icon: ShoppingCart, path: 'pos' },
            { label: 'Transactions', icon: Receipt, path: 'transactions' },
        ],
    },
    {
        section: 'Others',
        links: [
            { label: 'Customers', icon: Users, path: 'customers' },
            { label: 'Users', icon: UserCog, path: 'users' },
        ],
    },
];

const preferenceItems: NavItem[] = [
    { label: 'Settings', icon: Settings, path: 'settings' },
];

const STORAGE_KEY = 'sidebar:collapsed';

type AppsidebarProps = {
    /**
     * Whether this instance can be collapsed to an icon rail.
     * Set to false for instances rendered inside a temporary overlay
     * (e.g. the mobile Sheet drawer), where collapsing doesn't make sense
     * since the drawer already has its own open/close affordance.
     */
    collapsible?: boolean;
};

export default function Appsidebar({ collapsible = true }: AppsidebarProps) {
    const { url, props } = usePage();
    const { currentTeam } = props as { currentTeam?: { slug: string } };

    // Read persisted state synchronously so there's no flash of the wrong width on load.
    const [collapsedState, setCollapsed] = useState(() => {
        if (typeof window === 'undefined') return false;
        return window.localStorage.getItem(STORAGE_KEY) === '1';
    });

    // Non-collapsible instances (mobile drawer) always render fully expanded,
    // regardless of what desktop has saved to localStorage.
    const collapsed = collapsible && collapsedState;

    useEffect(() => {
        if (!collapsible) return;
        window.localStorage.setItem(STORAGE_KEY, collapsedState ? '1' : '0');
    }, [collapsedState, collapsible]);

    const getHref = (path: string, isScoped = true) => {
        if (!isScoped) {
            return `/${path}`;
        }

        return currentTeam?.slug ? `/${currentTeam.slug}/${path}` : '#';
    };

    const isActive = (href: string) => {
        if (href === '#') return false;
        return url === href || url.startsWith(`${href}/`);
    };

    const renderLink = ({ label, icon: Icon, path }: NavItem, isScoped: boolean) => {
        const href = getHref(path, isScoped);
        const active = isActive(href);

        return (
            <Link
                key={label}
                href={href}
                aria-current={active ? 'page' : undefined}
                title={collapsed ? label : undefined}
                className={`group relative flex items-center gap-2.5 rounded-[10px] px-3 py-2.5 text-sm font-semibold transition-colors ${
                    collapsed ? 'justify-center px-2.5' : ''
                } ${
                    active
                        ? 'bg-brand text-text-on-primary'
                        : 'text-text-secondary hover:bg-primary-50 hover:text-brand'
                }`}
            >
                <Icon size={18} strokeWidth={1.8} />
                {!collapsed && <span>{label}</span>}

                {/* Tooltip shown only when collapsed, on hover */}
                {collapsed && (
                    <span className="pointer-events-none absolute left-full top-1/2 z-50 ml-2 -translate-y-1/2 whitespace-nowrap rounded-md bg-surface px-2 py-1 text-xs font-medium text-text-secondary opacity-0 shadow-md ring-1 ring-border-soft transition-opacity group-hover:opacity-100">
                        {label}
                    </span>
                )}
            </Link>
        );
    };

    return (
        <aside
            className={`sticky top-0 flex h-screen flex-col border-r border-border-soft bg-surface transition-[width] duration-200 ease-in-out ${
                collapsed ? 'w-[72px]' : 'w-64'
            }`}
        >
            <div
                className={`flex h-16 shrink-0 items-center border-b border-border-soft transition-all duration-200 ${
                    collapsed ? 'justify-between px-2.5' : 'justify-between px-5'
                }`}
            >
                <div 
                    onClick={collapsed ? () => setCollapsed(false) : undefined}
                    className={`flex items-center gap-2 ${collapsed ? 'cursor-pointer' : ''}`}
                >
                    <div className={`flex shrink-0 items-center justify-center rounded-[10px] bg-brand transition-all duration-200 ${collapsed ? 'h-7 w-7' : 'h-9 w-9'}`}>
                        <PillBottle size={collapsed ? 14 : 18} stroke="#fff" strokeWidth={1} />
                    </div>
                    {!collapsed && (
                        <span className="text-lg font-bold tracking-tight text-brand">
                            Daaweyn
                        </span>
                    )}
                </div>

                {collapsible && (
                    <button
                        type="button"
                        onClick={() => setCollapsed((prev) => !prev)}
                        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                        className={`flex shrink-0 p-0 items-center justify-center rounded-md text-text-secondary hover:bg-primary-50 hover:text-brand transition-colors ${
                            collapsed ? 'size-7' : 'size-8'
                        }`}
                    >
                        {collapsed ? (
                            <PanelLeftOpen size={14} strokeWidth={1.8} />
                        ) : (
                            <PanelLeftClose size={18} strokeWidth={1.8} />
                        )}
                    </button>
                )}
            </div>

            {/* Nav */}
            <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-3 py-4">
                {navItems.map(({ section, links }) => (
                    <div key={section}>
                        {!collapsed && (
                            <p className="mb-1.5 px-2 text-[11px] font-medium tracking-[0.05em] text-text-muted uppercase">
                                {section}
                            </p>
                        )}
                        <div className="flex flex-col gap-1">
                            {links.map((item) => renderLink(item, true))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Preferences */}
            <div className="border-t border-border-soft px-3 pt-3 pb-4">
                {!collapsed && (
                    <p className="mb-1.5 px-2 text-[11px] font-medium tracking-[0.05em] text-text-muted uppercase">
                        Preferences
                    </p>
                )}
                <div className="flex flex-col gap-1">
                    {preferenceItems.map((item) => renderLink(item, false))}
                </div>
            </div>
        </aside>
    );
}