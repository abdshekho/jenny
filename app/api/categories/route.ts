import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Category from '@/lib/models/Category'

export async function GET() {
  try {
    await dbConnect()
    const categories = await Category.find({}).sort({ order: 1, createdAt: 1 })
    const transformedCategories = categories.map(cat => ({
      ...cat.toObject(),
      id: cat._id.toString()
    }))
    return NextResponse.json({ success: true, data: transformedCategories })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch categories' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect()
    const body = await request.json()
    
    const lastCategory = await Category.findOne().sort({ order: -1 })
    const order = lastCategory ? lastCategory.order + 1 : 1
    
    const category = await Category.create({ ...body, order })
    const transformedCategory = {
      ...category.toObject(),
      id: category._id.toString()
    }
    return NextResponse.json({ success: true, data: transformedCategory }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to create category' }, { status: 500 })
  }
}