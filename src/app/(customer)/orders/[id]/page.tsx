"use client";
import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { ordersApi } from "@/services/orderService";
import { Order } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ConfirmModal } from "@/components/ui/Modal";
import { TransferSlipUpload } from "@/components/forms/TransferSlipUpload";
import { Spinner } from "@/components/ui/Spinner";
import { formatPrice, formatDate } from "@/lib/utils";
import toast from "react-hot-toast";
import Image from "next/image";
import Link from "next/link";

interface Props {
    params: { id: string };
}

export default function OrderDetailPage({ params }: Props) {
    const { user } = useAuthStore();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [cancelOpen, setCancelOpen] = useState(false);
    const [canceling, setCanceling] = useState(false);

    useEffect(() => {
        if (!user) return;
        ordersApi
            .getOrder(user.id, params.id)
            .then(setOrder)
            .catch(() => toast.error("โหลดออเดอร์ไม่สำเร็จ"))
            .finally(() => setLoading(false));
    }, [user, params.id]);

    const handleCancel = async () => {
        if (!user || !order) return;
        setCanceling(true);
        try {
            const updated = await ordersApi.updateOrder(user.id, order.id, {
                status: "canceled",
            });
            setOrder(updated);
            toast.success("ยกเลิกคำสั่งซื้อแล้ว");
            setCancelOpen(false);
        } catch {
            toast.error("ยกเลิกไม่สำเร็จ");
        } finally {
            setCanceling(false);
        }
    };

    const handleSlipUpload = async (file: { filename: string; url: string }) => {
        if (!user || !order) return;
        const updated = await ordersApi.updateOrder(user.id, order.id, {
            transfer_slip: file,
        });
        setOrder(updated);
    };

    if (loading) {
        return (
            <div className="flex justify-center py-20">
                <Spinner size="lg" />
            </div>
        );
    }

    if (!order) {
        return <div className="py-20 text-center text-gray-500">ไม่พบคำสั่งซื้อ</div>;
    }

    return (
        <div className="mx-auto max-w-3xl px-4 py-8">
            <div className="mb-6 flex items-center gap-4">
                <Link href="/orders" className="text-sm text-blue-600 hover:underline">
                    ← กลับ
                </Link>
                <h1 className="text-2xl font-bold text-gray-900">รายละเอียดคำสั่งซื้อ</h1>
            </div>

            <div className="flex flex-col gap-5">
                {/* Status & Info */}
                <Card>
                    <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                            <p className="text-sm text-gray-500 font-mono mb-1">
                                #{order.id.slice(0, 8).toUpperCase()}
                            </p>
                            <Badge status={order.status} />
                            <p className="mt-2 text-sm text-gray-600">{formatDate(order.created_at)}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-gray-500">ยอดรวม</p>
                            <p className="text-2xl font-bold text-blue-600">
                                {formatPrice(order.total_paid)}
                            </p>
                        </div>
                    </div>
                    <hr className="my-4" />
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <p className="text-gray-500">ที่อยู่จัดส่ง</p>
                            <p className="font-medium text-gray-900">{order.address}</p>
                        </div>
                        <div>
                            <p className="text-gray-500">ติดต่อ</p>
                            <p className="font-medium text-gray-900">{order.contact}</p>
                        </div>
                    </div>
                </Card>

                {/* Products */}
                <Card>
                    <h2 className="mb-4 text-lg font-semibold text-gray-900">รายการสินค้า</h2>
                    <div className="flex flex-col gap-3">
                        {order.products.map(({ id, product, qty }) => (
                            <div key={id} className="flex items-center gap-3">
                                <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                                    {product?.images?.[0]?.url && (
                                        <Image
                                            src={product.images[0].url}
                                            alt={product.title}
                                            fill
                                            className="object-cover"
                                            sizes="48px"
                                        />
                                    )}
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-900 line-clamp-1">
                                        {product?.title}
                                    </p>
                                    <p className="text-xs text-gray-500">x{qty}</p>
                                </div>
                                <span className="text-sm font-medium">
                                    {formatPrice((product?.price ?? 0) * qty)}
                                </span>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Transfer slip */}
                <Card>
                    <h2 className="mb-4 text-lg font-semibold text-gray-900">
                        สลิปการชำระเงิน
                    </h2>
                    {order.transfer_slip ? (
                        <div className="relative h-48 w-full overflow-hidden rounded-lg border border-gray-200">
                            <Image
                                src={order.transfer_slip.url}
                                alt="transfer slip"
                                fill
                                className="object-contain"
                                sizes="600px"
                            />
                        </div>
                    ) : order.status === "waiting" ? (
                        <TransferSlipUpload onUpload={handleSlipUpload} />
                    ) : (
                        <p className="text-sm text-gray-500">ยังไม่มีสลิป</p>
                    )}
                </Card>

                {/* Actions */}
                {order.status === "waiting" && (
                    <div className="flex justify-end">
                        <Button variant="danger" onClick={() => setCancelOpen(true)}>
                            ยกเลิกคำสั่งซื้อ
                        </Button>
                    </div>
                )}
            </div>

            <ConfirmModal
                open={cancelOpen}
                onClose={() => setCancelOpen(false)}
                onConfirm={handleCancel}
                title="ยกเลิกคำสั่งซื้อ"
                message="คุณต้องการยกเลิกคำสั่งซื้อนี้ใช่หรือไม่?"
                loading={canceling}
            />
        </div>
    );
}
