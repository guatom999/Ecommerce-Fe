"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { categoriesApi } from "@/services/categoryService";
import { filesApi } from "@/services/fileService";
import { Category, Product } from "@/types";
import toast from "react-hot-toast";
import Image from "next/image";

const schema = z.object({
    title: z.string().min(1, "กรุณากรอกชื่อสินค้า"),
    description: z.string().min(1, "กรุณากรอกรายละเอียด"),
    price: z.coerce.number().positive("ราคาต้องมากกว่า 0"),
    category_id: z.coerce.number().min(1, "กรุณาเลือกหมวดหมู่"),
});

type FormData = z.infer<typeof schema>;

interface ProductFormProps {
    defaultValues?: Partial<Product>;
    onSubmit: (data: {
        title: string;
        description: string;
        price: number;
        category: { id: number };
        images: { filename: string; url: string }[];
    }) => Promise<void>;
    loading?: boolean;
}

export function ProductForm({
    defaultValues,
    onSubmit,
    loading,
}: ProductFormProps) {
    const [categories, setCategories] = useState<Category[]>([]);
    const [images, setImages] = useState<{ filename: string; url: string }[]>(
        defaultValues?.images?.map((i) => ({ filename: i.filename, url: i.url })) ?? []
    );
    const [uploading, setUploading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            title: defaultValues?.title,
            description: defaultValues?.description,
            price: defaultValues?.price,
            category_id: defaultValues?.category?.id,
        },
    });

    useEffect(() => {
        categoriesApi.getCategories().then(setCategories).catch(() => { });
    }, []);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;
        setUploading(true);
        try {
            const uploaded = await filesApi.uploadFiles(Array.from(files));
            setImages((prev) => [
                ...prev,
                ...uploaded.map((f) => ({ filename: f.filename, url: f.url })),
            ]);
            toast.success("อัพโหลดรูปภาพสำเร็จ");
        } catch {
            toast.error("อัพโหลดรูปภาพไม่สำเร็จ");
        } finally {
            setUploading(false);
        }
    };

    const removeImage = (idx: number) =>
        setImages((prev) => prev.filter((_, i) => i !== idx));

    const handleFormSubmit = ({ category_id, ...data }: FormData) =>
        onSubmit({ ...data, category: { id: category_id }, images });

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-5">
            <Input
                label="ชื่อสินค้า"
                placeholder="กรอกชื่อสินค้า"
                error={errors.title?.message}
                {...register("title")}
            />
            <Textarea
                label="รายละเอียด"
                placeholder="รายละเอียดสินค้า"
                error={errors.description?.message}
                {...register("description")}
            />
            <Input
                label="ราคา (บาท)"
                type="number"
                step="0.01"
                placeholder="0.00"
                error={errors.price?.message}
                {...register("price")}
            />
            <Select
                label="หมวดหมู่"
                placeholder="เลือกหมวดหมู่"
                options={categories.map((c) => ({ label: c.title, value: c.id }))}
                error={errors.category_id?.message}
                {...register("category_id")}
            />
            {/* Image upload */}
            <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">รูปภาพสินค้า</label>
                <div className="flex flex-wrap gap-2">
                    {images.map((img, idx) => (
                        <div key={idx} className="relative h-20 w-20">
                            <Image
                                src={img.url}
                                alt={img.filename}
                                fill
                                className="rounded-lg object-cover"
                                sizes="80px"
                            />
                            <button
                                type="button"
                                onClick={() => removeImage(idx)}
                                className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white"
                            >
                                ×
                            </button>
                        </div>
                    ))}
                </div>
                <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    disabled={uploading}
                    className="text-sm text-gray-600 file:mr-2 file:rounded-lg file:border-0 file:bg-blue-50 file:px-3 file:py-1 file:text-sm file:text-blue-700"
                />
                {uploading && <p className="text-xs text-gray-500">กำลังอัพโหลด...</p>}
            </div>
            <Button type="submit" loading={loading} className="w-full">
                {defaultValues ? "บันทึกการแก้ไข" : "สร้างสินค้า"}
            </Button>
        </form>
    );
}
