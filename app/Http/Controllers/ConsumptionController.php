<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Consumption;

class ConsumptionController extends Controller
{
    public function store(Request $request)
    {
        // 1. Veriyi Doğrula
        $validated = $request->validate([
            'type' => 'required|in:elektrik,su,dogalgaz',
            'amount' => 'required|numeric|min:0', // Tüketim (kWh veya m3)
            'cost' => 'required|numeric|min:0',   // Tutar (TL)
            'date' => 'required|date',            // Fatura Tarihi
        ]);

        // 2. Kaydet
        $request->user()->consumptions()->create($validated);

        // 3. Geri Dön (Inertia sayfayı yeniler, veri grafiğe düşer)
        return redirect()->back()->with('success', 'Fatura başarıyla eklendi.');
    }

    public function destroy(Consumption $consumption)
    {
        // Sadece kendi verisini silebilirsin kontrolü
        if ($consumption->user_id !== auth()->id()) {
            abort(403);
        }
        
        $consumption->delete();
        return redirect()->back();
    }
}