<?php

namespace App\Actions\Fortify;

use App\Actions\Teams\CreateTeam;
use App\Concerns\PasswordValidationRules;
use App\Concerns\ProfileValidationRules;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Laravel\Fortify\Contracts\CreatesNewUsers;

class CreateNewUser implements CreatesNewUsers
{
    use PasswordValidationRules, ProfileValidationRules;

    public function __construct(private CreateTeam $createTeam)
    {
        //
    }

    public function create(array $input): User
    {
        Validator::make($input, [
            ...$this->profileRules(),
            'password' => $this->passwordRules(),
            'invitation' => ['nullable', 'string'],
        ])->validate();

        return DB::transaction(function () use ($input) {
            $user = User::create([
                'name' => $input['name'],
                'email' => $input['email'],
                'password' => $input['password'],
            ]);

            $this->createTeam->handle($user, $user->name."'s Team", isPersonal: true);

            if (!empty($input['invitation'])) {
                $invitation = \App\Models\TeamInvitation::query()
                    ->where('code', $input['invitation'])
                    ->whereNull('accepted_at')
                    ->where(fn ($query) => $query
                        ->whereNull('expires_at')
                        ->orWhere('expires_at', '>=', now()))
                    ->first();

                if ($invitation) {
                    $team = $invitation->team;

                    $team->memberships()->firstOrCreate(
                        ['user_id' => $user->id],
                        ['role' => $invitation->role],
                    );

                    $invitation->update(['accepted_at' => now()]);

                    $user->switchTeam($team);
                }
            }

            return $user;
        });
    }
}
