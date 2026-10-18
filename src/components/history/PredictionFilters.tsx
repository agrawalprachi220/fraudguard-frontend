import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import { MERCHANT_CATEGORIES } from "@/types/transaction";

export type StatusFilter = "all" | "fraud" | "legitimate";

interface PredictionFiltersProps {
  search: string;
  onSearchChange: (v: string) => void;
  status: StatusFilter;
  onStatusChange: (v: StatusFilter) => void;
  category: string;
  onCategoryChange: (v: string) => void;
}

export function PredictionFilters({
  search,
  onSearchChange,
  status,
  onStatusChange,
  category,
  onCategoryChange,
}: PredictionFiltersProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
      <div className="flex-1 space-y-1.5">
        <Label className="text-xs">Search</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by transaction ID..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs">Status</Label>
        <Select value={status} onValueChange={(v) => onStatusChange(v as StatusFilter)}>
          <SelectTrigger className="w-[150px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="fraud">Fraud</SelectItem>
            <SelectItem value="legitimate">Legitimate</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs">Category</Label>
        <Select value={category} onValueChange={onCategoryChange}>
          <SelectTrigger className="w-[160px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {MERCHANT_CATEGORIES.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
