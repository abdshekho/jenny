"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ImageUpload } from "@/components/admin/image-upload"
import { ImageGalleryDialog } from "@/components/admin/image-gallery"
import { apiClient } from "@/lib/api-client"
import { MenuService } from "@/lib/menu-utils"
import type { Product, Category } from "@/lib/types"
import { Plus, Edit, Trash2, Star, Loader2 } from "lucide-react"
import { ImageIcon } from "lucide-react"
import { toast } from "sonner"
import Image from "next/image"

export function ProductManager() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [productsResponse, categoriesResponse] = await Promise.all([
        apiClient.getProducts(),
        apiClient.getCategories()
      ])

      if (productsResponse.success) {
        setProducts(productsResponse.data)
      }

      if (categoriesResponse.success) {
        setCategories(categoriesResponse.data)
      }
    } catch (error) {
      toast.error('Error loading data')
    } finally {
      setLoading(false)
    }
  }

  const filteredProducts =
    selectedCategory === "all" ? products : products.filter((p) => p.categoryId === selectedCategory)

  const handleSaveProduct = async (productData: Partial<Product>) => {
    try {
      setSaving(true)
      if (editingProduct) {
        // Update existing product
        const response = await apiClient.updateProduct(editingProduct.id, productData)
        if (response.success) {
          setProducts((prev) =>
            prev.map((prod) => (prod.id === editingProduct.id ? response.data : prod))
          )
          toast.success('Product updated successfully')
        } else {
          toast.error('Failed to update product')
          return
        }
      } else {
        // Create new product
        const response = await apiClient.createProduct(productData as Omit<Product, 'id' | 'createdAt' | 'updatedAt'>)
        if (response.success) {
          setProducts((prev) => [...prev, response.data])
          toast.success('Product created successfully')
        } else {
          toast.error('Failed to create product')
          return
        }
      }

      setEditingProduct(null)
      setIsDialogOpen(false)
    } catch (error) {
      toast.error('Error saving product')
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return

    try {
      const response = await apiClient.deleteProduct(id)
      if (response.success) {
        setProducts((prev) => prev.filter((prod) => prod.id !== id))
        toast.success('Product deleted successfully')
      } else {
        toast.error('Failed to delete product')
      }
    } catch (error) {
      toast.error('Error deleting product')
    }
  }

  const toggleProductStatus = async (id: string) => {
    const product = products.find(prod => prod.id === id)
    if (!product) return

    try {
      const response = await apiClient.updateProduct(id, { isActive: !product.isActive })
      if (response.success) {
        setProducts((prev) => prev.map((prod) => (prod.id === id ? response.data : prod)))
        toast.success(`Product ${response.data.isActive ? 'activated' : 'deactivated'}`)
      } else {
        toast.error('Failed to update product status')
      }
    } catch (error) {
      toast.error('Error updating product status')
    }
  }

  const toggleFeatured = async (id: string) => {
    const product = products.find(prod => prod.id === id)
    if (!product) return

    try {
      const response = await apiClient.updateProduct(id, { isFeatured: !product.isFeatured })
      if (response.success) {
        setProducts((prev) => prev.map((prod) => (prod.id === id ? response.data : prod)))
        toast.success(`Product ${response.data.isFeatured ? 'featured' : 'unfeatured'}`)
      } else {
        toast.error('Failed to update product featured status')
      }
    } catch (error) {
      toast.error('Error updating product featured status')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Products</h1>
          <p className="text-muted-foreground">Manage your menu items</p>
        </div>

        <Dialog open={ isDialogOpen } onOpenChange={ setIsDialogOpen }>
          <DialogTrigger asChild>
            <Button
              className="bg-primary text-black hover:bg-primary/90"
              onClick={ () => setEditingProduct(null) }
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-black">
            <DialogHeader>
              <DialogTitle>{ editingProduct ? "Edit Product" : "Add New Product" }</DialogTitle>
            </DialogHeader>
            <ProductForm
              product={ editingProduct }
              categories={ categories }
              onSave={ handleSaveProduct }
              onCancel={ () => setIsDialogOpen(false) }
              saving={ saving }
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-4 items-center">
        <Label htmlFor="category-filter">Filter by Category:</Label>
        <Select value={ selectedCategory } onValueChange={ setSelectedCategory }>
          <SelectTrigger className="w-60">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            { categories.map((category) => (
              <SelectItem key={ category.id } value={ category.id }>
                { category.titlePrimary }
              </SelectItem>
            )) }
          </SelectContent>
        </Select>
      </div>

      { loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="logo-loader">
            <Image src={ 'logo2.webp' } alt="logo" width={ 200 } height={ 200 } />
          </div>
          {/* <Loader2 className="h-8 w-8 animate-spin" /> */ }
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          { filteredProducts.map((product) => {
            const category = MenuService.getCategoryById(categories, product.categoryId)
            return (
              <Card key={ product.id } className="bg-black/20">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg text-primary flex items-center gap-2">
                        { product.titlePrimary }
                        { product.isFeatured && <Star className="h-4 w-4 text-accent fill-current" /> }
                      </CardTitle>
                      <p className="text-sm text-white">{ product.titleSecondary }</p>

                    </div>
                    <div className="flex flex-col items-center">
                      <Badge variant="outline" className="text-xs bg-black">
                        { category?.titlePrimary }
                      </Badge>
                      <Badge variant={ product.isActive ? "default" : "destructive" } className="mt-1">
                        { product.isActive ? "Active" : "Inactive" }
                      </Badge>
                    </div>

                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="aspect-video bg-muted relative overflow-hidden">
                    <img
                      src={
                        product.image || "/logo.webp" || 
                        `/placeholder.svg?height=200&width=300&query=${encodeURIComponent(product.titlePrimary)}`
                      }
                      alt={ product.titlePrimary }
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />

                    {/* Price Badge */ }
                    <div className="absolute top-3 right-3">
                      <div className="bg-accent text-accent-foreground px-3 py-1 rounded-full font-bold shadow-lg">
                        { MenuService.formatPrice(product.price) }
                      </div>
                    </div>

                    {/* Featured Badge */ }
                    { product.isFeatured && (
                      <div className="absolute top-3 left-3">
                        <div className="bg-primary text-black px-2 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                          <Star className="h-3 w-3 fill-current" />
                          Special
                        </div>
                      </div>
                    ) }

                    {/* Discount Badge */ }
                    { product.originalPrice && (
                      <div className="absolute bottom-3 left-3">
                        <Badge variant="destructive" className="font-bold">
                          { MenuService.getDiscountPercentage(product.originalPrice, product.price) }% OFF
                        </Badge>
                      </div>
                    ) }
                  </div>
                  <div className="flex items-center justify-between">
                    {/* <Image src={product.image || ''} alt="none"/> */ }

                    <div>
                      <p className="text-lg font-bold text-primary">{ MenuService.formatPrice(product.price) }</p>
                      { product.originalPrice && (
                        <p className="text-sm text-muted-foreground line-through">
                          { MenuService.formatPrice(product.originalPrice) }
                        </p>
                      ) }
                    </div>
                  </div>

                  { (product.description || product.descriptionAr) && (
                    <div className="space-y-1">
                      {product.description && (
                        <p className="text-sm text-white line-clamp-2">{ product.description }</p>
                      )}
                      {product.descriptionAr && (
                        <p className="text-sm text-white line-clamp-2" dir="rtl">{ product.descriptionAr }</p>
                      )}
                    </div>
                  ) }



                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Switch checked={ product.isActive } onCheckedChange={ () => toggleProductStatus(product.id) } />
                        <span className="text-xs text-muted-foreground">Active</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch checked={ product.isFeatured } onCheckedChange={ () => toggleFeatured(product.id) } />
                        <span className="text-xs text-muted-foreground">Featured</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={ () => {
                          setEditingProduct(product)
                          setIsDialogOpen(true)
                        } }
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={ () => handleDeleteProduct(product.id) }
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          }) }
        </div>
      ) }
    </div>
  )
}

function ProductForm({
  product,
  categories,
  onSave,
  onCancel,
  saving,
}: {
  product: Product | null
  categories: Category[]
  onSave: (data: Partial<Product>) => void
  onCancel: () => void
  saving: boolean
}) {
  const [formData, setFormData] = useState({
    categoryId: product?.categoryId || categories[0]?.id || "",
    titlePrimary: product?.titlePrimary || "",
    titleSecondary: product?.titleSecondary || "",
    description: product?.description || "",
    descriptionAr: product?.descriptionAr || "",
    price: product?.price || 0,
    originalPrice: product?.originalPrice || 0,
    image: product?.image || "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      ...formData,
      originalPrice: formData.originalPrice === 0 ? null : formData.originalPrice || undefined,
    })
  }

  return (
    <form onSubmit={ handleSubmit } className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="categoryId">Category</Label>
          <Select
            value={ formData.categoryId }
            onValueChange={ (value) => setFormData((prev) => ({ ...prev, categoryId: value })) }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              { categories.map((category) => (
                <SelectItem key={ category.id } value={ category.id }>
                  { category.titlePrimary }
                </SelectItem>
              )) }
            </SelectContent>
          </Select>
        </div>


      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="titlePrimary">Primary Title</Label>
          <Input
            id="titlePrimary"
            value={ formData.titlePrimary }
            onChange={ (e) => setFormData((prev) => ({ ...prev, titlePrimary: e.target.value })) }
            placeholder="e.g., Grilled Chicken"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="titleSecondary">Secondary Title</Label>
          <Input
            id="titleSecondary"
            value={ formData.titleSecondary }
            onChange={ (e) => setFormData((prev) => ({ ...prev, titleSecondary: e.target.value })) }
            placeholder="e.g., دجاج مشوي"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-2">
          <Label htmlFor="description">Description (English)</Label>
          <Textarea
            id="description"
            value={ formData.description }
            onChange={ (e) => setFormData((prev) => ({ ...prev, description: e.target.value })) }
            placeholder="Brief description of the product in English"
            rows={ 3 }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="descriptionAr">Description (Arabic)</Label>
          <Textarea
            id="descriptionAr"
            value={ formData.descriptionAr }
            onChange={ (e) => setFormData((prev) => ({ ...prev, descriptionAr: e.target.value })) }
            placeholder="وصف مختصر للمنتج بالعربية"
            rows={ 3 }
            dir="rtl"
          />
        </div>
      </div>



      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price">Price</Label>
          <Input
            id="price"
            type="number"
            step="1000"
            value={ formData.price }
            onFocus={ (e) => e.target.select() }
            onChange={ (e) => setFormData((prev) => ({ ...prev, price: Number.parseFloat(e.target.value) || 0 })) }
            className="[&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="originalPrice">Old Price (optional)</Label>
          <Input
            id="originalPrice"
            type="number"
            step="1000"
            onFocus={ (e) => e.target.select() }
            value={ formData.originalPrice }
            onChange={ (e) =>
              setFormData((prev) => ({ ...prev, originalPrice: Number.parseFloat(e.target.value) || 0 }))
            }
            className="[&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
            placeholder="For discounted items"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Product Image</Label>
        <div className="space-y-4">
          <ImageUpload value={ formData.image } onChange={ (url) => setFormData((prev) => ({ ...prev, image: url })) } />
          <div className="flex gap-2">
            <ImageGalleryDialog
              onSelect={ (url) => {
                console.log('Selected image URL:', url)
                setFormData((prev) => ({ ...prev, image: url }))
              }}
              selectedUrl={ formData.image }
            >
              <Button type="button" variant="outline" size="sm" className="text-black">
                <ImageIcon className="h-4 w-4 mr-2" />
                Choose from Gallery
              </Button>
            </ImageGalleryDialog>
          </div>
        </div>
      </div>


      <div className="flex gap-2 pt-4">
        <Button type="submit" className="flex-1 bg-primary text-black" disabled={ saving }>
          { saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" /> }
          { product ? "Update" : "Create" } Product
        </Button>
        <Button type="button" variant="outline" className="text-black" onClick={ onCancel } disabled={ saving }>
          Cancel
        </Button>
      </div>
    </form>
  )
}
