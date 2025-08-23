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

  return (
    <nav className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          <Button
            variant={selectedCategory === "all" ? "default" : "outline"}
            className={cn(
              "whitespace-nowrap min-w-fit",
              selectedCategory === "all"
                ? "bg-primary text-primary-foreground"
                : "hover:bg-secondary hover:text-secondary-foreground",
            )}
            onClick={() => onCategoryChange("all")}
          >
            All Items
          </Button>

          {activeCategories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              className={cn(
                "whitespace-nowrap min-w-fit",
                selectedCategory === category.id
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-secondary hover:text-secondary-foreground",
              )}
              onClick={() => onCategoryChange(category.id)}
            >
              <span className="block">{category.titlePrimary}</span>
            </Button>
          ))}
        </div>
      </div>
    </nav>
  )
}
