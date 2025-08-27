"use client"

import { cn } from "@/lib/utils"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { mockCategories, mockProducts } from "@/lib/mock-data"
import { MenuService } from "@/lib/menu-utils"
import { Package, FolderOpen, Star, TrendingUp } from "lucide-react"

export function AdminDashboard() {
  const activeCategories = MenuService.getActiveCategories(mockCategories)
  const activeProducts = mockProducts.filter((p) => p.isActive)
  const featuredProducts = MenuService.getFeaturedProducts(mockProducts)
  const totalRevenue = mockProducts.reduce((sum, product) => sum + product.price, 0)

  const stats = [
    {
      title: "Total Categories",
      value: activeCategories.length,
      icon: FolderOpen,
      color: "text-primary",
    },
    {
      title: "Total Products",
      value: activeProducts.length,
      icon: Package,
      color: "text-chart-1",
    },
    {
      title: "Featured Items",
      value: featuredProducts.length,
      icon: Star,
      color: "text-accent",
    },
    {
      title: "Avg. Price",
      value: `$${(totalRevenue / activeProducts.length).toFixed(2)}`,
      icon: TrendingUp,
      color: "text-chart-1",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your restaurant menu</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        { stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={ stat.title } className="bg-black/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white/70">{ stat.title }</CardTitle>
                <Icon className={ cn("h-5 w-5", stat.color) } />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{ stat.value }</div>
              </CardContent>
            </Card>
          )
        }) }
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-black/50">
          <CardHeader>
            <CardTitle className="text-white">Recent Categories</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            { activeCategories && activeCategories?.length ? activeCategories.slice(0, 4).map((category) => (
              <div key={ category.id } className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-primary">{ category.titlePrimary }</p>
                  <p className="text-sm text-muted-foreground">{ category.titleSecondary }</p>
                </div>
                <Badge variant="default" className="text-black">
                  { MenuService.getProductsByCategory(mockProducts, category._id).length } items
                </Badge>
              </div>
            )) : null }
          </CardContent>
        </Card>

        <Card className="bg-black/50">
          <CardHeader>
            <CardTitle className="text-white">Featured Products</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            { featuredProducts && featuredProducts.length ? featuredProducts.slice(0, 4).map((product) => (
              <div key={ product.id } className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-primary">{ product.titlePrimary }</p>
                  <p className="text-sm text-white">{ product.titleSecondary }</p>
                </div>
                <Badge variant="outline" className="text-primary border-primary">
                  ${ product.price }
                </Badge>
              </div>
            )) : null }
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
