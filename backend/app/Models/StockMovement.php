<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StockMovement extends Model
{
    protected $fillable = [
        'product_id',
        'type',
        'quantity',
        'reason',
        'user_id'
    ];

    // Un mouvement appartient à un produit
    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    // Un mouvement est effectué par un utilisateur
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}