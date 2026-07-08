import { Head, Link, usePage } from '@inertiajs/react';
import { Plus, Search, Users } from 'lucide-react';
import { useMemo, useState } from 'react';
import Heading from '@/components/heading';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { useInitials } from '@/hooks/use-initials';
import type { TeamMember } from '@/types';

type Props = {
    members: TeamMember[];
};

const ROLE_OPTIONS = [
    { value: '', label: 'All Roles' },
    { value: 'owner', label: 'Owner' },
    { value: 'admin', label: 'Admin' },
    { value: 'member', label: 'Member' },
];

export default function UsersIndex({ members }: Props) {
    const { props } = usePage();
    const currentTeam = props.currentTeam as {
        slug: string;
        name: string;
    } | null;
    const teamSlug = currentTeam?.slug ?? '';
    const getInitials = useInitials();

    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState('');

    const roleBadgeStyles: Record<string, string> = {
        owner: 'bg-success-bg text-success-fg border-transparent hover:bg-success-bg/80',
        admin: 'bg-info-bg text-info-fg border-transparent hover:bg-info-bg/80',
        member: 'bg-secondary text-secondary-foreground border-transparent hover:bg-secondary/80',
    };

    // Client-side search + role filter (UserController has no server-side search)
    const filteredMembers = useMemo(() => {
        const q = searchQuery.toLowerCase();

        return members.filter((m) => {
            const matchSearch =
                !q ||
                m.name.toLowerCase().includes(q) ||
                m.email.toLowerCase().includes(q);
            const matchRole = !roleFilter || m.role === roleFilter;

            return matchSearch && matchRole;
        });
    }, [members, searchQuery, roleFilter]);

    return (
        <>
            <Head title="Staff & Users" />
            <div className="flex flex-col flex-1 gap-4">
                {/* Page Header */}
                <div className="flex items-center justify-between mt-2">
                    <Heading 
                        title="Staff & Users" 
                        description="Manage your team members and their roles." 
                    />
                </div>

                {/* Toolbar */}
                <div className="flex flex-wrap items-center gap-3">
                    {/* Search */}
                    <div className="relative flex-1 max-w-xs">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
                        <Input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search staff…"
                            className="h-9 pl-9 text-sm"
                        />
                    </div>

                    {/* Role filter */}
                    <Select
                        value={roleFilter}
                        onValueChange={setRoleFilter}
                    >
                        <SelectTrigger className="h-9 min-w-[120px]">
                            <SelectValue placeholder="All Roles" />
                        </SelectTrigger>
                        <SelectContent>
                            {ROLE_OPTIONS.map((o) => (
                                <SelectItem key={o.value} value={o.value}>
                                    {o.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {/* Spacer */}
                    <div className="flex-1" />

                    {/* Primary action */}
                    <Button
                        asChild
                        className="cursor-pointer gap-2 bg-brand hover:bg-brand-dark transition-all duration-200 hover:-translate-y-0.5"
                    >
                        <Link href={`/settings/teams/${teamSlug}`}>
                            <Plus className="h-4 w-4" />
                            Invite Member
                        </Link>
                    </Button>
                </div>

                {/* Table / List */}
                {filteredMembers.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-lg border border-border-soft bg-surface py-12 text-center">
                        <Users className="mb-3 h-8 w-8 text-text-secondary opacity-60" />
                        <p className="text-sm font-medium text-text-primary">
                            No staff members found
                        </p>
                        <p className="mt-1 text-xs text-text-secondary">
                            Invite team members to collaborate in your pharmacy.
                        </p>
                    </div>
                ) : (
                    <div className="flex-1 overflow-x-auto rounded-lg border border-border-soft bg-surface shadow-[0_2px_10px_rgba(20,28,64,0.05)]">
                        <Table className="min-w-[800px]">
                            <TableHeader>
                                <TableRow className="border-b border-divider hover:bg-transparent">
                                    <TableHead className="px-4 py-3.5 text-left text-sm font-medium text-text-secondary uppercase">Staff Member</TableHead>
                                    <TableHead className="px-4 py-3.5 text-left text-sm font-medium text-text-secondary uppercase">Email Address</TableHead>
                                    <TableHead className="px-4 py-3.5 text-left text-sm font-medium text-text-secondary uppercase">Role</TableHead>
                                    <TableHead className="px-4 py-3.5 text-left text-sm font-medium text-text-secondary uppercase">Joined Date</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredMembers.map((member) => (
                                    <TableRow
                                        key={member.id}
                                        className="border-b border-divider hover:bg-primary-50 transition-colors"
                                    >
                                        <TableCell className="px-4 py-4">
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-9 w-9">
                                                    {member.avatar ? (
                                                        <AvatarImage
                                                            src={member.avatar}
                                                            alt={member.name}
                                                        />
                                                    ) : null}
                                                    <AvatarFallback className="bg-brand/10 text-xs font-semibold text-brand">
                                                        {getInitials(member.name)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <span className="font-medium text-sm text-text-primary">
                                                    {member.name}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-4 py-4 text-sm text-text-secondary">
                                            {member.email}
                                        </TableCell>
                                        <TableCell className="px-4 py-4">
                                            <Badge
                                                className={
                                                    roleBadgeStyles[member.role] ||
                                                    roleBadgeStyles.member
                                                }
                                            >
                                                {member.role_label}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="px-4 py-4 text-sm text-text-secondary">
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
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
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
