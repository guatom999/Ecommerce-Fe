import Link from "next/link";
import Image from "next/image";
import { Product } from "@/types";
import { formatPrice } from "@/lib/utils";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ShoppingCart } from "lucide-react";

interface ProductCardProps {
    product: Product;
    onAddToCart?: (product: Product) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
    const imageUrl = product.images?.[0]?.url;

    return (
        <Card padding={false} className="group flex flex-col overflow-hidden hover:shadow-md transition-shadow">
            <Link href={`/products/${product.id}`}>
                <div className="relative h-48 w-full overflow-hidden bg-gray-100">
                    {imageUrl ? (
                        <Image
                            src={imageUrl}
                            alt={product.title}
                            fill
                            className="object-cover transition-transform group-hover:scale-105"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        />
                    ) : (
                        <div className="flex h-full items-center justify-center text-gray-400 text-sm">
                            ไม่มีรูปภาพ
                        </div>
                    )}
                </div>
            </Link>
            <div className="flex flex-1 flex-col gap-2 p-4">
                <span className="text-xs text-blue-600 font-medium">
                    {product.category.title}
                </span>
                <Link href={`/products/${product.id}`}>
                    <h3 className="font-semibold text-gray-900 line-clamp-2 hover:text-blue-600 transition-colors">
                        {product.title}
                    </h3>
                </Link>
                <p className="text-sm text-gray-500 line-clamp-2">{product.description}</p>
                <div className="mt-auto flex items-center justify-between">
                    <span className="text-lg font-bold text-gray-900">
                        {formatPrice(product.price)}
                    </span>
                    {onAddToCart && (
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onAddToCart(product)}
                        >
                            <ShoppingCart size={14} />
                            เพิ่ม
                        </Button>
                    )}
                </div>
            </div>
        </Card>
    );
}
