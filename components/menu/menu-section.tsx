"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MenuService } from "@/lib/menu-utils"
import { useCart } from "@/lib/cart-context"
import type { Category, Product } from "@/lib/types"
import { Star, Clock, Leaf, Plus } from "lucide-react"

interface MenuSectionProps {
  category: Category
  products: Product[]
}

export function MenuSection({ category, products }: MenuSectionProps) {
  const { dispatch } = useCart()
  
  if (products.length === 0) return null

  const addToCart = (product: Product) => {
    dispatch({ type: 'ADD_ITEM', payload: product })
  }

  return (
    <section className="space-y-6">
      <div className="text-center space-y-2 flex flex-col items-center">
        <h2 className="text-3xl font-bold text-black bg-primary py-2 px-4">{ category.titlePrimary }</h2>
        <p className="text-xl text-muted-foreground">{ category.titleSecondary }</p>
        {/* {category.description && <p className="text-muted-foreground max-w-2xl mx-auto">{category.description}</p>} */ }
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        { products.map((product) => (
          <div key={ product._id } className="group cursor-pointer">
            <div className="bg-black/50 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
              {/* Product Image */ }
              <div className="aspect-video bg-black/50 relative overflow-hidden">
                <img
                  src={
                    product.image || "/logo.jpg" ||
                    `/placeholder.svg?height=200&width=300&query=${encodeURIComponent(product.titlePrimary)}`
                  }
                  alt={ product.titlePrimary }
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />

                {/* Price Badge */ }
                <div className="absolute top-3 right-3">
                  <div className="bg-accent text-accent-foreground px-2 py-1 rounded-full font-bold shadow-lg">
                    { MenuService.formatPrice(product.price) }
                  </div>
                  {/* <div className="bg-accent text-accent-foreground px-3 py-1 rounded-full font-bold shadow-lg">
                    {MenuService.formatPrice(product.price)}
                  </div> */}
                </div>

                {/* Featured Badge */ }
                { product.isFeatured && (
                  <div className="absolute top-3 left-3">
                    <div className="bg-black text-primary px-2 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                      <Star className="h-3 w-3 fill-current" />
                      Special
                    </div>
                  </div>
                ) }

                {/* Discount Badge */ }
                { product.originalPrice && (
                  <div className="absolute bottom-3 right-3">
                    {/* <Badge variant="destructive" className="font-bold bg-green-800"> */ }
                    <Badge variant="destructive" className="font-bold">
                      { MenuService.getDiscountPercentage(product.originalPrice, product.price) }% OFF
                    </Badge>
                  </div>
                ) }
              </div>

              {/* Product Info */ }
              <h3 className="font-bold text-lg text-card-foreground bg-primary px-1 py-3 text-center leading-tight">{ product.titlePrimary }</h3>
              {/* <h3 className="font-bold text-lg text-card-foreground bg-primary px-1 py-1 text-center leading-tight">{product.titleSecondary}</h3> */ }
              <div className="p-4 space-y-3 text-center">
                <div>
                  <p className="text-primary">{ product.titleSecondary }</p>
                </div>

                { product.description && (
                  <p className="text-sm text-white line-clamp-2 leading-relaxed">{ product.description }</p>
                ) }
                {/* Ingredients */ }
                {/* {product.ingredients.length > 0 && (
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-primary uppercase tracking-wide">Ingredients</p>
                    <p className="text-sm text-white">
                      {product.ingredients.slice(0, 4).join(" • ")}
                      {product.ingredients.length > 4 && " • ..."}
                    </p>
                  </div>
                )} */}

                {/* Footer Info */ }
                <div className="flex items-center justify-between pt-2">
                  {/* <div className="flex items-center gap-3">
                    { product.preparationTime && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        { product.preparationTime }min
                      </div>
                    ) }

                    { product.allergens && product.allergens.includes("vegetarian") && (
                      <div className="flex items-center gap-1 text-xs text-accent">
                        <Leaf className="h-3 w-3" />
                        Vegetarian
                      </div>
                    ) }
                  </div> */}

                  {/* Add to Cart Button */ }
                  <Button 
                    onClick={() => addToCart(product)}
                    size="sm"
                    className="bg-primary hover:bg-primary/90"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add to Cart
                  </Button>
                  
                  {/* Price with Original Price */ }
                  <div className="text-right">
                    { product.originalPrice && (
                      <p className="text-xs text-muted-foreground line-through">
                        { MenuService.formatPrice(product.originalPrice) }
                      </p>
                    ) }
                  </div>
                </div>

                {/* Allergen Info */ }
                {/* { product.allergens && product.allergens.length > 0 && (
                  <div className="pt-2 border-t border-border">
                    <p className="text-xs text-muted-foreground">
                      <span className="font-medium">Contains:</span> { product.allergens.join(", ") }
                    </p>
                  </div>
                ) } */}
              </div>
            </div>
          </div>
        )) }
      </div>
    </section>
  )
}
