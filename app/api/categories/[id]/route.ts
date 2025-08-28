import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Category from '@/lib/models/Category'
import Product from '@/lib/models/Product'

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect()
    const body = await request.json()
    const category = await Category.findByIdAndUpdate(params.id, body, { new: true })
    
    if (!category) {
      return NextResponse.json({ success: false, error: 'Category not found' }, { status: 404 })
    }
    
    const transformedCategory = {
      ...category.toObject(),
      id: category._id.toString()
    }
    
    return NextResponse.json({ success: true, data: transformedCategory })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update category' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect()
    
    // Check if category exists
    const category = await Category.findById(params.id)
    if (!category) {
      return NextResponse.json({ success: false, error: 'Category not found' }, { status: 404 })
    }
    
    // Check if there are products depending on this category
    const dependentProducts = await Product.countDocuments({ categoryId: params.id })
    if (dependentProducts > 0) {
      return NextResponse.json({ 
        success: false, 
        error: `Cannot delete category. ${dependentProducts} product(s) are using this category.`,
        dependentCount: dependentProducts
      }, { status: 400 })
    }
    
    // Delete the category if no dependencies
    await Category.findByIdAndDelete(params.id)
    
    return NextResponse.json({ success: true, message: 'Category deleted successfully' })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete category' }, { status: 500 })
  }
}