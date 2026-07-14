export interface Variant {
  id: string;
  name: string; // e.g., "Chico", "Grande"
  sku: string;
  priceAdjustment: number; // Adjustment relative to the base price, e.g. +1.50
  stock: number;
}

export interface ModifierOption {
  id: string;
  name: string; // e.g., "Queso Extra", "Sin cebolla"
  price: number; // e.g., +1.00
  selectedByDefault: boolean;
}

export interface ModifierGroup {
  id: string;
  name: string; // e.g., "Extras", "Ingredientes"
  required: boolean;
  maxSelections: number; // e.g., 1 for single choice, or 5 for multiple
  options: ModifierOption[];
}

export interface Attribute {
  id: string;
  key: string; // e.g., "Marca", "Proveedor", "Calorías"
  value: string; // e.g., "La Huerta", "Distribuidora Norte", "240 kcal"
}

export interface Product {
  id: string;
  name: string;
  description: string;
  sku: string;
  barcode: string;
  category: string;
  price: number; // Base Price
  cost: number; // Production/Acquisition cost to calculate profit margins
  taxRate: number; // e.g. 16 for 16%, 0 for exempt
  imageUrl: string;
  imageColor: string; // Tailwind color class for solid fallback if no image (e.g., "bg-rose-500")
  trackStock: boolean;
  stock: number;
  lowStockThreshold: number;
  variants: Variant[];
  modifiers: ModifierGroup[];
  attributes: Attribute[];
}

export interface POSPreviewConfig {
  selectedVariantId: string | null;
  selectedModifierOptionIds: string[]; // List of selected option IDs in checkout simulation
}
