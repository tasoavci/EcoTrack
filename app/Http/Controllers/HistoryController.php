<?php

namespace App\Http\Controllers;
use Inertia\Inertia;
use App\Models\Consumption;

class HistoryController extends Controller {
    public function index() {
        return Inertia::render('History/Index', [
            'consumptions' => Consumption::where('user_id', auth()->id())
                ->orderBy('date', 'desc')
                ->paginate(10)
        ]);
    }
}