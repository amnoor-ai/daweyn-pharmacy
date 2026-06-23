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
    CircleHelp,
    Moon,
} from 'lucide-react';
import { useState } from 'react';

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
    { label: 'Help', icon: CircleHelp, path: 'help' },
];

export default function Appsidebar() {
    const { url, props } = usePage();
    const { currentTeam } = props;
    const [darkMode, setDarkMode] = useState(false);

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
        <aside className="flex flex-col w-64 min-h-screen bg-white border-r border-[#ECEEF5]">

            {/* Logo */}
            <div className="flex items-center gap-3 px-5 py-6 border-b border-[#ECEEF5]">
                <div className="flex items-center justify-center w-9 h-9 bg-[#1B2559] rounded-[10px]">
                    <PillBottle size={20} stroke="#fff" strokeWidth={1.8} />
                </div>
                <span className="text-lg font-bold text-[#1B2559] tracking-tight">Daaweyn</span>
            </div>

            {/* Nav */}
            <div className="flex flex-col flex-1 gap-6 px-3 py-4">
                {navItems.map(({ section, links }) => (
                    <div key={section}>
                        <p className="px-2 mb-1.5 text-[11px] font-bold uppercase tracking-[0.09em] text-[#1B2559]">
                            {section}
                        </p>
                        {links.map(({ label, icon: Icon, path }) => {
                            const href = getHref(path, true);

                            return (
                                <Link
                                    key={label}
                                    href={href}
                                    className={`flex items-center gap-2.5 px-3 py-2.5 rounded-[10px] text-sm font-semibold transition-colors
                                        ${isActive(href)
                                            ? 'bg-[#1B2559] text-white'
                                            : 'text-[#3D4166] hover:bg-[#EEF0FD] hover:text-[#1B2559]'
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
            <div className="px-3 pb-4 border-t border-[#ECEEF5] pt-3">
                <p className="px-2 mb-1.5 text-[11px] font-bold uppercase tracking-[0.09em] text-[#1B2559]">
                    Preferences
                </p>
                {preferenceItems.map(({ label, icon: Icon, path }) => {
                    const href = getHref(path, false);

                    return (
                        <Link
                            key={label}
                            href={href}
                            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-[10px] text-sm font-semibold transition-colors
                                ${isActive(href)
                                    ? 'bg-[#1B2559] text-white'
                                    : 'text-[#3D4166] hover:bg-[#EEF0FD] hover:text-[#1B2559]'
                                }`}
                        >
                            <Icon size={18} strokeWidth={1.8} />
                            {label}
                        </Link>
                    );
                })}

                {/* Dark mode toggle */}
                <button
                    onClick={() => setDarkMode(!darkMode)}
                    className="flex items-center justify-between w-full px-3 py-2.5 rounded-[10px] text-sm font-semibold text-[#3D4166] hover:bg-[#EEF0FD] hover:text-[#1B2559] transition-colors"
                >
                    <span className="flex items-center gap-2.5">
                        <Moon size={18} strokeWidth={1.8} />
                        Dark Mode
                    </span>
                    <div className={`relative w-[34px] h-5 rounded-full transition-colors ${darkMode ? 'bg-[#1B2559]' : 'bg-[#C5C9E0]'}`}>
                        <div className={`absolute top-[3px] left-[3px] w-3.5 h-3.5 bg-white rounded-full transition-transform ${darkMode ? 'translate-x-[14px]' : ''}`} />
                    </div>
                </button>
            </div>
        </aside>
    );
}