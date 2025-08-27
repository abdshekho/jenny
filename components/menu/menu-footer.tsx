"use client"

import { MapPin, Phone, Clock, Wifi, Instagram, Facebook, Twitter, Truck, PartyPopper, Salad } from "lucide-react"

export function MenuFooter() {
  return (
    <footer className="bg-black/40 text-sidebar-foreground mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="space-y-4 text-white">
            <h3 className="text-lg font-bold text-primary">Contact Us</h3>
            <div className="space-y-3 ">
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="text-sm">Syria - Damascus - Kassaa</span>
              </div>
              <div className="flex items-center gap-3 ">
                <Phone className="h-4 w-4 text-primary" />
                <span className="text-sm">011 444 6633</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-primary" />
                <span className="text-sm">Daily: 11:00 AM - 11:00 PM</span>
              </div>
            </div>
          </div>

          {/* Services */}
          <div className="space-y-4 text-white">
            <h3 className="text-lg font-bold text-primary">Services</h3>
            <div className="space-y-2 text-sm">
              {/* <p>• Dine-in Experience</p> */}
              {/* <p>• Takeaway Orders</p> */}
              {/* <p>• Delivery Service</p> */}
              {/* <p>• Catering Events</p> */}
              <div className="flex items-center gap-2 pt-2">
                <Salad className="h-4 w-4 text-primary" />
                <span>Dine-in Experience</span>
              </div>
              <div className="flex items-center gap-2 pt-2">
                <PartyPopper className="h-4 w-4 text-primary" />
                <span>Catering Events</span>
              </div>
              <div className="flex items-center gap-2 pt-2">
                <Truck className="h-4 w-4 text-primary" />
                <span>Delivery Service</span>
              </div>
              <div className="flex items-center gap-2 pt-2">
                <Wifi className="h-4 w-4 text-primary" />
                <span>Free WiFi Available</span>
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div className="space-y-4 text-white">
            <h3 className="text-lg font-bold text-primary">Follow Us</h3>
            <p className="text-sm text-muted-foreground">Stay updated with our latest dishes and special offers!</p>
            <div className="flex gap-4">
              <div className="p-2 bg-primary rounded-full transition-colors cursor-pointer">
                <Instagram className="h-5 w-5 text-black" />
              </div>
              <div className="p-2 bg-primary rounded-full transition-colors cursor-pointer">
                <Facebook className="h-5 w-5 text-black" />
              </div>
              <div className="p-2 bg-primary rounded-full transition-colors cursor-pointer">
                <Twitter className="h-5 w-5 text-black" />
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-sidebar-border mt-8 pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            © 2025 Jenny's Burger Restaurant. All rights reserved. | Made with ❤️ for food lovers
          </p>
        </div>
      </div>
    </footer>
  )
}
