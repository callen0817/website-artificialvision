import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Service } from "@/types/service";
import { Star, ShoppingCart, Zap, Check } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ServiceModalProps {
  service: Service | null;
  open: boolean;
  onClose: () => void;
  onAddToCart: (service: Service) => void;
  onBuyNow: (service: Service) => void;
}

const ServiceModal = ({ service, open, onClose, onAddToCart, onBuyNow }: ServiceModalProps) => {
  if (!service) return null;

  const isProduct = ['scanar-360', 'scanar', 'scanhub'].includes(service.id);
  const isScanar = service.id === 'scanar';

  const avgRating = service.reviews.length > 0
    ? service.reviews.reduce((acc, review) => acc + review.rating, 0) / service.reviews.length
    : 0;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
        <ScrollArea className="max-h-[90vh]">
          <div className="p-6 space-y-6">
            <DialogHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <Badge variant="secondary">{service.category}</Badge>
                  <DialogTitle className="text-3xl font-bold">{service.name}</DialogTitle>
                  <p className="text-muted-foreground">{service.shortDescription}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Starting at</p>
                  <p className="text-3xl font-bold text-secondary-foreground">
                    ${service.startingPrice.toLocaleString()}
                  </p>
                </div>
              </div>
            </DialogHeader>

            {service.reviews.length > 0 && (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < avgRating ? "fill-secondary text-secondary" : "text-muted"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {avgRating.toFixed(1)} ({service.reviews.length} reviews)
                </span>
              </div>
            )}

            <Separator />

            <div>
              <h3 className="text-lg font-semibold mb-3">Description</h3>
              <p className="text-muted-foreground leading-relaxed">{service.description}</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Key Features</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {service.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-foreground">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Deliverables</h3>
              <div className="flex flex-wrap gap-2">
                {service.deliverables.map((deliverable, idx) => (
                  <Badge key={idx} variant="outline" className="text-xs">
                    {deliverable}
                  </Badge>
                ))}
              </div>
            </div>

            {service.reviews.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Customer Reviews</h3>
                <div className="space-y-4">
                  {service.reviews.map((review) => (
                    <div key={review.id} className="border border-border rounded-lg p-4 bg-card">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-medium text-foreground">{review.author}</p>
                          <div className="flex items-center gap-1 mt-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3 h-3 ${
                                  i < review.rating ? "fill-secondary text-secondary" : "text-muted"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {new Date(review.date).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-muted/50 rounded-lg p-4 text-sm text-muted-foreground">
              <p className="font-medium text-foreground mb-2">Important Note:</p>
              <p>
                All pricing is subject to confirmation upon site arrival. Final scope and pricing
                will be determined after due diligence. If pricing changes on-site, you'll be
                notified and must confirm before services proceed. Cancellation after finalization
                (1 week before service) or rejection of price changes incurs overhead + 15%
                cancellation fee, unless rescheduled within 90 days.
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              {isScanar ? (
                <>
                  <Button
                    variant="outline"
                    className="flex-1"
                    size="lg"
                    disabled
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Add to Cart
                  </Button>
                  <Button
                    className="flex-1 bg-accent/50 text-accent-foreground cursor-not-allowed"
                    size="lg"
                    disabled
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    Preorder Now
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    onClick={() => {
                      if (isProduct) {
                        onClose();
                        onAddToCart(service);
                      } else {
                        onAddToCart(service);
                      }
                    }}
                    variant="outline"
                    className="flex-1"
                    size="lg"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Add to Cart
                  </Button>
                  <Button
                    onClick={() => {
                      if (isProduct) {
                        onClose();
                        onBuyNow(service);
                      } else {
                        onBuyNow(service);
                      }
                    }}
                    className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground"
                    size="lg"
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    Request Service
                  </Button>
                </>
              )}
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default ServiceModal;
