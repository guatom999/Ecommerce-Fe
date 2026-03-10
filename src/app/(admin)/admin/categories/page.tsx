"use client";
import { useState, useEffect } from "react";
import { categoriesApi } from "@/services/categoryService";
import { Category } from "@/types";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { ConfirmModal } from "@/components/ui/Modal";
import { Spinner } from "@/components/ui/Spinner";
import toast from "react-hot-toast";
import { Plus, Trash2, Tag } from "lucide-react";

export default function AdminCategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [newTitle, setNewTitle] = useState("");
    const [creating, setCreating] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
    const [deleting, setDeleting] = useState(false);

    const fetchCategories = async () => {
        try {
            const data = await categoriesApi.getCategories();
            setCategories(data);
        } catch {
            toast.error("โหลดหมวดหมู่ไม่สำเร็จ");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTitle.trim()) return;
        setCreating(true);
        try {
            await categoriesApi.createCategory(newTitle.trim());
            toast.success("สร้างหมวดหมู่สำเร็จ");
            setNewTitle("");
            fetchCategories();
        } catch {
            toast.error("สร้างหมวดหมู่ไม่สำเร็จ");
        } finally {
            setCreating(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;
        setDeleting(true);
        try {
            await categoriesApi.deleteCategory(deleteTarget.id);
            toast.success(`ลบหมวดหมู่ "${deleteTarget.title}" แล้ว`);
            setDeleteTarget(null);
            fetchCategories();
        } catch {
            toast.error("ลบหมวดหมู่ไม่สำเร็จ");
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div className="max-w-2xl">
            <h1 className="mb-6 text-2xl font-bold text-gray-900">จัดการหมวดหมู่</h1>

            {/* Create */}
            <Card className="mb-6">
                <h2 className="mb-4 text-lg font-semibold text-gray-900">
                    เพิ่มหมวดหมู่ใหม่
                </h2>
                <form onSubmit={handleCreate} className="flex gap-3">
                    <Input
                        placeholder="ชื่อหมวดหมู่"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        className="flex-1"
                    />
                    <Button type="submit" loading={creating} disabled={!newTitle.trim()}>
                        <Plus size={16} /> เพิ่ม
                    </Button>
                </form>
            </Card>

            {/* List */}
            <Card>
                <h2 className="mb-4 text-lg font-semibold text-gray-900">
                    หมวดหมู่ทั้งหมด ({categories.length})
                </h2>
                {loading ? (
                    <div className="flex justify-center py-8">
                        <Spinner />
                    </div>
                ) : categories.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">ยังไม่มีหมวดหมู่</p>
                ) : (
                    <div className="flex flex-col gap-2">
                        {categories.map((cat) => (
                            <div
                                key={cat.id}
                                className="flex items-center justify-between rounded-lg border border-gray-100 px-4 py-3 hover:bg-gray-50"
                            >
                                <div className="flex items-center gap-3">
                                    <Tag size={16} className="text-blue-600" />
                                    <span className="font-medium text-gray-900">{cat.title}</span>
                                    <span className="text-xs text-gray-400">#{cat.id}</span>
                                </div>
                                <Button
                                    size="sm"
                                    variant="danger"
                                    onClick={() => setDeleteTarget(cat)}
                                >
                                    <Trash2 size={13} />
                                </Button>
                            </div>
                        ))}
                    </div>
                )}
            </Card>

            <ConfirmModal
                open={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                onConfirm={handleDelete}
                title="ลบหมวดหมู่"
                message={`คุณต้องการลบหมวดหมู่ "${deleteTarget?.title}" ใช่หรือไม่?`}
                loading={deleting}
            />
        </div>
    );
}
