<?php

namespace App\Http\Controllers;

use App\Models\UserProfile;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OnboardingController extends Controller
{
    public function create()
    {
        if (auth()->user()->profile) {
            return redirect()->route('dashboard');
        }

        return Inertia::render('Onboarding/Setup');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'square_meters' => 'required|integer|min:10',
            'people_count' => 'required|integer|min:1',
            'heating_type' => 'required|string',
            'has_insulation' => 'boolean',
            'budget_limit' => 'nullable|numeric',
        ]);

        auth()->user()->profile()->create($validated);

        return redirect()->route('dashboard');
    }
}