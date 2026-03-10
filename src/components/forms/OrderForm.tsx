"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

const schema = z.object({
    address: z.string().min(1, "กรุณากรอกที่อยู่จัดส่ง"),
    contact: z.string().min(1, "กรุณากรอกข้อมูลติดต่อ"),
});

export type OrderFormData = z.infer<typeof schema>;

interface OrderFormProps {
    onSubmit: (data: OrderFormData) => Promise<void>;
    loading?: boolean;
}

export function OrderForm({ onSubmit, loading }: OrderFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<OrderFormData>({ resolver: zodResolver(schema) });

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <Input
                label="ที่อยู่จัดส่ง"
                placeholder="บ้านเลขที่ ถนน ตำบล อำเภอ จังหวัด รหัสไปรษณีย์"
                error={errors.address?.message}
                {...register("address")}
            />
            <Input
                label="ข้อมูลติดต่อ (เบอร์โทร)"
                placeholder="08X-XXX-XXXX"
                error={errors.contact?.message}
                {...register("contact")}
            />
            <Button type="submit" loading={loading} className="w-full">
                ยืนยันคำสั่งซื้อ
            </Button>
        </form>
    );
}
