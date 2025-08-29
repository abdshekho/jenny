"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, FolderOpen, Package, Eye, Settings, ChefHat } from "lucide-react"
import Image from "next/image"

interface AdminSidebarProps {
  currentView: string
  onViewChange: (view: any) => any
  onClose?: () => void
}

const sidebarItems = [
  {
    id: "categories",
    label: "Categories",
    icon: FolderOpen,
  },
  {
    id: "products",
    label: "Products",
    icon: Package,
  },
]

export function AdminSidebar({ currentView, onViewChange, onClose }: AdminSidebarProps) {
  return (
    <div className="w-64 bg-black/60 border-r border-sidebar-border">
      <div className="p-6">
        <div className="mb-8">
            <Image src={ 'logo3.webp' } alt="logo" width={ 200 } height={ 200 } />
        </div>

        <nav className="space-y-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon
            return (
              <Button
                key={item.id}
                variant={currentView === item.id ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3 h-12",
                  currentView === item.id
                    ? "bg-primary text-black"
                    : "text-white hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                )}
                onClick={() => {
                  onViewChange(item.id)
                  onClose?.()
                }}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Button>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
