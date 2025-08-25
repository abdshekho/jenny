"use client"

import type React from "react"

import { useState, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Upload, X, ImageIcon, Loader2, Check, AlertCircle } from "lucide-react"

interface ImageUploadProps {
  value?: string
  onChange: (url: string) => void
  onRemove?: () => void
  maxSize?: number // in MB
  acceptedTypes?: string[]
  className?: string
}

interface UploadState {
  uploading: boolean
  progress: number
  error?: string
  success?: boolean
}

export function ImageUpload({
  value,
  onChange,
  onRemove,
  maxSize = 5,
  acceptedTypes = ["image/jpeg", "image/png", "image/webp"],
  className,
}: ImageUploadProps) {
  const [uploadState, setUploadState] = useState<UploadState>({
    uploading: false,
    progress: 0,
  })
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const compressImage = useCallback(async (file: File): Promise<File> => {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")!
      const img = new Image()

      img.onload = () => {
        // Calculate new dimensions (max 1200px width, maintain aspect ratio)
        const maxWidth = 1200
        const maxHeight = 800
        let { width, height } = img

        if (width > maxWidth) {
          height = (height * maxWidth) / width
          width = maxWidth
        }

        if (height > maxHeight) {
          width = (width * maxHeight) / height
          height = maxHeight
        }

        canvas.width = width
        canvas.height = height

        // Draw and compress
        ctx.drawImage(img, 0, 0, width, height)

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, ".webp"), {
                type: "image/webp",
                lastModified: Date.now(),
              })
              resolve(compressedFile)
            } else {
              resolve(file)
            }
          },
          "image/webp",
          0.8, // 80% quality
        )
      }

      img.src = URL.createObjectURL(file)
    })
  }, [])

  const uploadImage = useCallback(
    async (file: File) => {
      setUploadState({ uploading: true, progress: 0 })

      try {
        // Validate file
        if (!acceptedTypes.includes(file.type)) {
          throw new Error(`File type ${file.type} not supported`)
        }

        if (file.size > maxSize * 1024 * 1024) {
          throw new Error(`File size must be less than ${maxSize}MB`)
        }

        setUploadState((prev) => ({ ...prev, progress: 20 }))

        // Compress image
        const compressedFile = await compressImage(file)
        setUploadState((prev) => ({ ...prev, progress: 50 }))

        // Create form data
        const formData = new FormData()
        formData.append("file", compressedFile)

        setUploadState((prev) => ({ ...prev, progress: 70 }))

        // Upload to API
        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })

        if (!response.ok) {
          throw new Error("Upload failed")
        }

        const { url } = await response.json()
        setUploadState({ uploading: false, progress: 100, success: true })

        // Call onChange with the new URL
        onChange(url)

        // Reset success state after 2 seconds
        setTimeout(() => {
          setUploadState((prev) => ({ ...prev, success: false }))
        }, 2000)
      } catch (error) {
        setUploadState({
          uploading: false,
          progress: 0,
          error: error instanceof Error ? error.message : "Upload failed",
        })

        // Clear error after 3 seconds
        setTimeout(() => {
          setUploadState((prev) => ({ ...prev, error: undefined }))
        }, 3000)
      }
    },
    [acceptedTypes, maxSize, compressImage, onChange],
  )

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setDragActive(false)

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        uploadImage(e.dataTransfer.files[0])
      }
    },
    [uploadImage],
  )

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        uploadImage(e.target.files[0])
      }
    },
    [uploadImage],
  )

  const handleRemove = useCallback(() => {
    if (onRemove) {
      onRemove()
    } else {
      onChange("")
    }
  }, [onRemove, onChange])

  return (
    <div className={cn("space-y-4", className)}>
      {/* Current Image Preview */}
      {value && !uploadState.uploading && (
        <Card>
          <CardContent className="p-4">
            <div className="relative group">
              <img
                src={value || "/placeholder.svg"}
                alt="Uploaded image"
                className="w-full h-48 object-cover rounded-lg"
                onError={(e) => {
                  e.currentTarget.src = `/placeholder.svg?height=200&width=300&query=image placeholder`
                }}
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleRemove}
                  className="bg-destructive/80 hover:bg-destructive"
                >
                  <X className="h-4 w-4 mr-2" />
                  Remove
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upload Area */}
      <Card
        className={cn(
          "border-2 border-dashed transition-colors",
          dragActive ? "border-primary bg-primary/5" : "border-border",
          uploadState.uploading && "pointer-events-none opacity-50",
        )}
      >
        <CardContent className="p-8">
          <div
            className="text-center space-y-4"
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {uploadState.uploading ? (
              <div className="space-y-4">
                <Loader2 className="h-12 w-12 mx-auto text-primary animate-spin" />
                <div className="space-y-2">
                  <p className="text-sm font-medium">Uploading and compressing...</p>
                  <Progress value={uploadState.progress} className="w-full" />
                  <p className="text-xs text-muted-foreground">{uploadState.progress}% complete</p>
                </div>
              </div>
            ) : uploadState.success ? (
              <div className="space-y-2">
                <Check className="h-12 w-12 mx-auto text-green-500" />
                <p className="text-sm font-medium text-green-600">Upload successful!</p>
              </div>
            ) : uploadState.error ? (
              <div className="space-y-2">
                <AlertCircle className="h-12 w-12 mx-auto text-destructive" />
                <p className="text-sm font-medium text-destructive">{uploadState.error}</p>
                <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                  Try Again
                </Button>
              </div>
            ) : (
              <>
                <ImageIcon className="h-12 w-12 mx-auto" />
                <div className="space-y-2">
                  <p className="text-lg font-medium text-black">Upload an image</p>
                  <p className="text-sm">Drag and drop an image here, or click to select</p>
                </div>

                <div className="flex flex-wrap gap-2 justify-center">
                  <Badge variant="secondary">Max {maxSize}MB</Badge>
                  <Badge variant="secondary">JPG, PNG, WebP</Badge>
                  <Badge variant="secondary">Auto-compressed</Badge>
                </div>

                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="gap-2"
                  disabled={uploadState.uploading}
                >
                  <Upload className="h-4 w-4" />
                  Choose File
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedTypes.join(",")}
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  )
}
