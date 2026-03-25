"use client";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";
import { ordersApi } from "@/services/orderService";
import { OrderForm, OrderFormData } from "@/components/forms/OrderForm";
import { Card } from "@/components/ui/Card";
import { formatPrice } from "@/lib/utils";
import { useState } from "react";
import toast from "react-hot-toast";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";

export default function CheckoutPage() {
    const { items, totalPrice, clear } = useCartStore();
    const { user } = useAuthStore();
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    if (items.length === 0) {
        return (
            <div className="mx-auto max-w-3xl px-4 py-20 text-center">
                <ShoppingBag size={64} className="mx-auto mb-4 text-gray-300" />
                <h2 className="text-xl font-semibold text-gray-600">ไม่มีสินค้าในตะกร้า</h2>
                <Link href="/products" className="mt-6 inline-block rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700">
                    ดูสินค้า
                </Link>
            </div>
        );
    }

    const handleSubmit = async (data: OrderFormData) => {
        setLoading(true);
        try {
            const order = await ordersApi.createOrder({
                address: data.address,
                contact: data.contact,
                products: items.map(({ product, qty }) => ({ product: { id: product.id, price: product.price }, qty })),
            });
            clear();
            toast.success("สั่งซื้อสำเร็จ!");
            router.push(`/orders/${order.id}`);
        } catch {
            toast.error("สั่งซื้อไม่สำเร็จ");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mx-auto max-w-4xl px-4 py-8">
            <h1 className="mb-6 text-2xl font-bold text-gray-900">ชำระเงิน</h1>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Form */}
                <Card>
                    <h2 className="mb-4 text-lg font-semibold text-gray-900">ข้อมูลการจัดส่ง</h2>
                    <OrderForm onSubmit={handleSubmit} loading={loading} />
                </Card>

                {/* Order summary */}
                <Card>
                    <h2 className="mb-4 text-lg font-semibold text-gray-900">สรุปคำสั่งซื้อ</h2>
                    <div className="flex flex-col gap-3">
                        {items.map(({ product, qty }) => (
                            <div key={product.id} className="flex items-center gap-3">
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-900 line-clamp-1">
                                        {product.title}
                                    </p>
                                    <p className="text-xs text-gray-500">x{qty}</p>
                                </div>
                                <span className="text-sm font-medium text-gray-900">
                                    {formatPrice(product.price * qty)}
                                </span>
                            </div>
                        ))}
                        <hr />
                        <div className="flex justify-between">
                            <span className="font-bold text-gray-900">ยอดรวมทั้งหมด</span>
                            <span className="text-xl font-bold text-blue-600">
                                {formatPrice(totalPrice())}
                            </span>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}
