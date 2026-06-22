<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    // 1. Inscription d'un nouvel utilisateur
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed', // Nécessite 'password_confirmation' dans la requête
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);

        // Création du token dès l'inscription
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'access_token' => $token,
            'token_type' => 'Bearer',
        ], 201);
    }
public function updateProfile(Request $request)
{
    $user = $request->user();

    $validated = $request->validate([
        'name' => 'sometimes|string|max:255',
        'email' => 'sometimes|email|max:255',
        'company' => 'sometimes|nullable|string|max:255',
    ]);

    $user->update($validated);

    return response()->json($user);
}

public function updatePassword(Request $request)
{
    $user = $request->user();

    $validated = $request->validate([
        'current_password' => 'required',
        'password' => 'required|min:8|confirmed',
    ]);

    if (!\Hash::check($validated['current_password'], $user->password)) {
        return response()->json(['message' => 'Mot de passe actuel incorrect.'], 422);
    }

    $user->update(['password' => \Hash::make($validated['password'])]);

    return response()->json(['message' => 'Mot de passe mis à jour.']);
}
    // 2. Connexion et génération du Token
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        // Vérification de l'utilisateur et du mot de passe
        if (! $user || ! Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Les identifiants fournis sont incorrects.'],
            ]);
        }

        // Génération du token Sanctum
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'access_token' => $token,
            'token_type' => 'Bearer',
        ], 200);
    }
public function forgotPassword(Request $request)
{
    $request->validate([
        'email' => 'required|email',
    ]);

    $status = \Illuminate\Support\Facades\Password::sendResetLink(
        $request->only('email')
    );

    if ($status === \Illuminate\Support\Facades\Password::RESET_LINK_SENT) {
        return response()->json(['message' => 'Lien de réinitialisation envoyé.']);
    }

    return response()->json(['message' => 'Impossible d\'envoyer le lien.'], 422);
}
    // 3. Déconnexion (Révocation du token actuel)
    public function logout(Request $request)
    {
        // Supprime le token qui a servi à s'authentifier
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Déconnexion réussie, token supprimé.'
        ], 200);
    }
}


