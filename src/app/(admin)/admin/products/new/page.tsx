"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { productsApi } from "@/services/productService";
import { ProductForm } from "@/components/forms/ProductForm";
import { Card } from "@/components/ui/Card";
import { useState } from "react";
import toast from "react-hot-toast";

export default function NewProductPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (data: Parameters<typeof productsApi.createProduct>[0]) => {
        setLoading(true);
        try {
            await productsApi.createProduct(data);
            toast.success("สร้างสินค้าสำเร็จ");
            router.push("/admin/products");
        } catch {
            toast.error("สร้างสินค้าไม่สำเร็จ");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl">
            <div className="mb-6 flex items-center gap-4">
                <Link href="/admin/products" className="text-sm text-blue-600 hover:underline">
                    ← กลับ
                </Link>
                <h1 className="text-2xl font-bold text-gray-900">เพิ่มสินค้าใหม่</h1>
            </div>
            <Card>
                <ProductForm onSubmit={handleSubmit} loading={loading} />
            </Card>
        </div>
    );
}
