"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { RegisterForm } from "@/components/forms/RegisterForm";
import { Card } from "@/components/ui/Card";
import { useState } from "react";
import toast from "react-hot-toast";

export default function RegisterPage() {
    const { signUp } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (data: {
        email: string;
        username: string;
        password: string;
    }) => {
        setLoading(true);
        try {
            await signUp(data.email, data.password, data.username);
            toast.success("สมัครสมาชิกสำเร็จ กรุณาเข้าสู่ระบบ");
            router.push("/login");
        } catch {
            toast.error("สมัครสมาชิกไม่สำเร็จ อีเมลอาจถูกใช้งานแล้ว");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-[calc(100vh-130px)] items-center justify-center px-4 py-10">
            <Card className="w-full max-w-md">
                <h1 className="mb-6 text-2xl font-bold text-gray-900">สมัครสมาชิก</h1>
                <RegisterForm onSubmit={handleSubmit} loading={loading} />
                <p className="mt-4 text-center text-sm text-gray-600">
                    มีบัญชีแล้ว?{" "}
                    <Link href="/login" className="text-blue-600 hover:underline">
                        เข้าสู่ระบบ
                    </Link>
                </p>
            </Card>
        </div>
    );
}
