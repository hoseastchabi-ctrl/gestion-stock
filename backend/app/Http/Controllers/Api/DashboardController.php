<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\StockMovement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class DashboardController extends Controller
{
    public function index()
    {
        $totalProducts = Product::count();
        $totalValue = Product::sum(\Illuminate\Support\Facades\DB::raw('price * quantity'));
        $lowStockThreshold = 5;
        $lowStockCount = Product::where('quantity', '<=', $lowStockThreshold)->count();
        $movementsToday = StockMovement::whereDate('created_at', today())->count();

        $criticalAlerts = Product::where('quantity', '<=', $lowStockThreshold)
            ->with('category')
            ->orderBy('quantity', 'asc')
            ->limit(5)
            ->get()
            ->map(function ($product) {
                return [
                    'id' => $product->id,
                    'sku' => $product->reference,
                    'name' => $product->name,
                    'quantity' => $product->quantity,
                    'stock_alert_threshold' => 5,
                    'category_name' => $product->category->name ?? null,
                ];
            });

        $recentActivity = StockMovement::with('product', 'user')
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($movement) {
                return [
                    'id' => $movement->id,
                    'type' => $movement->type,
                    'quantity' => $movement->quantity,
                    'reason' => $movement->reason,
                    'created_at' => $movement->created_at,
                    'product_name' => $movement->product->name ?? 'Produit supprimé',
                    'user_name' => $movement->user->name ?? 'Utilisateur inconnu',
                ];
            });

        $weeklyFlow = collect(range(6, 0))->map(function ($daysAgo) {
            $date = now()->subDays($daysAgo);
            $ins = StockMovement::where('type', 'IN')->whereDate('created_at', $date)->sum('quantity');
            $outs = StockMovement::where('type', 'OUT')->whereDate('created_at', $date)->sum('quantity');
            return [
                'day' => $date->locale('fr')->isoFormat('ddd'),
                'ins' => $ins,
                'outs' => $outs,
            ];
        });

        return response()->json([
            'stats' => [
                'total_products' => $totalProducts,
                'total_value' => $totalValue,
                'low_stock_count' => $lowStockCount,
                'movements_today' => $movementsToday,
            ],
            'weekly_flow' => $weeklyFlow,
            'critical_alerts' => $criticalAlerts,
            'recent_activity' => $recentActivity,
        ]);
    }
}