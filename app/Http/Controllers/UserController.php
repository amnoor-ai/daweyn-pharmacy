<?php

namespace App\Http\Controllers;

use App\Models\Team;
use App\Models\User;
use App\Models\Membership;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    /**
     * Display a directory listing of the current team's staff members.
     */
    public function index(Team $currentTeam): Response
    {
        $members = $currentTeam->members()
            ->withPivot(['role'])
            ->get()
            ->map(function (User $member) {
                /** @var Membership $membership */
                $membership = $member->getRelation('pivot');

                return [
                    'id' => $member->id,
                    'name' => $member->name,
                    'email' => $member->email,
                    'avatar' => $member->avatar ?? null,
                    'role' => $membership->role->value,
                    'role_label' => $membership->role->label(),
                    'created_at' => $membership->created_at?->toISOString() ?? $member->created_at?->toISOString(),
                ];
            });

        $invitations = $currentTeam->invitations()
            ->whereNull('accepted_at')
            ->get()
            ->map(fn ($invitation) => [
                'code' => $invitation->code,
                'email' => $invitation->email,
                'role' => $invitation->role->value,
                'role_label' => $invitation->role->label(),
                'created_at' => $invitation->created_at->toISOString(),
            ]);

        return Inertia::render('users/index', [
            'members' => $members,
            'invitations' => $invitations,
            'availableRoles' => \App\Enums\TeamRole::assignable(),
            'permissions' => request()->user()->toTeamPermissions($currentTeam),
        ]);
    }
}
