"use client"

import { useState } from "react"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { CategoryManager } from "@/components/admin/category-manager"
import { ProductManager } from "@/components/admin/product-manager"

type AdminView = "categories" | "products"

export default function AdminPage() {
  const [currentView, setCurrentView] = useState<AdminView>("categories")

  const renderCurrentView = () => {
    switch (currentView) {
      case "categories":
        return <CategoryManager />
      case "products":
        return <ProductManager />
      default:
        return <CategoryManager />
    }
  }

  return (
    <div className="flex h-screen">
      <AdminSidebar currentView={currentView} onViewChange={setCurrentView} />
      <main className="flex-1 overflow-auto">
        <div className="p-6">{renderCurrentView()}</div>
      </main>
    </div>
  )
}
