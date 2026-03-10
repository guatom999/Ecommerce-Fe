"use client";
import { useState } from "react";
import { filesApi } from "@/services/fileService";
import { Button } from "@/components/ui/Button";
import toast from "react-hot-toast";
import Image from "next/image";

interface TransferSlipUploadProps {
    onUpload: (file: { filename: string; url: string }) => Promise<void>;
    existingUrl?: string;
}

export function TransferSlipUpload({
    onUpload,
    existingUrl,
}: TransferSlipUploadProps) {
    const [preview, setPreview] = useState<string | null>(existingUrl ?? null);
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0];
        if (!f) return;
        setFile(f);
        setPreview(URL.createObjectURL(f));
    };

    const handleSubmit = async () => {
        if (!file) return;
        setUploading(true);
        try {
            const [uploaded] = await filesApi.uploadFiles([file]);
            await onUpload({ filename: uploaded.filename, url: uploaded.url });
            toast.success("อัพโหลดสลิปสำเร็จ");
        } catch {
            toast.error("อัพโหลดสลิปไม่สำเร็จ");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="flex flex-col gap-3">
            <label className="text-sm font-medium text-gray-700">
                สลิปการชำระเงิน
            </label>
            {preview && (
                <div className="relative h-48 w-full overflow-hidden rounded-lg border border-gray-200">
                    <Image
                        src={preview}
                        alt="transfer slip"
                        fill
                        className="object-contain"
                        sizes="400px"
                    />
                </div>
            )}
            <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="text-sm text-gray-600 file:mr-2 file:rounded-lg file:border-0 file:bg-blue-50 file:px-3 file:py-1 file:text-sm file:text-blue-700"
            />
            {file && (
                <Button onClick={handleSubmit} loading={uploading}>
                    ส่งสลิปการชำระเงิน
                </Button>
            )}
        </div>
    );
}
