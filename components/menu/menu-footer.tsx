"use client"

import { MapPin, Phone, Clock, Wifi, Instagram, Facebook, Twitter } from "lucide-react"

export function MenuFooter() {
  return (
    <footer className="bg-sidebar text-sidebar-foreground mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-sidebar-primary" />
                <span className="text-sm">King Fahd Road, Riyadh 12345, Saudi Arabia</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-sidebar-primary" />
                <span className="text-sm">+966 11 123 4567</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-sidebar-primary" />
                <span className="text-sm">Daily: 11:00 AM - 11:00 PM</span>
              </div>
            </div>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold">Services</h3>
            <div className="space-y-2 text-sm">
              <p>• Dine-in Experience</p>
              <p>• Takeaway Orders</p>
              <p>• Delivery Service</p>
              <p>• Catering Events</p>
              <div className="flex items-center gap-2 pt-2">
                <Wifi className="h-4 w-4 text-sidebar-primary" />
                <span>Free WiFi Available</span>
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold">Follow Us</h3>
            <div className="flex gap-4">
              <div className="p-2 bg-sidebar-accent rounded-full hover:bg-sidebar-primary transition-colors cursor-pointer">
                <Instagram className="h-5 w-5 text-sidebar-accent-foreground" />
              </div>
              <div className="p-2 bg-sidebar-accent rounded-full hover:bg-sidebar-primary transition-colors cursor-pointer">
                <Facebook className="h-5 w-5 text-sidebar-accent-foreground" />
              </div>
              <div className="p-2 bg-sidebar-accent rounded-full hover:bg-sidebar-primary transition-colors cursor-pointer">
                <Twitter className="h-5 w-5 text-sidebar-accent-foreground" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground">Stay updated with our latest dishes and special offers!</p>
          </div>
        </div>

        <div className="border-t border-sidebar-border mt-8 pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            © 2024 Al Baik Restaurant. All rights reserved. | Made with ❤️ for food lovers
          </p>
        </div>
      </div>
    </footer>
  )
}
