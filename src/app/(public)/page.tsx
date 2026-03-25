import Link from "next/link";
import { productsApi } from "@/services/productService";
import { ProductCard } from "@/components/product/ProductCard";
import type { Product } from "@/types";

export default async function HomePage() {
    let featuredProducts: Product[] = [];
    try {
        const res = await productsApi.getProducts({
            page: 1,
            limit: 8,
            order_by: "created_at",
            sort: "DESC",
        });
        featuredProducts = res.data ?? [];
    } catch {
        // fail silently on server
    }

    return (
        <div>
            {/* Hero */}
            <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
                <div className="mx-auto max-w-7xl px-4 py-20 text-center">
                    <h1 className="mb-4 text-4xl font-bold md:text-6xl">
                        ยินดีต้อนรับสู่ AraiwaniShop
                    </h1>
                    <p className="mb-8 text-lg text-blue-100 md:text-xl">
                        ช้อปสินค้าคุณภาพดีราคาถูก จัดส่งรวดเร็ว
                    </p>
                    <Link
                        href="/products"
                        className="rounded-xl bg-white px-8 py-3 font-semibold text-blue-700 shadow hover:bg-blue-50 transition"
                    >
                        ดูสินค้าทั้งหมด
                    </Link>
                </div>
            </section>

            {/* Featured Products */}
            <section className="mx-auto max-w-7xl px-4 py-12">
                <h2 className="mb-6 text-2xl font-bold text-gray-900">สินค้าใหม่ล่าสุด</h2>
                {featuredProducts.length === 0 ? (
                    <p className="text-gray-500">ยังไม่มีสินค้า</p>
                ) : (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {featuredProducts.map((product: Product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
                <div className="mt-8 text-center">
                    <Link
                        href="/products"
                        className="rounded-lg border border-blue-600 px-6 py-2 text-blue-600 hover:bg-blue-50 transition"
                    >
                        ดูสินค้าทั้งหมด →
                    </Link>
                </div>
            </section>
        </div>
    );
}
