const mongoose = require('mongoose')

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/restaurant-menu'

// Category Schema
const CategorySchema = new mongoose.Schema({
  titlePrimary: { type: String, required: true, trim: true },
  titleSecondary: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  image: { type: String, trim: true },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true })

// Product Schema
const ProductSchema = new mongoose.Schema({
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  titlePrimary: { type: String, required: true, trim: true },
  titleSecondary: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  ingredients: [{ type: String, trim: true }],
  price: { type: Number, required: true, min: 0 },
  originalPrice: { type: Number, min: 0 },
  image: { type: String, trim: true },
  images: [{ type: String, trim: true }],
  isActive: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  order: { type: Number, default: 0 },
  nutritionInfo: {
    calories: Number,
    protein: Number,
    carbs: Number,
    fat: Number
  },
  allergens: [{ type: String, trim: true }],
  preparationTime: { type: Number, min: 0 }
}, { timestamps: true })

const Category = mongoose.model('Category', CategorySchema)
const Product = mongoose.model('Product', ProductSchema)

// Sample data
const categories = [
  {
    titlePrimary: "Appetizers",
    titleSecondary: "المقبلات",

    order: 1,
    isActive: true
  },
  {
    titlePrimary: "Main Courses",
    titleSecondary: "الأطباق الرئيسية",

    order: 2,
    isActive: true
  },
  {
    titlePrimary: "Desserts",
    titleSecondary: "الحلويات",

    order: 3,
    isActive: true
  },
  {
    titlePrimary: "Beverages",
    titleSecondary: "المشروبات",

    order: 4,
    isActive: true
  }
]

async function seedDatabase() {
  try {
    await mongoose.connect(MONGODB_URI)
    console.log('Connected to MongoDB')
    
    // Clear existing data
    await Category.deleteMany({})
    await Product.deleteMany({})
    console.log('Cleared existing data')
    
    // Insert categories
    const insertedCategories = await Category.insertMany(categories)
    console.log('Categories inserted:', insertedCategories.length)
    
    // Create products for each category
    const products = []
    
    // Appetizers
    products.push({
      categoryId: insertedCategories[0]._id,
      titlePrimary: "Hummus Plate",
      titleSecondary: "طبق الحمص",
      description: "Creamy hummus served with fresh vegetables and pita bread",

      price: 12.99,
      image: "/images/products/hummus.jpg",
      isActive: true,
      isFeatured: true,
      order: 1,
      nutritionInfo: { calories: 180, protein: 8, carbs: 20, fat: 9 },
      allergens: ["sesame"],
      preparationTime: 5
    })
    
    products.push({
      categoryId: insertedCategories[0]._id,
      titlePrimary: "Stuffed Grape Leaves",
      titleSecondary: "ورق العنب المحشي",
      description: "Traditional grape leaves stuffed with rice and herbs",

      price: 15.99,
      image: "/images/products/grape-leaves.jpg",
      isActive: true,
      isFeatured: false,
      order: 2,
      nutritionInfo: { calories: 220, protein: 4, carbs: 35, fat: 8 },
      preparationTime: 10
    })
    
    // Main Courses
    products.push({
      categoryId: insertedCategories[1]._id,
      titlePrimary: "Grilled Chicken Shawarma",
      titleSecondary: "شاورما الدجاج المشوي",
      description: "Tender grilled chicken with garlic sauce and vegetables",

      price: 18.99,
      originalPrice: 22.99,
      image: "/images/products/chicken-shawarma.jpg",
      isActive: true,
      isFeatured: true,
      order: 1,
      nutritionInfo: { calories: 450, protein: 35, carbs: 30, fat: 20 },
      preparationTime: 15
    })
    
    products.push({
      categoryId: insertedCategories[1]._id,
      titlePrimary: "Lamb Kabsa",
      titleSecondary: "كبسة اللحم",
      description: "Traditional spiced rice with tender lamb",
      price: 24.99,
      image: "/images/products/lamb-kabsa.jpg",
      isActive: true,
      isFeatured: true,
      order: 2,
      nutritionInfo: { calories: 580, protein: 40, carbs: 45, fat: 25 },
      preparationTime: 25
    })
    
    // Desserts
    products.push({
      categoryId: insertedCategories[2]._id,
      titlePrimary: "Baklava",
      titleSecondary: "البقلاوة",
      description: "Layers of phyllo pastry with nuts and honey",

      price: 8.99,
      image: "/images/products/baklava.jpg",
      isActive: true,
      isFeatured: false,
      order: 1,
      nutritionInfo: { calories: 320, protein: 6, carbs: 35, fat: 18 },
      allergens: ["nuts", "gluten"],
      preparationTime: 5
    })
    
    // Beverages
    products.push({
      categoryId: insertedCategories[3]._id,
      titlePrimary: "Fresh Orange Juice",
      titleSecondary: "عصير البرتقال الطازج",
      description: "Freshly squeezed orange juice",

      price: 6.99,
      image: "/images/products/orange-juice.jpg",
      isActive: true,
      isFeatured: false,
      order: 1,
      nutritionInfo: { calories: 110, protein: 2, carbs: 26, fat: 0 },
      preparationTime: 3
    })
    
    // Insert products
    const insertedProducts = await Product.insertMany(products)
    console.log('Products inserted:', insertedProducts.length)
    
    console.log('Database seeded successfully!')
    process.exit(0)
    
  } catch (error) {
    console.error('Error seeding database:', error)
    process.exit(1)
  }
}

seedDatabase()