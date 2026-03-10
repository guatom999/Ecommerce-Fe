"use client";
import { useEffect, useState } from "react";
import { productsApi } from "@/services/productService";
import { ordersApi } from "@/services/orderService";
import { Card } from "@/components/ui/Card";
import { Package, ShoppingBag, Clock, CheckCircle, XCircle, Truck } from "lucide-react";

interface Stats {
    totalProducts: number;
    totalOrders: number;
    waiting: number;
    shipping: number;
    completed: number;
    canceled: number;
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<Stats>({
        totalProducts: 0,
        totalOrders: 0,
        waiting: 0,
        shipping: 0,
        completed: 0,
        canceled: 0,
    });

    useEffect(() => {
        const loadStats = async () => {
            try {
                const [productsRes, ordersRes, waiting, shipping, completed, canceled] =
                    await Promise.allSettled([
                        productsApi.getProducts({ page: 1, limit: 1 }),
                        ordersApi.getOrders({ page: 1, limit: 1 }),
                        ordersApi.getOrders({ page: 1, limit: 1, status: "waiting" }),
                        ordersApi.getOrders({ page: 1, limit: 1, status: "shipping" }),
                        ordersApi.getOrders({ page: 1, limit: 1, status: "completed" }),
                        ordersApi.getOrders({ page: 1, limit: 1, status: "canceled" }),
                    ]);

                setStats({
                    totalProducts:
                        productsRes.status === "fulfilled"
                            ? productsRes.value.pagination?.total_item ?? 0
                            : 0,
                    totalOrders:
                        ordersRes.status === "fulfilled"
                            ? ordersRes.value.pagination?.total_item ?? 0
                            : 0,
                    waiting:
                        waiting.status === "fulfilled"
                            ? waiting.value.pagination?.total_item ?? 0
                            : 0,
                    shipping:
                        shipping.status === "fulfilled"
                            ? shipping.value.pagination?.total_item ?? 0
                            : 0,
                    completed:
                        completed.status === "fulfilled"
                            ? completed.value.pagination?.total_item ?? 0
                            : 0,
                    canceled:
                        canceled.status === "fulfilled"
                            ? canceled.value.pagination?.total_item ?? 0
                            : 0,
                });
            } catch { }
        };
        loadStats();
    }, []);

    const summaryCards = [
        { label: "สินค้าทั้งหมด", value: stats.totalProducts, icon: Package, color: "text-blue-600 bg-blue-50" },
        { label: "คำสั่งซื้อทั้งหมด", value: stats.totalOrders, icon: ShoppingBag, color: "text-purple-600 bg-purple-50" },
        { label: "รอดำเนินการ", value: stats.waiting, icon: Clock, color: "text-amber-600 bg-amber-50" },
        { label: "กำลังจัดส่ง", value: stats.shipping, icon: Truck, color: "text-blue-600 bg-blue-50" },
        { label: "สำเร็จ", value: stats.completed, icon: CheckCircle, color: "text-green-600 bg-green-50" },
        { label: "ยกเลิก", value: stats.canceled, icon: XCircle, color: "text-red-600 bg-red-50" },
    ];

    return (
        <div>
            <h1 className="mb-6 text-2xl font-bold text-gray-900">แดชบอร์ด</h1>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {summaryCards.map(({ label, value, icon: Icon, color }) => (
                    <Card key={label} className="flex items-center gap-4">
                        <div className={`rounded-xl p-3 ${color}`}>
                            <Icon size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">{label}</p>
                            <p className="text-2xl font-bold text-gray-900">{value}</p>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
