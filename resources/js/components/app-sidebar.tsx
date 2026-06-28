import { Link, usePage } from '@inertiajs/react';
import {
    PillBottle,
    LayoutDashboard,
    Shapes,
    Pill,
    Receipt,
    Users,
    UserCog,
    Settings,
} from 'lucide-react';

const navItems = [
    {
        section: 'Menu',
        links: [
            { label: 'Dashboard', icon: LayoutDashboard, path: 'dashboard' },
            { label: 'Categories', icon: Shapes, path: 'categories' },
            { label: 'Products', icon: Pill, path: 'products' },
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

const preferenceItems = [
    { label: 'Settings', icon: Settings, path: 'settings' },
];

export default function Appsidebar() {
    const { url, props } = usePage();
    const { currentTeam } = props;

    const getHref = (path: string, isScoped = true) => {
        if (!isScoped) {
            return `/${path}`;
        }

        return currentTeam?.slug ? `/${currentTeam.slug}/${path}` : '#';
    };

    const isActive = (href: string) => {
        if (href === '#') {
            return false;
        }

        return url.startsWith(href);
    };

    return (
        <aside className="flex min-h-screen w-64 flex-col border-r border-border-soft bg-surface">
            {/* Logo */}
            <div className="flex items-center gap-3 border-b border-border-soft px-5 py-6">
                <div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-brand">
                    <PillBottle size={20} stroke="#fff" strokeWidth={1.8} />
                </div>
                <span className="text-lg font-bold tracking-tight text-brand">
                    Daaweyn
                </span>
            </div>

            {/* Nav */}
            <div className="flex flex-1 flex-col gap-6 px-3 py-4">
                {navItems.map(({ section, links }) => (
                    <div key={section}>
                        <p className="mb-1.5 px-2 text-[11px] font-bold tracking-[0.09em] text-brand uppercase">
                            {section}
                        </p>
                        {links.map(({ label, icon: Icon, path }) => {
                            const href = getHref(path, true);

                            return (
                                <Link
                                    key={label}
                                    href={href}
                                    className={`flex items-center gap-2.5 rounded-[10px] px-3 py-2.5 text-sm font-semibold transition-colors ${
                                        isActive(href)
                                            ? 'bg-brand text-text-on-primary'
                                            : 'text-text-secondary hover:bg-primary-50 hover:text-brand'
                                    }`}
                                >
                                    <Icon size={18} strokeWidth={1.8} />
                                    {label}
                                </Link>
                            );
                        })}
                    </div>
                ))}
            </div>

            {/* Preferences */}
            <div className="border-t border-border-soft px-3 pt-3 pb-4">
                <p className="mb-1.5 px-2 text-[11px] font-bold tracking-[0.09em] text-brand uppercase">
                    Preferences
                </p>
                {preferenceItems.map(({ label, icon: Icon, path }) => {
                    const href = getHref(path, false);

                    return (
                        <Link
                            key={label}
                            href={href}
                            className={`flex items-center gap-2.5 rounded-[10px] px-3 py-2.5 text-sm font-semibold transition-colors ${
                                isActive(href)
                                    ? 'bg-brand text-text-on-primary'
                                    : 'text-text-secondary hover:bg-primary-50 hover:text-brand'
                            }`}
                        >
                            <Icon size={18} strokeWidth={1.8} />
                            {label}
                        </Link>
                    );
                })}
            </div>
        </aside>
    );
}
