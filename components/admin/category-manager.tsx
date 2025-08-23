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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ImageUpload } from "@/components/admin/image-upload"
import { ImageGalleryDialog } from "@/components/admin/image-gallery"
import { mockCategories } from "@/lib/mock-data"
import type { Category } from "@/lib/types"
import { Plus, Edit, Trash2, ImageIcon } from "lucide-react"

export function CategoryManager() {
  const [categories, setCategories] = useState<Category[]>(mockCategories)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleSaveCategory = (categoryData: Partial<Category>) => {
    if (editingCategory) {
      // Update existing category
      setCategories((prev) =>
        prev.map((cat) => (cat.id === editingCategory.id ? { ...cat, ...categoryData, updatedAt: new Date() } : cat)),
      )
    } else {
      // Create new category
      const newCategory: Category = {
        id: Date.now().toString(),
        titlePrimary: categoryData.titlePrimary || "",
        titleSecondary: categoryData.titleSecondary || "",
        description: categoryData.description || "",
        image: categoryData.image || "",
        order: categories.length + 1,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      setCategories((prev) => [...prev, newCategory])
    }

    setEditingCategory(null)
    setIsDialogOpen(false)
  }

  const handleDeleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((cat) => cat.id !== id))
  }

  const toggleCategoryStatus = (id: string) => {
    setCategories((prev) => prev.map((cat) => (cat.id === id ? { ...cat, isActive: !cat.isActive } : cat)))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Categories</h1>
          <p className="text-muted-foreground">Manage your menu categories</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={() => setEditingCategory(null)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingCategory ? "Edit Category" : "Add New Category"}</DialogTitle>
            </DialogHeader>
            <CategoryForm
              category={editingCategory}
              onSave={handleSaveCategory}
              onCancel={() => setIsDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Card key={category.id} className="bg-card">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg text-card-foreground">{category.titlePrimary}</CardTitle>
                <Badge variant={category.isActive ? "default" : "secondary"}>
                  {category.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{category.titleSecondary}</p>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Category Image */}
              {category.image && (
                <div className="aspect-video rounded-lg overflow-hidden">
                  <img
                    src={category.image || "/placeholder.svg"}
                    alt={category.titlePrimary}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = `/placeholder.svg?height=150&width=250&query=${encodeURIComponent(category.titlePrimary)}`
                    }}
                  />
                </div>
              )}

              {category.description && <p className="text-sm text-card-foreground">{category.description}</p>}

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Switch checked={category.isActive} onCheckedChange={() => toggleCategoryStatus(category.id)} />
                  <span className="text-sm text-muted-foreground">Active</span>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditingCategory(category)
                      setIsDialogOpen(true)
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteCategory(category.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function CategoryForm({
  category,
  onSave,
  onCancel,
}: {
  category: Category | null
  onSave: (data: Partial<Category>) => void
  onCancel: () => void
}) {
  const [formData, setFormData] = useState({
    titlePrimary: category?.titlePrimary || "",
    titleSecondary: category?.titleSecondary || "",
    description: category?.description || "",
    image: category?.image || "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="titlePrimary">Primary Title</Label>
          <Input
            id="titlePrimary"
            value={formData.titlePrimary}
            onChange={(e) => setFormData((prev) => ({ ...prev, titlePrimary: e.target.value }))}
            placeholder="e.g., Appetizers"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="titleSecondary">Secondary Title</Label>
          <Input
            id="titleSecondary"
            value={formData.titleSecondary}
            onChange={(e) => setFormData((prev) => ({ ...prev, titleSecondary: e.target.value }))}
            placeholder="e.g., المقبلات"
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
          placeholder="Brief description of the category"
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label>Category Image</Label>
        <div className="space-y-4">
          <ImageUpload value={formData.image} onChange={(url) => setFormData((prev) => ({ ...prev, image: url }))} />
          <div className="flex gap-2">
            <ImageGalleryDialog
              onSelect={(url) => setFormData((prev) => ({ ...prev, image: url }))}
              selectedUrl={formData.image}
            >
              <Button type="button" variant="outline" size="sm">
                <ImageIcon className="h-4 w-4 mr-2" />
                Choose from Gallery
              </Button>
            </ImageGalleryDialog>
          </div>
        </div>
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="submit" className="flex-1 bg-primary text-primary-foreground">
          {category ? "Update" : "Create"} Category
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
