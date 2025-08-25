import type { Category, Product } from './types'

class ApiClient {
  private async request<T>(url: string, options?: RequestInit): Promise<T> {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return response.json()
  }

  // Categories
  async getCategories(): Promise<{ success: boolean; data: Category[] }> {
    return this.request('/api/categories')
  }

  async createCategory(category: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>): Promise<{ success: boolean; data: Category }> {
    return this.request('/api/categories', {
      method: 'POST',
      body: JSON.stringify(category),
    })
  }

  async updateCategory(id: string, category: Partial<Category>): Promise<{ success: boolean; data: Category }> {
    return this.request(`/api/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(category),
    })
  }

  async deleteCategory(id: string): Promise<{ success: boolean; message: string }> {
    return this.request(`/api/categories/${id}`, {
      method: 'DELETE',
    })
  }

  // Products
  async getProducts(categoryId?: string): Promise<{ success: boolean; data: Product[] }> {
    const url = categoryId ? `/api/products?categoryId=${categoryId}` : '/api/products'
    return this.request(url)
  }

  async createProduct(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<{ success: boolean; data: Product }> {
    return this.request('/api/products', {
      method: 'POST',
      body: JSON.stringify(product),
    })
  }

  async updateProduct(id: string, product: Partial<Product>): Promise<{ success: boolean; data: Product }> {
    return this.request(`/api/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(product),
    })
  }

  async deleteProduct(id: string): Promise<{ success: boolean; message: string }> {
    return this.request(`/api/products/${id}`, {
      method: 'DELETE',
    })
  }
}

export const apiClient = new ApiClient()