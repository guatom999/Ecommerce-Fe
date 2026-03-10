"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { productsApi } from "@/services/productService";
import { Product } from "@/types";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { ConfirmModal } from "@/components/ui/Modal";
import { Pagination } from "@/components/ui/Pagination";
import { formatPrice, formatDate } from "@/lib/utils";
import toast from "react-hot-toast";
import { Plus, Pencil, Trash2 } from "lucide-react";

export default function AdminProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(1);
    const [page, setPage] = useState(1);
    const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
    const [deleting, setDeleting] = useState(false);

    const fetchProducts = useCallback(async (p: number = page) => {
        setLoading(true);
        try {
            const res = await productsApi.getProducts({
                page: p,
                limit: 10,
                order_by: "created_at",
                sort: "DESC",
            });
            setProducts(res.data ?? []);
            setTotalPages(res.pagination?.total_page ?? 1);
        } catch {
            toast.error("โหลดสินค้าไม่สำเร็จ");
        } finally {
            setLoading(false);
        }
    }, [page]);

    useEffect(() => {
        fetchProducts(page);
    }, [page, fetchProducts]);

    const handleDelete = async () => {
        if (!deleteTarget) return;
        setDeleting(true);
        try {
            await productsApi.deleteProduct(deleteTarget.id);
            toast.success(`ลบ "${deleteTarget.title}" แล้ว`);
            setDeleteTarget(null);
            fetchProducts(page);
        } catch {
            toast.error("ลบสินค้าไม่สำเร็จ");
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div>
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">จัดการสินค้า</h1>
                <Link href="/admin/products/new">
                    <Button>
                        <Plus size={16} /> เพิ่มสินค้า
                    </Button>
                </Link>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <Spinner size="lg" />
                </div>
            ) : products.length === 0 ? (
                <p className="py-20 text-center text-gray-500">ยังไม่มีสินค้า</p>
            ) : (
                <>
                    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
                        <table className="min-w-full text-sm">
                            <thead className="bg-gray-50 text-gray-600">
                                <tr>
                                    <th className="px-4 py-3 text-left">ชื่อสินค้า</th>
                                    <th className="px-4 py-3 text-left">หมวดหมู่</th>
                                    <th className="px-4 py-3 text-right">ราคา</th>
                                    <th className="px-4 py-3 text-left">วันที่สร้าง</th>
                                    <th className="px-4 py-3 text-center">จัดการ</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {products.map((product) => (
                                    <tr key={product.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 font-medium text-gray-900 max-w-xs">
                                            <p className="line-clamp-2">{product.title}</p>
                                        </td>
                                        <td className="px-4 py-3 text-gray-500">
                                            {product.category.title}
                                        </td>
                                        <td className="px-4 py-3 text-right font-medium text-blue-600">
                                            {formatPrice(product.price)}
                                        </td>
                                        <td className="px-4 py-3 text-gray-500">
                                            {formatDate(product.created_at)}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center justify-center gap-2">
                                                <Link href={`/admin/products/${product.id}/edit`}>
                                                    <Button size="sm" variant="outline">
                                                        <Pencil size={13} />
                                                    </Button>
                                                </Link>
                                                <Button
                                                    size="sm"
                                                    variant="danger"
                                                    onClick={() => setDeleteTarget(product)}
                                                >
                                                    <Trash2 size={13} />
                                                </Button>
                                            </div>
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

            <ConfirmModal
                open={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                onConfirm={handleDelete}
                title="ลบสินค้า"
                message={`คุณต้องการลบ "${deleteTarget?.title}" ใช่หรือไม่?`}
                loading={deleting}
            />
        </div>
    );
}
