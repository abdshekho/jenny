"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

import { apiClient } from "@/lib/api-client"
import type { Category } from "@/lib/types"
import { Plus, Edit, Trash2, Loader2 } from "lucide-react"
import { toast } from "sonner"
import Image from "next/image"

export function CategoryManager() {
  const [categories, setCategories] = useState<Category[]>([])
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadCategories()
    console.log('tttttttttttttt', categories);
  }, [])

  const loadCategories = async () => {
    try {
      setLoading(true)
      const response = await apiClient.getCategories()
      if (response.success) {
        setCategories(response.data)
      } else {
        toast.error('Failed to load categories')
      }
    } catch (error) {
      toast.error('Error loading categories')
    } finally {
      setLoading(false)
    }
  }

  const handleSaveCategory = async (categoryData: Partial<Category>) => {
    try {
      setSaving(true)
      if (editingCategory) {
        // Update existing category
        const response = await apiClient.updateCategory(editingCategory._id, categoryData)
        if (response.success) {
          setCategories((prev) =>
            prev.map((cat) => (cat._id === editingCategory._id ? response.data : cat))
          )
          toast.success('Category updated successfully')
        } else {
          toast.error('Failed to update category')
          return
        }
      } else {
        // Create new category
        const response = await apiClient.createCategory(categoryData as Omit<Category, 'id' | 'createdAt' | 'updatedAt'>)
        if (response.success) {
          setCategories((prev) => [...prev, response.data])
          toast.success('Category created successfully')
        } else {
          toast.error('Failed to create category')
          return
        }
      }

      setEditingCategory(null)
      setIsDialogOpen(false)
    } catch (error) {
      toast.error('Error saving category')
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return

    try {
      const response = await apiClient.deleteCategory(id)
      if (response.success) {
        setCategories((prev) => prev.filter((cat) => cat._id !== id))
        toast.success('Category deleted successfully')
      } else {
        // Handle dependency error specifically
        if (response.error?.includes('product(s) are using')) {
          toast.error(response.error, { duration: 5000 })
        } else {
          toast.error('Failed to delete category')
        }
      }
    } catch (error) {
      toast.error('Error deleting category maybe there are products depend on this category')
    }
  }

  const toggleCategoryStatus = async (id: string) => {
    const category = categories.find(cat => cat._id === id)
    if (!category) return

    try {
      const response = await apiClient.updateCategory(id, { isActive: !category.isActive })
      if (response.success) {
        setCategories((prev) => prev.map((cat) => (cat._id === id ? response.data : cat)))
        toast.success(`Category ${response.data.isActive ? 'activated' : 'deactivated'}`)
      } else {
        toast.error('Failed to update category status')
      }
    } catch (error) {
      toast.error('Error updating category status')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Categories</h1>
          <p className="text-muted-foreground">Manage your menu categories</p>
        </div>

        <Dialog open={ isDialogOpen } onOpenChange={ setIsDialogOpen }>
          <DialogTrigger asChild>
            <Button
              className="bg-primary text-black hover:bg-primary/90"
              onClick={ () => setEditingCategory(null) }
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-black">
            <DialogHeader>
              <DialogTitle>{ editingCategory ? "Edit Category" : "Add New Category" }</DialogTitle>
            </DialogHeader>
            <CategoryForm
              category={ editingCategory }
              onSave={ handleSaveCategory }
              onCancel={ () => setIsDialogOpen(false) }
              saving={ saving }
            />
          </DialogContent>
        </Dialog>
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
          { categories.map((category, index) => (
            <Card key={ index } className="bg-black/20">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg text-primary">{ category.titlePrimary }</CardTitle>
                  <Badge variant={ category.isActive ? "default" : "destructive" }>
                    { category.isActive ? "Active" : "Inactive" }
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{ category.titleSecondary }</p>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="text-sm text-muted-foreground">
                  Order: { category.order || 0 }
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Switch checked={ category.isActive } onCheckedChange={ () => toggleCategoryStatus(category._id) } />
                    <span className="text-sm text-muted-foreground">Active</span>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={ () => {
                        setEditingCategory(category)
                        setIsDialogOpen(true)
                      } }
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={ () => handleDeleteCategory(category._id) }
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )) }
        </div>
      ) }
    </div>
  )
}

function CategoryForm({
  category,
  onSave,
  onCancel,
  saving,
}: {
  category: Category | null
  onSave: (data: Partial<Category>) => void
  onCancel: () => void
  saving: boolean
}) {
  const [formData, setFormData] = useState({
    titlePrimary: category?.titlePrimary || "",
    titleSecondary: category?.titleSecondary || "",
    order: category?.order || 0,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <form onSubmit={ handleSubmit } className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="titlePrimary">Primary Title</Label>
          <Input
            id="titlePrimary"
            value={ formData.titlePrimary }
            onChange={ (e) => setFormData((prev) => ({ ...prev, titlePrimary: e.target.value })) }
            placeholder="e.g., Appetizers"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="titleSecondary">Arabic Title</Label>
          <Input
            id="titleSecondary"
            dir="rtl"
            value={ formData.titleSecondary }
            onChange={ (e) => setFormData((prev) => ({ ...prev, titleSecondary: e.target.value })) }
            placeholder="e.g., المقبلات"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="order">Display Order</Label>
        <Input
          id="order"
          type="number"
          className="[&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
          value={ formData.order }
          onChange={ (e) => setFormData((prev) => ({ ...prev, order: parseInt(e.target.value) || 0 })) }
          onFocus={ (e) => e.target.select() }
          placeholder="0"
          min="0"
        />
      </div>





      <div className="flex gap-2 pt-4">
        <Button type="submit" className="flex-1 bg-primary text-black" disabled={ saving }>
          { saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" /> }
          { category ? "Update" : "Create" } Category
        </Button>
        <Button type="button" variant="outline" onClick={ onCancel } disabled={ saving } className="text-black">
          Cancel
        </Button>
      </div>
    </form>
  )
}
