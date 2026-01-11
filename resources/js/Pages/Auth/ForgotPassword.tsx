import GuestLayout from "@/Layouts/GuestLayout";
import { Head, useForm, Link } from "@inertiajs/react";
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

export default function ForgotPassword({ status }: { status?: string }) {
    const { data, setData, post, processing, errors } = useForm({
        email: "",
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("password.email"));
    };

    return (
        <GuestLayout>
            <Head title="Şifre Sıfırla" />

            <Card>
                <CardHeader>
                    <CardTitle>Şifreni mi Unuttun?</CardTitle>
                    <CardDescription>
                        Sorun değil. Email adresini gir, sana şifreni sıfırlaman
                        için bir bağlantı gönderelim.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {status && (
                        <div className="mb-4 rounded-md bg-green-50 p-3 text-sm text-green-800">
                            {status}
                        </div>
                    )}

                    <form onSubmit={submit} className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={data.email}
                                onChange={(e) =>
                                    setData("email", e.target.value)
                                }
                                autoFocus
                            />
                            <InputError message={errors.email} />
                        </div>

                        <Button className="w-full" disabled={processing}>
                            {processing
                                ? "Gönderiliyor..."
                                : "Sıfırlama Bağlantısı Gönder"}
                        </Button>

                        <div className="text-center text-sm">
                            <Link
                                href={route("login")}
                                className="text-primary underline-offset-4 hover:underline"
                            >
                                Giriş ekranına dön
                            </Link>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </GuestLayout>
    );
}
