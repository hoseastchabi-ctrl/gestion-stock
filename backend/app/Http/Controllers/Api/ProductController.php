<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::with('category');

        if ($request->has('category_id') && $request->category_id) {
            $query->where('category_id', $request->category_id);
        }

        $products = $query->get()->map(function ($product) {
            $product->image_url = $product->image ? Storage::url($product->image) : null;
            return $product;
        });

        return response()->json($products, 200);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'name'        => 'required|string|max:255',
            'reference'   => 'required|string|unique:products,reference|max:100',
            'price'       => 'required|numeric|min:0',
            'quantity'    => 'required|integer|min:0',
            'image'       => 'nullable|image|max:5120',
        ]);

        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('products', 'public');
        }

        $product = Product::create($validated);
        $product->image_url = $product->image ? Storage::url($product->image) : null;

        return response()->json($product, 201);
    }

    public function show(Product $product)
    {
        $product->load('category');
        $product->image_url = $product->image ? Storage::url($product->image) : null;
        return response()->json($product, 200);
    }

    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'category_id' => 'sometimes|required|exists:categories,id',
            'name'        => 'sometimes|required|string|max:255',
            'reference'   => 'sometimes|required|string|max:100|unique:products,reference,' . $product->id,
            'price'       => 'sometimes|required|numeric|min:0',
            'quantity'    => 'sometimes|required|integer|min:0',
            'image'       => 'nullable|image|max:5120',
        ]);

        if ($request->hasFile('image')) {
            if ($product->image) {
                Storage::disk('public')->delete($product->image);
            }
            $validated['image'] = $request->file('image')->store('products', 'public');
        }

        $product->update($validated);
        $product->image_url = $product->image ? Storage::url($product->image) : null;

        return response()->json($product, 200);
    }

    public function destroy(Product $product)
    {
        if ($product->image) {
            Storage::disk('public')->delete($product->image);
        }
        $product->delete();

        return response()->json([
            'message' => 'Produit supprimé avec succès du stock'
        ], 200);
    }
}