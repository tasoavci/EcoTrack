import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { Checkbox } from "@/Components/ui/checkbox";
import InputError from "@/Components/InputError";
import { Trash2 } from "lucide-react";

interface Consumption {
    id: number;
    date: string;
    type: "elektrik" | "su" | "dogalgaz";
    amount: number;
    cost: number;
}

interface PaginatedData {
    data: Consumption[];
    links: any[];
    current_page: number;
    last_page: number;
}

interface UserProfile {
    id: number;
    square_meters: number;
    people_count: number;
    heating_type: string;
    has_insulation: boolean;
    budget_limit: number | null;
}

interface SettingsProps {
    userProfile: UserProfile | null;
    consumptions: PaginatedData;
}

export default function Settings({ userProfile, consumptions }: SettingsProps) {
    const { delete: destroy, processing: deleting } = useForm({});

    const {
        data,
        setData,
        patch,
        processing,
        errors,
        reset,
    } = useForm({
        square_meters: userProfile?.square_meters?.toString() || "",
        people_count: userProfile?.people_count?.toString() || "",
        heating_type: userProfile?.heating_type || "",
        has_insulation: userProfile?.has_insulation || false,
        budget_limit: userProfile?.budget_limit?.toString() || "",
    });

    const handleDelete = (id: number) => {
        if (confirm("Bu kaydı silmek istediğinize emin misiniz?")) {
            destroy(route("consumption.destroy", id), {
                preserveScroll: true,
            });
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        patch(route("settings.update"), {
            preserveScroll: true,
            onSuccess: () => {
                // Form reset edilebilir veya mesaj gösterilebilir
            },
        });
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("tr-TR", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const formatType = (type: string) => {
        const types: Record<string, string> = {
            elektrik: "Elektrik",
            su: "Su",
            dogalgaz: "Doğalgaz",
        };
        return types[type] || type;
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="font-semibold text-xl text-gray-800">
                    Ayarlar
                </h2>
            }
        >
            <Head title="Ayarlar" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    {/* Profil Ayarları */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Profil Ayarları</CardTitle>
                            <CardDescription>
                                Ev bilgilerinizi ve hedeflerinizi güncelleyin
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="grid gap-6">
                                {/* Metrekare ve Kişi Sayısı */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label>Ev Büyüklüğü (m²)</Label>
                                        <Input
                                            type="number"
                                            placeholder="Örn: 100"
                                            value={data.square_meters}
                                            onChange={(e) =>
                                                setData("square_meters", e.target.value)
                                            }
                                        />
                                        <InputError message={errors.square_meters} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>Kişi Sayısı</Label>
                                        <Input
                                            type="number"
                                            placeholder="Örn: 3"
                                            value={data.people_count}
                                            onChange={(e) =>
                                                setData("people_count", e.target.value)
                                            }
                                        />
                                        <InputError message={errors.people_count} />
                                    </div>
                                </div>

                                {/* Isınma Türü */}
                                <div className="grid gap-2">
                                    <Label>Isınma Türü</Label>
                                    <Select
                                        value={data.heating_type || undefined}
                                        onValueChange={(val: string) =>
                                            setData("heating_type", val)
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Seçiniz" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="dogalgaz">
                                                Doğalgaz (Kombi)
                                            </SelectItem>
                                            <SelectItem value="merkezi">
                                                Merkezi Sistem
                                            </SelectItem>
                                            <SelectItem value="klima">
                                                Elektrik / Klima
                                            </SelectItem>
                                            <SelectItem value="soba">
                                                Soba / Katı Yakıt
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.heating_type} />
                                </div>

                                {/* Bütçe Hedefi */}
                                <div className="grid gap-2">
                                    <Label>Aylık Maksimum Fatura Hedefiniz (TL)</Label>
                                    <Input
                                        type="number"
                                        placeholder="Örn: 1500"
                                        value={data.budget_limit}
                                        onChange={(e) =>
                                            setData("budget_limit", e.target.value)
                                        }
                                    />
                                    <InputError message={errors.budget_limit} />
                                    <p className="text-xs text-muted-foreground">
                                        Bu limiti aşarsanız sizi uyaracağız.
                                    </p>
                                </div>

                                {/* Yalıtım Checkbox */}
                                <div className="flex items-center space-x-2 border p-4 rounded-md">
                                    <Checkbox
                                        id="insulation"
                                        checked={data.has_insulation}
                                        onCheckedChange={(checked: boolean | "indeterminate") =>
                                            setData("has_insulation", checked === true)
                                        }
                                    />
                                    <label
                                        htmlFor="insulation"
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                    >
                                        Binada ısı yalıtımı (mantolama) var
                                    </label>
                                </div>

                                <Button type="submit" disabled={processing}>
                                    {processing ? "Kaydediliyor..." : "Kaydet"}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Fatura Geçmişi */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Fatura Geçmişi</CardTitle>
                            <CardDescription>
                                Kayıtlı fatura geçmişiniz
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {consumptions.data.length > 0 ? (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Tarih</TableHead>
                                            <TableHead>Tür</TableHead>
                                            <TableHead>Miktar</TableHead>
                                            <TableHead>Tutar</TableHead>
                                            <TableHead className="text-right">
                                                İşlem
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {consumptions.data.map((item) => (
                                            <TableRow key={item.id}>
                                                <TableCell>
                                                    {formatDate(item.date)}
                                                </TableCell>
                                                <TableCell className="capitalize font-medium">
                                                    {formatType(item.type)}
                                                </TableCell>
                                                <TableCell>
                                                    {item.amount.toFixed(2)}{" "}
                                                    {item.type === "elektrik"
                                                        ? "kWh"
                                                        : "m³"}
                                                </TableCell>
                                                <TableCell>
                                                    ₺{item.cost.toFixed(2)}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() =>
                                                            handleDelete(item.id)
                                                        }
                                                        disabled={deleting}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            ) : (
                                <p className="text-center py-8 text-gray-500">
                                    Henüz kayıt bulunmamaktadır.
                                </p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

