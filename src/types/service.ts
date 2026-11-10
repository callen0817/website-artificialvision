export interface Service {
  id: string;
  category: string;
  name: string;
  description: string;
  shortDescription: string;
  startingPrice: number;
  image: string;
  images?: string[]; // Multiple images for carousel
  features: string[];
  deliverables: string[];
  reviews: Review[];
  formFields?: FormField[];
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
}

export interface FormField {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'multiselect' | 'checkbox' | 'checkboxlist';
  options?: string[];
  required: boolean;
  hasOther?: boolean; // For checkboxlist with "Other" option
}

export interface CartItem {
  service: Service;
  quantity: number;
  selectedDeliverables: string[];
  notes?: string;
  customRequirements?: string;
}

export interface BookingDetails {
  bookingType: 'immediate' | 'consultation';
  timeSlot?: string;
  dateRange?: {
    start: string;
    end: string;
  };
}
