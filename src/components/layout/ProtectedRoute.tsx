"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { FullPageSpinner } from "@/components/ui/Spinner";

interface ProtectedRouteProps {
    children: React.ReactNode;
    requireAdmin?: boolean;
}

export function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
    const { isAuthenticated, isAdmin } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
        if (!isAuthenticated) {
            router.replace("/login");
            return;
        }
        if (requireAdmin && !isAdmin) {
            router.replace("/");
        }
    }, [isAuthenticated, isAdmin, requireAdmin, router]);

    if (!isAuthenticated) return <FullPageSpinner />;
    if (requireAdmin && !isAdmin) return <FullPageSpinner />;

    return <>{children}</>;
}
