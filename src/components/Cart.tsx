import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ShoppingCart, X, Minus, Plus } from "lucide-react";
import { CartItem } from "@/types/service";

interface CartProps {
  items: CartItem[];
  onRemoveItem: (serviceId: string) => void;
  onUpdateQuantity: (serviceId: string, quantity: number) => void;
  onCheckout: () => void;
}

const Cart = ({ items, onRemoveItem, onUpdateQuantity, onCheckout }: CartProps) => {
  const totalPrice = items.reduce((sum, item) => sum + (item.service.startingPrice * item.quantity), 0);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="lg" className="relative bg-[#fff2cc] text-black hover:bg-[#fff2cc] hover:text-black border-0">
          <ShoppingCart className="w-5 h-5 mr-2" />
          Cart
          {items.length > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 flex items-center justify-center"
            >
              {items.length}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="text-2xl">Shopping Cart</SheetTitle>
        </SheetHeader>
        
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center">
            <ShoppingCart className="w-16 h-16 text-muted-foreground mb-4" />
            <p className="text-lg font-medium text-muted-foreground">Your cart is empty</p>
            <p className="text-sm text-muted-foreground mt-2">Add services to get started</p>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 my-6 pr-4" style={{ height: 'calc(100vh - 250px)' }}>
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.service.id} className="border border-border rounded-lg p-4 bg-card space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground">{item.service.name}</h4>
                        <Badge variant="secondary" className="mt-1 text-xs">
                          {item.service.category}
                        </Badge>
                      </div>
                      <button
                        onClick={() => onRemoveItem(item.service.id)}
                        className="text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {item.selectedDeliverables.length > 0 && (
                      <div className="text-xs text-muted-foreground">
                        <p className="font-medium mb-1">Selected deliverables:</p>
                        <ul className="list-disc list-inside space-y-0.5">
                          {item.selectedDeliverables.map((d, idx) => (
                            <li key={idx}>{d}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {item.notes && (
                      <div className="text-xs text-muted-foreground">
                        <p className="font-medium">Notes: {item.notes}</p>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-2 border-t border-border">
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onUpdateQuantity(item.service.id, Math.max(1, item.quantity - 1))}
                          className="h-8 w-8 p-0"
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onUpdateQuantity(item.service.id, item.quantity + 1)}
                          className="h-8 w-8 p-0"
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                      <p className="font-bold text-secondary-foreground">
                        ${(item.service.startingPrice * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="border-t border-border pt-4 space-y-4">
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total:</span>
                <span className="text-secondary-foreground">${totalPrice.toLocaleString()}</span>
              </div>
              <Button 
                onClick={onCheckout}
                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                size="lg"
              >
                Request Services
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default Cart;
