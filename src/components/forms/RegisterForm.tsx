"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

const schema = z.object({
    email: z
        .string()
        .regex(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, "รูปแบบอีเมลไม่ถูกต้อง"),
    username: z.string().min(1, "กรุณากรอกชื่อผู้ใช้"),
    password: z
        .string()
        .min(8, "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร")
        .regex(/[A-Z]/, "ต้องมีตัวพิมพ์ใหญ่อย่างน้อย 1 ตัว")
        .regex(/[a-z]/, "ต้องมีตัวพิมพ์เล็กอย่างน้อย 1 ตัว"),
    confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
    message: "รหัสผ่านไม่ตรงกัน",
    path: ["confirmPassword"],
});

type RegisterData = z.infer<typeof schema>;
type SubmitData = Omit<RegisterData, "confirmPassword">;

interface RegisterFormProps {
    onSubmit: (data: SubmitData) => Promise<void>;
    loading?: boolean;
}

export function RegisterForm({ onSubmit, loading }: RegisterFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterData>({ resolver: zodResolver(schema) });

    const handleFormSubmit = ({ confirmPassword: _, ...data }: RegisterData) =>
        onSubmit(data);

    return (
        <form
            onSubmit={handleSubmit(handleFormSubmit)}
            className="flex flex-col gap-4"
        >
            <Input
                label="อีเมล"
                type="email"
                placeholder="you@example.com"
                error={errors.email?.message}
                {...register("email")}
            />
            <Input
                label="ชื่อผู้ใช้"
                placeholder="username"
                error={errors.username?.message}
                {...register("username")}
            />
            <Input
                label="รหัสผ่าน"
                type="password"
                placeholder="••••••••"
                error={errors.password?.message}
                {...register("password")}
            />
            <Input
                label="ยืนยันรหัสผ่าน"
                type="password"
                placeholder="••••••••"
                error={errors.confirmPassword?.message}
                {...register("confirmPassword")}
            />
            <Button type="submit" loading={loading} className="w-full">
                สมัครสมาชิก
            </Button>
        </form>
    );
}
