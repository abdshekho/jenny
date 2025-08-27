import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Product from '@/lib/models/Product'

export async function GET(request: NextRequest) {
  try {
    await dbConnect()
    const { searchParams } = new URL(request.url)
    const categoryId = searchParams.get('categoryId')
    
    const filter = categoryId ? { categoryId } : {}
    const products = await Product.find(filter).populate('categoryId').sort({ order: 1, createdAt: 1 })
    
    const transformedProducts = products.map(prod => ({
      ...prod.toObject(),
      id: prod._id.toString(),
      categoryId: prod.categoryId._id.toString()
    }))
    
    return NextResponse.json({ success: true, data: transformedProducts })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch products' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect()
    const body = await request.json()
    
    const lastProduct = await Product.findOne({ categoryId: body.categoryId })
    const order = lastProduct ? lastProduct.order + 1 : 1
    
    const product = await Product.create({ ...body, order })
    const populatedProduct = await Product.findById(product._id).populate('categoryId')
    
    const transformedProduct = {
      ...populatedProduct.toObject(),
      id: populatedProduct._id.toString(),
      categoryId: populatedProduct.categoryId._id.toString()
    }
    
    return NextResponse.json({ success: true, data: transformedProduct }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to create product' }, { status: 500 })
  }
}