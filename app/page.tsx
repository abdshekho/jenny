"use client"

import { useState } from "react"
import { MenuHeader } from "@/components/menu/menu-header"
import { CategoryNavigation } from "@/components/menu/category-navigation"
import { MenuSection } from "@/components/menu/menu-section"
import { MenuFooter } from "@/components/menu/menu-footer"
import { InstallPrompt } from "@/components/pwa/install-prompt"
import { mockCategories, mockProducts } from "@/lib/mock-data"
import { MenuService } from "@/lib/menu-utils"

export default function MenuPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const menuData = MenuService.groupProductsByCategory(mockCategories, mockProducts)
  const featuredProducts = MenuService.getFeaturedProducts(mockProducts)

  const filteredMenuData =
    selectedCategory === "all" ? menuData : menuData.filter(({ category }) => category.id === selectedCategory)

  return (
    <div className="min-h-screen bg-background">
      <MenuHeader />

      <CategoryNavigation
        categories={mockCategories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      <main className="container mx-auto px-4 py-8 space-y-12">
        {/* Featured Items Section */}
        {selectedCategory === "all" && featuredProducts.length > 0 && (
          <section className="space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-foreground mb-2">Chef's Specials</h2>
              <p className="text-muted-foreground">Our most popular dishes</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProducts.slice(0, 6).map((product) => (
                <div key={product.id} className="group">
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
              ))}
            </div>
          </section>
        )}

        {/* Menu Sections */}
        {filteredMenuData.map(({ category, products }) => (
          <MenuSection key={category.id} category={category} products={products} />
        ))}
      </main>

      <MenuFooter />

      <InstallPrompt />
    </div>
  )
}
