import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Service, CartItem } from "@/types/service";
import { Calendar as CalendarIcon, Clock } from "lucide-react";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface BookingModalProps {
  service: Service | null;
  open: boolean;
  onClose: () => void;
  onComplete: (cartItem: CartItem) => void;
}

const BookingModal = ({ service, open, onClose, onComplete }: BookingModalProps) => {
  const [selectedDeliverables, setSelectedDeliverables] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [customRequirements, setCustomRequirements] = useState("");
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>("");

  const isCustomService = service?.id === "custom-services";
  const isProduct = ['scanar-360', 'scanar', 'scanhub'].includes(service?.id || '');
  const showBookingType = !isCustomService && !isProduct;

  const timeSlots = [
    "8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM",
    "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM",
    "4:00 PM", "5:00 PM", "6:00 PM"
  ];

  if (!service) return null;

  const handleDeliverablesChange = (deliverable: string, checked: boolean) => {
    if (checked) {
      setSelectedDeliverables([...selectedDeliverables, deliverable]);
    } else {
      setSelectedDeliverables(selectedDeliverables.filter((d) => d !== deliverable));
    }
  };

  const handleSubmit = () => {
    // Only require deliverables if service has them
    if (service.deliverables.length > 0 && selectedDeliverables.length === 0) {
      toast.error("Please select at least one deliverable");
      return;
    }

    const cartItem: CartItem = {
      service,
      quantity: 1,
      selectedDeliverables,
      notes: notes || undefined,
      customRequirements: customRequirements || undefined,
    };

    onComplete(cartItem);
    toast.success("Added to cart!");
    
    // Reset form
    setSelectedDeliverables([]);
    setNotes("");
    setCustomRequirements("");
    setFormData({});
    setStartDate(undefined);
    setEndDate(undefined);
    setSelectedTime("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] p-0">
        <ScrollArea className="max-h-[90vh]">
          <div className="p-6 space-y-6">
            <DialogHeader>
              <DialogTitle className="text-2xl">Configure Service</DialogTitle>
              <p className="text-muted-foreground">{service.name}</p>
            </DialogHeader>

            <div className="space-y-6">
              {showBookingType && (
                <div>
                  <Label className="text-base font-semibold mb-3 block">Service Request</Label>
                  <div className="flex items-start space-x-3 border border-accent/50 bg-accent/5 rounded-lg p-4">
                    <Clock className="w-5 h-5 text-accent mt-0.5" />
                    <div className="flex-1">
                      <div className="font-semibold">Request Service</div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Configure your service details below. After adding to cart, you can submit your request and our team will contact you to finalize scheduling and pricing.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Scheduling */}
              {!isProduct && (
              <div className="space-y-4">
                <Label className="text-base font-semibold">Schedule Service</Label>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="time-slot">Time Slot</Label>
                    <select
                      id="time-slot"
                      value={selectedTime}
                      onChange={(e) => setSelectedTime(e.target.value)}
                      className="w-full mt-1 px-3 py-2 border border-input rounded-md bg-background"
                    >
                      <option value="">Select time...</option>
                      {timeSlots.map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <Label>Start Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full mt-1 justify-start text-left font-normal",
                            !startDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {startDate ? format(startDate, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={startDate}
                          onSelect={setStartDate}
                          initialFocus
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div>
                  <Label>End Date (Optional)</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full mt-1 justify-start text-left font-normal",
                          !endDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {endDate ? format(endDate, "PPP") : "Pick an end date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={setEndDate}
                        initialFocus
                        disabled={(date) => startDate ? date < startDate : false}
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              )}

              {!isProduct && service.deliverables.length > 0 && (
                <div>
                  <Label className="text-base font-semibold mb-3 block">
                    Select Deliverables <span className="text-destructive">*</span>
                  </Label>
                  <div className="space-y-2 border border-border rounded-lg p-4">
                    {service.deliverables.map((deliverable, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <Checkbox
                          id={`deliverable-${idx}`}
                          checked={selectedDeliverables.includes(deliverable)}
                          onCheckedChange={(checked) => handleDeliverablesChange(deliverable, checked as boolean)}
                        />
                        <Label
                          htmlFor={`deliverable-${idx}`}
                          className="text-sm cursor-pointer"
                        >
                          {deliverable}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {!isProduct && service.formFields && service.formFields.length > 0 && (
                <div className="space-y-4">
                  <Label className="text-base font-semibold">Additional Information</Label>
                  {service.formFields.map((field) => (
                    <div key={field.id}>
                      <Label htmlFor={field.id}>
                        {field.label}
                        {field.required && <span className="text-destructive"> *</span>}
                      </Label>
                      {field.type === "textarea" ? (
                        <Textarea
                          id={field.id}
                          value={formData[field.id] || ""}
                          onChange={(e) => setFormData({ ...formData, [field.id]: e.target.value })}
                          className="mt-1"
                        />
                      ) : field.type === "select" ? (
                        <select
                          id={field.id}
                          value={formData[field.id] || ""}
                          onChange={(e) => setFormData({ ...formData, [field.id]: e.target.value })}
                          className="w-full mt-1 px-3 py-2 border border-input rounded-md bg-background"
                        >
                          <option value="">Select...</option>
                          {field.options?.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      ) : field.type === "checkboxlist" ? (
                        <div className="mt-2 space-y-2 border border-border rounded-lg p-4">
                          {field.options?.map((option) => (
                            <div key={option}>
                              {option === "Other" && field.hasOther ? (
                                <div className="flex items-center gap-2">
                                  <Checkbox
                                    id={`${field.id}-${option}`}
                                    checked={formData[field.id]?.includes(option) || false}
                                    onCheckedChange={(checked) => {
                                      const currentValues = formData[field.id] || [];
                                      if (checked) {
                                        setFormData({
                                          ...formData,
                                          [field.id]: [...currentValues, option]
                                        });
                                      } else {
                                        setFormData({
                                          ...formData,
                                          [field.id]: currentValues.filter((v: string) => v !== option),
                                          [`${field.id}-other-text`]: ""
                                        });
                                      }
                                    }}
                                  />
                                  <Label htmlFor={`${field.id}-${option}`} className="cursor-pointer flex-shrink-0">
                                    {option}
                                  </Label>
                                  <Input
                                    type="text"
                                    placeholder="Specify..."
                                    value={formData[`${field.id}-other-text`] || ""}
                                    onChange={(e) => setFormData({
                                      ...formData,
                                      [`${field.id}-other-text`]: e.target.value
                                    })}
                                    className="flex-1"
                                    disabled={!formData[field.id]?.includes(option)}
                                  />
                                </div>
                              ) : (
                                <div className="flex items-center gap-2">
                                  <Checkbox
                                    id={`${field.id}-${option}`}
                                    checked={formData[field.id]?.includes(option) || false}
                                    onCheckedChange={(checked) => {
                                      const currentValues = formData[field.id] || [];
                                      if (checked) {
                                        setFormData({
                                          ...formData,
                                          [field.id]: [...currentValues, option]
                                        });
                                      } else {
                                        setFormData({
                                          ...formData,
                                          [field.id]: currentValues.filter((v: string) => v !== option)
                                        });
                                      }
                                    }}
                                  />
                                  <Label htmlFor={`${field.id}-${option}`} className="cursor-pointer">
                                    {option}
                                  </Label>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <Input
                          id={field.id}
                          type={field.type}
                          value={formData[field.id] || ""}
                          onChange={(e) => setFormData({ ...formData, [field.id]: e.target.value })}
                          className="mt-1"
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}

              {!isProduct && (
              <div>
                <Label htmlFor="notes" className="text-base font-semibold">Additional Notes</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any specific requirements or notes for this service..."
                  className="mt-2"
                  rows={3}
                />
              </div>
              )}

              {!isCustomService && !isProduct && (
                <div>
                  <Label htmlFor="custom" className="text-base font-semibold">Other Requirements (Not Listed)</Label>
                  <Textarea
                    id="custom"
                    value={customRequirements}
                    onChange={(e) => setCustomRequirements(e.target.value)}
                    placeholder="Describe any custom requirements not listed above..."
                    className="mt-2"
                    rows={3}
                  />
                </div>
              )}

              <div className="bg-muted/50 rounded-lg p-4 text-sm text-muted-foreground">
                <p className="font-medium text-foreground mb-1">Pricing Disclaimer:</p>
                <p>
                  Final pricing will be confirmed upon site arrival and after due diligence. You will be
                  notified of any price changes and must approve before services are rendered.
                </p>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={onClose} className="flex-1">
                  Cancel
                </Button>
                <Button 
                  onClick={handleSubmit}
                  className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground"
                >
                  Add to Cart
                </Button>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default BookingModal;
