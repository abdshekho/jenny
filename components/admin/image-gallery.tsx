"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { Search, Trash2, Copy, Check, ImageIcon } from "lucide-react"

interface ImageItem {
  url: string
  filename: string
  size: number
  type: string
  uploadedAt: Date
}

interface ImageGalleryProps {
  onSelect?: (url: string) => void
  selectedUrl?: string
}

export function ImageGallery({ onSelect, selectedUrl }: ImageGalleryProps) {
  const [images, setImages] = useState<ImageItem[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null)

  useEffect(() => {
    loadImages()
  }, [])

  const loadImages = async () => {
    try {
      const response = await fetch("/api/images")
      if (response.ok) {
        const data = await response.json()
        setImages(data.images || [])
      }
    } catch (error) {
      console.error("Failed to load images:", error)
    } finally {
      setLoading(false)
    }
  }

  const deleteImage = async (filename: string) => {
    if (!confirm("Are you sure you want to delete this image?")) return

    try {
      const response = await fetch(`/api/images/${filename}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setImages((prev) => prev.filter((img) => img.filename !== filename))
      }
    } catch (error) {
      console.error("Failed to delete image:", error)
    }
  }

  const copyUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url)
      setCopiedUrl(url)
      setTimeout(() => setCopiedUrl(null), 2000)
    } catch (error) {
      console.error("Failed to copy URL:", error)
    }
  }

  const filteredImages = images.filter((img) => img.filename.toLowerCase().includes(searchTerm.toLowerCase()))

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" />
          <Input
            placeholder="Search images..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Badge variant="outline">{filteredImages.length} images</Badge>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-0">
                <div className="aspect-square bg-muted rounded-t-lg" />
                <div className="p-3 space-y-2">
                  <div className="h-4 bg-muted rounded" />
                  <div className="h-3 bg-muted rounded w-2/3" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredImages.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <ImageIcon className="h-12 w-12 mx-auto mb-4" />
            <p className="text-lg font-medium">
              {searchTerm ? "No images found" : "No images uploaded yet"}
            </p>
            <p className="text-sm">
              {searchTerm ? "Try a different search term" : "Upload some images to get started"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredImages.map((image) => (
            <Card
              key={image.filename}
              className={cn(
                "group cursor-pointer transition-all hover:shadow-md",
                selectedUrl === image.url && "ring-2 ring-primary",
              )}
              onClick={() => onSelect?.(image.url)}
            >
              <CardContent className="p-0">
                <div className="aspect-square relative overflow-hidden rounded-t-lg">
                  <img
                    src={image.url || "/placeholder.svg"}
                    alt={image.filename}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    onError={(e) => {
                      e.currentTarget.src = `/placeholder.svg?height=200&width=200&query=broken image`
                    }}
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={(e) => {
                        e.stopPropagation()
                        copyUrl(image.url)
                      }}
                    >
                      {copiedUrl === image.url ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteImage(image.filename)
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="p-3 space-y-1">
                  <p className="text-sm font-medium truncate">{image.filename}</p>
                  <div className="flex flex-col gap-y-1 items-center justify-between text-xs">
                    <Badge variant="default" className="text-xs text-black">
                      {image.type.split("/")[1].toUpperCase()}
                    </Badge>
                    <span>{formatFileSize(image.size)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

export function ImageGalleryDialog({
  children,
  onSelect,
  selectedUrl,
}: {
  children: React.ReactNode
  onSelect: (url: string) => void
  selectedUrl?: string
}) {
  const [open, setOpen] = useState(false)

  const handleSelect = (url: string) => {
    onSelect(url)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden bg-black">
        <DialogHeader>
          <DialogTitle>Select Image</DialogTitle>
        </DialogHeader>
        <div className="overflow-y-auto">
          <ImageGallery onSelect={handleSelect} selectedUrl={selectedUrl} />
        </div>
      </DialogContent>
    </Dialog>
  )
}
