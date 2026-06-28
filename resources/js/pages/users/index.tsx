import { Head, Link, usePage } from '@inertiajs/react';
import { Plus, Users } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useInitials } from '@/hooks/use-initials';
import type { TeamMember } from '@/types';

type Props = {
    members: TeamMember[];
};

export default function UsersIndex({ members }: Props) {
    const { props } = usePage();
    const currentTeam = props.currentTeam as {
        slug: string;
        name: string;
    } | null;
    const teamSlug = currentTeam?.slug ?? '';
    const getInitials = useInitials();

    const roleBadgeStyles: Record<string, string> = {
        owner: 'bg-success-bg text-success-fg border-transparent hover:bg-success-bg/80',
        admin: 'bg-info-bg text-info-fg border-transparent hover:bg-info-bg/80',
        member: 'bg-secondary text-secondary-foreground border-transparent hover:bg-secondary/80',
    };

    return (
        <>
            <Head title="Staff Directory" />
            <div className="flex flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-y-3">
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-text-primary sm:text-2xl">
                            Staff
                        </h1>
                        <p className="mt-1 text-sm text-text-secondary">
                            View and manage your pharmacy staff directory.
                        </p>
                    </div>
                    <Button
                        asChild
                        className="cursor-pointer gap-2 bg-brand hover:bg-brand-dark"
                    >
                        <Link href={`/settings/teams/${teamSlug}`}>
                            <Plus className="h-4 w-4" />
                            Invite Member
                        </Link>
                    </Button>
                </div>

                {/* Table / List */}
                {members.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-xl border border-border-soft bg-surface py-12 text-center">
                        <Users className="mb-3 h-8 w-8 text-text-secondary opacity-60" />
                        <p className="text-sm font-medium text-text-primary">
                            No staff members found
                        </p>
                        <p className="mt-1 text-xs text-text-secondary">
                            Invite team members to collaborate in your pharmacy.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-hidden rounded-xl border border-border-soft bg-surface shadow-[0_2px_10px_rgba(20,28,64,0.05)]">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-border-soft">
                                        <th className="px-6 py-3.5 text-left text-[13px] font-medium text-text-secondary">
                                            Staff Member
                                        </th>
                                        <th className="px-6 py-3.5 text-left text-[13px] font-medium text-text-secondary">
                                            Email Address
                                        </th>
                                        <th className="px-6 py-3.5 text-left text-[13px] font-medium text-text-secondary">
                                            Role
                                        </th>
                                        <th className="px-6 py-3.5 text-left text-[13px] font-medium text-text-secondary">
                                            Joined Date
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {members.map((member, idx) => (
                                        <tr
                                            key={member.id}
                                            className={
                                                idx !== members.length - 1
                                                    ? 'border-b border-border-soft'
                                                    : ''
                                            }
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-9 w-9">
                                                        {member.avatar ? (
                                                            <AvatarImage
                                                                src={
                                                                    member.avatar
                                                                }
                                                                alt={
                                                                    member.name
                                                                }
                                                            />
                                                        ) : null}
                                                        <AvatarFallback className="bg-brand/10 text-xs font-semibold text-brand">
                                                            {getInitials(
                                                                member.name,
                                                            )}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <span className="font-medium text-text-primary">
                                                        {member.name}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-text-secondary">
                                                {member.email}
                                            </td>
                                            <td className="px-6 py-4">
                                                <Badge
                                                    className={
                                                        roleBadgeStyles[
                                                            member.role
                                                        ] ||
                                                        roleBadgeStyles.member
                                                    }
                                                >
                                                    {member.role_label}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4 text-text-secondary">
                                                {member.created_at
                                                    ? new Date(
                                                          member.created_at,
                                                      ).toLocaleDateString(
                                                          'en-GB',
                                                          {
                                                              day: 'numeric',
                                                              month: 'short',
                                                              year: 'numeric',
                                                          },
                                                      )
                                                    : '—'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

UsersIndex.layout = (props: { currentTeam?: { slug: string } | null }) => ({
    breadcrumbs: [
        {
            title: 'Staff',
            href: props.currentTeam ? `/${props.currentTeam.slug}/users` : '/',
        },
    ],
});
