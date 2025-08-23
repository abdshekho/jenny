"use client"

import { ChefHat, Clock, MapPin } from "lucide-react"

export function MenuHeader() {
  return (
    <header className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <ChefHat className="h-12 w-12" />
            <div>
              <h1 className="text-4xl font-bold">Al Baik Restaurant</h1>
              <p className="text-xl opacity-90">مطعم البيك</p>
            </div>
          </div>

          <p className="text-lg opacity-90 max-w-2xl mx-auto">
            Authentic flavors, fresh ingredients, and traditional recipes crafted with love
          </p>

          <div className="flex items-center justify-center gap-8 text-sm opacity-80">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>Open: 11:00 AM - 11:00 PM</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>Riyadh, Saudi Arabia</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
