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
    password: z.string().min(1, "กรุณากรอกรหัสผ่าน"),
});

type LoginData = z.infer<typeof schema>;

interface LoginFormProps {
    onSubmit: (data: LoginData) => Promise<void>;
    loading?: boolean;
}

export function LoginForm({ onSubmit, loading }: LoginFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginData>({ resolver: zodResolver(schema) });

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <Input
                label="อีเมล"
                type="email"
                placeholder="you@example.com"
                error={errors.email?.message}
                {...register("email")}
            />
            <Input
                label="รหัสผ่าน"
                type="password"
                placeholder="••••••••"
                error={errors.password?.message}
                {...register("password")}
            />
            <Button type="submit" loading={loading} className="w-full">
                เข้าสู่ระบบ
            </Button>
        </form>
    );
}
