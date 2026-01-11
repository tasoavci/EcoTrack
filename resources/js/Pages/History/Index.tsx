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
import { Button } from "@/Components/ui/button";
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

interface HistoryProps {
    auth: {
        user: {
            name: string;
            email: string;
        };
    };
    consumptions: PaginatedData;
}

export default function History({ consumptions }: HistoryProps) {
    const { delete: destroy, processing } = useForm({});

    const handleDelete = (id: number) => {
        if (confirm("Bu kaydı silmek istediğinize emin misiniz?")) {
            destroy(route("consumption.destroy", id), {
                preserveScroll: true,
            });
        }
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
                    Fatura Geçmişi
                </h2>
            }
        >
            <Head title="Geçmiş" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white p-6 rounded-lg shadow">
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
                                                    disabled={processing}
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
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
