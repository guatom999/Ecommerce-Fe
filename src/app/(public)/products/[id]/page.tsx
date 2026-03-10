"use client";
import { useEffect, useState } from "react";
import { productsApi } from "@/services/productService";
import { useCartStore } from "@/store/cartStore";
import { ImageGallery } from "@/components/ui/ImageGallery";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { Product } from "@/types";
import { formatPrice } from "@/lib/utils";
import toast from "react-hot-toast";
import { ShoppingCart } from "lucide-react";
import { useAuthStore } from "@/store/authStore";

interface Props {
    params: { id: string };
}

export default function ProductDetailPage({ params }: Props) {
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [qty, setQty] = useState(1);
    const { isAuthenticated } = useAuthStore();
    const add = useCartStore((s) => s.add);

    useEffect(() => {
        productsApi
            .getProduct(params.id)
            .then(setProduct)
            .catch(() => toast.error("โหลดสินค้าไม่สำเร็จ"))
            .finally(() => setLoading(false));
    }, [params.id]);

    if (loading) {
        return (
            <div className="flex justify-center py-20">
                <Spinner size="lg" />
            </div>
        );
    }

    if (!product) {
        return (
            <div className="py-20 text-center text-gray-500">ไม่พบสินค้า</div>
        );
    }

    const handleAddToCart = () => {
        if (!isAuthenticated) {
            toast.error("กรุณาเข้าสู่ระบบก่อนเพิ่มสินค้าลงตะกร้า");
            return;
        }
        add(product, qty);
        toast.success(`เพิ่ม "${product.title}" x${qty} ลงตะกร้าแล้ว`);
    };

    return (
        <div className="mx-auto max-w-6xl px-4 py-10">
            <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
                {/* Gallery */}
                <ImageGallery images={product.images} title={product.title} />

                {/* Info */}
                <div className="flex flex-col gap-4">
                    <span className="w-fit rounded-full bg-blue-100 px-3 py-1 text-xs text-blue-700 font-medium">
                        {product.category.title}
                    </span>
                    <h1 className="text-3xl font-bold text-gray-900">{product.title}</h1>
                    <p className="text-2xl font-semibold text-blue-600">
                        {formatPrice(product.price)}
                    </p>
                    <p className="text-gray-600 leading-relaxed">{product.description}</p>

                    {/* Qty */}
                    <div className="flex items-center gap-3">
                        <label className="text-sm font-medium text-gray-700">จำนวน:</label>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setQty((q) => Math.max(1, q - 1))}
                                className="h-8 w-8 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-100"
                            >
                                -
                            </button>
                            <span className="w-8 text-center text-sm font-medium">{qty}</span>
                            <button
                                onClick={() => setQty((q) => q + 1)}
                                className="h-8 w-8 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-100"
                            >
                                +
                            </button>
                        </div>
                    </div>

                    <Button size="lg" onClick={handleAddToCart} className="mt-2">
                        <ShoppingCart size={18} /> เพิ่มลงตะกร้า
                    </Button>
                </div>
            </div>
        </div>
    );
}
