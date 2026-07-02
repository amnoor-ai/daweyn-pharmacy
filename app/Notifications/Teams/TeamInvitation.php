<?php

namespace App\Notifications\Teams;

use App\Models\TeamInvitation as TeamInvitationModel;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class TeamInvitation extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(public TeamInvitationModel $invitation)
    {
        //
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $team = $this->invitation->team;
        $inviter = $this->invitation->inviter;
        $roleStr = $this->invitation->role->value;
        $article = in_array(strtolower(substr($roleStr, 0, 1)), ['a', 'e', 'i', 'o', 'u']) ? 'an' : 'a';

        return (new MailMessage)
            ->subject("You've been invited to join {$team->name} on Daaweyn Pharmacy")
            ->greeting("Hello,")
            ->line("{$inviter->name} has invited you to join {$team->name} as {$article} {$roleStr} on Daaweyn Pharmacy — a modern pharmacy management platform built for clinical efficiency.")
            ->line("Click below to create your account and accept the invitation.")
            ->action("Accept Invitation & Register", route('register', ['invitation' => $this->invitation->code]))
            ->line("[Already have an account? Sign in instead](" . route('login', ['invitation' => $this->invitation->code]) . ")")
            ->line("This invitation expires in 7 days. If you were not expecting this, you can safely ignore this email.")
            ->salutation("The Daaweyn Pharmacy Team\n© 2026 Daaweyn Pharmacy. All rights reserved.");
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'invitation_id' => $this->invitation->id,
            'team_id' => $this->invitation->team_id,
            'team_name' => $this->invitation->team->name,
            'role' => $this->invitation->role->value,
        ];
    }
}
