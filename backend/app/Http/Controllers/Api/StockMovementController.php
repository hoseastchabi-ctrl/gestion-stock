<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\StockMovement;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class StockMovementController extends Controller
{
    /**
     * Historique global de tous les mouvements.
     */
    public function index()
    {
        $movements = StockMovement::with(['product', 'user'])->latest()->get();
        return response()->json($movements, 200);
    }

    /**
     * Enregistrer un nouveau mouvement (Entrée ou Sortie) et ajuster le stock.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'type'       => 'required|in:in,out',
            'quantity'   => 'required|integer|min:1',
            'reason'     => 'nullable|string|max:255',
        ]);

        // Utilisation d'une transaction DB pour s'assurer que le mouvement ET la mise à jour du stock réussissent ensemble
        $movement = DB::transaction(function () use ($validated, $request) {
            $product = Product::lockForUpdate()->find($validated['product_id']);

            if ($validated['type'] === 'in') {
                // Entrée : on augmente le stock
                $product->quantity += $validated['quantity'];
            } else {
                // Sortie : on vérifie si le stock est suffisant
                if ($product->quantity < $validated['quantity']) {
                    throw ValidationException::withMessages([
                        'quantity' => ["Stock insuffisant. Quantité actuelle disponible : {$product->quantity}"],
                    ]);
                }
                $product->quantity -= $validated['quantity'];
            }

            // Sauvegarde de la nouvelle quantité du produit
            $product->save();

            // Création de l'historique du mouvement
            return StockMovement::create([
                'product_id' => $validated['product_id'],
                'type'       => $validated['type'],
                'quantity'   => $validated['quantity'],
                'reason'     => $validated['reason'],
                'user_id'    => $request->user()->id, // Récupère l'id de l'utilisateur connecté
            ]);
        });

        return response()->json($movement->load('product'), 201);
    }

    /**
     * Historique des mouvements pour un produit spécifique.
     */
    public function productHistory(Product $product)
    {
        $movements = $product->movements()->with('user')->latest()->get();
        return response()->json($movements, 200);
    }
}