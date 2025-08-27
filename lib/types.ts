export interface Category {
  _id: string
  titlePrimary: string // Main language title
  titleSecondary: string // Secondary language title
  order: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Product {
  _id: string
  categoryId: string
  titlePrimary: string // Main language title
  titleSecondary: string // Secondary language title
  description?: string
  descriptionAr?: string

  price: number
  originalPrice?: number // For discounted items
  image?: string
  images?: string[] // Multiple product images
  isActive: boolean
  isFeatured: boolean
  order: number
  nutritionInfo?: {
    calories?: number
    protein?: number
    carbs?: number
    fat?: number
  }
  allergens?: string[]
  preparationTime?: number // in minutes
  createdAt: Date
  updatedAt: Date
}

export interface MenuData {
  categories: Category[]
  products: Product[]
  lastUpdated: Date
}

// API Response types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface MenuResponse extends ApiResponse<MenuData> {}
