import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    RadialBarChart,
    RadialBar,
} from "recharts";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { Label } from "@/Components/ui/label";
import AddConsumptionModal from "@/Components/AddConsumptionModal";
import SmartSuggestions from "@/Components/SmartSuggestions";
import {
    Leaf,
    Zap,
    Droplets,
    Flame,
    TrendingUp,
    TrendingDown,
    Minus,
    Wallet,
    Sprout,
} from "lucide-react";

// Renk Paleti
const COLORS = {
    elektrik: "#EAB308", // Yellow-500
    su: "#3B82F6", // Blue-500
    dogalgaz: "#EF4444", // Red-500
    carbon: "#52525b", // Zinc-600
    tree: "#16a34a", // Green-600
};

// Name'e göre renk döndür helper function
const getColorByName = (name: string): string => {
    const nameLower = name.toLowerCase();
    if (nameLower.includes("elektrik")) return COLORS.elektrik;
    if (nameLower.includes("su")) return COLORS.su;
    if (nameLower.includes("doğalgaz") || nameLower.includes("dogalgaz"))
        return COLORS.dogalgaz;
    return "#94a3b8"; // Default gray
};

const ChangeIndicator = ({ value }: { value: number }) => {
    if (value === 0)
        return (
            <span className="text-gray-400 text-xs flex items-center ml-2">
                <Minus className="h-3 w-3 mr-1" /> Değişim yok
            </span>
        );
    const isGood = value < 0;
    const colorClass = isGood ? "text-green-600" : "text-red-600";
    const Icon = isGood ? TrendingDown : TrendingUp;
    return (
        <span
            className={`${colorClass} text-xs font-bold flex items-center ml-2`}
        >
            <Icon className="h-3 w-3 mr-1" />%{Math.abs(value)}
        </span>
    );
};

interface DashboardProps {
    auth: {
        user: {
            name: string;
            email: string;
        };
    };
    chartData: Array<{
        name: string;
        elektrik: number;
        su: number;
        dogalgaz: number;
    }>;
    stats: {
        userProfile: any;
        totalCarbon: number;
        carbonChange: number;
        treesNeeded: number;
        totalElectricity: number;
        totalWater: number;
        totalGas: number;
        electricityChange: number;
        waterChange: number;
        budgetLimit: number | null;
        totalCost: number;
        peopleCount: number;
    };
    selectedMonth?: string | null;
    availableMonths: Array<{ value: string; label: string }>;
    distributionCosts: {
        elektrik: number;
        su: number;
        dogalgaz: number;
    };
    perPersonData: {
        elektrik: number;
        su: number;
        dogalgaz: number;
        carbon: number;
    };
}

export default function Dashboard({
    auth,
    chartData,
    stats,
    selectedMonth,
    availableMonths,
    distributionCosts,
    perPersonData,
}: DashboardProps) {
    const { userProfile } = stats;

    // Ay filtre değişikliği
    const handleMonthChange = (month: string) => {
        const url = route("dashboard");
        const queryString = month ? `?month=${encodeURIComponent(month)}` : "";
        router.visit(url + queryString, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    // Gider Dağılımı - Gerçek Cost Verileri
    const distributionData = [
        { name: "Elektrik", value: distributionCosts.elektrik },
        { name: "Su", value: distributionCosts.su },
        { name: "Doğalgaz", value: distributionCosts.dogalgaz },
    ].filter((d) => d.value > 0);

    const budgetUsage =
        stats.budgetLimit && stats.budgetLimit > 0
            ? (stats.totalCost / stats.budgetLimit) * 100
            : 0;
    const budgetData =
        stats.budgetLimit && stats.budgetLimit > 0
            ? [
                  { name: "Kalan", value: 100, fill: "#e5e7eb" },
                  {
                      name: "Harcanan",
                      value: budgetUsage > 100 ? 100 : budgetUsage,
                      fill: budgetUsage > 90 ? "#ef4444" : "#22c55e",
                  },
              ]
            : [];

    const perPersonChartData = [
        {
            name: "Elektrik",
            value: perPersonData.elektrik,
            unit: "kWh",
        },
        {
            name: "Su",
            value: perPersonData.su,
            unit: "m³",
        },
        {
            name: "Doğalgaz",
            value: perPersonData.dogalgaz,
            unit: "m³",
        },
    ].filter((d) => d.value > 0);

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                        <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                            Enerji Tasarrufu Paneli
                        </h2>
                        <p className="text-sm text-gray-500">
                            Hoş geldin {auth.user.name}!
                        </p>
                    </div>
                    <AddConsumptionModal />
                </div>
            }
        >
            <Head title="Enerji Tasarrufu Paneli" />

            <div className="py-8 bg-gray-50/50 min-h-screen">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    {/* Ay Filtresi */}
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-4">
                                <Label
                                    htmlFor="month-filter"
                                    className="text-sm font-medium"
                                >
                                    Ay Filtresi:
                                </Label>
                                <Select
                                    value={selectedMonth || "all"}
                                    onValueChange={(value: string) =>
                                        handleMonthChange(
                                            value === "all" ? "" : value
                                        )
                                    }
                                >
                                    <SelectTrigger
                                        className="w-[200px]"
                                        id="month-filter"
                                    >
                                        <SelectValue placeholder="Tüm aylar" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">
                                            Tüm Aylar
                                        </SelectItem>
                                        {availableMonths.map((month) => (
                                            <SelectItem
                                                key={month.value}
                                                value={month.value}
                                            >
                                                {month.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>

                    {/* 1. SATIR: TÜKETİM KARTLARI (YAN YANA 3'LÜ) */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Elektrik */}
                        <Card className="border-t-4 border-t-yellow-400 shadow-sm hover:shadow-md transition-shadow">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-gray-600">
                                    Elektrik Tüketimi
                                </CardTitle>
                                <div className="p-2 bg-yellow-100 rounded-full">
                                    <Zap className="h-4 w-4 text-yellow-600" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-end">
                                    <div className="text-2xl font-bold">
                                        {stats.totalElectricity} kWh
                                    </div>
                                    <ChangeIndicator
                                        value={stats.electricityChange}
                                    />
                                </div>
                                <p className="text-xs text-muted-foreground mt-2">
                                    Bu ayki toplam kullanım
                                </p>
                            </CardContent>
                        </Card>

                        {/* Su */}
                        <Card className="border-t-4 border-t-blue-400 shadow-sm hover:shadow-md transition-shadow">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-gray-600">
                                    Su Tüketimi
                                </CardTitle>
                                <div className="p-2 bg-blue-100 rounded-full">
                                    <Droplets className="h-4 w-4 text-blue-600" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-end">
                                    <div className="text-2xl font-bold">
                                        {stats.totalWater} m³
                                    </div>
                                    <ChangeIndicator
                                        value={stats.waterChange}
                                    />
                                </div>
                                <p className="text-xs text-muted-foreground mt-2">
                                    Bu ayki toplam kullanım
                                </p>
                            </CardContent>
                        </Card>

                        {/* Doğalgaz (Ekledik!) */}
                        <Card className="border-t-4 border-t-red-400 shadow-sm hover:shadow-md transition-shadow">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-gray-600">
                                    Doğalgaz Tüketimi
                                </CardTitle>
                                <div className="p-2 bg-red-100 rounded-full">
                                    <Flame className="h-4 w-4 text-red-600" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-end">
                                    <div className="text-2xl font-bold">
                                        {stats.totalGas} m³
                                    </div>
                                    {/* Doğalgaz değişimi controller'dan gelmediyse 0 gösterir */}
                                    <ChangeIndicator value={0} />
                                </div>
                                <p className="text-xs text-muted-foreground mt-2">
                                    Bu ayki toplam kullanım
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* 2. SATIR: İKİNCİL METRİKLER (KARBON & BÜTÇE) */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {/* Toplam Karbon */}
                        <Card className="col-span-2 bg-zinc-900 text-white border-none shadow-lg bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-zinc-300">
                                    <Leaf className="h-5 w-5" /> Toplam Karbon
                                    Ayak İzi
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-4xl font-bold">
                                            {stats.totalCarbon} kg
                                        </div>
                                        <div className="text-sm text-zinc-400 mt-1">
                                            Geçen aya göre{" "}
                                            <span
                                                className={
                                                    stats.carbonChange < 0
                                                        ? "text-green-400"
                                                        : "text-red-400"
                                                }
                                            >
                                                %{Math.abs(stats.carbonChange)}
                                            </span>{" "}
                                            değişim
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-3xl font-bold text-green-400">
                                            {stats.treesNeeded} 🌲
                                        </div>
                                        <div className="text-xs text-zinc-400">
                                            Telafi ağacı
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Toplam Harcama */}
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Toplam Harcama
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    ₺{stats.totalCost}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Tüm faturalar dahil
                                </p>
                            </CardContent>
                        </Card>

                        {/* Bütçe Hedefi */}
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Hedef Bütçe
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    ₺{stats.budgetLimit}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Belirlediğiniz sınır
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* 3. SATIR: GRAFİK ŞÖLENİ */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* SOL: Trend Grafiği (Line Chart) */}
                        <Card className="col-span-1 lg:col-span-2">
                            <CardHeader>
                                <CardTitle>Fatura Trend Analizi</CardTitle>
                                <CardDescription>
                                    Son 6 ayın harcama değişimi
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="h-[350px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={chartData}>
                                        <CartesianGrid
                                            strokeDasharray="3 3"
                                            vertical={false}
                                            stroke="#e5e7eb"
                                        />
                                        <XAxis
                                            dataKey="name"
                                            stroke="#888888"
                                            fontSize={12}
                                            tickLine={false}
                                            axisLine={false}
                                        />
                                        <YAxis
                                            stroke="#888888"
                                            fontSize={12}
                                            tickLine={false}
                                            axisLine={false}
                                            tickFormatter={(v) => `₺${v}`}
                                        />
                                        <Tooltip
                                            contentStyle={{
                                                borderRadius: "8px",
                                            }}
                                            formatter={(
                                                v: number | undefined
                                            ) => [`₺${v ?? 0}`]}
                                        />
                                        <Legend />
                                        <Line
                                            type="monotone"
                                            dataKey="elektrik"
                                            name="Elektrik"
                                            stroke={COLORS.elektrik}
                                            strokeWidth={3}
                                            dot={{ r: 4 }}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="su"
                                            name="Su"
                                            stroke={COLORS.su}
                                            strokeWidth={3}
                                            dot={{ r: 4 }}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="dogalgaz"
                                            name="Doğalgaz"
                                            stroke={COLORS.dogalgaz}
                                            strokeWidth={3}
                                            dot={{ r: 4 }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        {/* SAĞ: Dağılım Grafiği (Pie Chart) - YENİ */}
                        <Card className="col-span-1">
                            <CardHeader>
                                <CardTitle>Gider Dağılımı</CardTitle>
                                <CardDescription>
                                    Nereye ne kadar ödediniz?
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="h-[350px] relative">
                                {distributionData.length > 0 ? (
                                    <ResponsiveContainer
                                        width="100%"
                                        height="100%"
                                    >
                                        <PieChart>
                                            <Pie
                                                data={distributionData}
                                                innerRadius={60}
                                                outerRadius={100}
                                                paddingAngle={5}
                                                dataKey="value"
                                                nameKey="name"
                                            >
                                                {distributionData.map(
                                                    (entry, index) => (
                                                        <Cell
                                                            key={`cell-${index}`}
                                                            fill={getColorByName(
                                                                entry.name
                                                            )}
                                                        />
                                                    )
                                                )}
                                            </Pie>
                                            <Tooltip
                                                formatter={(
                                                    v: number | undefined
                                                ) => `₺${Math.round(v ?? 0)}`}
                                            />
                                            <Legend
                                                verticalAlign="bottom"
                                                height={36}
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="flex h-full items-center justify-center text-muted-foreground text-sm">
                                        Veri yok
                                    </div>
                                )}
                                {/* Ortaya İkon Koyma Trick'i */}
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none pb-8">
                                    <Wallet className="h-6 w-6 text-gray-400" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* 4. SATIR: KİŞİ BAŞINA DÜŞEN KULLANIM */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Kişi Başına Düşen Kullanım</CardTitle>
                            <CardDescription>
                                {stats.peopleCount} kişilik hanede kişi başı
                                tüketim
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="h-[300px]">
                            {perPersonChartData.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={perPersonChartData}>
                                        <CartesianGrid
                                            strokeDasharray="3 3"
                                            vertical={false}
                                        />
                                        <XAxis
                                            dataKey="name"
                                            stroke="#888888"
                                            fontSize={12}
                                            tickLine={false}
                                            axisLine={false}
                                        />
                                        <YAxis
                                            stroke="#888888"
                                            fontSize={12}
                                            tickLine={false}
                                            axisLine={false}
                                        />
                                        <Tooltip
                                            formatter={(
                                                value: number | undefined,
                                                payload: any
                                            ) => [
                                                `${(value ?? 0).toFixed(2)} ${
                                                    payload?.payload?.unit || ""
                                                }`,
                                                payload?.name || "",
                                            ]}
                                        />
                                        <Legend />
                                        <Bar
                                            dataKey="value"
                                            radius={[8, 8, 0, 0]}
                                            name="Kişi Başı Tüketim"
                                        >
                                            {perPersonChartData.map(
                                                (entry, index) => (
                                                    <Cell
                                                        key={`cell-${index}`}
                                                        fill={getColorByName(
                                                            entry.name
                                                        )}
                                                    />
                                                )
                                            )}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="flex h-full items-center justify-center text-muted-foreground text-sm">
                                    Veri yok
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="col-span-1 lg:col-span-2">
                            <SmartSuggestions
                                stats={stats}
                                userProfile={userProfile}
                            />
                        </div>

                        <Card className="col-span-1">
                            <CardHeader>
                                <CardTitle>Bütçe Kullanımı</CardTitle>
                                <CardDescription>
                                    {stats.budgetLimit && stats.budgetLimit > 0
                                        ? `Limitin %${Math.round(
                                              budgetUsage
                                          )}'si doldu`
                                        : "Bütçe limiti belirlenmemiş"}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="h-[200px]">
                                {budgetData.length > 0 ? (
                                    <ResponsiveContainer
                                        width="100%"
                                        height="100%"
                                    >
                                        <RadialBarChart
                                            innerRadius="80%"
                                            outerRadius="100%"
                                            barSize={10}
                                            data={budgetData}
                                            startAngle={180}
                                            endAngle={0}
                                        >
                                            <RadialBar
                                                background
                                                dataKey="value"
                                                cornerRadius={10}
                                            />
                                            <Legend
                                                iconSize={10}
                                                layout="vertical"
                                                verticalAlign="middle"
                                            />
                                            <Tooltip
                                                formatter={(
                                                    value: number | undefined,
                                                    payload: any
                                                ) => {
                                                    const name =
                                                        payload?.name || "";
                                                    const percentage = (
                                                        value ?? 0
                                                    ).toFixed(1);
                                                    return [
                                                        `${name}: %${percentage}`,
                                                        "",
                                                    ];
                                                }}
                                            />
                                        </RadialBarChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="flex h-full items-center justify-center text-muted-foreground text-sm">
                                        Bütçe limiti belirlenmemiş
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
