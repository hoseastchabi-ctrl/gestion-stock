<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index()
    {
        return Category::all();
    }

    public function store(Request $request)
    {
        $category = Category::create($request->validate([
            'name' => 'required',
            'description' => 'nullable'
        ]));

        return response()->json($category, 201);
    }

    public function show(Category $category)
    {
        return $category;
    }

    public function update(Request $request, Category $category)
    {
        $category->update($request->all());

        return $category;
    }

    public function destroy(Category $category)
    {
        $category->delete();

        return response()->json([
            'message' => 'Catégorie supprimée'
        ]);
    }
}