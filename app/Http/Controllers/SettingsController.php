<?php

namespace App\Http\Controllers;

use App\Models\UserProfile;
use App\Models\Consumption;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SettingsController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        
        return Inertia::render('Settings/Index', [
            'userProfile' => $user->profile,
            'consumptions' => Consumption::where('user_id', $user->id)
                ->orderBy('date', 'desc')
                ->paginate(10)
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'square_meters' => 'required|integer|min:10',
            'people_count' => 'required|integer|min:1',
            'heating_type' => 'required|string',
            'has_insulation' => 'boolean',
            'budget_limit' => 'nullable|numeric',
        ]);

        $user = auth()->user();
        
        if ($user->profile) {
            $user->profile->update($validated);
        } else {
            $user->profile()->create($validated);
        }

        return redirect()->back()->with('success', 'Ayarlar başarıyla güncellendi.');
    }
}

