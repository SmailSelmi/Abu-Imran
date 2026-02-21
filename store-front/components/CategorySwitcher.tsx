"use client";
import { clsx } from "clsx";
import { Egg, Bird, Thermometer, ChefHat } from "lucide-react";
import { motion } from "framer-motion";

type Category = "eggs" | "chicks" | "chickens" | "incubators";

interface CategorySwitcherProps {
  selected: Category;
  onSelect: (category: Category) => void;
}

export function CategorySwitcher({
  selected,
  onSelect,
}: CategorySwitcherProps) {
  const categories = [
    { id: "eggs", label: "بيض تفقيس", icon: Egg, color: "yellow" },
    { id: "chicks", label: "صيصان", icon: Bird, color: "orange" },
    { id: "chickens", label: "دجاج بالغ", icon: ChefHat, color: "red" },
    { id: "incubators", label: "فقاسات", icon: Thermometer, color: "blue" },
  ] as const;

  return (
    <div className="flex flex-wrap justify-center gap-4 mb-12">
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onSelect(cat.id)}
          className={clsx(
            "relative flex items-center gap-3 px-6 py-4 rounded-xl transition-all duration-300 min-w-[160px] group",
            selected === cat.id
              ? "bg-white dark:bg-zinc-900 shadow-md ring-2 ring-green-500 text-green-700 dark:text-green-400 scale-105"
              : "bg-white/50 dark:bg-zinc-900/50 hover:bg-white dark:hover:bg-zinc-800 text-gray-500 dark:text-gray-400 hover:shadow-lg",
          )}
        >
          <div
            className={clsx(
              "p-2 rounded-xl transition-colors",
              selected === cat.id
                ? `bg-${cat.color}-100 dark:bg-${cat.color}-900/30 text-${cat.color}-600`
                : "bg-gray-100 dark:bg-zinc-800",
            )}
          >
            <cat.icon className="w-6 h-6" />
          </div>
          <span className="font-bold text-lg">{cat.label}</span>

          {selected === cat.id && (
            <motion.div
              layoutId="active-pill"
              className="absolute inset-0 rounded-xl border-2 border-green-500 pointer-events-none"
              initial={false}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          )}
        </button>
      ))}
    </div>
  );
}
