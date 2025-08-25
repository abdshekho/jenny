"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { mockCategories, mockProducts } from "@/lib/mock-data"
import { MenuService } from "@/lib/menu-utils"
import { Star, Clock, ExternalLink } from "lucide-react"

export function MenuPreview() {
  const menuData = MenuService.groupProductsByCategory(mockCategories, mockProducts)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Menu Preview</h1>
          <p className="text-muted-foreground">Preview how your menu will look to customers</p>
        </div>

        <Button variant="outline" className="gap-2 bg-transparent">
          <ExternalLink className="h-4 w-4" />
          View Public Menu
        </Button>
      </div>

      <div className="space-y-8">
        {menuData.map(({ category, products }) => (
          <div key={category._id} className="space-y-4">
            <div className="border-b border-border pb-2">
              <h2 className="text-2xl font-bold text-foreground">{category.titlePrimary}</h2>
              <p className="text-lg text-muted-foreground">{category.titleSecondary}</p>
              {category.description && <p className="text-sm text-muted-foreground mt-1">{category.description}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {products.map((product) => (
                <Card key={product._id} className="bg-card hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-card-foreground">{product.titlePrimary}</h3>
                          {product.isFeatured && <Star className="h-4 w-4 text-accent fill-current" />}
                        </div>
                        <p className="text-sm text-muted-foreground">{product.titleSecondary}</p>
                      </div>

                      <div className="text-right">
                        <p className="font-bold text-primary">{MenuService.formatPrice(product.price)}</p>
                        {product.originalPrice && (
                          <p className="text-sm text-muted-foreground line-through">
                            {MenuService.formatPrice(product.originalPrice)}
                          </p>
                        )}
                      </div>
                    </div>

                    {product.description && <p className="text-sm text-card-foreground mb-3">{product.description}</p>}

                    {product.ingredients.length > 0 && (
                      <div className="mb-3">
                        <p className="text-xs text-muted-foreground mb-1">Ingredients:</p>
                        <p className="text-sm text-card-foreground">{product.ingredients.join(" • ")}</p>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex gap-2">
                        {product.originalPrice && (
                          <Badge variant="destructive" className="text-xs">
                            {MenuService.getDiscountPercentage(product.originalPrice, product.price)}% OFF
                          </Badge>
                        )}
                        {product.allergens && product.allergens.length > 0 && (
                          <Badge variant="outline" className="text-xs">
                            Contains: {product.allergens.join(", ")}
                          </Badge>
                        )}
                      </div>

                      {product.preparationTime && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {product.preparationTime}min
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
