"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { X } from "lucide-react";
import { CATEGORY_DATA } from "@/lib/constants";
import type { Database } from "@/types/supabase";
import { OrderForm } from "./OrderForm";

type Product = Database["public"]["Tables"]["products"]["Row"];

interface OrderDialogProps {
  category?: string;
  isOpen: boolean;
  onClose: () => void;
  product?: Product | null;
  quantity?: number;
  defaultVariant?: string;
}

export function OrderDialog({
  category = "eggs",
  isOpen,
  onClose,
  product: initialProduct,
  quantity: externalQuantity,
  defaultVariant,
}: OrderDialogProps) {
  const activeCategory = initialProduct?.category || category;
  const config = CATEGORY_DATA[activeCategory] || CATEGORY_DATA.eggs;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden outline-none rounded-3xl bg-white dark:bg-zinc-950 shadow-2xl border-none max-md:fixed max-md:inset-0 max-md:h-full max-md:max-w-none max-md:rounded-none max-md:translate-x-0 max-md:translate-y-0 max-md:left-0 max-md:top-0">
        <DialogHeader className="sr-only">
          <DialogTitle>{initialProduct?.name || config.name_ar}</DialogTitle>
          <DialogDescription>أكمل طلبك للحصول على سلالاتنا النادرة.</DialogDescription>
        </DialogHeader>

        <div className="relative">
          <button
            onClick={onClose}
            className="absolute top-6 end-6 p-1.5 hover:bg-muted rounded-lg transition-colors z-[60] shrink-0 md:hidden"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
          
          <OrderForm
            category={category}
            product={initialProduct}
            quantity={externalQuantity}
            defaultVariant={defaultVariant}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
