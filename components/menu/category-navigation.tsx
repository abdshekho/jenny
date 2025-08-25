"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { Category } from "@/lib/types"

interface CategoryNavigationProps {
  categories: Category[]
  selectedCategory: string
  onCategoryChange: (categoryId: string) => void
}

export function CategoryNavigation({ categories, selectedCategory, onCategoryChange }: CategoryNavigationProps) {
  const activeCategories = categories.filter((cat) => cat.isActive).sort((a, b) => a.order - b.order)
  console.log("cccccccccccccccccccc",activeCategories);
  return (
    <nav className="sticky top-0 z-10  backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          <Button
            variant={selectedCategory === "all" ? "default" : "outline"}
            className={cn(
              "whitespace-nowrap min-w-fit text-black",
              selectedCategory === "all"
                ? "bg-primary text-black"
                : "hover:bg-primary",
            )}
            onClick={() => onCategoryChange("all")}
          >
            All Items
          </Button>

          {activeCategories.map((category) => (
            <Button
              key={category._id}
              variant={selectedCategory === category._id ? "default" : "outline"}
              className={cn(
                "whitespace-nowrap min-w-fit text-black",
                selectedCategory === category._id
                  ? "bg-primary"
                  : "hover:bg-primary",
              )}
              onClick={() => onCategoryChange(category._id)}
            >
              <span className="block">{category.titlePrimary}</span>
            </Button>
          ))}
        </div>
      </div>
    </nav>
  )
}
