import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Category from '@/lib/models/Category'
import Product from '@/lib/models/Product'

export async function GET() {
  try {
    await dbConnect()
    
    const [categories, products] = await Promise.all([
      Category.find({ isActive: true }).sort({ order: 1, createdAt: 1 }),
      Product.find({ isActive: true }).populate('categoryId').sort({ order: 1, createdAt: 1 })
    ])
    
    // Transform _id to id for frontend compatibility
    const transformedCategories = categories.map(cat => ({
      ...cat.toObject(),
      id: cat._id.toString()
    }))
    
    const transformedProducts = products.map(prod => ({
      ...prod.toObject(),
      id: prod._id.toString(),
      categoryId: prod.categoryId._id.toString()
    }))
    
    return NextResponse.json({
      success: true,
      data: {
        categories: transformedCategories,
        products: transformedProducts,
        lastUpdated: new Date()
      }
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch menu data' },
      { status: 500 }
    )
  }
}