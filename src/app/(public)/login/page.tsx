"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { LoginForm } from "@/components/forms/LoginForm";
import { Card } from "@/components/ui/Card";
import { useState } from "react";
import toast from "react-hot-toast";

export default function LoginPage() {
    const { signIn } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (data: { email: string; password: string }) => {
        setLoading(true);
        try {
            await signIn(data.email, data.password);
            toast.success("เข้าสู่ระบบสำเร็จ");
            router.push("/");
        } catch {
            toast.error("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-[calc(100vh-130px)] items-center justify-center px-4 py-10">
            <Card className="w-full max-w-md">
                <h1 className="mb-6 text-2xl font-bold text-gray-900">เข้าสู่ระบบ</h1>
                <LoginForm onSubmit={handleSubmit} loading={loading} />
                <p className="mt-4 text-center text-sm text-gray-600">
                    ยังไม่มีบัญชี?{" "}
                    <Link href="/register" className="text-blue-600 hover:underline">
                        สมัครสมาชิก
                    </Link>
                </p>
            </Card>
        </div>
    );
}
