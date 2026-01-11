import GuestLayout from "@/Layouts/GuestLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";

export default function VerifyEmail({ status }: { status?: string }) {
    const { post, processing } = useForm({});

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("verification.send"));
    };

    return (
        <GuestLayout>
            <Head title="Email Doğrulama" />

            <Card>
                <CardHeader>
                    <CardTitle>Emailini Doğrula</CardTitle>
                    <CardDescription>
                        Kayıt olduğun için teşekkürler! Başlamadan önce, sana
                        gönderdiğimiz linke tıklayarak email adresini
                        doğrulayabilir misin?
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {status === "verification-link-sent" && (
                        <div className="mb-4 rounded-md bg-green-50 p-3 text-sm text-green-800">
                            Kayıt sırasında verdiğin adrese yeni bir doğrulama
                            linki gönderildi.
                        </div>
                    )}

                    <form onSubmit={submit} className="grid gap-4">
                        <Button className="w-full" disabled={processing}>
                            {processing
                                ? "Gönderiliyor..."
                                : "Doğrulama Emailini Tekrar Gönder"}
                        </Button>

                        <div className="text-center text-sm">
                            <Link
                                href={route("logout")}
                                method="post"
                                as="button"
                                className="text-primary underline-offset-4 hover:underline"
                            >
                                Çıkış Yap
                            </Link>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </GuestLayout>
    );
}
