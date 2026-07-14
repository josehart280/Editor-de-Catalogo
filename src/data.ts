import { Product } from "./types";

export const PRESET_CATEGORIES = [
  "🍔 Comida Rápida",
  "☕ Cafetería",
  "🍰 Repostería",
  "👕 Ropa y Retail",
  "🥤 Bebidas Frías",
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: "prod-1",
    name: "Hamburguesa Gourmet Doble",
    description: "Doble carne premium angus de 150g, queso cheddar fundido, cebolla caramelizada y salsa secreta de la casa en pan brioche.",
    sku: "HAM-DBL-001",
    barcode: "750103504121",
    category: "🍔 Comida Rápida",
    price: 12.50,
    cost: 4.80,
    taxRate: 16,
    imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80",
    imageColor: "from-amber-500 to-orange-600",
    trackStock: true,
    stock: 45,
    lowStockThreshold: 10,
    variants: [
      {
        id: "var-1-1",
        name: "Sencilla (1 Carne)",
        sku: "HAM-SNG-001",
        priceAdjustment: -2.50,
        stock: 30,
      },
      {
        id: "var-1-2",
        name: "Doble Tradicional",
        sku: "HAM-DBL-001",
        priceAdjustment: 0.00,
        stock: 45,
      },
      {
        id: "var-1-3",
        name: "Mega Triple (+Tocino)",
        sku: "HAM-TPL-001",
        priceAdjustment: 3.50,
        stock: 15,
      },
    ],
    modifiers: [
      {
        id: "mod-1",
        name: "Ingredientes Extras",
        required: false,
        maxSelections: 4,
        options: [
          { id: "opt-1-1", name: "Queso Cheddar Extra", price: 1.20, selectedByDefault: false },
          { id: "opt-1-2", name: "Tocineta Crujiente", price: 1.80, selectedByDefault: true },
          { id: "opt-1-3", name: "Huevo Estrellado", price: 1.50, selectedByDefault: false },
          { id: "opt-1-4", name: "Aguacate Fresco", price: 1.00, selectedByDefault: false },
        ]
      },
      {
        id: "mod-2",
        name: "Término de la Carne",
        required: true,
        maxSelections: 1,
        options: [
          { id: "opt-2-1", name: "Término Medio", price: 0.00, selectedByDefault: false },
          { id: "opt-2-2", name: "Tres Cuartos", price: 0.00, selectedByDefault: true },
          { id: "opt-2-3", name: "Bien Cocido", price: 0.00, selectedByDefault: false },
        ]
      }
    ],
    attributes: [
      { id: "attr-1-1", key: "Origen de Carne", value: "Angus Certificado" },
      { id: "attr-1-2", key: "Alergénicos", value: "Gluten, Lácteos" },
      { id: "attr-1-3", key: "Picante", value: "No" },
    ]
  },
  {
    id: "prod-2",
    name: "Iced Latte Premium",
    description: "Doble shot de espresso de grano de especialidad local de altura, leche fría batida y hielo. Endulzado a elección.",
    sku: "BEV-LAT-002",
    barcode: "750201101982",
    category: "☕ Cafetería",
    price: 4.50,
    cost: 1.10,
    taxRate: 16,
    imageUrl: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=600&auto=format&fit=crop&q=80",
    imageColor: "from-amber-700 to-amber-900",
    trackStock: false,
    stock: 999,
    lowStockThreshold: 5,
    variants: [
      {
        id: "var-2-1",
        name: "Regular (12 oz)",
        sku: "BEV-LAT-REG",
        priceAdjustment: 0.00,
        stock: 999,
      },
      {
        id: "var-2-2",
        name: "Grande (16 oz)",
        sku: "BEV-LAT-GRD",
        priceAdjustment: 1.00,
        stock: 999,
      },
    ],
    modifiers: [
      {
        id: "mod-2-1",
        name: "Tipo de Leche",
        required: true,
        maxSelections: 1,
        options: [
          { id: "opt-3-1", name: "Leche Entera", price: 0.00, selectedByDefault: true },
          { id: "opt-3-2", name: "Leche Deslactosada", price: 0.00, selectedByDefault: false },
          { id: "opt-3-3", name: "Bebida de Almendras", price: 0.80, selectedByDefault: false },
          { id: "opt-3-4", name: "Bebida de Avena", price: 1.00, selectedByDefault: false },
        ]
      },
      {
        id: "mod-2-2",
        name: "Saborizantes",
        required: false,
        maxSelections: 2,
        options: [
          { id: "opt-4-1", name: "Jarabe de Vainilla", price: 0.50, selectedByDefault: false },
          { id: "opt-4-2", name: "Caramelo Salado", price: 0.60, selectedByDefault: false },
          { id: "opt-4-3", name: "Crema Batida", price: 0.70, selectedByDefault: false },
        ]
      }
    ],
    attributes: [
      { id: "attr-2-1", key: "Tipo de Grano", value: "Arábica Lavado" },
      { id: "attr-2-2", key: "Región del Café", value: "Chiapas, MX (1,200m)" },
      { id: "attr-2-3", key: "Vegano", value: "Opcional (con leche vegetal)" },
    ]
  },
  {
    id: "prod-3",
    name: "Pastel Fudge de Chocolate",
    description: "Rebanada de pastel húmedo de chocolate oscuro cubierto con fudge de chocolate belga y chispas semi-amargas.",
    sku: "POS-CHO-003",
    barcode: "750401201931",
    category: "🍰 Repostería",
    price: 6.00,
    cost: 1.80,
    taxRate: 8,
    imageUrl: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&auto=format&fit=crop&q=80",
    imageColor: "from-rose-950 to-stone-900",
    trackStock: true,
    stock: 12,
    lowStockThreshold: 4,
    variants: [],
    modifiers: [
      {
        id: "mod-3-1",
        name: "Acompañamiento",
        required: false,
        maxSelections: 1,
        options: [
          { id: "opt-5-1", name: "Bola de Helado Vainilla", price: 2.00, selectedByDefault: false },
          { id: "opt-5-2", name: "Fresas Frescas", price: 1.20, selectedByDefault: false },
          { id: "opt-5-3", name: "Salsa de Frambuesa", price: 0.80, selectedByDefault: false },
        ]
      }
    ],
    attributes: [
      { id: "attr-3-1", key: "Porción", value: "Rebanada individual" },
      { id: "attr-3-2", key: "Calorías", value: "420 kcal" },
      { id: "attr-3-3", key: "Azúcar", value: "Alta" },
    ]
  },
  {
    id: "prod-4",
    name: "Playera Clásica Algodón Orgánico",
    description: "Playera básica unisex confeccionada en 100% algodón orgánico certificado. Suave, transpirable y de corte clásico.",
    sku: "RET-TEE-004",
    barcode: "193854019231",
    category: "👕 Ropa y Retail",
    price: 25.00,
    cost: 8.50,
    taxRate: 16,
    imageUrl: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80",
    imageColor: "from-sky-400 to-indigo-600",
    trackStock: true,
    stock: 120,
    lowStockThreshold: 15,
    variants: [
      { id: "var-4-1", name: "Color Blanco - Chica (S)", sku: "RET-TEE-WHT-S", priceAdjustment: 0.00, stock: 35 },
      { id: "var-4-2", name: "Color Blanco - Mediana (M)", sku: "RET-TEE-WHT-M", priceAdjustment: 0.00, stock: 40 },
      { id: "var-4-3", name: "Color Blanco - Grande (L)", sku: "RET-TEE-WHT-L", priceAdjustment: 0.00, stock: 20 },
      { id: "var-4-4", name: "Color Negro - Chica (S)", sku: "RET-TEE-BLK-S", priceAdjustment: 1.50, stock: 12 },
      { id: "var-4-5", name: "Color Negro - Mediana (M)", sku: "RET-TEE-BLK-M", priceAdjustment: 1.50, stock: 13 },
    ],
    modifiers: [
      {
        id: "mod-4-1",
        name: "Servicio de Regalo",
        required: false,
        maxSelections: 1,
        options: [
          { id: "opt-6-1", name: "Envoltura Premium + Moño", price: 3.50, selectedByDefault: false },
          { id: "opt-6-2", name: "Bolsa de Tela Ecológica", price: 1.50, selectedByDefault: false },
        ]
      }
    ],
    attributes: [
      { id: "attr-4-1", key: "Material", value: "100% Algodón Orgánico" },
      { id: "attr-4-2", key: "Hecho en", value: "México (Comercio Justo)" },
      { id: "attr-4-3", key: "Instrucciones de Lavado", value: "Lavar con agua fría, no usar secadora" },
    ]
  }
];

export const MOCK_PRESET_IMAGES = [
  {
    name: "🍔 Hamburguesa clásica",
    url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80"
  },
  {
    name: "🍕 Pizza Italiana",
    url: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop&q=80"
  },
  {
    name: "☕ Café Latte / Cappuccino",
    url: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=600&auto=format&fit=crop&q=80"
  },
  {
    name: "🍰 Pastel de Chocolate",
    url: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&auto=format&fit=crop&q=80"
  },
  {
    name: "🥤 Bebida / Cocktail",
    url: "https://images.unsplash.com/photo-1536935338788-846bb9981813?w=600&auto=format&fit=crop&q=80"
  },
  {
    name: "👕 Playera Unisex",
    url: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80"
  },
  {
    name: "👟 Tenis Deportivos",
    url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80"
  },
  {
    name: "🥗 Ensalada Saludable",
    url: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&auto=format&fit=crop&q=80"
  },
];
