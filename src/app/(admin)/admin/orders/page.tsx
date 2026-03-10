"use client";
import { useState, useEffect, useCallback } from "react";
import { ordersApi } from "@/services/orderService";
import { Order, OrderStatus } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { Input } from "@/components/ui/Input";
import { Pagination } from "@/components/ui/Pagination";
import { Spinner } from "@/components/ui/Spinner";
import { Modal } from "@/components/ui/Modal";
import { formatPrice, formatDate } from "@/lib/utils";
import toast from "react-hot-toast";
import Image from "next/image";
import { Eye } from "lucide-react";
import { useAuthStore } from "@/store/authStore";

const STATUS_OPTIONS = [
    { label: "ทุกสถานะ", value: "" },
    { label: "รอดำเนินการ", value: "waiting" },
    { label: "กำลังจัดส่ง", value: "shipping" },
    { label: "สำเร็จ", value: "completed" },
    { label: "ยกเลิก", value: "canceled" },
];

const UPDATE_STATUS_OPTIONS: { label: string; value: OrderStatus }[] = [
    { label: "รอดำเนินการ", value: "waiting" },
    { label: "กำลังจัดส่ง", value: "shipping" },
    { label: "สำเร็จ", value: "completed" },
    { label: "ยกเลิก", value: "canceled" },
];

export default function AdminOrdersPage() {
    const { user } = useAuthStore();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(1);
    const [page, setPage] = useState(1);
    const [statusFilter, setStatusFilter] = useState("");
    const [search, setSearch] = useState("");
    const [searchInput, setSearchInput] = useState("");
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

    const fetchOrders = useCallback(async () => {
        setLoading(true);
        try {
            const res = await ordersApi.getOrders({
                page,
                limit: 10,
                status: (statusFilter as OrderStatus) || undefined,
                search: search || undefined,
            });
            setOrders(res.data ?? []);
            setTotalPages(res.pagination?.total_page ?? 1);
        } catch {
            toast.error("โหลดออเดอร์ไม่สำเร็จ");
        } finally {
            setLoading(false);
        }
    }, [page, statusFilter, search]);

    useEffect(() => {
        fetchOrders();
    }, [page, statusFilter, search, fetchOrders]);

    const handleUpdateStatus = async (order: Order, status: OrderStatus) => {
        setUpdatingStatus(order.id);
        try {
            const updated = await ordersApi.updateOrder(order.user_id, order.id, {
                status,
            });
            setOrders((prev) =>
                prev.map((o) => (o.id === updated.id ? updated : o))
            );
            if (selectedOrder?.id === order.id) setSelectedOrder(updated);
            toast.success("อัพเดทสถานะสำเร็จ");
        } catch {
            toast.error("อัพเดทสถานะไม่สำเร็จ");
        } finally {
            setUpdatingStatus(null);
        }
    };

    return (
        <div>
            <h1 className="mb-6 text-2xl font-bold text-gray-900">จัดการคำสั่งซื้อ</h1>

            {/* Filters */}
            <div className="mb-4 flex flex-col gap-3 sm:flex-row">
                <form
                    className="flex flex-1 gap-2"
                    onSubmit={(e) => {
                        e.preventDefault();
                        setSearch(searchInput);
                        setPage(1);
                    }}
                >
                    <Input
                        placeholder="ค้นหา..."
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        className="flex-1"
                    />
                    <button
                        type="submit"
                        className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
                    >
                        ค้นหา
                    </button>
                </form>
                <Select
                    options={STATUS_OPTIONS}
                    value={statusFilter}
                    onChange={(e) => {
                        setStatusFilter(e.target.value);
                        setPage(1);
                    }}
                    className="w-full sm:w-48"
                />
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <Spinner size="lg" />
                </div>
            ) : orders.length === 0 ? (
                <p className="py-20 text-center text-gray-500">ไม่พบคำสั่งซื้อ</p>
            ) : (
                <>
                    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
                        <table className="min-w-full text-sm">
                            <thead className="bg-gray-50 text-gray-600">
                                <tr>
                                    <th className="px-4 py-3 text-left">Order ID</th>
                                    <th className="px-4 py-3 text-left">วันที่</th>
                                    <th className="px-4 py-3 text-left">สถานะ</th>
                                    <th className="px-4 py-3 text-right">ยอดรวม</th>
                                    <th className="px-4 py-3 text-center">อัพเดทสถานะ</th>
                                    <th className="px-4 py-3 text-center">ดู</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {orders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 font-mono text-gray-900">
                                            #{order.id.slice(0, 8).toUpperCase()}
                                        </td>
                                        <td className="px-4 py-3 text-gray-500">
                                            {formatDate(order.created_at)}
                                        </td>
                                        <td className="px-4 py-3">
                                            <Badge status={order.status} />
                                        </td>
                                        <td className="px-4 py-3 text-right font-medium text-blue-600">
                                            {formatPrice(order.total_paid)}
                                        </td>
                                        <td className="px-4 py-3">
                                            <Select
                                                options={UPDATE_STATUS_OPTIONS}
                                                value={order.status}
                                                onChange={(e) =>
                                                    handleUpdateStatus(order, e.target.value as OrderStatus)
                                                }
                                                disabled={updatingStatus === order.id}
                                                className="text-xs"
                                            />
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => setSelectedOrder(order)}
                                            >
                                                <Eye size={13} />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="mt-6 flex justify-center">
                        <Pagination
                            currentPage={page}
                            totalPages={totalPages}
                            onPageChange={(p) => setPage(p)}
                        />
                    </div>
                </>
            )}

            {/* Order detail modal */}
            {selectedOrder && (
                <Modal
                    open={!!selectedOrder}
                    onClose={() => setSelectedOrder(null)}
                    title={`Order #${selectedOrder.id.slice(0, 8).toUpperCase()}`}
                    className="max-w-lg"
                >
                    <div className="flex flex-col gap-4">
                        <div className="grid grid-cols-2 gap-3 text-sm">
                            <div>
                                <p className="text-gray-500">สถานะ</p>
                                <Badge status={selectedOrder.status} />
                            </div>
                            <div>
                                <p className="text-gray-500">ยอดรวม</p>
                                <p className="font-bold text-blue-600">
                                    {formatPrice(selectedOrder.total_paid)}
                                </p>
                            </div>
                            <div>
                                <p className="text-gray-500">ที่อยู่</p>
                                <p className="font-medium">{selectedOrder.address}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">ติดต่อ</p>
                                <p className="font-medium">{selectedOrder.contact}</p>
                            </div>
                        </div>
                        {selectedOrder.transfer_slip && (
                            <div>
                                <p className="mb-2 text-sm text-gray-500">สลิปการชำระเงิน</p>
                                <div className="relative h-40 w-full overflow-hidden rounded-lg border border-gray-200">
                                    <Image
                                        src={selectedOrder.transfer_slip.url}
                                        alt="slip"
                                        fill
                                        className="object-contain"
                                        sizes="400px"
                                    />
                                </div>
                            </div>
                        )}
                        <div>
                            <p className="mb-2 text-sm text-gray-500">รายการสินค้า</p>
                            <div className="flex flex-col gap-2">
                                {selectedOrder.products.map(({ id, product, qty }) => (
                                    <div key={id} className="flex justify-between text-sm">
                                        <span className="line-clamp-1 flex-1 pr-2 text-gray-900">
                                            {product?.title} x{qty}
                                        </span>
                                        <span className="text-gray-600">
                                            {formatPrice((product?.price ?? 0) * qty)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
}
