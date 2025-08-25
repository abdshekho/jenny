"use client"

import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { Badge } from "@/components/ui/badge"

interface CartButtonProps {
  onClick: () => void
}

export function CartButton({ onClick }: CartButtonProps) {
  const { state } = useCart()

  return (
    <Button
      onClick={onClick}
      variant="outline"
      size="lg"
      className="relative text-black"
    >
      <ShoppingCart className="h-5 w-5" />
      {state.itemCount > 0 && (
        <Badge 
          variant="destructive" 
          className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
        >
          {state.itemCount}
        </Badge>
      )}
    </Button>
  )
}