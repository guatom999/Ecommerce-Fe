"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { productsApi } from "@/services/productService";
import { Product } from "@/types";
import { ProductForm } from "@/components/forms/ProductForm";
import { Card } from "@/components/ui/Card";
import { Spinner } from "@/components/ui/Spinner";
import toast from "react-hot-toast";

interface Props {
    params: { id: string };
}

export default function EditProductPage({ params }: Props) {
    const router = useRouter();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        productsApi
            .getProduct(params.id)
            .then(setProduct)
            .catch(() => toast.error("โหลดสินค้าไม่สำเร็จ"))
            .finally(() => setLoading(false));
    }, [params.id]);

    const handleSubmit = async (
        data: Parameters<typeof productsApi.updateProduct>[1]
    ) => {
        setSaving(true);
        try {
            await productsApi.updateProduct(params.id, data);
            toast.success("บันทึกการแก้ไขสำเร็จ");
            router.push("/admin/products");
        } catch {
            toast.error("บันทึกไม่สำเร็จ");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center py-20">
                <Spinner size="lg" />
            </div>
        );
    }

    if (!product) {
        return <div className="py-20 text-center text-gray-500">ไม่พบสินค้า</div>;
    }

    return (
        <div className="max-w-2xl">
            <div className="mb-6 flex items-center gap-4">
                <Link href="/admin/products" className="text-sm text-blue-600 hover:underline">
                    ← กลับ
                </Link>
                <h1 className="text-2xl font-bold text-gray-900">แก้ไขสินค้า</h1>
            </div>
            <Card>
                <ProductForm
                    defaultValues={product}
                    onSubmit={handleSubmit}
                    loading={saving}
                />
            </Card>
        </div>
    );
}
