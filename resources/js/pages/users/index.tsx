import { Head, usePage } from '@inertiajs/react';
import { Plus, Search, Trash2, Users, Mail, X, ArrowUp, ArrowDown, ChevronsUpDown } from 'lucide-react';
import { useMemo, useState } from 'react';
import CancelInvitationModal from '@/components/cancel-invitation-modal';
import Heading from '@/components/heading';
import InviteMemberModal from '@/components/invite-member-modal';
import RemoveMemberModal from '@/components/remove-member-modal';
import TablePagination from '@/components/TablePagination';
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
        owner: 'bg-emerald-500/10 text-emerald-500 border-transparent hover:bg-emerald-500/10/80',
        admin: 'bg-blue-500/10 text-blue-500 border-transparent hover:bg-blue-500/10/80',
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

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' } | null>(null);

    const sortedMembers = useMemo(() => {
        const sortableItems = [...filteredMembers];

        if (sortConfig !== null) {
            sortableItems.sort((a: any, b: any) => {
                const aValue = a[sortConfig.key];
                const bValue = b[sortConfig.key];
                
                if (aValue === null) {
return 1;
}

                if (bValue === null) {
return -1;
}
                
                if (aValue < bValue) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }

                if (aValue > bValue) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }

                return 0;
            });
        }

        return sortableItems;
    }, [filteredMembers, sortConfig]);

    const totalPages = Math.ceil(sortedMembers.length / itemsPerPage);
    const paginatedMembers = useMemo(() => {
        return sortedMembers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    }, [sortedMembers, currentPage]);

    const requestSort = (key: string) => {
        let direction: 'asc' | 'desc' = 'asc';

        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }

        setSortConfig({ key, direction });
    };

    const SortIcon = ({ columnKey }: { columnKey: string }) => {
        if (sortConfig?.key !== columnKey) {
            return <ChevronsUpDown className="ml-2 h-4 w-4 inline-block text-gray-400" />;
        }

        return sortConfig.direction === 'asc' ? 
            <ArrowUp className="ml-2 h-4 w-4 inline-block text-primary" /> : 
            <ArrowDown className="ml-2 h-4 w-4 inline-block text-primary" />;
    };

    return (
        <>
            <Head title="Staff & Users" />
            <div className="flex flex-col flex-1 space-y-6">
                {/* Page Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <Heading 
                        title="Staff & Users" 
                        description="Manage your team members and their roles." 
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                    {/* Left Column: Filters & Table (col-span-2) */}
                    <div className="lg:col-span-2 flex flex-col gap-4">
                        {/* Toolbar (Search, Filter & Actions) */}
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-1">
                            {/* Search */}
                            <div className="relative w-full sm:max-w-xs">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search staff…"
                                    className="h-9 pl-9 text-sm shadow-sm"
                                />
                            </div>

                            <div className="flex flex-wrap items-center gap-3 justify-end">
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

                            {/* Invite Member - inline */}
                            {permissions.canCreateInvitation && (
                                <Button
                                    onClick={() => setInviteDialogOpen(true)}
                                    className="cursor-pointer gap-2 h-9"
                                    size="sm"
                                >
                                    <Plus className="h-4 w-4" />
                                    Invite Member
                                </Button>
                            )}
                            </div>
                        </div>

                        {/* Table / List */}
                {filteredMembers.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-lg border border-border bg-card py-12 text-center">
                        <Users className="mb-3 h-8 w-8 text-muted-foreground opacity-60" />
                        <p className="text-sm font-medium text-foreground">
                            No staff members found
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                            Invite team members to collaborate in your pharmacy.
                        </p>
                    </div>
                ) : (
                    <div className="flex-1 overflow-x-auto rounded-lg border border-border bg-card shadow-[0_2px_10px_rgba(20,28,64,0.05)]">
                        <Table className="min-w-[800px]">
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="cursor-pointer select-none" onClick={() => requestSort('name')}>Staff Member <SortIcon columnKey="name" /></TableHead>
                                    <TableHead className="cursor-pointer select-none" onClick={() => requestSort('email')}>Email Address <SortIcon columnKey="email" /></TableHead>
                                    <TableHead className="cursor-pointer select-none" onClick={() => requestSort('role')}>Role <SortIcon columnKey="role" /></TableHead>
                                    <TableHead className="cursor-pointer select-none" onClick={() => requestSort('created_at')}>Joined Date <SortIcon columnKey="created_at" /></TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {paginatedMembers.map((member) => (
                                    <TableRow
                                        key={member.id}
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
                                                    <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                                                        {getInitials(member.name)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <span className="font-medium text-sm text-foreground">
                                                    {member.name}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-4 py-4 text-sm text-muted-foreground">
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
                                        <TableCell className="px-4 py-4 text-sm text-muted-foreground">
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
                                                className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                                <span className="sr-only">Remove {member.name}</span>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <TablePagination 
                            currentPage={currentPage}
                            totalPages={totalPages}
                            totalItems={sortedMembers.length}
                            itemsPerPage={itemsPerPage}
                            onPageChange={setCurrentPage}
                        />
                    </div>
                )}
                    </div>

                    {/* Right Column: Sidebar Metrics (col-span-1) */}
                    <div className="lg:col-span-1 flex flex-col gap-6">

                        {/* Stats Cards */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="rounded-xl border border-border bg-card p-5 flex flex-col gap-1 shadow-sm">
                                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Staff</span>
                                <span className="text-3xl font-bold text-foreground mt-1">{members.length}</span>
                            </div>
                            <div className="rounded-xl border border-border bg-card p-5 flex flex-col gap-1 shadow-sm">
                                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Invites</span>
                                <span className="text-3xl font-bold text-foreground mt-1">{invitations.length}</span>
                            </div>
                        </div>

                        {/* Pending Invites list */}
                        {invitations.length > 0 && (
                            <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden flex flex-col">
                                <div className="border-b border-border px-5 py-4 bg-muted/30/40 flex items-center justify-between">
                                    <h3 className="font-semibold text-sm text-foreground">Pending Invitations</h3>
                                </div>
                                <div className="divide-y divide-border-soft max-h-[400px] overflow-y-auto">
                                    {invitations.map((invitation) => (
                                        <div key={invitation.code} className="p-4 flex flex-col gap-3 hover:bg-primary/10/50 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <div className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-primary shrink-0">
                                                    <Mail className="h-4 w-4" />
                                                </div>
                                                <div className="flex-1 overflow-hidden">
                                                    <div className="text-sm font-medium text-foreground truncate" title={invitation.email}>{invitation.email}</div>
                                                    <div className="text-xs text-muted-foreground mt-0.5">{invitation.role_label}</div>
                                                </div>
                                            </div>
                                            {permissions.canCancelInvitation && (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="w-full text-xs h-8 text-destructive hover:text-destructive hover:bg-destructive/10 border-border bg-card mt-1"
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

UsersIndex.layoutConfig = (props: { currentTeam?: { slug: string } | null }) => ({
    breadcrumbs: [
        {
            title: 'Staff',
            href: props.currentTeam ? `/${props.currentTeam.slug}/users` : '/',
        },
    ],
});
