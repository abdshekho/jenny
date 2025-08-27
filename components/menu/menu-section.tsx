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
  viewMode?: 'grid' | 'list'
}

export function MenuSection({ category, products, viewMode = 'grid' }: MenuSectionProps) {
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

      <div className={ viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4" }>
        { products.map((product) => (
          // <div className="group">
            <div key={ product._id } className={ `bg-black/50 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 ${viewMode === 'list' ? 'flex flex-row relative' : ''
              }` }>
              {/* Product Image */ }
              <div className={ `bg-black/50 overflow-hidden ${viewMode === 'list' ? 'w-32 h-32 flex-shrink-0' : 'aspect-video relative'
                }` }>
                <img
                  src={
                    product.image || "/logo.jpg" ||
                    `/placeholder.svg?height=200&width=300&query=${encodeURIComponent(product.titlePrimary)}`
                  }
                  alt={ product.titlePrimary }
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />

                {/* Price Badge */ }
                <div className="absolute top-2 right-2">
                  <div className="bg-accent text-accent-foreground px-2 py-1 rounded-full font-bold shadow-lg text-sm">
                    { MenuService.formatPrice(product.price) }
                  </div>
                </div>

                {/* Featured Badge */ }
                { product.isFeatured && (
                  <div className="absolute top-2 left-2">
                    <div className="bg-black text-primary px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                      <Star className="h-3 w-3 fill-current" />
                      { viewMode === 'list' ? '' : 'Special' }
                    </div>
                  </div>
                ) }

                {/* Discount Badge */ }
                { viewMode === 'grid' && product.originalPrice ? (
                  <div className="absolute bottom-2 right-2">
                    <Badge variant="destructive" className="font-bold text-xs">
                      { MenuService.getDiscountPercentage(product.originalPrice, product.price) }% OFF
                    </Badge>
                  </div>
                ) : ( <Button
                  onClick={ () => addToCart(product) }
                  size="sm"
                  className="absolute bottom-2 right-2 bg-white hover:bg-primary/90 cursor-pointer text-black"
                >
                  <Plus className="h-4 w-4 text-black" />
                  Add
                </Button> )}
              </div>

              {/* Product Info */ }
              <div className={ viewMode === 'list' ? 'flex-1' : '' }>
                <h3 className={ `font-bold text-lg  leading-tight text-center ${viewMode === 'list' ? 'px-4 py-2' : 'px-1 py-3 text-card-foreground bg-primary'
                  }` }>{ product.titlePrimary }</h3>
                <div className={ `text-center ${viewMode === 'list' ? 'px-4 flex flex-col space-y-1' : 'p-4  space-y-3 flex flex-col justify-between'}` }>
                  <div>
                    <p className="text-primary">{ product.titleSecondary }</p>
                  </div>

                  { product.description && (
                    <p dir="rtl" className={ `text-sm text-white leading-relaxed ${viewMode === 'list' ? 'line-clamp-2 text-center' : 'line-clamp-3'
                      }` }>{ product.description }</p>
                  ) }

                  {/* Footer Info */ }
                  <div className={ `flex items-center pt-2 ${viewMode === 'list' ? 'justify-between' : 'justify-between'
                    }` }>
                    {/* Add to Cart Button */ }
                    { viewMode !== 'list' && <Button
                      onClick={ () => addToCart(product) }
                      size="sm"
                      className="bg-white hover:bg-primary/90 cursor-pointer text-black"
                    >
                      <Plus className="h-4 w-4 text-black" />
                      Add
                    </Button> }


                    {/* Price with Original Price */ }
                    <div className="text-right">
                      { product.originalPrice && (
                        <p className="text-xs text-muted-foreground line-through">
                          { MenuService.formatPrice(product.originalPrice) }
                        </p>
                      ) }
                    </div>
                  </div>
                </div>
              </div>
            {/* </div> */}
          </div>
        )) }
      </div>
    </section>
  )
}
