import mongoose from 'mongoose'

const ProductSchema = new mongoose.Schema({
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  titlePrimary: {
    type: String,
    required: true,
    trim: true
  },
  titleSecondary: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },

  price: {
    type: Number,
    required: true,
    min: 0
  },
  originalPrice: {
    type: Number,
    min: 0
  },
  image: {
    type: String,
    trim: true
  },
  images: [{
    type: String,
    trim: true
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  order: {
    type: Number,
    default: 0
  },
  nutritionInfo: {
    calories: Number,
    protein: Number,
    carbs: Number,
    fat: Number
  },
  allergens: [{
    type: String,
    trim: true
  }],
  preparationTime: {
    type: Number,
    min: 0
  }
}, {
  timestamps: true
})

export default mongoose.models.Product || mongoose.model('Product', ProductSchema)