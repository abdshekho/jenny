"use client"

import { Clock, MapPin, Phone } from "lucide-react"
import Image from "next/image"

export function MenuHeader() {

  return (
    <header className="text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Image src={ 'logo3.webp' } alt="logo" width={ 200 } height={ 200 } />
            {/* <Image src={ 'logo.jpg' } alt="logo" width={ 60 } height={ 60 } /> */ }
            <div>
              {/* <h1 className="text-4xl font-bold">JENNY'S BURGER</h1> */ }
            </div>
          </div>

          <p className="text-sm md:text-lg opacity-90 max-w-2xl mx-auto">
            Authentic flavors, fresh ingredients, and traditional recipes crafted with love
          </p>

          <div className="flex items-center justify-center flex-wrap gap-3 md:gap-8 text-sm opacity-80">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              <span>Open: 12:00 PM - 01:00 AM</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              <span>Damascus - Kassaa</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-primary" />
              <span>011 4446633</span>
            </div>
          </div>
        </div>
      </div>


    </header>
  )
}
