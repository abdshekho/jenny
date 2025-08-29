"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { CategoryManager } from "@/components/admin/category-manager"
import { ProductManager } from "@/components/admin/product-manager"
import { Button } from "@/components/ui/button"
import { Loader2, Power } from "lucide-react"

type AdminView = "categories" | "products"

export default function AdminPage() {
  const [currentView, setCurrentView] = useState<AdminView>("categories")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("adminToken")
    if (token) {
      setIsAuthenticated(true)
    } else {
      router.push("/admin/login")
    }
    setLoading(false)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("adminToken")
    router.push("/admin/login")
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

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
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            {/* <h1 className="text-2xl font-bold">لوحة تحكم الآدمن</h1> */}
            <Button onClick={handleLogout} variant="outline" className="text-black">
              <Power className="h-4 w-4" />
              log out
            </Button>
          </div>
          {renderCurrentView()}
        </div>
      </main>
    </div>
  )
}
