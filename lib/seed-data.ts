import dbConnect from './mongodb'
import Category from './models/Category'
import Product from './models/Product'
import { mockCategories, mockProducts } from './mock-data'

export async function seedDatabase() {
  try {
    await dbConnect()
    
    // Clear existing data
    await Category.deleteMany({})
    await Product.deleteMany({})
    
    // Insert categories
    const categoryMap = new Map()
    for (const mockCategory of mockCategories) {
      const { id, createdAt, updatedAt, ...categoryData } = mockCategory
      const category = await Category.create(categoryData)
      categoryMap.set(id, category._id.toString())
    }
    
    // Insert products with correct category references
    for (const mockProduct of mockProducts) {
      const { id, categoryId, createdAt, updatedAt, ...productData } = mockProduct
      const newCategoryId = categoryMap.get(categoryId)
      if (newCategoryId) {
        await Product.create({
          ...productData,
          categoryId: newCategoryId
        })
      }
    }
    
    console.log('Database seeded successfully!')
    return { success: true, message: 'Database seeded successfully' }
  } catch (error) {
    console.error('Error seeding database:', error)
    return { success: false, error: 'Failed to seed database' }
  }
}