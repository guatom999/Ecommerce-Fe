import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "EcommerceGo — ร้านค้าออนไลน์",
    description: "ช้อปสินค้าคุณภาพดีราคาถูกที่ EcommerceGo",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="th">
            <body className={inter.className}>
                {children}
                <Toaster
                    position="top-right"
                    toastOptions={{
                        duration: 3000,
                        style: { borderRadius: "8px", fontSize: "14px" },
                    }}
                />
            </body>
        </html>
    );
}
