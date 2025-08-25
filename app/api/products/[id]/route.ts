import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Product from '@/lib/models/Product'

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect()
    const body = await request.json()
    const product = await Product.findByIdAndUpdate(params.id, body, { new: true }).populate('categoryId')
    
    if (!product) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 })
    }
    
    const transformedProduct = {
      ...product.toObject(),
      id: product._id.toString(),
      categoryId: product.categoryId._id.toString()
    }
    
    return NextResponse.json({ success: true, data: transformedProduct })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update product' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect()
    const product = await Product.findByIdAndDelete(params.id)
    
    if (!product) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 })
    }
    
    return NextResponse.json({ success: true, message: 'Product deleted successfully' })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete product' }, { status: 500 })
  }
}