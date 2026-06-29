import { Form, Head, Link } from '@inertiajs/react';
import { PillBottle } from 'lucide-react';
import InputError from '@/components/input-error';
import PasskeyVerify from '@/components/passkey-verify';
import PasswordInput from '@/components/password-input';
import TeamInvitationAlert from '@/components/team-invitation-alert';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
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
    return (
        <>
            <Head title="Log in" />
            <div className="flex min-h-screen w-full bg-background">

                {/* LEFT PANEL */}
                <div className="hidden lg:block lg:w-1/2 relative">
                    <img
                        src="/images/pharmacy-login-bg.jpg"
                        alt="Pharmacy"
                        className="absolute inset-0 h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40" />
                    <div className="absolute bottom-10 left-10 right-10">
                        <p className="text-white font-bold text-3xl">
                            Smart pharmacy management, simplified.
                        </p>
                    </div>
                </div>

                {/* RIGHT PANEL */}
                <div className="relative flex flex-1 flex-col items-center justify-center bg-background px-8 py-12 lg:px-16 min-h-screen lg:min-h-0">
                    <div className="w-full max-w-sm">

                        {/* Logo */}
                        <Link href={home()} className="flex items-center justify-center gap-3 mb-12">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand">
                                <PillBottle size={22} className="text-white" />
                            </div>
                            <span className="text-2xl font-bold text-foreground">Daaweyn Pharmacy</span>
                        </Link>

                        {/* Form goes here */}

                        {teamInvitation && (
                            <TeamInvitationAlert
                                invitation={teamInvitation}
                                action="Log in"
                            />
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
                                        className="w-full bg-brand font-bold text-white hover:bg-brand-dark transition-all duration-200 hover:-translate-y-0.5"
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
                </div>

            </div>
        </>
    );
}