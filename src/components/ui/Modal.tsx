"use client";
import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { Button } from "./Button";
import { cn } from "@/lib/utils";

interface ModalProps {
    open: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    className?: string;
}

export function Modal({ open, onClose, title, children, className }: ModalProps) {
    const overlayRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (open) document.body.style.overflow = "hidden";
        else document.body.style.overflow = "";
        return () => { document.body.style.overflow = ""; };
    }, [open]);

    if (!open) return null;

    return (
        <div
            ref={overlayRef}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
        >
            <div
                className={cn(
                    "relative w-full max-w-md rounded-xl bg-white shadow-xl",
                    className
                )}
            >
                <div className="flex items-center justify-between border-b px-6 py-4">
                    <h2 className="text-lg font-semibold text-gray-900">
                        {title ?? ""}
                    </h2>
                    <button
                        onClick={onClose}
                        className="rounded-md p-1 text-gray-400 hover:text-gray-600"
                    >
                        <X size={20} />
                    </button>
                </div>
                <div className="p-6">{children}</div>
            </div>
        </div>
    );
}

interface ConfirmModalProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    message?: string;
    loading?: boolean;
}

export function ConfirmModal({
    open,
    onClose,
    onConfirm,
    title = "ยืนยันการดำเนินการ",
    message = "คุณแน่ใจหรือไม่?",
    loading,
}: ConfirmModalProps) {
    return (
        <Modal open={open} onClose={onClose} title={title}>
            <p className="text-gray-600">{message}</p>
            <div className="mt-6 flex justify-end gap-3">
                <Button variant="outline" onClick={onClose} disabled={loading}>
                    ยกเลิก
                </Button>
                <Button variant="danger" onClick={onConfirm} loading={loading}>
                    ยืนยัน
                </Button>
            </div>
        </Modal>
    );
}
