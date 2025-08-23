"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { mockProducts, mockCategories } from "@/lib/mock-data"
import { MenuService } from "@/lib/menu-utils"
import type { Product } from "@/lib/types"
import { Plus, Edit, Trash2, Star } from "lucide-react"
import { ImageIcon } from "lucide-react"

export function ProductManager() {
  const [products, setProducts] = useState<Product[]>(mockProducts)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  const filteredProducts =
    selectedCategory === "all" ? products : products.filter((p) => p.categoryId === selectedCategory)

  const handleSaveProduct = (productData: Partial<Product>) => {
    if (editingProduct) {
      // Update existing product
      setProducts((prev) =>
        prev.map((prod) => (prod.id === editingProduct.id ? { ...prod, ...productData, updatedAt: new Date() } : prod)),
      )
    } else {
      // Create new product
      const newProduct: Product = {
        id: Date.now().toString(),
        categoryId: productData.categoryId || mockCategories[0].id,
        titlePrimary: productData.titlePrimary || "",
        titleSecondary: productData.titleSecondary || "",
        description: productData.description || "",
        ingredients: productData.ingredients || [],
        price: productData.price || 0,
        originalPrice: productData.originalPrice,
        image: productData.image || "",
        isActive: true,
        isFeatured: false,
        order: products.length + 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      setProducts((prev) => [...prev, newProduct])
    }

    setEditingProduct(null)
    setIsDialogOpen(false)
  }

  const handleDeleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((prod) => prod.id !== id))
  }

  const toggleProductStatus = (id: string) => {
    setProducts((prev) => prev.map((prod) => (prod.id === id ? { ...prod, isActive: !prod.isActive } : prod)))
  }

  const toggleFeatured = (id: string) => {
    setProducts((prev) => prev.map((prod) => (prod.id === id ? { ...prod, isFeatured: !prod.isFeatured } : prod)))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Products</h1>
          <p className="text-muted-foreground">Manage your menu items</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={() => setEditingProduct(null)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingProduct ? "Edit Product" : "Add New Product"}</DialogTitle>
            </DialogHeader>
            <ProductForm product={editingProduct} onSave={handleSaveProduct} onCancel={() => setIsDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-4 items-center">
        <Label htmlFor="category-filter">Filter by Category:</Label>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {mockCategories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.titlePrimary}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => {
          const category = MenuService.getCategoryById(mockCategories, product.categoryId)
          return (
            <Card key={product.id} className="bg-card">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg text-card-foreground flex items-center gap-2">
                      {product.titlePrimary}
                      {product.isFeatured && <Star className="h-4 w-4 text-accent fill-current" />}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">{product.titleSecondary}</p>
                    <Badge variant="outline" className="mt-1 text-xs">
                      {category?.titlePrimary}
                    </Badge>
                  </div>
                  <Badge variant={product.isActive ? "default" : "secondary"}>
                    {product.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-bold text-primary">{MenuService.formatPrice(product.price)}</p>
                    {product.originalPrice && (
                      <p className="text-sm text-muted-foreground line-through">
                        {MenuService.formatPrice(product.originalPrice)}
                      </p>
                    )}
                  </div>
                </div>

                {product.description && (
                  <p className="text-sm text-card-foreground line-clamp-2">{product.description}</p>
                )}

                {product.ingredients.length > 0 && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Ingredients:</p>
                    <p className="text-sm text-card-foreground">
                      {product.ingredients.slice(0, 3).join(", ")}
                      {product.ingredients.length > 3 && "..."}
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Switch checked={product.isActive} onCheckedChange={() => toggleProductStatus(product.id)} />
                      <span className="text-xs text-muted-foreground">Active</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch checked={product.isFeatured} onCheckedChange={() => toggleFeatured(product.id)} />
                      <span className="text-xs text-muted-foreground">Featured</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingProduct(product)
                        setIsDialogOpen(true)
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteProduct(product.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

function ProductForm({
  product,
  onSave,
  onCancel,
}: {
  product: Product | null
  onSave: (data: Partial<Product>) => void
  onCancel: () => void
}) {
  const [formData, setFormData] = useState({
    categoryId: product?.categoryId || mockCategories[0].id,
    titlePrimary: product?.titlePrimary || "",
    titleSecondary: product?.titleSecondary || "",
    description: product?.description || "",
    ingredients: product?.ingredients.join(", ") || "",
    price: product?.price || 0,
    originalPrice: product?.originalPrice || 0,
    image: product?.image || "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const ingredients = formData.ingredients
      .split(",")
      .map((ing) => ing.trim())
      .filter((ing) => ing.length > 0)

    onSave({
      ...formData,
      ingredients,
      originalPrice: formData.originalPrice || undefined,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="categoryId">Category</Label>
          <Select
            value={formData.categoryId}
            onValueChange={(value) => setFormData((prev) => ({ ...prev, categoryId: value }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {mockCategories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.titlePrimary}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="price">Price</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            value={formData.price}
            onChange={(e) => setFormData((prev) => ({ ...prev, price: Number.parseFloat(e.target.value) || 0 }))}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="titlePrimary">Primary Title</Label>
          <Input
            id="titlePrimary"
            value={formData.titlePrimary}
            onChange={(e) => setFormData((prev) => ({ ...prev, titlePrimary: e.target.value }))}
            placeholder="e.g., Grilled Chicken"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="titleSecondary">Secondary Title</Label>
          <Input
            id="titleSecondary"
            value={formData.titleSecondary}
            onChange={(e) => setFormData((prev) => ({ ...prev, titleSecondary: e.target.value }))}
            placeholder="e.g., دجاج مشوي"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
          placeholder="Brief description of the product"
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="ingredients">Ingredients (comma-separated)</Label>
        <Textarea
          id="ingredients"
          value={formData.ingredients}
          onChange={(e) => setFormData((prev) => ({ ...prev, ingredients: e.target.value }))}
          placeholder="chicken, lettuce, tomatoes, sauce"
          rows={2}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="originalPrice">Original Price (optional)</Label>
          <Input
            id="originalPrice"
            type="number"
            step="0.01"
            value={formData.originalPrice}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, originalPrice: Number.parseFloat(e.target.value) || 0 }))
            }
            placeholder="For discounted items"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="image">Image URL</Label>
          <div className="flex gap-2">
            <Input
              id="image"
              value={formData.image}
              onChange={(e) => setFormData((prev) => ({ ...prev, image: e.target.value }))}
              placeholder="/images/products/item.jpg"
            />
            <Button type="button" variant="outline" size="sm">
              <ImageIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="submit" className="flex-1 bg-primary text-primary-foreground">
          {product ? "Update" : "Create"} Product
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
