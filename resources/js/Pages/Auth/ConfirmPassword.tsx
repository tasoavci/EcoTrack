import GuestLayout from "@/Layouts/GuestLayout";
import { Head, useForm } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import InputError from "@/Components/InputError";

export default function ConfirmPassword() {
    const { data, setData, post, processing, errors, reset } = useForm({
        password: "",
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        post(route("password.confirm"), {
            onFinish: () => reset("password"),
        });
    };

    return (
        <GuestLayout>
            <Head title="Şifre Onayı" />

            <Card>
                <CardHeader>
                    <CardTitle>Güvenli Alan</CardTitle>
                    <CardDescription>
                        Bu işlem güvenli bir alana erişim gerektiriyor. Lütfen
                        devam etmeden önce şifrenizi doğrulayın.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={submit} className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="password">Mevcut Şifre</Label>
                            <Input
                                id="password"
                                type="password"
                                value={data.password}
                                onChange={(e) =>
                                    setData("password", e.target.value)
                                }
                                autoFocus
                            />
                            <InputError message={errors.password} />
                        </div>

                        <Button className="w-full" disabled={processing}>
                            {processing
                                ? "Onaylanıyor..."
                                : "Onayla ve Devam Et"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </GuestLayout>
    );
}
