"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ordersApi } from "@/services/orderService";
import { useAuthStore } from "@/store/authStore";
import { Order, OrderStatus } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Select } from "@/components/ui/Select";
import { Pagination } from "@/components/ui/Pagination";
import { Spinner } from "@/components/ui/Spinner";
import { formatPrice, formatDate } from "@/lib/utils";
import toast from "react-hot-toast";
import { Package } from "lucide-react";

const STATUS_OPTIONS = [
    { label: "ทุกสถานะ", value: "" },
    { label: "รอดำเนินการ", value: "waiting" },
    { label: "กำลังจัดส่ง", value: "shipping" },
    { label: "สำเร็จ", value: "completed" },
    { label: "ยกเลิก", value: "canceled" },
];

export default function OrdersPage() {
    const { user } = useAuthStore();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(1);
    const [page, setPage] = useState(1);
    const [status, setStatus] = useState<string>("");

    useEffect(() => {
        if (!user) return;
        setLoading(true);
        ordersApi
            .getOrders({
                page,
                limit: 10,
                status: (status as OrderStatus) || undefined,
            })
            .then((res) => {
                setOrders(res.data ?? []);
                setTotalPages(res.pagination?.total_page ?? 1);
            })
            .catch(() => toast.error("โหลดออเดอร์ไม่สำเร็จ"))
            .finally(() => setLoading(false));
    }, [user, page, status]);

    return (
        <div className="mx-auto max-w-4xl px-4 py-8">
            <h1 className="mb-6 text-2xl font-bold text-gray-900">คำสั่งซื้อของฉัน</h1>

            {/* Filter */}
            <div className="mb-4 flex justify-end">
                <Select
                    options={STATUS_OPTIONS}
                    value={status}
                    onChange={(e) => {
                        setStatus(e.target.value);
                        setPage(1);
                    }}
                    className="w-48"
                />
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <Spinner size="lg" />
                </div>
            ) : orders.length === 0 ? (
                <div className="py-20 text-center">
                    <Package size={64} className="mx-auto mb-4 text-gray-300" />
                    <p className="text-gray-500">ยังไม่มีคำสั่งซื้อ</p>
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    {orders.map((order) => (
                        <Card key={order.id} className="flex items-center justify-between gap-4">
                            <div className="flex flex-1 flex-col gap-1">
                                <p className="text-sm text-gray-500 font-mono">#{order.id.slice(0, 8).toUpperCase()}</p>
                                <p className="text-sm text-gray-600">{formatDate(order.created_at)}</p>
                                <p className="text-xs text-gray-500">{order.products?.length ?? 0} รายการ</p>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                                <Badge status={order.status} />
                                <p className="font-bold text-blue-600">{formatPrice(order.total_paid)}</p>
                                <Link
                                    href={`/orders/${order.id}`}
                                    className="text-xs text-blue-600 hover:underline"
                                >
                                    ดูรายละเอียด →
                                </Link>
                            </div>
                        </Card>
                    ))}
                    <div className="mt-4 flex justify-center">
                        <Pagination
                            currentPage={page}
                            totalPages={totalPages}
                            onPageChange={setPage}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
