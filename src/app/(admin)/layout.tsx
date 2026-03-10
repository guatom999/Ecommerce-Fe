import { Navbar } from "@/components/layout/Navbar";
import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ProtectedRoute requireAdmin>
            <div className="flex min-h-screen flex-col">
                <Navbar />
                <div className="flex flex-1">
                    <AdminSidebar />
                    <main className="flex-1 overflow-auto p-6">{children}</main>
                </div>
            </div>
        </ProtectedRoute>
    );
}
