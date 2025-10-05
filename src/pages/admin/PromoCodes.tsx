import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Plus, Edit, BarChart3, Power, Trash2 } from "lucide-react";
import { PROMO_CODES } from "@/types/booking";

export const PromoCodes = () => {
  const [promoUsage, setPromoUsage] = useState<Record<string, number>>({});

  useEffect(() => {
    const usage = localStorage.getItem("admin_promo_usage");
    if (usage) {
      setPromoUsage(JSON.parse(usage));
    }
  }, []);

  const getStatusBadge = (code: string) => {
    const promo = PROMO_CODES.find((p) => p.code === code);
    if (!promo) return null;

    const usage = promoUsage[code] || 0;
    const percentage = (usage / promo.usageLimit) * 100;

    const now = new Date();
    const endDate = new Date(promo.validUntil);

    if (!promo.isActive) {
      return <Badge variant="secondary">ปิดใช้งาน</Badge>;
    }
    if (now > endDate) {
      return <Badge variant="destructive">หมดอายุ</Badge>;
    }
    if (percentage >= 90) {
      return <Badge variant="secondary" className="bg-accent">ใกล้หมด</Badge>;
    }
    return <Badge variant="default" className="bg-success">ใช้งานได้</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">จัดการโค้ดส่วนลด</h2>
          <p className="text-muted-foreground">
            จัดการโค้ดส่วนลดและติดตามการใช้งาน
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            View Report
          </Button>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Create Promo Code
          </Button>
        </div>
      </div>

      {/* Promo Codes List */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {PROMO_CODES.map((promo) => {
          const usage = promoUsage[promo.code] || 0;
          const percentage = (usage / promo.usageLimit) * 100;
          const totalDiscount = usage * promo.value; // Simplified calculation

          return (
            <Card key={promo.code} className="hover:border-primary/40 transition-colors">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-xl font-spooky">
                      {promo.code}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {promo.description}
                    </p>
                  </div>
                  {getStatusBadge(promo.code)}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-primary">
                      {promo.type === "percentage" ? `${promo.value}%` : `฿${promo.value}`}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      ส่วนลด
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {usage} / {promo.usageLimit}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      ใช้งาน
                    </p>
                  </div>
                </div>

                <div className="space-y-1">
                  <Progress value={percentage} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    {percentage >= 90 && (
                      <span className="text-accent font-medium">⚠️ ใกล้ครบจำนวนแล้ว</span>
                    )}
                  </p>
                </div>

                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">ส่วนลดรวม:</span>
                    <span className="font-semibold text-destructive">
                      -฿{totalDiscount.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">ยอดขั้นต่ำ:</span>
                    <span>฿{promo.minPurchase.toLocaleString()}</span>
                  </div>
                  {promo.maxDiscount && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">ลดสูงสุด:</span>
                      <span>฿{promo.maxDiscount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">ใช้ได้ถึง:</span>
                    <span>{new Date(promo.validUntil).toLocaleDateString("th-TH")}</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1 gap-1">
                    <Edit className="h-3 w-3" />
                    แก้ไข
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 gap-1">
                    <BarChart3 className="h-3 w-3" />
                    รายงาน
                  </Button>
                  <Button
                    variant={promo.isActive ? "outline" : "default"}
                    size="sm"
                    className="gap-1"
                  >
                    <Power className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1 text-destructive hover:bg-destructive hover:text-destructive-foreground"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
