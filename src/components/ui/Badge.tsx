import { cn, ORDER_STATUS_COLORS, ORDER_STATUS_LABELS } from "@/lib/utils";
import { OrderStatus } from "@/types";

interface BadgeProps {
    status: OrderStatus;
    className?: string;
}

export function Badge({ status, className }: BadgeProps) {
    return (
        <span
            className={cn(
                "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                ORDER_STATUS_COLORS[status],
                className
            )}
        >
            {ORDER_STATUS_LABELS[status]}
        </span>
    );
}
