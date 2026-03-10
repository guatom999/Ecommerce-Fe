"use client";
import Link from "next/link";
import Image from "next/image";
import { useCartStore } from "@/store/cartStore";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { formatPrice } from "@/lib/utils";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";

export default function CartPage() {
    const { items, remove, updateQty, clear, totalPrice } = useCartStore();

    if (items.length === 0) {
        return (
            <div className="mx-auto max-w-3xl px-4 py-20 text-center">
                <ShoppingBag size={64} className="mx-auto mb-4 text-gray-300" />
                <h2 className="text-xl font-semibold text-gray-600">ตะกร้าสินค้าว่างเปล่า</h2>
                <p className="mt-2 text-gray-500">เพิ่มสินค้าลงตะกร้าก่อนนะครับ</p>
                <Link
                    href="/products"
                    className="mt-6 inline-block rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
                >
                    ดูสินค้า
                </Link>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-4xl px-4 py-8">
            <h1 className="mb-6 text-2xl font-bold text-gray-900">ตะกร้าสินค้า</h1>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Cart items */}
                <div className="flex flex-col gap-4 lg:col-span-2">
                    {items.map(({ product, qty }) => (
                        <Card key={product.id} className="flex gap-4">
                            <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                                {product.images?.[0]?.url ? (
                                    <Image
                                        src={product.images[0].url}
                                        alt={product.title}
                                        fill
                                        className="object-cover"
                                        sizes="80px"
                                    />
                                ) : (
                                    <div className="flex h-full items-center justify-center text-gray-400 text-xs">
                                        ไม่มีรูป
                                    </div>
                                )}
                            </div>
                            <div className="flex flex-1 flex-col gap-2">
                                <div className="flex items-start justify-between">
                                    <Link href={`/products/${product.id}`} className="font-medium text-gray-900 hover:text-blue-600 line-clamp-2">
                                        {product.title}
                                    </Link>
                                    <button
                                        onClick={() => remove(product.id)}
                                        className="text-gray-400 hover:text-red-500"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                                <span className="text-sm text-blue-600 font-semibold">
                                    {formatPrice(product.price)}
                                </span>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => updateQty(product.id, qty - 1)}
                                        disabled={qty <= 1}
                                        className="h-7 w-7 rounded border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                                    >
                                        <Minus size={12} className="mx-auto" />
                                    </button>
                                    <span className="w-8 text-center text-sm">{qty}</span>
                                    <button
                                        onClick={() => updateQty(product.id, qty + 1)}
                                        className="h-7 w-7 rounded border border-gray-300 text-gray-600 hover:bg-gray-100"
                                    >
                                        <Plus size={12} className="mx-auto" />
                                    </button>
                                    <span className="ml-auto text-sm text-gray-500">
                                        = {formatPrice(product.price * qty)}
                                    </span>
                                </div>
                            </div>
                        </Card>
                    ))}
                    <div className="flex justify-end">
                        <Button variant="ghost" size="sm" onClick={clear} className="text-red-500 hover:text-red-700">
                            <Trash2 size={14} /> ล้างตะกร้า
                        </Button>
                    </div>
                </div>

                {/* Summary */}
                <div>
                    <Card>
                        <h2 className="mb-4 text-lg font-semibold text-gray-900">สรุปรายการ</h2>
                        <div className="flex flex-col gap-2 text-sm">
                            {items.map(({ product, qty }) => (
                                <div key={product.id} className="flex justify-between text-gray-600">
                                    <span className="line-clamp-1 flex-1 pr-2">{product.title} x{qty}</span>
                                    <span>{formatPrice(product.price * qty)}</span>
                                </div>
                            ))}
                            <hr className="my-2" />
                            <div className="flex justify-between font-bold text-gray-900">
                                <span>ยอดรวม</span>
                                <span className="text-blue-600">{formatPrice(totalPrice())}</span>
                            </div>
                        </div>
                        <Link href="/checkout">
                            <Button className="mt-6 w-full" size="lg">
                                สั่งซื้อ
                            </Button>
                        </Link>
                    </Card>
                </div>
            </div>
        </div>
    );
}
