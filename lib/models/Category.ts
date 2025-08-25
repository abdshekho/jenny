import mongoose from 'mongoose'

const CategorySchema = new mongoose.Schema({
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


  order: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
})

export default mongoose.models.Category || mongoose.model('Category', CategorySchema)