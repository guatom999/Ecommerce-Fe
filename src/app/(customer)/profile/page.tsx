"use client";
import { useAuthStore } from "@/store/authStore";
import { Card } from "@/components/ui/Card";
import { User, Mail, Shield } from "lucide-react";

export default function ProfilePage() {
    const { user } = useAuthStore();

    if (!user) return null;

    return (
        <div className="mx-auto max-w-2xl px-4 py-10">
            <h1 className="mb-6 text-2xl font-bold text-gray-900">โปรไฟล์ของฉัน</h1>
            <Card>
                <div className="flex flex-col gap-5">
                    <div className="flex items-center gap-4">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                            <User size={32} className="text-blue-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">
                                {user.username}
                            </h2>
                            <span className="text-sm text-gray-500">
                                {user.role_id === 2 ? "ผู้ดูแลระบบ" : "ลูกค้า"}
                            </span>
                        </div>
                    </div>
                    <hr />
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-3">
                            <Mail size={18} className="text-gray-400" />
                            <div>
                                <p className="text-xs text-gray-500">อีเมล</p>
                                <p className="text-sm font-medium text-gray-900">{user.email}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Shield size={18} className="text-gray-400" />
                            <div>
                                <p className="text-xs text-gray-500">สิทธิ์การใช้งาน</p>
                                <p className="text-sm font-medium text-gray-900">
                                    {user.role_id === 2 ? "Admin (role_id: 2)" : "Customer (role_id: 1)"}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-gray-400 text-sm font-mono">ID</span>
                            <div>
                                <p className="text-xs text-gray-500">รหัสผู้ใช้</p>
                                <p className="text-sm font-medium text-gray-900 font-mono">{user.id}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
}
