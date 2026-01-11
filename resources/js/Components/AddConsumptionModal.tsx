import { useState } from "react";
import { useForm } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/Components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import InputError from "@/Components/InputError";
import { PlusCircle } from "lucide-react";

export default function AddConsumptionModal() {
    const [open, setOpen] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        type: "",
        amount: "",
        cost: "",
        date: new Date().toISOString().split("T")[0], // Bugünün tarihi
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("consumption.store"), {
            onSuccess: () => {
                setOpen(false); // Modalı kapat
                reset(); // Formu temizle
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="gap-2">
                    <PlusCircle className="h-4 w-4" />
                    Yeni Veri Ekle
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Fatura/Tüketim Ekle</DialogTitle>
                    <DialogDescription>
                        Fatura detaylarını girerek karbon ayak izinizi
                        güncelleyin.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={submit} className="grid gap-4 py-4">
                    {/* Tür Seçimi */}
                    <div className="grid gap-2">
                        <Label>Tüketim Türü</Label>
                        <Select
                            value={data.type || undefined}
                            onValueChange={(val: string) =>
                                setData("type", val)
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Seçiniz (Elektrik/Su/Doğalgaz)" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="elektrik">
                                    Elektrik (kWh)
                                </SelectItem>
                                <SelectItem value="su">Su (m³)</SelectItem>
                                <SelectItem value="dogalgaz">
                                    Doğalgaz (m³)
                                </SelectItem>
                            </SelectContent>
                        </Select>
                        <InputError message={errors.type} />
                    </div>

                    {/* Miktar */}
                    <div className="grid gap-2">
                        <Label>
                            Miktar {data.type === "elektrik" ? "(kWh)" : "(m³)"}
                        </Label>
                        <Input
                            type="number"
                            step="0.01"
                            placeholder="Örn: 150"
                            value={data.amount}
                            onChange={(e) => setData("amount", e.target.value)}
                        />
                        <InputError message={errors.amount} />
                    </div>

                    {/* Tutar */}
                    <div className="grid gap-2">
                        <Label>Fatura Tutarı (TL)</Label>
                        <Input
                            type="number"
                            step="0.01"
                            placeholder="Örn: 450"
                            value={data.cost}
                            onChange={(e) => setData("cost", e.target.value)}
                        />
                        <InputError message={errors.cost} />
                    </div>

                    {/* Tarih */}
                    <div className="grid gap-2">
                        <Label>Fatura Tarihi</Label>
                        <Input
                            type="date"
                            value={data.date}
                            onChange={(e) => setData("date", e.target.value)}
                        />
                        <InputError message={errors.date} />
                    </div>

                    <DialogFooter>
                        <Button type="submit" disabled={processing}>
                            Kaydet
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
