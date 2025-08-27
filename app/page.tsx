"use client"

import { useState, useEffect } from "react"
import { MenuHeader } from "@/components/menu/menu-header"
import { CategoryNavigation } from "@/components/menu/category-navigation"
import { MenuSection } from "@/components/menu/menu-section"
import { MenuFooter } from "@/components/menu/menu-footer"
import { InstallPrompt } from "@/components/pwa/install-prompt"
import { MenuService } from "@/lib/menu-utils"
import type { Category, Product } from "@/lib/types"
import { LayoutGrid, List, ListOrdered, Loader2 } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export default function MenuPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [categories, setCategories] = useState<Category[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  useEffect(() => {
    loadMenuData()
  }, [])

  const loadMenuData = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/menu')
      const result = await response.json()
      
      if (result.success) {
        setCategories(result.data.categories)
        setProducts(result.data.products)
      }
    } catch (error) {
      console.error('Error loading menu data:', error)
    } finally {
      setLoading(false)
    }
  }

  const menuData = MenuService.groupProductsByCategory(categories, products)
  // const featuredProducts = MenuService.getFeaturedProducts(products)

  const filteredMenuData =
    selectedCategory === "all" ? menuData : menuData.filter(({ category }) => category._id === selectedCategory)

  console.log('🚀 ~ page.tsx ~ MenuPage ~ filteredMenuData:', filteredMenuData);



  return (
    <div className="min-h-screen">
      <MenuHeader />

      <CategoryNavigation
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="logo-loader">
                      <Image src={ 'logo2.png' } alt="logo" width={ 200 } height={ 200 } />
          </div>
          {/* <Loader2 className="h-8 w-8 animate-spin" /> */}
        </div>
      ) : (
        <main className="container mx-auto px-4 py-8 space-y-12">
        {/* Featured Items Section */}
        {/* {selectedCategory === "all" && featuredProducts.length > 0 && (
          <section className="space-y-6">
            <div className="text-center flex flex-col items-center">
              <h2 className="text-3xl font-bold text-black bg-primary py-2 px-4">Chef's Specials</h2>
              <p className="text-muted-foreground">Our most popular dishes</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProducts && featuredProducts.length > 0 ?( featuredProducts.slice(0, 6).map((product) => (
                <div key={product._id} className="group">
                  <div className="bg-card rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                    <div className="aspect-video bg-muted relative overflow-hidden">
                      <img
                        src={
                          product.image ||
                          `/placeholder.svg?height=200&width=300&query=${encodeURIComponent(product.titlePrimary) || "/placeholder.svg"}`
                        }
                        alt={product.titlePrimary}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute top-3 right-3">
                        <div className="bg-accent text-accent-foreground px-2 py-1 rounded-full text-sm font-bold">
                          {MenuService.formatPrice(product.price)}
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-lg text-card-foreground mb-1">{product.titlePrimary}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{product.titleSecondary}</p>
                      {product.description && (
                        <p className="text-sm text-card-foreground line-clamp-2">{product.description}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))):<div></div>}
            </div>
          </section>
        )} */}

          {/* View Toggle Button */}
          <div className="fixed bottom-10 right-3 z-20">
            <Button
              variant="outline"
              size="lg"
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              className="bg-white text-black px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
            >
              {viewMode === 'list' ? <LayoutGrid className="h-5 w-5"/>: <List className="h-5 w-5"/> }
            </Button>
          </div>

          {/* Menu Sections */}
          {filteredMenuData.map(({ category, products }) => (
            <MenuSection key={category._id} category={category} products={products} viewMode={viewMode} />
          ))}
        </main>
      )}

      <MenuFooter />

      <InstallPrompt />
    </div>
  )
}
