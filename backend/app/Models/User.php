<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Notifications\Messages\MailMessage;
use Laravel\Sanctum\HasApiTokens; // <--- TRÈS IMPORTANT

class User extends Authenticatable
{
    public function sendPasswordResetNotification($token)
{
    $url = config('app.frontend_url', 'http://localhost:5173') . '/reset-password?token=' . $token . '&email=' . urlencode($this->email);

    $this->notify(new class($token, $url) extends ResetPassword {
        public $resetUrl;

        public function __construct($token, $resetUrl)
        {
            parent::__construct($token);
            $this->resetUrl = $resetUrl;
        }

        public function toMail($notifiable)
        {
            return (new MailMessage)
                ->subject('Réinitialisation de votre mot de passe StockMe')
                ->line('Vous recevez cet email car nous avons reçu une demande de réinitialisation de mot de passe.')
                ->action('Réinitialiser le mot de passe', $this->resetUrl)
                ->line('Si vous n\'avez pas demandé cette réinitialisation, aucune action n\'est requise.');
        }
    });
}
    use HasApiTokens, HasFactory, Notifiable; // <--- TRÈS IMPORTANT

    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];
    
}
