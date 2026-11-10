import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Service } from "@/types/service";
import { Star, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

// Import card images
import card2dCadDrafting from "@/assets/card-2d-cad-drafting.png";
import cardAutocadTraining from "@/assets/card-autocad-training.png";
import cardAutodeskConstructionCloud from "@/assets/card-autodesk-construction-cloud.png";
import cardBim3dModeling from "@/assets/card-bim-3d-modeling.png";
import cardBimCoordination from "@/assets/card-bim-coordination.png";
import cardConstructionDrawings from "@/assets/card-construction-drawings.png";
import cardCustomServices from "@/assets/card-custom-services.png";
import cardDroneServices from "@/assets/card-drone-services.png";
import cardInventorTraining from "@/assets/card-inventor-training.png";
import cardLidarScanning from "@/assets/card-lidar-scanning.png";
import cardPhotogrammetry from "@/assets/card-photogrammetry.png";
import cardRevitTraining from "@/assets/card-revit-training.png";
import cardScanar from "@/assets/card-scanar.png";
import cardScanar360 from "@/assets/card-scanar-360.png";
import cardScanhub from "@/assets/card-scanhub.png";
import cardSolidworksTraining from "@/assets/card-solidworks-training.png";

// Image mapping
const imageMap: Record<string, string> = {
  "card-2d-cad-drafting": card2dCadDrafting,
  "card-autocad-training": cardAutocadTraining,
  "card-autodesk-construction-cloud": cardAutodeskConstructionCloud,
  "card-bim-3d-modeling": cardBim3dModeling,
  "card-bim-coordination": cardBimCoordination,
  "card-construction-drawings": cardConstructionDrawings,
  "card-custom-services": cardCustomServices,
  "card-drone-services": cardDroneServices,
  "card-inventor-training": cardInventorTraining,
  "card-lidar-scanning": cardLidarScanning,
  "card-photogrammetry": cardPhotogrammetry,
  "card-revit-training": cardRevitTraining,
  "card-scanar": cardScanar,
  "card-scanar-360": cardScanar360,
  "card-scanhub": cardScanhub,
  "card-solidworks-training": cardSolidworksTraining,
};

interface ServiceCardProps {
  service: Service;
  onClick: () => void;
}

const ServiceCard = ({ service, onClick }: ServiceCardProps) => {
  const avgRating = service.reviews.length > 0
    ? service.reviews.reduce((acc, review) => acc + review.rating, 0) / service.reviews.length
    : 0;

  const isPreorder = ["scanar-360", "scanar", "scanhub"].includes(service.id);
  
  // Use images array if available, otherwise fallback to single image
  const images = service.images || [service.image];

  return (
    <Card 
      className="group cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-hover border border-border bg-card relative"
      onClick={onClick}
    >
      {/* Preorder Banner - Only for specific products */}
      {isPreorder && (
        <div className="bg-primary text-primary-foreground py-2 px-4 text-center text-sm font-medium">
          PREORDER ONLY
        </div>
      )}

      {/* Product Image Carousel */}
      <div className="aspect-[4/3] bg-muted flex items-center justify-center relative overflow-hidden">
        {images.length > 1 ? (
          <Carousel className="w-full h-full">
            <CarouselContent>
              {images.map((img, index) => (
                <CarouselItem key={index}>
                  <div className="w-full h-full flex items-center justify-center">
                    {imageMap[img] ? (
                      <img 
                        src={imageMap[img]} 
                        alt={service.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center p-8">
                        <div className="absolute inset-0 bg-gradient-to-br from-transparent to-muted/50" />
                        <span className="text-6xl opacity-40 relative z-10">
                          {service.category === "Hardware" ? "📷" :
                           service.category === "Software" ? "💻" :
                           service.category === "Reality Capture" ? "🎥" : 
                           service.category === "BIM Services" ? "🏗️" : 
                           service.category === "Training" ? "🎓" : "⚙️"}
                        </span>
                      </div>
                    )}
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-2" />
            <CarouselNext className="right-2" />
          </Carousel>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            {imageMap[images[0]] ? (
              <img 
                src={imageMap[images[0]]} 
                alt={service.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center p-8">
                <div className="absolute inset-0 bg-gradient-to-br from-transparent to-muted/50" />
                <span className="text-6xl opacity-40 relative z-10">
                  {service.category === "Hardware" ? "📷" :
                   service.category === "Software" ? "💻" :
                   service.category === "Reality Capture" ? "🎥" : 
                   service.category === "BIM Services" ? "🏗️" : 
                   service.category === "Training" ? "🎓" : "⚙️"}
                </span>
              </div>
            )}
          </div>
        )}
        <Badge variant="secondary" className="absolute top-3 right-3 z-20">
          {service.category}
        </Badge>
      </div>
      
      <div className="p-6 space-y-3">
        <div>
          <h3 className="text-xl font-semibold text-foreground mb-2">
            {service.name}
          </h3>
          
          {service.reviews.length > 0 && (
            <div className="flex items-center gap-1 mb-3">
              <Star className="w-4 h-4 fill-secondary text-secondary" />
              <span className="text-sm font-medium text-foreground">
                {avgRating.toFixed(1)}
              </span>
            </div>
          )}

          <p className="text-sm text-muted-foreground leading-relaxed">
            {service.shortDescription}
          </p>
        </div>

        <div className="pt-4 flex items-end justify-between">
          <div>
            <p className="text-xs text-muted-foreground mb-1">{isPreorder ? "PREORDER PRICE" : "STARTING AT"}</p>
            <p className="text-2xl font-bold text-foreground">
              {service.startingPrice === 0 ? "Contact Us" : `$${service.startingPrice.toLocaleString()}`}
              {service.startingPrice > 0 && <span className="text-sm font-normal text-muted-foreground">/unit</span>}
            </p>
          </div>
          <button 
            className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors"
            aria-label="View details"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </Card>
  );
};

export default ServiceCard;
