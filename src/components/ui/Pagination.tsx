import { Button } from "./Button";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export function Pagination({
    currentPage,
    totalPages,
    onPageChange,
}: PaginationProps) {
    if (totalPages <= 1) return null;

    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    const visiblePages = pages.filter(
        (p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 2
    );

    return (
        <div className="flex items-center justify-center gap-1">
            <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => onPageChange(currentPage - 1)}
            >
                &laquo;
            </Button>
            {visiblePages.map((page, idx) => {
                const prev = visiblePages[idx - 1];
                return (
                    <div key={page} className="flex items-center gap-1">
                        {prev && page - prev > 1 && (
                            <span className="px-1 text-gray-400">…</span>
                        )}
                        <Button
                            variant={page === currentPage ? "primary" : "outline"}
                            size="sm"
                            onClick={() => onPageChange(page)}
                        >
                            {page}
                        </Button>
                    </div>
                );
            })}
            <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => onPageChange(currentPage + 1)}
            >
                &raquo;
            </Button>
        </div>
    );
}
