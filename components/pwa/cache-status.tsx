"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Wifi, WifiOff, Download } from "lucide-react"

export function CacheStatus() {
  const [isOnline, setIsOnline] = useState(true)
  const [cacheInfo, setCacheInfo] = useState<{
    images: number
    totalImages: number
  }>({ images: 0, totalImages: 0 })

  useEffect(() => {
    // Monitor online status
    const updateOnlineStatus = () => {
      setIsOnline(navigator.onLine)
    }

    window.addEventListener("online", updateOnlineStatus)
    window.addEventListener("offline", updateOnlineStatus)
    updateOnlineStatus()

    // Get cache information
    const getCacheInfo = async () => {
      if ("caches" in window) {
        try {
          const cache = await caches.open("al-baik-images-v1")
          const keys = await cache.keys()
          setCacheInfo({
            images: keys.length,
            totalImages: 60, // Estimated total images
          })
        } catch (error) {
          console.error("Failed to get cache info:", error)
        }
      }
    }

    getCacheInfo()

    return () => {
      window.removeEventListener("online", updateOnlineStatus)
      window.removeEventListener("offline", updateOnlineStatus)
    }
  }, [])

  return (
    <div className="flex items-center gap-2">
      <Badge variant={isOnline ? "default" : "secondary"} className="gap-1">
        {isOnline ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
        {isOnline ? "Online" : "Offline"}
      </Badge>

      {cacheInfo.images > 0 && (
        <Badge variant="outline" className="gap-1">
          <Download className="h-3 w-3" />
          Images: {cacheInfo.images}/{cacheInfo.totalImages} cached
        </Badge>
      )}
    </div>
  )
}
