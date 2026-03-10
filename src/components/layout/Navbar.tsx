"use client";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";
import { useAuth } from "@/hooks/useAuth";
import { ShoppingCart, User, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";

export function Navbar() {
    const { isAuthenticated, isAdmin, user } = useAuthStore();
    const totalItems = useCartStore((s) => s.totalItems)();
    const { signOut } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <nav className="sticky top-0 z-40 border-b border-gray-200 bg-white shadow-sm">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
                {/* Logo */}
                <Link href="/" className="text-xl font-bold text-blue-600">
                    EcommerceGo
                </Link>

                {/* Desktop nav */}
                <div className="hidden items-center gap-6 md:flex">
                    <Link href="/products" className="text-sm text-gray-600 hover:text-blue-600">
                        สินค้า
                    </Link>
                    {isAdmin && (
                        <Link href="/admin" className="text-sm text-gray-600 hover:text-blue-600">
                            จัดการร้าน
                        </Link>
                    )}
                    {isAuthenticated && (
                        <>
                            <Link href="/orders" className="text-sm text-gray-600 hover:text-blue-600">
                                คำสั่งซื้อ
                            </Link>
                            <Link href="/profile" className="text-sm text-gray-600 hover:text-blue-600">
                                <User size={18} className="inline" /> {user?.username}
                            </Link>
                        </>
                    )}
                    <Link href="/cart" className="relative text-gray-600 hover:text-blue-600">
                        <ShoppingCart size={22} />
                        {totalItems > 0 && (
                            <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-xs text-white">
                                {totalItems}
                            </span>
                        )}
                    </Link>
                    {isAuthenticated ? (
                        <button
                            onClick={signOut}
                            className="flex items-center gap-1 text-sm text-gray-600 hover:text-red-600"
                        >
                            <LogOut size={16} /> ออกจากระบบ
                        </button>
                    ) : (
                        <Link
                            href="/login"
                            className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
                        >
                            เข้าสู่ระบบ
                        </Link>
                    )}
                </div>

                {/* Mobile hamburger */}
                <div className="flex items-center gap-3 md:hidden">
                    <Link href="/cart" className="relative text-gray-600">
                        <ShoppingCart size={22} />
                        {totalItems > 0 && (
                            <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-xs text-white">
                                {totalItems}
                            </span>
                        )}
                    </Link>
                    <button onClick={() => setMenuOpen((o) => !o)} className="text-gray-600">
                        {menuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            {menuOpen && (
                <div className="border-t border-gray-200 bg-white px-4 py-3 md:hidden">
                    <div className="flex flex-col gap-3">
                        <Link href="/products" onClick={() => setMenuOpen(false)} className="text-sm text-gray-700">สินค้า</Link>
                        {isAdmin && <Link href="/admin" onClick={() => setMenuOpen(false)} className="text-sm text-gray-700">จัดการร้าน</Link>}
                        {isAuthenticated && (
                            <>
                                <Link href="/orders" onClick={() => setMenuOpen(false)} className="text-sm text-gray-700">คำสั่งซื้อ</Link>
                                <Link href="/profile" onClick={() => setMenuOpen(false)} className="text-sm text-gray-700">โปรไฟล์: {user?.username}</Link>
                            </>
                        )}
                        {isAuthenticated ? (
                            <button onClick={signOut} className="text-left text-sm text-red-600">ออกจากระบบ</button>
                        ) : (
                            <Link href="/login" onClick={() => setMenuOpen(false)} className="text-sm text-blue-600">เข้าสู่ระบบ</Link>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
