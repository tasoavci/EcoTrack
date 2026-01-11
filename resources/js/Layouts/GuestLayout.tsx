import { Link } from "@inertiajs/react";
import { Leaf } from "lucide-react";
import { ReactNode } from "react";

interface GuestLayoutProps {
    children: ReactNode;
}

export default function GuestLayout({ children }: GuestLayoutProps) {
    return (
        <div className="w-full lg:grid lg:min-h-screen h-full lg:grid-cols-2 object-cover dark:brightness-[0.2] dark:grayscale bg-[url('https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center">
            <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-background">
                <div className="mx-auto grid w-full max-w-[400px] gap-6">
                    <div className="flex flex-col space-y-2 text-center">
                        <div className="flex justify-center lg:hidden mb-4">
                            <Link
                                href="/"
                                className="flex items-center gap-2 font-bold text-xl"
                            >
                                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
                                    <Leaf className="h-5 w-5" />
                                </div>
                                EcoTrack
                            </Link>
                        </div>
                    </div>

                    {children}
                </div>
            </div>

            <div className="hidden bg-muted lg:block relative overflow-hidden bg-zinc-900">
                <div className="absolute inset-0 bg-gradient-to-br from-green-900/40 to-black/60 z-10" />
                <div className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale bg-[url('https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center" />

                <div className="absolute bottom-10 left-10 z-20 text-white p-6">
                    <div className="flex items-center gap-2 font-bold text-2xl mb-2">
                        <Leaf className="h-6 w-6 text-green-400" />
                        EcoTrack
                    </div>
                    <p className="text-lg text-zinc-300 max-w-md">
                        Enerji tüketiminizi takip edin, karbon ayak izinizi
                        azaltın ve geleceğe nefes olun.
                    </p>
                </div>
            </div>
        </div>
    );
}
