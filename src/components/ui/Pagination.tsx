import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-center gap-1">
      <button
        onClick={() => onPageChange(Math.max(1, page - 1))}
        disabled={page === 1}
        className="rounded p-1.5 text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <ChevronLeft size={18} />
      </button>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={`h-8 w-8 rounded text-sm font-medium transition-colors ${
            p === page ? 'bg-stone-700 text-white' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          {p}
        </button>
      ))}
      <button
        onClick={() => onPageChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        className="rounded p-1.5 text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  )
}
