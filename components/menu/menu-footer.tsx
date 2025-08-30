"use client"

import { MapPin, Phone, Clock, Wifi, Instagram, Facebook, Twitter, Truck, PartyPopper, Salad, PhoneOutgoing, PhoneForwarded } from "lucide-react"
import Image from "next/image"

export function MenuFooter() {
  return (
    <footer className="bg-black/40 text-sidebar-foreground mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
          {/* Contact Info */ }
          <div className="space-y-4 text-white">
            <h3 className="text-lg font-bold text-primary">Contact Us</h3>
            <div className="space-y-3 ">
              <a className="flex items-center gap-3" target="_blank" href="https://www.google.com/maps?q=33.5201644897461,36.3164215087891">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="text-sm">Damascus - Kassaa</span>
              </a>
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-primary" />
                <span className="text-sm">Daily: 12:00 PM - 01:00 AM</span>
              </div>
              <a className="flex items-center gap-3 "  target="_blank" href="tel:+0114446633">
                <Phone className="h-4 w-4 text-primary" ></Phone>
                <span className="text-sm">011 4446633</span>
              </a>
              <a className="flex items-center gap-3 " target="_blank" href="tel:+0114424173">
                <PhoneOutgoing className="h-4 w-4 text-primary" />
                <span className="text-sm">011 4424173</span>
              </a>
              <a className="flex items-center gap-3 " target="_blank" href="tel:+0114424174">
                <PhoneForwarded className="h-4 w-4 text-primary" />
                <span className="text-sm">011 4424174 </span>
              </a>
            </div>
          </div>

          {/* Services */ }
          <div className="space-y-4 text-white">
            <h3 className="text-lg font-bold text-primary">Services</h3>
            <div className="space-y-2 text-sm">
              {/* <p>• Dine-in Experience</p> */ }
              {/* <p>• Takeaway Orders</p> */ }
              {/* <p>• Delivery Service</p> */ }
              {/* <p>• Catering Events</p> */ }
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

          {/* Social Media */ }
          <div className="flex flex-col gap-4  text-white">
            <h3 className="text-lg font-bold text-primary">Follow Us</h3>
            <div className="space-y-4">
              <div className="flex gap-3 items-center">
                <div className="p-2 rounded-full transition-colors cursor-pointer">
                  <Image src={ '/bee-order.png' } className="" width={ 130 } height={ 30 } alt="bee-oreder"/>
                </div>
                <div className="p-2 rounded-full transition-colors cursor-pointer">
                  <Image src={ '/movo2.png' } alt="movo" width={ 100 } height={ 30 }/>
                </div>
                
              </div>
            <p className="text-sm text-muted-foreground">Stay updated with our latest dishes and special offers!</p>

              <div className="flex gap-5 items-center">
                <a className="p-2 bg-primary hover:bg-white rounded-full transition-colors cursor-pointer w-9 h-9" target="_blank" href="https://www.instagram.com/jennys_burger25/">
                  <Instagram className="h-5 w-5 text-black" />
                </a>

                <a className="p-2 bg-primary hover:bg-white rounded-full transition-colors cursor-pointer w-9 h-9" target="_blank" href="https://www.facebook.com/profile.php?id=61574583383522">
                  <Facebook className="h-5 w-5 text-black" />
                </a>
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
