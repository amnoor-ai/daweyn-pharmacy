import { Form, Head, Link } from '@inertiajs/react';
import { Moon, PillBottle, Sun } from 'lucide-react';
import { useSyncExternalStore } from 'react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TeamInvitationAlert from '@/components/team-invitation-alert';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { useAppearance } from '@/hooks/use-appearance';
import { home } from '@/routes';
import { store } from '@/routes/login';
import { request } from '@/routes/password';
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
    const { resolvedAppearance, updateAppearance } = useAppearance();
    const emptySubscribe = () => () => {};
    const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);

    function toggleDarkMode() {
        updateAppearance(resolvedAppearance === 'dark' ? 'light' : 'dark');
    }

    return (
        <>
            <Head title="Log in" />
            <div className="flex min-h-screen w-full bg-background">

                {/* LEFT PANEL */}
                <div className="hidden lg:block lg:w-1/2 relative min-h-screen">
                    <img
                        src="/images/pharmacy-login-bg.jpg"
                        alt="Pharmacy"
                        className="absolute inset-0 h-full w-full object-cover object-center"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />
                    <div className="absolute bottom-12 left-10 right-10">
                        <p className="text-white font-bold text-3xl leading-tight max-w-xs">
                            Smart pharmacy management, simplified.
                        </p>
                        <p className="text-white/70 text-sm mt-3 max-w-xs leading-relaxed">
                            Trusted by pharmacies nationwide.
                        </p>
                    </div>
                </div>

                {/* RIGHT PANEL */}
                <div className="relative flex flex-1 flex-col items-center justify-center bg-background px-8 py-12 lg:px-16 min-h-screen">

                    {/* Dark mode toggle */}
                    <button
                        type="button"
                        onClick={toggleDarkMode}
                        className="absolute top-5 right-5 cursor-pointer rounded-lg p-2 text-foreground/50 transition-colors duration-150 hover:text-foreground/80"
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

                    <div className="w-full max-w-sm">

                        {/* Logo */}
                        <Link href={home()} className="flex items-center justify-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
                                <PillBottle size={22} className="text-white" />
                            </div>
                            <span className="text-2xl font-bold text-foreground">
                                Daaweyn Pharmacy
                            </span>
                        </Link>

                        <p className="mt-2 text-center text-sm text-muted-foreground">
                            Welcome back
                        </p>

                        <div className="w-full border-t border-border mt-8 mb-8" />

                        {teamInvitation && (
                            <div className="mb-6">
                                <TeamInvitationAlert
                                    invitation={teamInvitation}
                                    action="Log in"
                                />
                            </div>
                        )}

                        {status && (
                            <div className="mb-4 rounded-lg bg-emerald-500/10 px-4 py-3 text-center text-sm font-medium text-emerald-600">
                                {status}
                            </div>
                        )}

                        <Form
                            {...store.form()}
                            resetOnSuccess={['password']}
                            className="flex flex-col gap-5"
                        >
                            {({ processing, errors }) => (
                                <>
                                    <div className="flex flex-col gap-1.5">
                                        <Label htmlFor="email" className="text-sm font-semibold text-foreground/80">
                                            Email address
                                        </Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            name="email"
                                            required
                                            autoFocus
                                            tabIndex={1}
                                            autoComplete="email"
                                            placeholder="email@example.com"
                                            className="placeholder:text-foreground/35"
                                        />
                                        <InputError message={errors.email} />
                                    </div>

                                    <div className="flex flex-col gap-1.5">
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="password" className="text-sm font-semibold text-foreground/80">
                                                Password
                                            </Label>
                                            {canResetPassword && (
                                                <TextLink
                                                    href={request()}
                                                    className="text-xs text-muted-foreground/70 underline hover:text-foreground"
                                                    tabIndex={5}
                                                >
                                                    Forgot password?
                                                </TextLink>
                                            )}
                                        </div>
                                        <PasswordInput
                                            id="password"
                                            name="password"
                                            required
                                            tabIndex={2}
                                            autoComplete="current-password"
                                            placeholder="Password"
                                            className="placeholder:text-foreground/35"
                                        />
                                        <InputError message={errors.password} />
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <Checkbox id="remember" name="remember" tabIndex={3} />
                                        <Label htmlFor="remember" className="text-sm text-muted-foreground">
                                            Remember me
                                        </Label>
                                    </div>

                                    <Button
                                        type="submit"
                                        className="w-full font-bold text-white"
                                        tabIndex={4}
                                        disabled={processing}
                                        data-test="login-button"
                                    >
                                        {processing ? <Spinner /> : 'Sign In'}
                                    </Button>
                                </>
                            )}
                        </Form>
                    </div>

                    {/* Footer */}
                    <div className="absolute bottom-6 left-0 right-0 text-center text-xs text-muted-foreground/50">
                        <a href="#" className="transition-colors hover:text-muted-foreground">Privacy Policy</a>
                        <span className="mx-2 text-muted-foreground/30">·</span>
                        <a href="#" className="transition-colors hover:text-muted-foreground">Terms of Service</a>
                        <span className="mx-2 text-muted-foreground/30">·</span>
                        <a href="#" className="transition-colors hover:text-muted-foreground">Support</a>
                    </div>

                </div>

            </div>
        </>
    );
}
