"use client"

import { useState } from "react"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminDashboard } from "@/components/admin/admin-dashboard"
import { CategoryManager } from "@/components/admin/category-manager"
import { ProductManager } from "@/components/admin/product-manager"
import { MenuPreview } from "@/components/admin/menu-preview"
import { AdminSettings } from "@/components/admin/admin-settings"

type AdminView = "dashboard" | "categories" | "products" | "preview" | "settings"

export default function AdminPage() {
  const [currentView, setCurrentView] = useState<AdminView>("dashboard")

  const renderCurrentView = () => {
    switch (currentView) {
      case "dashboard":
        return <AdminDashboard />
      case "categories":
        return <CategoryManager />
      case "products":
        return <ProductManager />
      case "preview":
        return <MenuPreview />
      case "settings":
        return <AdminSettings />
      default:
        return <AdminDashboard />
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
