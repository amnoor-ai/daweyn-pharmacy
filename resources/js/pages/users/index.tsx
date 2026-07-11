import { Head, usePage } from '@inertiajs/react';
import { Plus, Search, Trash2, Users, Mail, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import Heading from '@/components/heading';
import RemoveMemberModal from '@/components/remove-member-modal';
import InviteMemberModal from '@/components/invite-member-modal';
import CancelInvitationModal from '@/components/cancel-invitation-modal';
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
import type { TeamMember, TeamInvitation, RoleOption, TeamPermissions } from '@/types';

type Props = {
    members: TeamMember[];
    invitations: TeamInvitation[];
    availableRoles: RoleOption[];
    permissions: TeamPermissions;
};

const ROLE_OPTIONS = [
    { value: '', label: 'All Roles' },
    { value: 'owner', label: 'Owner' },
    { value: 'admin', label: 'Admin' },
    { value: 'member', label: 'Member' },
];

export default function UsersIndex({ members, invitations, availableRoles, permissions }: Props) {
    const { props } = usePage();
    const currentTeam = props.currentTeam as any;
    const teamSlug = currentTeam?.slug ?? '';
    const getInitials = useInitials();

    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [removeTarget, setRemoveTarget] = useState<(typeof members)[0] | null>(null);
    const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
    const [cancelInvitationDialogOpen, setCancelInvitationDialogOpen] = useState(false);
    const [invitationToCancel, setInvitationToCancel] = useState<TeamInvitation | null>(null);

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
            <div className="flex flex-col flex-1 gap-6 max-w-7xl w-full mx-auto px-4">
                {/* Page Header */}
                <div className="flex items-center justify-between mt-2">
                    <Heading 
                        title="Staff & Users" 
                        description="Manage your team members and their roles." 
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                    {/* Left Column: Filters & Table (col-span-2) */}
                    <div className="lg:col-span-2 flex flex-col gap-4">
                        {/* Toolbar (Search & Filter) */}
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
                                    <TableHead className="px-4 py-3.5 text-right text-sm font-medium text-text-secondary uppercase">Actions</TableHead>
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
                                        <TableCell className="px-4 py-4 text-right">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setRemoveTarget(member)}
                                                className="h-8 w-8 p-0 text-text-secondary hover:text-danger-fg"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                                <span className="sr-only">Remove {member.name}</span>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
                    </div>

                    {/* Right Column: Sidebar Metrics & Actions (col-span-1) */}
                    <div className="lg:col-span-1 flex flex-col gap-6">
                        {/* Primary action */}
                        {permissions.canCreateInvitation && (
                            <Button
                                onClick={() => setInviteDialogOpen(true)}
                                className="w-full cursor-pointer gap-2 bg-brand hover:bg-brand-dark transition-all duration-200 hover:-translate-y-0.5 shadow-sm"
                            >
                                <Plus className="h-4 w-4" />
                                Invite Member
                            </Button>
                        )}

                        {/* Stats Cards */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="rounded-xl border border-border-soft bg-surface p-5 flex flex-col gap-1 shadow-sm">
                                <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Total Staff</span>
                                <span className="text-3xl font-bold text-text-primary mt-1">{members.length}</span>
                            </div>
                            <div className="rounded-xl border border-border-soft bg-surface p-5 flex flex-col gap-1 shadow-sm">
                                <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Invites</span>
                                <span className="text-3xl font-bold text-text-primary mt-1">{invitations.length}</span>
                            </div>
                        </div>

                        {/* Pending Invites list */}
                        {invitations.length > 0 && (
                            <div className="rounded-xl border border-border-soft bg-surface shadow-sm overflow-hidden flex flex-col">
                                <div className="border-b border-border-soft px-5 py-4 bg-canvas/40 flex items-center justify-between">
                                    <h3 className="font-semibold text-sm text-text-primary">Pending Invitations</h3>
                                </div>
                                <div className="divide-y divide-border-soft max-h-[400px] overflow-y-auto">
                                    {invitations.map((invitation) => (
                                        <div key={invitation.code} className="p-4 flex flex-col gap-3 hover:bg-primary-50/50 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <div className="flex size-9 items-center justify-center rounded-full bg-brand/10 text-brand shrink-0">
                                                    <Mail className="h-4 w-4" />
                                                </div>
                                                <div className="flex-1 overflow-hidden">
                                                    <div className="text-sm font-medium text-text-primary truncate" title={invitation.email}>{invitation.email}</div>
                                                    <div className="text-xs text-text-secondary mt-0.5">{invitation.role_label}</div>
                                                </div>
                                            </div>
                                            {permissions.canCancelInvitation && (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="w-full text-xs h-8 text-danger-fg hover:text-danger-fg hover:bg-danger-bg border-border-soft bg-surface mt-1"
                                                    onClick={() => {
                                                        setInvitationToCancel(invitation);
                                                        setCancelInvitationDialogOpen(true);
                                                    }}
                                                >
                                                    <X className="h-3.5 w-3.5 mr-1.5" />
                                                    Cancel Invitation
                                                </Button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {permissions.canCreateInvitation && (
                <InviteMemberModal
                    team={currentTeam}
                    availableRoles={availableRoles}
                    open={inviteDialogOpen}
                    onOpenChange={setInviteDialogOpen}
                />
            )}

            <CancelInvitationModal
                team={currentTeam}
                invitation={invitationToCancel}
                open={cancelInvitationDialogOpen}
                onOpenChange={setCancelInvitationDialogOpen}
            />

            <RemoveMemberModal
                team={currentTeam}
                member={removeTarget}
                open={!!removeTarget}
                onOpenChange={(open) => !open && setRemoveTarget(null)}
            />
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
