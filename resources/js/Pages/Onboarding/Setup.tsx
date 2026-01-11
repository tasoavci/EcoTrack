import { useForm, Head } from "@inertiajs/react";
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
import GuestLayout from "@/Layouts/GuestLayout";

export default function Setup() {
    const { data, setData, post, processing, errors } = useForm({
        square_meters: "",
        people_count: "",
        heating_type: "",
        has_insulation: false,
        budget_limit: "",
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("onboarding.store"));
    };

    return (
        <GuestLayout>
            <Head title="Profil Kurulumu" />

            <div className="grid gap-2 text-center mb-4">
                <h1 className="text-2xl font-bold">Hoş Geldiniz!</h1>
                <p className="text-muted-foreground text-sm">
                    Size özel tasarruf önerileri sunabilmemiz için evinizi
                    tanımamız gerekiyor.
                </p>
            </div>

            <form onSubmit={submit} className="grid gap-4">
                {/* Metrekare ve Kişi Sayısı */}
                <div className="grid grid-cols-2 gap-4">
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

                {/* Isınma Türü (Select) */}
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

                <Button
                    type="submit"
                    className="w-full mt-2"
                    disabled={processing}
                >
                    Analizi Başlat
                </Button>
            </form>
        </GuestLayout>
    );
}
