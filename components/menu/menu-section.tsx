"use client"

import { Badge } from "@/components/ui/badge"
import { MenuService } from "@/lib/menu-utils"
import type { Category, Product } from "@/lib/types"
import { Star, Clock, Leaf } from "lucide-react"

interface MenuSectionProps {
  category: Category
  products: Product[]
}

export function MenuSection({ category, products }: MenuSectionProps) {
  if (products.length === 0) return null

  return (
    <section className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-foreground">{category.titlePrimary}</h2>
        <p className="text-xl text-muted-foreground">{category.titleSecondary}</p>
        {category.description && <p className="text-muted-foreground max-w-2xl mx-auto">{category.description}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="group cursor-pointer">
            <div className="bg-card rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105">
              {/* Product Image */}
              <div className="aspect-video bg-muted relative overflow-hidden">
                <img
                  src={
                    product.image ||
                    `/placeholder.svg?height=200&width=300&query=${encodeURIComponent(product.titlePrimary)}`
                  }
                  alt={product.titlePrimary}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />

                {/* Price Badge */}
                <div className="absolute top-3 right-3">
                  <div className="bg-accent text-accent-foreground px-3 py-1 rounded-full font-bold shadow-lg">
                    {MenuService.formatPrice(product.price)}
                  </div>
                </div>

                {/* Featured Badge */}
                {product.isFeatured && (
                  <div className="absolute top-3 left-3">
                    <div className="bg-primary text-primary-foreground px-2 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                      <Star className="h-3 w-3 fill-current" />
                      Special
                    </div>
                  </div>
                )}

                {/* Discount Badge */}
                {product.originalPrice && (
                  <div className="absolute bottom-3 left-3">
                    <Badge variant="destructive" className="font-bold">
                      {MenuService.getDiscountPercentage(product.originalPrice, product.price)}% OFF
                    </Badge>
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-4 space-y-3">
                <div>
                  <h3 className="font-bold text-lg text-card-foreground leading-tight">{product.titlePrimary}</h3>
                  <p className="text-sm text-muted-foreground">{product.titleSecondary}</p>
                </div>

                {product.description && (
                  <p className="text-sm text-card-foreground line-clamp-2 leading-relaxed">{product.description}</p>
                )}

                {/* Ingredients */}
                {product.ingredients.length > 0 && (
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Ingredients</p>
                    <p className="text-sm text-card-foreground">
                      {product.ingredients.slice(0, 4).join(" • ")}
                      {product.ingredients.length > 4 && " • ..."}
                    </p>
                  </div>
                )}

                {/* Footer Info */}
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-3">
                    {product.preparationTime && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {product.preparationTime}min
                      </div>
                    )}

                    {product.allergens && product.allergens.includes("vegetarian") && (
                      <div className="flex items-center gap-1 text-xs text-accent">
                        <Leaf className="h-3 w-3" />
                        Vegetarian
                      </div>
                    )}
                  </div>

                  {/* Price with Original Price */}
                  <div className="text-right">
                    {product.originalPrice && (
                      <p className="text-xs text-muted-foreground line-through">
                        {MenuService.formatPrice(product.originalPrice)}
                      </p>
                    )}
                  </div>
                </div>

                {/* Allergen Info */}
                {product.allergens && product.allergens.length > 0 && (
                  <div className="pt-2 border-t border-border">
                    <p className="text-xs text-muted-foreground">
                      <span className="font-medium">Contains:</span> {product.allergens.join(", ")}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
