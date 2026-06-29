import { Form, Head, Link } from '@inertiajs/react';
import {
    CheckCircle2,
    Eye,
    EyeOff,
    Lock,
    Mail,
    Moon,
    PillBottle,
    Sun,
} from 'lucide-react';
import { useState, useSyncExternalStore } from 'react';
import InputError from '@/components/input-error';
import TeamInvitationAlert from '@/components/team-invitation-alert';
import { Spinner } from '@/components/ui/spinner';
import { useAppearance } from '@/hooks/use-appearance';
import { home } from '@/routes';
import { store } from '@/routes/login';
import { request } from '@/routes/password';
import { home } from '@/routes';
import type { TeamInvitationContext } from '@/types';

type Props = {
    status?: string;
    canResetPassword: boolean;
    teamInvitation?: TeamInvitationContext | null;
};

export default function Login({
    status,
    canResetPassword,
    teamInvitation,
}: Props) {
    const [showPassword, setShowPassword] = useState(false);
    const { resolvedAppearance, updateAppearance } = useAppearance();

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
        <>
            <Head title="Log in" />
            <div className="flex min-h-screen w-full bg-background">

            <div className="flex h-dvh w-full">
                {/* ───────────── LEFT PANEL ───────────── */}
                <div className="relative hidden w-1/2 lg:block">
                    {/* Background image */}
                    <img
                        src="/images/pharmacy-login-bg.jpg"
                        alt="Daaweyn Pharmacy interior"
                        className="absolute inset-0 h-full w-full object-cover"
                    />

                    {/* Dark overlay */}
                    <div className="absolute inset-0 bg-black/40" />

                    {/* Floating content over overlay */}
                    <div className="relative z-10 flex h-full flex-col justify-between p-10">
                        {/* Top-left brand card */}
                        <div className="inline-flex w-fit items-center gap-3 rounded-xl bg-white/10 px-5 py-3 backdrop-blur-md">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-500">
                                <PillBottle size={18} className="text-white" />
                            </div>
                            <span className="text-lg font-bold tracking-tight text-white">
                                Daaweyn
                            </span>
                        </div>

                        {/* Bottom-left stacked content */}
                        <div className="max-w-md space-y-5">
                            {/* Green pill badge */}
                            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 px-4 py-1.5 text-sm font-semibold text-emerald-300 backdrop-blur-sm">
                                <CheckCircle2 size={16} />
                                Trusted by pharmacies nationwide
                            </span>

                            {/* Headline */}
                            <h2 className="text-3xl leading-tight font-bold tracking-tight text-white xl:text-4xl">
                                Smart pharmacy management, simplified.
                            </h2>

                            {/* Subtitle */}
                            <p className="text-base leading-relaxed text-white/70">
                                Streamline your inventory, prescriptions, and
                                sales all from one intelligent dashboard
                                designed for modern pharmacies.
                            </p>
                        </div>
                    </div>
                </div>

                {/* ───────────── RIGHT PANEL ───────────── */}
                <div className="relative flex w-full flex-col items-center justify-center bg-background px-6 sm:px-12 lg:w-1/2">
                    {/* Dark mode toggle */}
                    <button
                        type="button"
                        onClick={toggleDarkMode}
                        className="absolute top-5 right-5 cursor-pointer rounded-lg p-2 text-muted-foreground transition-colors hover:text-foreground"
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
                    <div className="w-full max-w-md">
                        {/* Team invitation alert */}
                        {teamInvitation && (
                            <div className="mb-6">
                                <TeamInvitationAlert
                                    invitation={teamInvitation}
                                    action="Log in"
                                />
                            </div>
                        )}

                        {/* Logo row */}
                        <Link
                            href={home()}
                            className="mb-2 inline-flex items-center gap-3 w-full justify-center"
                        >
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand">
                                <PillBottle
                                    size={22}
                                    className="text-white"
                                />
                            </div>
                            <span className="text-4xl font-bold text-foreground">
                                Daaweyn Pharmacy
                            </span>
                        </Link>

                        {/* Welcome subtitle */}
                        <p className="mb-8 text-sm text-muted-foreground text-center">
                            Welcome back
                        </p>

                        {/* Status message */}
                        {status && (
                            <div className="mb-4 rounded-lg bg-emerald-500/10 px-4 py-3 text-center text-sm font-medium text-emerald-400">
                                {status}
                            </div>
                        )}

                        {/* ─── Form ─── */}
                        <Form
                            {...store.form()}
                            resetOnSuccess={['password']}
                            className="flex flex-col gap-5"
                        >
                            {({ processing, errors }) => (
                                <>
                                    {/* Email field */}
                                    <div className="space-y-2">
                                        <label
                                            htmlFor="email"
                                            className="block text-sm font-medium text-muted-foreground"
                                        >
                                            Email address
                                        </label>
                                        <div className="relative">
                                            <Mail
                                                size={18}
                                                className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-muted-foreground"
                                            />
                                            <input
                                                id="email"
                                                type="email"
                                                name="email"
                                                required
                                                autoFocus
                                                tabIndex={1}
                                                autoComplete="email"
                                                placeholder="email@example.com"
                                                className="h-11 w-full rounded-lg border border-border bg-input pl-11 pr-4 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-colors focus:border-ring focus:ring-1 focus:ring-ring/30"
                                            />
                                        </div>
                                        <InputError message={errors.email} />
                                    </div>

                                    {/* Password field */}
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <label
                                                htmlFor="password"
                                                className="block text-sm font-medium text-muted-foreground"
                                            >
                                                Password
                                            </label>
                                            {canResetPassword && (
                                                <Link
                                                    href={request()}
                                                    className="text-sm font-medium text-blue-400 transition-colors hover:text-blue-300"
                                                    tabIndex={5}
                                                >
                                                    Forgot Password?
                                                </Link>
                                            )}
                                        </div>
                                        <div className="relative">
                                            <Lock
                                                size={18}
                                                className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-muted-foreground"
                                            />
                                            <input
                                                id="password"
                                                type={
                                                    showPassword
                                                        ? 'text'
                                                        : 'password'
                                                }
                                                name="password"
                                                required
                                                tabIndex={2}
                                                autoComplete="current-password"
                                                placeholder="Password"
                                                className="h-11 w-full rounded-lg border border-border bg-input pl-11 pr-11 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-colors focus:border-ring focus:ring-1 focus:ring-ring/30"
                                            />
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setShowPassword(
                                                        (prev) => !prev,
                                                    )
                                                }
                                                className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                                                aria-label={
                                                    showPassword
                                                        ? 'Hide password'
                                                        : 'Show password'
                                                }
                                                tabIndex={-1}
                                            >
                                                {showPassword ? (
                                                    <EyeOff size={18} />
                                                ) : (
                                                    <Eye size={18} />
                                                )}
                                            </button>
                                        </div>
                                        <InputError
                                            message={errors.password}
                                        />
                                    </div>

                                    {/* Remember me */}
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="checkbox"
                                            id="remember"
                                            name="remember"
                                            tabIndex={3}
                                            className="h-4 w-4 rounded border-border bg-input text-primary focus:ring-ring/30 focus:ring-offset-0"
                                        />
                                        <label
                                            htmlFor="remember"
                                            className="text-sm text-muted-foreground"
                                        >
                                            Remember me
                                        </label>
                                    </div>

                                    {/* Sign In button */}
                                    <button
                                        type="submit"
                                        className="mt-2 flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary text-sm font-bold text-primary-foreground transition-all hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none disabled:opacity-50"
                                        tabIndex={4}
                                        disabled={processing}
                                        data-test="login-button"
                                    >
                                        {processing ? (
                                            <Spinner />
                                        ) : (
                                            <>
                                                Sign In
                                            </>
                                        )}
                                    </button>
                                </>
                            )}
                        </Form>

                        {/* Divider */}
                        <div className="my-8 border-t border-border" />

                        {/* Footer links */}
                        <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
                            <a
                                href="#"
                                className="transition-colors hover:text-foreground"
                            >
                                Privacy Policy
                            </a>
                            <span>·</span>
                            <a
                                href="#"
                                className="transition-colors hover:text-foreground"
                            >
                                Terms of Service
                            </a>
                            <span>·</span>
                            <a
                                href="#"
                                className="transition-colors hover:text-foreground"
                            >
                                Support
                            </a>
                        </div>
                    </div>
                </div>
            </div>
