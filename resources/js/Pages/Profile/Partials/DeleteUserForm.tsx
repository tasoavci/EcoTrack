import Modal from '@/Components/Modal';
import { useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/Components/ui/card';
import InputError from '@/Components/InputError';

interface DeleteUserFormProps {
    className?: string;
}

export default function DeleteUserForm({ className = '' }: DeleteUserFormProps) {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const passwordInput = useRef<HTMLInputElement>(null);

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
        clearErrors,
    } = useForm({
        password: '',
    });

    const confirmUserDeletion = () => {
        setConfirmingUserDeletion(true);
    };

    const deleteUser = (e: React.FormEvent) => {
        e.preventDefault();

        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current?.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);

        clearErrors();
        reset();
    };

    return (
        <Card className={className}>
            <CardHeader>
                <CardTitle>Hesabı Sil</CardTitle>
                <CardDescription>
                    Hesabınız silindiğinde, tüm kaynaklarınız ve verileriniz
                    kalıcı olarak silinecektir. Hesabınızı silmeden önce,
                    saklamak istediğiniz veri veya bilgileri indirin.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Button variant="destructive" onClick={confirmUserDeletion}>
                    Hesabı Sil
                </Button>

                <Modal show={confirmingUserDeletion} onClose={closeModal}>
                    <form onSubmit={deleteUser} className="p-6">
                        <h2 className="text-lg font-semibold text-foreground">
                            Hesabınızı silmek istediğinizden emin misiniz?
                        </h2>

                        <p className="mt-2 text-sm text-muted-foreground">
                            Hesabınız silindiğinde, tüm kaynaklarınız ve
                            verileriniz kalıcı olarak silinecektir. Hesabınızı
                            kalıcı olarak silmek istediğinizi onaylamak için
                            lütfen şifrenizi girin.
                        </p>

                        <div className="mt-6 space-y-2">
                            <Label htmlFor="password" className="sr-only">
                                Şifre
                            </Label>

                            <Input
                                id="password"
                                type="password"
                                name="password"
                                ref={passwordInput}
                                value={data.password}
                                onChange={(e) =>
                                    setData('password', e.target.value)
                                }
                                placeholder="Şifre"
                                autoFocus
                            />

                            <InputError
                                message={errors.password}
                                className="mt-1"
                            />
                        </div>

                        <div className="mt-6 flex justify-end gap-3">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={closeModal}
                            >
                                İptal
                            </Button>

                            <Button
                                type="submit"
                                variant="destructive"
                                disabled={processing}
                            >
                                {processing ? 'Siliniyor...' : 'Hesabı Sil'}
                            </Button>
                        </div>
                    </form>
                </Modal>
            </CardContent>
        </Card>
    );
}

