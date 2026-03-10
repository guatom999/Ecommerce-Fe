"use client";
import { useState, useEffect } from "react";
import { categoriesApi } from "@/services/categoryService";
import { productsApi } from "@/services/productService";
import { useCartStore } from "@/store/cartStore";
import { ProductCard } from "@/components/product/ProductCard";
import { Pagination } from "@/components/ui/Pagination";
import { Spinner } from "@/components/ui/Spinner";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Category, Product, ProductsQuery } from "@/types";
import toast from "react-hot-toast";

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(1);
    const [query, setQuery] = useState<ProductsQuery>({
        page: 1,
        limit: 12,
        order_by: "created_at",
        sort: "DESC",
    });
    const [search, setSearch] = useState("");
    const add = useCartStore((s) => s.add);

    useEffect(() => {
        categoriesApi.getCategories().then(setCategories).catch(() => { });
    }, []);

    useEffect(() => {
        setLoading(true);
        productsApi
            .getProducts(query)
            .then((res) => {
                setProducts(res.data ?? []);
                setTotalPages(res.pagination?.total_page ?? 1);
            })
            .catch(() => toast.error("โหลดสินค้าไม่สำเร็จ"))
            .finally(() => setLoading(false));
    }, [query]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setQuery((q) => ({ ...q, search, page: 1 }));
    };

    const handleAddToCart = (product: Product) => {
        add(product);
        toast.success(`เพิ่ม "${product.title}" ลงตะกร้าแล้ว`);
    };

    return (
        <div className="mx-auto max-w-7xl px-4 py-8">
            <h1 className="mb-6 text-2xl font-bold text-gray-900">สินค้าทั้งหมด</h1>

            {/* Filters */}
            <div className="mb-6 flex flex-col gap-3 sm:flex-row">
                <form onSubmit={handleSearch} className="flex flex-1 gap-2">
                    <Input
                        placeholder="ค้นหาสินค้า..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
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
                    options={[
                        { label: "ทุกหมวดหมู่", value: "" },
                        ...categories.map((c) => ({ label: c.title, value: c.id })),
                    ]}
                    value={query.id ?? ""}
                    onChange={(e) =>
                        setQuery((q) => ({ ...q, id: e.target.value || undefined, page: 1 }))
                    }
                    className="w-full sm:w-48"
                />
                <Select
                    options={[
                        { label: "ล่าสุด", value: "created_at-DESC" },
                        { label: "เก่าสุด", value: "created_at-ASC" },
                        { label: "ราคาสูง-ต่ำ", value: "price-DESC" },
                        { label: "ราคาต่ำ-สูง", value: "price-ASC" },
                    ]}
                    value={`${query.order_by}-${query.sort}`}
                    onChange={(e) => {
                        const [order_by, sort] = e.target.value.split("-");
                        setQuery((q) => ({
                            ...q,
                            order_by: order_by as "id" | "created_at",
                            sort: sort as "ASC" | "DESC",
                            page: 1,
                        }));
                    }}
                    className="w-full sm:w-48"
                />
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <Spinner size="lg" />
                </div>
            ) : products.length === 0 ? (
                <p className="py-20 text-center text-gray-500">ไม่พบสินค้า</p>
            ) : (
                <>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        {products.map((product) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                onAddToCart={handleAddToCart}
                            />
                        ))}
                    </div>
                    <div className="mt-8 flex justify-center">
                        <Pagination
                            currentPage={query.page ?? 1}
                            totalPages={totalPages}
                            onPageChange={(page) => setQuery((q) => ({ ...q, page }))}
                        />
                    </div>
                </>
            )}
        </div>
    );
}
