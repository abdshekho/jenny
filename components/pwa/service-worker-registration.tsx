"use client"

import { useEffect } from "react"

export function ServiceWorkerRegistration() {
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      const registerSW = async () => {
        try {
          console.log("[PWA] Registering service worker...")
          const registration = await navigator.serviceWorker.register("/sw.js", {
            scope: "/",
          })

          console.log("[PWA] Service worker registered successfully:", registration.scope)

          // Handle updates
          registration.addEventListener("updatefound", () => {
            const newWorker = registration.installing
            if (newWorker) {
              console.log("[PWA] New service worker installing...")
              newWorker.addEventListener("statechange", () => {
                if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
                  console.log("[PWA] New service worker installed, prompting for update...")
                  // You could show a toast notification here
                  if (confirm("A new version is available. Refresh to update?")) {
                    window.location.reload()
                  }
                }
              })
            }
          })

          // Listen for messages from service worker
          navigator.serviceWorker.addEventListener("message", (event) => {
            console.log("[PWA] Message from service worker:", event.data)

            if (event.data.type === "MENU_UPDATED") {
              // Show notification that menu has been updated
              console.log("[PWA] Menu data updated")
            }
          })

          // Register for background sync when online
          if ("sync" in window.ServiceWorkerRegistration.prototype) {
            window.addEventListener("online", () => {
              console.log("[PWA] Back online, requesting background sync...")
              registration.sync.register("menu-sync")
            })
          }
        } catch (error) {
          console.error("[PWA] Service worker registration failed:", error)
        }
      }

      registerSW()
    }
  }, [])

  return null
}
