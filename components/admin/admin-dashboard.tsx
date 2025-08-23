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
      color: "text-secondary",
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
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-card-foreground">{stat.title}</CardTitle>
                <Icon className={cn("h-4 w-4", stat.color)} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-card-foreground">{stat.value}</div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-card-foreground">Recent Categories</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {activeCategories.slice(0, 4).map((category) => (
              <div key={category.id} className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-card-foreground">{category.titlePrimary}</p>
                  <p className="text-sm text-muted-foreground">{category.titleSecondary}</p>
                </div>
                <Badge variant="secondary">
                  {MenuService.getProductsByCategory(mockProducts, category.id).length} items
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-card-foreground">Featured Products</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {featuredProducts.slice(0, 4).map((product) => (
              <div key={product.id} className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-card-foreground">{product.titlePrimary}</p>
                  <p className="text-sm text-muted-foreground">{product.titleSecondary}</p>
                </div>
                <Badge variant="outline" className="text-primary border-primary">
                  ${product.price}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
