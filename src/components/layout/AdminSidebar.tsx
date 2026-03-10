"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    Package,
    ShoppingBag,
    Tag,
} from "lucide-react";

const links = [
    { href: "/admin", label: "แดชบอร์ด", icon: LayoutDashboard },
    { href: "/admin/products", label: "สินค้า", icon: Package },
    { href: "/admin/orders", label: "คำสั่งซื้อ", icon: ShoppingBag },
    { href: "/admin/categories", label: "หมวดหมู่", icon: Tag },
];

export function AdminSidebar() {
    const pathname = usePathname();

    return (
        <aside className="flex h-full w-56 flex-col border-r border-gray-200 bg-white px-3 py-6">
            <p className="mb-4 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                เมนูแอดมิน
            </p>
            <nav className="flex flex-col gap-1">
                {links.map(({ href, label, icon: Icon }) => {
                    const active =
                        href === "/admin"
                            ? pathname === "/admin"
                            : pathname.startsWith(href);
                    return (
                        <Link
                            key={href}
                            href={href}
                            className={cn(
                                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                                active
                                    ? "bg-blue-50 text-blue-600"
                                    : "text-gray-600 hover:bg-gray-100"
                            )}
                        >
                            <Icon size={18} />
                            {label}
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}
