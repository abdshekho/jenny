import type { Category, Product } from "./types"

export class MenuService {
  // Get all active categories
  static getActiveCategories(categories: Category[]): Category[] {
    return categories.filter((category) => category.isActive).sort((a, b) => a.order - b.order)
  }

  // Get products by category
  static getProductsByCategory(products: Product[], categoryId: string): Product[] {
    return products
      .filter((product) => product.categoryId === categoryId && product.isActive)
      .sort((a, b) => a.order - b.order)
  }

  // Get featured products
  static getFeaturedProducts(products: Product[]): Product[] {
    return products.filter((product) => product.isFeatured && product.isActive).sort((a, b) => a.order - b.order)
  }

  // Search products by title
  static searchProducts(products: Product[], query: string): Product[] {
    const searchTerm = query.toLowerCase()
    return products.filter(
      (product) =>
        product.isActive &&
        (product.titlePrimary.toLowerCase().includes(searchTerm) ||
          product.titleSecondary.toLowerCase().includes(searchTerm)),
    )
  }

  // Get category by ID
  static getCategoryById(categories: Category[], id: string): Category | undefined {
    return categories.find((category) => category.id === id)
  }

  // Get product by ID
  static getProductById(products: Product[], id: string): Product | undefined {
    return products.find((product) => product.id === id)
  }

  // Format price with currency
  static formatPrice(price: number, currency = "SP"): string {
    // return `${price.toFixed(2)} ${currency}`
    return `${price} ${currency}`
  }

  // Calculate discounted price
  static getDiscountPercentage(originalPrice: number, currentPrice: number): number {
    return Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
  }

  // Group products by category
  static groupProductsByCategory(
    categories: Category[],
    products: Product[],
  ): Array<{
    category: Category
    products: Product[]
  }> {
    return this.getActiveCategories(categories).map((category) => ({
      category,
      products: this.getProductsByCategory(products, category.id),
    }))
  }
}
