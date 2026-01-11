<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Consumption;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = auth()->user();

        if (!$user->profile) {
            return redirect()->route('onboarding.create');
        }

        // Ay filtresi (opsiyonel, yoksa son 6 ay)
        $selectedMonth = $request->get('month');
        $filteredConsumptions = Consumption::where('user_id', $user->id);
        
        if ($selectedMonth) {
            // Seçilen ay için filtrele
            $filteredConsumptions->whereYear('date', date('Y', strtotime($selectedMonth)))
                ->whereMonth('date', date('m', strtotime($selectedMonth)));
        }
        
        $consumptions = $filteredConsumptions->orderBy('date', 'desc')->get();
        
        // Tüm veriler (ay filtrelemesi olmadan, grafik için)
        $allConsumptions = Consumption::where('user_id', $user->id)
            ->orderBy('date', 'desc')
            ->get();

        // Aylık veri formatı için hazırlık
        $monthlyData = [];
        $monthNames = [
            1 => 'Ocak', 2 => 'Şubat', 3 => 'Mart', 4 => 'Nisan',
            5 => 'Mayıs', 6 => 'Haziran', 7 => 'Temmuz', 8 => 'Ağustos',
            9 => 'Eylül', 10 => 'Ekim', 11 => 'Kasım', 12 => 'Aralık'
        ];

        // Son 6 ay için veri hazırla
        for ($i = 5; $i >= 0; $i--) {
            $date = now()->subMonths($i);
            $monthKey = $date->format('Y-m');
            $monthName = $monthNames[(int)$date->format('n')];
            
            $monthlyData[$monthKey] = [
                'name' => $monthName,
                'elektrik' => 0,
                'su' => 0,
                'dogalgaz' => 0,
            ];
        }

        // Tüketimleri aylara göre topla (tüm veriler için)
        foreach ($allConsumptions as $item) {
            $monthKey = date('Y-m', strtotime($item->date));
            if (isset($monthlyData[$monthKey])) {
                $monthlyData[$monthKey][$item->type] += (float)$item->cost;
            }
        }

        // Array formatına çevir
        $chartData = array_values($monthlyData);
        
        // Gider dağılımı için gerçek cost verilerini hesapla (filtrelenmiş veriler için)
        $distributionCosts = [
            'elektrik' => 0,
            'su' => 0,
            'dogalgaz' => 0,
        ];
        
        foreach ($consumptions as $item) {
            $distributionCosts[$item->type] += (float)$item->cost;
        }

        // İstatistikler (filtrelenmiş veriler için)
        $totalCarbon = 0;
        $totalElectricity = 0;
        $totalWater = 0;
        $totalGas = 0;
        $totalCost = 0;
        
        foreach ($consumptions as $item) {
            $totalCost += (float)$item->cost;
            
            if ($item->type == 'elektrik') {
                $totalElectricity += (float)$item->amount;
                $totalCarbon += (float)$item->amount * 0.3;
            } elseif ($item->type == 'su') {
                $totalWater += (float)$item->amount;
                $totalCarbon += (float)$item->amount * 0.2;
            } elseif ($item->type == 'dogalgaz') {
                $totalGas += (float)$item->amount;
                $totalCarbon += (float)$item->amount * 1.5;
            }
        }

        // Seçilen ay veya mevcut ay için değişim hesaplama
        if ($selectedMonth) {
            // Seçilen ayın başlangıç ve bitiş tarihleri
            $selectedMonthStart = date('Y-m-01', strtotime($selectedMonth));
            $selectedMonthEnd = date('Y-m-t', strtotime($selectedMonth));
            $selectedMonthEndDate = date('Y-m-d', strtotime($selectedMonthEnd . ' +1 day'));
            
            // Seçilen ayın bir önceki ayı
            $previousMonthStart = date('Y-m-01', strtotime($selectedMonth . ' -1 month'));
            $previousMonthEnd = date('Y-m-t', strtotime($selectedMonth . ' -1 month'));
            $previousMonthEndDate = date('Y-m-d', strtotime($previousMonthEnd . ' +1 day'));
        } else {
            // Filtre yoksa, son ay ve bir önceki ay
            $selectedMonthStart = now()->subMonth()->startOfMonth()->format('Y-m-d');
            $selectedMonthEndDate = now()->startOfMonth()->format('Y-m-d');
            $previousMonthStart = now()->subMonths(2)->startOfMonth()->format('Y-m-d');
            $previousMonthEndDate = now()->subMonth()->startOfMonth()->format('Y-m-d');
        }
        
        // Tüm tüketimleri al (karşılaştırma için)
        $allConsumptionsForComparison = Consumption::where('user_id', $user->id)
            ->orderBy('date', 'desc')
            ->get();
        
        $selectedMonthCarbon = 0;
        $previousMonthCarbon = 0;
        
        $selectedMonthElectricity = 0;
        $previousMonthElectricity = 0;
        
        $selectedMonthWater = 0;
        $previousMonthWater = 0;
        
        foreach ($allConsumptionsForComparison as $item) {
            $itemDate = date('Y-m-d', strtotime($item->date));
            
            // Seçilen ay verileri
            if ($itemDate >= $selectedMonthStart && $itemDate < $selectedMonthEndDate) {
                if ($item->type == 'elektrik') {
                    $selectedMonthCarbon += (float)$item->amount * 0.3;
                    $selectedMonthElectricity += (float)$item->amount;
                } elseif ($item->type == 'su') {
                    $selectedMonthCarbon += (float)$item->amount * 0.2;
                    $selectedMonthWater += (float)$item->amount;
                } elseif ($item->type == 'dogalgaz') {
                    $selectedMonthCarbon += (float)$item->amount * 1.5;
                }
            }
            
            // Önceki ay verileri
            if ($itemDate >= $previousMonthStart && $itemDate < $previousMonthEndDate) {
                if ($item->type == 'elektrik') {
                    $previousMonthCarbon += (float)$item->amount * 0.3;
                    $previousMonthElectricity += (float)$item->amount;
                } elseif ($item->type == 'su') {
                    $previousMonthCarbon += (float)$item->amount * 0.2;
                    $previousMonthWater += (float)$item->amount;
                } elseif ($item->type == 'dogalgaz') {
                    $previousMonthCarbon += (float)$item->amount * 1.5;
                }
            }
        }
        
        // Karbon değişimi hesapla (bir önceki aya göre)
        $carbonChange = 0;
        if ($previousMonthCarbon > 0) {
            $carbonChange = round((($selectedMonthCarbon - $previousMonthCarbon) / $previousMonthCarbon) * 100, 1);
        } elseif ($selectedMonthCarbon > 0 && $previousMonthCarbon == 0) {
            // Önceki ay veri yok ama seçilen ay var - %100 artış göster
            $carbonChange = 100;
        }
        
        // Elektrik değişimi hesapla (amount bazlı - kWh, bir önceki aya göre)
        $electricityChange = 0;
        if ($previousMonthElectricity > 0) {
            $electricityChange = round((($selectedMonthElectricity - $previousMonthElectricity) / $previousMonthElectricity) * 100, 1);
        } elseif ($selectedMonthElectricity > 0 && $previousMonthElectricity == 0) {
            // Önceki ay veri yok ama seçilen ay var - %100 artış göster
            $electricityChange = 100;
        }
        
        // Su değişimi hesapla (amount bazlı - m³, bir önceki aya göre)
        $waterChange = 0;
        if ($previousMonthWater > 0) {
            $waterChange = round((($selectedMonthWater - $previousMonthWater) / $previousMonthWater) * 100, 1);
        } elseif ($selectedMonthWater > 0 && $previousMonthWater == 0) {
            // Önceki ay veri yok ama seçilen ay var - %100 artış göster
            $waterChange = 100;
        }

        $treesNeeded = ceil($totalCarbon / 20);
        
        // Kişi başına düşen kullanım hesapla
        $peopleCount = $user->profile->people_count ?? 1;
        $perPersonData = [
            'elektrik' => round($totalElectricity / $peopleCount, 2),
            'su' => round($totalWater / $peopleCount, 2),
            'dogalgaz' => round($totalGas / $peopleCount, 2),
            'carbon' => round($totalCarbon / $peopleCount, 2),
        ];
        
        // Mevcut ay ve seçilebilir aylar listesi (SQLite uyumlu)
        $availableMonths = [];
        $allConsumptionDates = Consumption::where('user_id', $user->id)
            ->pluck('date')
            ->toArray();
        
        // PHP tarafında unique ayları bul (hem SQLite hem MySQL ile çalışır)
        $uniqueMonths = [];
        foreach ($allConsumptionDates as $date) {
            $monthKey = date('Y-m', strtotime($date));
            if (!in_array($monthKey, $uniqueMonths)) {
                $uniqueMonths[] = $monthKey;
            }
        }
        
        // Sırala (en yeni önce)
        rsort($uniqueMonths);
        
        foreach ($uniqueMonths as $monthKey) {
            $dateParts = explode('-', $monthKey);
            $year = (int)$dateParts[0];
            $month = (int)$dateParts[1];
            $availableMonths[] = [
                'value' => $monthKey,
                'label' => $monthNames[$month] . ' ' . $year,
            ];
        }

        return Inertia::render('Dashboard', [
            'chartData' => $chartData,
            'selectedMonth' => $selectedMonth,
            'availableMonths' => $availableMonths,
            'distributionCosts' => $distributionCosts,
            'perPersonData' => $perPersonData,
            'stats' => [
                'userProfile' => $user->profile,
                'totalCarbon' => round($totalCarbon, 1),
                'carbonChange' => $carbonChange,
                'treesNeeded' => $treesNeeded,
                'totalElectricity' => round($totalElectricity, 1),
                'totalWater' => round($totalWater, 1),
                'totalGas' => round($totalGas, 1),
                'electricityChange' => $electricityChange,
                'waterChange' => $waterChange,
                'budgetLimit' => $user->profile->budget_limit,
                'totalCost' => round($totalCost, 2),
                'peopleCount' => $peopleCount,
            ],
            'auth' => [
                'user' => [
                    'name' => $user->name,
                    'email' => $user->email,
                ]
            ]
        ]);
    }
}