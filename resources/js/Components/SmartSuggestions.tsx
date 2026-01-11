import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Lightbulb, AlertTriangle, CheckCircle } from "lucide-react";

interface SmartSuggestionsProps {
    stats: {
        totalCarbon: number;
        totalCost?: number;
        budgetLimit?: number | null;
    };
    userProfile: {
        has_insulation: boolean;
        people_count: number;
        square_meters?: number;
        heating_type?: string;
    };
}

export default function SmartSuggestions({
    stats,
    userProfile,
}: SmartSuggestionsProps) {
    const suggestions: Array<{
        title: string;
        desc: string;
        type: "warning" | "danger" | "success";
    }> = [];

    // Isı yalıtımı kontrolü
    if (userProfile && !userProfile.has_insulation) {
        suggestions.push({
            title: "Isı Yalıtımı Uyarısı",
            desc: "Evinizde yalıtım olmadığı için %35'e varan ısı kaybı yaşıyorsunuz. Mantolama ile faturanızı ayda ~800 TL düşürebilirsiniz.",
            type: "warning",
        });
    }

    // Karbon ayak izi kontrolü (sadece veri varsa)
    if (stats.totalCarbon > 0 && userProfile?.people_count) {
        const carbonPerPerson =
            stats.totalCarbon / (userProfile.people_count || 1);
        if (carbonPerPerson > 50) {
            suggestions.push({
                title: "Yüksek Karbon Ayak İzi",
                desc: "Kişi başı karbon salınımınız ortalamanın üzerinde. Gereksiz yanan ışıkları kapatmayı ve A++ cihazlar kullanmayı düşünün.",
                type: "danger",
            });
        } else if (carbonPerPerson > 0) {
            suggestions.push({
                title: "Harika Gidiyorsunuz!",
                desc: "Karbon ayak iziniz ideal seviyede. Gezegeni koruduğunuz için teşekkürler!",
                type: "success",
            });
        }
    }

    // Bütçe kontrolü
    if (
        stats.budgetLimit &&
        stats.totalCost &&
        stats.totalCost > stats.budgetLimit
    ) {
        const overBudget = stats.totalCost - stats.budgetLimit;
        suggestions.push({
            title: "Bütçe Aşıldı",
            desc: `Aylık bütçe limitinizi ${overBudget.toFixed(
                2
            )} TL aştınız. Tasarruf önerilerimize göz atın.`,
            type: "warning",
        });
    }

    // Öneri yoksa component'i render etme
    if (suggestions.length === 0) {
        return null;
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-yellow-500" />
                    Akıllı Tasarruf Asistanı
                </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
                {suggestions.map((item, index) => (
                    <div
                        key={index}
                        className={`p-4 rounded-lg border flex items-start gap-4 ${
                            item.type === "warning"
                                ? "bg-yellow-50 border-yellow-200"
                                : item.type === "danger"
                                ? "bg-red-50 border-red-200"
                                : "bg-green-50 border-green-200"
                        }`}
                    >
                        {item.type === "warning" && (
                            <AlertTriangle className="h-5 w-5 text-yellow-600 mt-1 flex-shrink-0" />
                        )}
                        {item.type === "danger" && (
                            <AlertTriangle className="h-5 w-5 text-red-600 mt-1 flex-shrink-0" />
                        )}
                        {item.type === "success" && (
                            <CheckCircle className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                        )}

                        <div className="flex-1">
                            <h4 className="font-semibold text-sm text-gray-900 mb-1">
                                {item.title}
                            </h4>
                            <p className="text-sm text-gray-600">{item.desc}</p>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
