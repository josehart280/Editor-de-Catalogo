import React, { useState } from "react";
import { Product, Variant, ModifierGroup, ModifierOption, Attribute } from "../types";
import { PRESET_CATEGORIES, MOCK_PRESET_IMAGES } from "../data";
import {
  Info,
  DollarSign,
  Image as ImageIcon,
  Layers,
  Database,
  Plus,
  Trash2,
  ListPlus,
  Settings,
  HelpCircle,
  TrendingUp,
  Tag,
  FolderPlus,
  Sliders,
  Check,
  ChevronDown,
  Upload
} from "lucide-react";

interface ProductFormProps {
  product: Product;
  onUpdateProduct: (updated: Product) => void;
  onDeleteProduct: (id: string) => void;
}

export default function ProductForm({
  product,
  onUpdateProduct,
  onDeleteProduct,
}: ProductFormProps) {
  // Local state for adding custom categories
  const [customCategory, setCustomCategory] = useState("");
  const [showCustomCategoryInput, setShowCustomCategoryInput] = useState(false);

  // Active form section tab for clean mobile navigation
  const [activeTab, setActiveTab] = useState<"basic" | "pricing" | "media" | "inventory" | "variants" | "modifiers" | "specs">("basic");

  // Helper to trigger updates
  const handleFieldChange = (field: keyof Product, value: any) => {
    onUpdateProduct({
      ...product,
      [field]: value,
    });
  };

  // --- 1. Margin & Cost Calculations ---
  const price = product.price || 0;
  const cost = product.cost || 0;
  const profit = price - cost;
  const marginPercentage = price > 0 ? (profit / price) * 100 : 0;

  // Margin color helper
  const getMarginBadgeClass = (percentage: number) => {
    if (percentage >= 50) return { bg: "bg-emerald-50 border-emerald-200 text-emerald-700", meter: "bg-emerald-500" };
    if (percentage >= 20) return { bg: "bg-amber-50 border-amber-200 text-amber-700", meter: "bg-amber-500" };
    return { bg: "bg-rose-50 border-rose-200 text-rose-700", meter: "bg-rose-500" };
  };
  const marginStyle = getMarginBadgeClass(marginPercentage);

  // --- 2. Dynamic Category Handlers ---
  const handleAddCustomCategory = () => {
    if (customCategory.trim()) {
      handleFieldChange("category", customCategory.trim());
      setCustomCategory("");
      setShowCustomCategoryInput(false);
    }
  };

  // --- 3. Dynamic Variants Handlers ---
  const handleAddVariant = () => {
    const newVariant: Variant = {
      id: `var-${Date.now()}`,
      name: "Nueva Variante",
      sku: `${product.sku || "SKU"}-VAR-${product.variants.length + 1}`,
      priceAdjustment: 0,
      stock: 10,
    };
    handleFieldChange("variants", [...product.variants, newVariant]);
  };

  const handleUpdateVariant = (index: number, key: keyof Variant, value: any) => {
    const updatedVariants = [...product.variants];
    updatedVariants[index] = {
      ...updatedVariants[index],
      [key]: value,
    };
    handleFieldChange("variants", updatedVariants);
  };

  const handleRemoveVariant = (index: number) => {
    const updatedVariants = product.variants.filter((_, i) => i !== index);
    handleFieldChange("variants", updatedVariants);
  };

  // --- 4. Dynamic Modifier Groups Handlers ---
  const handleAddModifierGroup = () => {
    const newGroup: ModifierGroup = {
      id: `modg-${Date.now()}`,
      name: "Opciones Extras",
      required: false,
      maxSelections: 1,
      options: [
        { id: `mopt-${Date.now()}-1`, name: "Opción 1", price: 0, selectedByDefault: false }
      ]
    };
    handleFieldChange("modifiers", [...product.modifiers, newGroup]);
  };

  const handleUpdateModifierGroup = (groupIndex: number, key: keyof ModifierGroup, value: any) => {
    const updatedModifiers = [...product.modifiers];
    updatedModifiers[groupIndex] = {
      ...updatedModifiers[groupIndex],
      [key]: value,
    };
    handleFieldChange("modifiers", updatedModifiers);
  };

  const handleRemoveModifierGroup = (groupIndex: number) => {
    const updatedModifiers = product.modifiers.filter((_, i) => i !== groupIndex);
    handleFieldChange("modifiers", updatedModifiers);
  };

  // Modifiers Options Nesting Actions
  const handleAddModifierOption = (groupIndex: number) => {
    const newOption: ModifierOption = {
      id: `mopt-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      name: "Nuevo Extra",
      price: 0.50,
      selectedByDefault: false,
    };
    const updatedModifiers = [...product.modifiers];
    updatedModifiers[groupIndex] = {
      ...updatedModifiers[groupIndex],
      options: [...updatedModifiers[groupIndex].options, newOption],
    };
    handleFieldChange("modifiers", updatedModifiers);
  };

  const handleUpdateModifierOption = (groupIndex: number, optionIndex: number, key: keyof ModifierOption, value: any) => {
    const updatedModifiers = [...product.modifiers];
    const updatedOptions = [...updatedModifiers[groupIndex].options];
    updatedOptions[optionIndex] = {
      ...updatedOptions[optionIndex],
      [key]: value,
    };
    updatedModifiers[groupIndex] = {
      ...updatedModifiers[groupIndex],
      options: updatedOptions,
    };
    handleFieldChange("modifiers", updatedModifiers);
  };

  const handleRemoveModifierOption = (groupIndex: number, optionIndex: number) => {
    const updatedModifiers = [...product.modifiers];
    const updatedOptions = updatedModifiers[groupIndex].options.filter((_, i) => i !== optionIndex);
    updatedModifiers[groupIndex] = {
      ...updatedModifiers[groupIndex],
      options: updatedOptions,
    };
    handleFieldChange("modifiers", updatedModifiers);
  };

  // --- 5. Dynamic Attributes/Specs Handlers ---
  const handleAddAttribute = () => {
    const newAttr: Attribute = {
      id: `attr-${Date.now()}`,
      key: "Especificación",
      value: "Detalle",
    };
    handleFieldChange("attributes", [...product.attributes, newAttr]);
  };

  const handleUpdateAttribute = (index: number, key: "key" | "value", value: string) => {
    const updatedAttrs = [...product.attributes];
    updatedAttrs[index] = {
      ...updatedAttrs[index],
      [key]: value,
    };
    handleFieldChange("attributes", updatedAttrs);
  };

  const handleRemoveAttribute = (index: number) => {
    const updatedAttrs = product.attributes.filter((_, i) => i !== index);
    handleFieldChange("attributes", updatedAttrs);
  };

  // --- 6. Simulated Local Image Upload ---
  const handleLocalImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const localUrl = URL.createObjectURL(file);
      handleFieldChange("imageUrl", localUrl);
    }
  };

  // Color Fallbacks (Gradients) preset
  const COLOR_GRADIENTS = [
    { name: "Ámbar", value: "from-amber-500 to-orange-600" },
    { name: "Café Especial", value: "from-amber-700 to-amber-900" },
    { name: "Cereza", value: "from-rose-500 to-pink-600" },
    { name: "Bosque", value: "from-emerald-600 to-teal-800" },
    { name: "Mar", value: "from-sky-400 to-indigo-600" },
    { name: "Monocromo", value: "from-slate-700 to-slate-900" },
  ];

  return (
    <div className="bg-white rounded-[24px] border border-natural-border shadow-sm overflow-hidden flex flex-col h-full" id="product-editor-container">
      
      {/* Header Info */}
      <div className="p-5 border-b border-natural-border bg-natural-bg/40 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-natural-primary uppercase tracking-widest block">
            Formulario Dinámico
          </span>
          <h2 className="text-xl font-bold text-natural-dark tracking-tight mt-0.5">
            Editar Ficha de Producto
          </h2>
        </div>
        <button
          onClick={() => onDeleteProduct(product.id)}
          id="btn-delete-product"
          className="self-start sm:self-center flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-rose-700 hover:text-white bg-rose-50 hover:bg-rose-700 border border-rose-100 hover:border-rose-700 rounded-xl transition-all cursor-pointer"
        >
          <Trash2 className="h-3.5 w-3.5" />
          Eliminar de Tienda
        </button>
      </div>

      {/* Navigation tabs for categories/form dividers */}
      <div className="flex border-b border-natural-border overflow-x-auto no-scrollbar scroll-smooth bg-white">
        {[
          { id: "basic", label: "General", icon: Info },
          { id: "pricing", label: "Precio & Margen", icon: DollarSign },
          { id: "media", label: "Multimedia", icon: ImageIcon },
          { id: "inventory", label: "Inventario", icon: Database },
          { id: "variants", label: "Variantes", icon: Sliders },
          { id: "modifiers", label: "Modificadores", icon: ListPlus },
          { id: "specs", label: "Ficha Técnica", icon: Tag },
        ].map((tab) => {
          const Icon = tab.icon;
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-3.5 border-b-2 text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                isSelected
                  ? "border-natural-primary text-natural-primary bg-natural-surface/15"
                  : "border-transparent text-natural-muted hover:text-natural-dark hover:bg-natural-bg/50"
              }`}
              id={`form-tab-${tab.id}`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
              {tab.id === "variants" && product.variants.length > 0 && (
                <span className="ml-1 bg-natural-surface text-natural-primary rounded-full px-1.5 py-0.2 text-[10px] font-bold">
                  {product.variants.length}
                </span>
              )}
              {tab.id === "modifiers" && product.modifiers.length > 0 && (
                <span className="ml-1 bg-amber-150 text-amber-850 rounded-full px-1.5 py-0.2 text-[10px] font-bold">
                  {product.modifiers.length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Form Content Scrollable */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">

        {/* ================= SECTION 1: BASIC DETAILS ================= */}
        {activeTab === "basic" && (
          <div className="space-y-5 animate-fade-in">
            <div className="flex items-center gap-2 pb-2 border-b border-natural-border">
              <div className="h-6 w-6 rounded bg-natural-bg text-natural-text flex items-center justify-center">
                <Info className="h-3.5 w-3.5" />
              </div>
              <h3 className="text-sm font-bold text-natural-dark">Información General</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-natural-text uppercase tracking-wider mb-1.5">
                  Nombre del Producto *
                </label>
                <input
                  type="text"
                  required
                  value={product.name}
                  onChange={(e) => handleFieldChange("name", e.target.value)}
                  placeholder="Ej. Hamburguesa de Pollo Crispy"
                  className="w-full px-4 py-2.5 text-sm bg-natural-input border border-natural-border rounded-xl focus:outline-none focus:ring-2 focus:ring-natural-primary focus:border-natural-primary transition-all text-natural-text"
                  id="form-product-name"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-natural-text uppercase tracking-wider mb-1.5">
                  Descripción Corta
                </label>
                <textarea
                  value={product.description}
                  onChange={(e) => handleFieldChange("description", e.target.value)}
                  placeholder="Ej. Pollo crujiente marinado con pan artesanal..."
                  rows={3}
                  className="w-full px-4 py-2.5 text-sm bg-natural-input border border-natural-border rounded-xl focus:outline-none focus:ring-2 focus:ring-natural-primary focus:border-natural-primary transition-all text-natural-text resize-none"
                  id="form-product-description"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-natural-text uppercase tracking-wider mb-1.5">
                  Categoría
                </label>
                {!showCustomCategoryInput ? (
                  <div className="flex gap-2">
                    <select
                      value={product.category}
                      onChange={(e) => handleFieldChange("category", e.target.value)}
                      className="flex-1 px-4 py-2.5 text-sm bg-natural-input border border-natural-border rounded-xl focus:outline-none focus:ring-2 focus:ring-natural-primary focus:border-natural-primary transition-all text-natural-text"
                      id="form-product-category-select"
                    >
                      {PRESET_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                      {!PRESET_CATEGORIES.includes(product.category) && product.category && (
                        <option value={product.category}>{product.category}</option>
                      )}
                    </select>
                    <button
                      type="button"
                      onClick={() => setShowCustomCategoryInput(true)}
                      className="px-3 bg-natural-bg hover:bg-natural-surface text-natural-text rounded-xl transition-colors text-sm font-semibold border border-natural-border"
                      title="Agregar Categoría Personalizada"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Nueva Categoría"
                      value={customCategory}
                      onChange={(e) => setCustomCategory(e.target.value)}
                      className="flex-1 px-4 py-2.5 text-sm bg-natural-input border border-natural-border rounded-xl focus:outline-none focus:ring-2 focus:ring-natural-primary focus:border-natural-primary transition-all text-natural-text"
                    />
                    <button
                      type="button"
                      onClick={handleAddCustomCategory}
                      className="px-3 bg-natural-primary hover:bg-natural-dark text-white rounded-xl transition-colors text-xs font-semibold flex items-center gap-1"
                    >
                      <Check className="h-3.5 w-3.5" />
                      Ok
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowCustomCategoryInput(false)}
                      className="px-3 bg-natural-bg hover:bg-natural-surface text-natural-muted border border-natural-border rounded-xl transition-colors text-xs font-semibold"
                    >
                      Cancelar
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-natural-text uppercase tracking-wider mb-1.5">
                  Gradiente de Color (Fallback)
                </label>
                <select
                  value={product.imageColor}
                  onChange={(e) => handleFieldChange("imageColor", e.target.value)}
                  className="w-full px-4 py-2.5 text-sm bg-natural-input border border-natural-border rounded-xl focus:outline-none focus:ring-2 focus:ring-natural-primary focus:border-natural-primary transition-all text-natural-text"
                  id="form-product-color-fallback"
                >
                  {COLOR_GRADIENTS.map((grad) => (
                    <option key={grad.value} value={grad.value}>
                      {grad.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-natural-text uppercase tracking-wider mb-1.5">
                  SKU (Código Interno)
                </label>
                <input
                  type="text"
                  value={product.sku}
                  onChange={(e) => handleFieldChange("sku", e.target.value)}
                  placeholder="Ej. ALM-HLD-001"
                  className="w-full px-4 py-2.5 text-sm bg-natural-input border border-natural-border rounded-xl focus:outline-none focus:ring-2 focus:ring-natural-primary focus:border-natural-primary transition-all text-natural-text font-mono"
                  id="form-product-sku"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-natural-text uppercase tracking-wider mb-1.5">
                  Código de Barras (UPC)
                </label>
                <input
                  type="text"
                  value={product.barcode}
                  onChange={(e) => handleFieldChange("barcode", e.target.value)}
                  placeholder="Ej. 750103504121"
                  className="w-full px-4 py-2.5 text-sm bg-natural-input border border-natural-border rounded-xl focus:outline-none focus:ring-2 focus:ring-natural-primary focus:border-natural-primary transition-all text-natural-text font-mono"
                  id="form-product-barcode"
                />
              </div>
            </div>
          </div>
        )}

        {/* ================= SECTION 2: PRICING & PROFIT MARGINS ================= */}
        {activeTab === "pricing" && (
          <div className="space-y-5 animate-fade-in">
            <div className="flex items-center justify-between pb-2 border-b border-natural-border">
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded bg-natural-bg text-natural-text flex items-center justify-center">
                  <DollarSign className="h-3.5 w-3.5" />
                </div>
                <h3 className="text-sm font-bold text-natural-dark">Precios y Margen de Utilidad</h3>
              </div>
              <span className="text-[10px] bg-natural-surface text-natural-primary px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider border border-natural-border-sec/40">
                Calculadora Activa
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-natural-text uppercase tracking-wider mb-1.5">
                  Precio Base al Público ($)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-natural-muted font-semibold text-sm">$</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={product.price}
                    onChange={(e) => handleFieldChange("price", Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-full pl-8 pr-4 py-2.5 text-sm bg-natural-input border border-natural-border rounded-xl focus:outline-none focus:ring-2 focus:ring-natural-primary focus:border-natural-primary transition-all text-natural-text font-bold"
                    id="form-product-price"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-natural-text uppercase tracking-wider mb-1.5">
                  Costo de Adquisición ($)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-natural-muted font-semibold text-sm">$</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={product.cost}
                    onChange={(e) => handleFieldChange("cost", Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-full pl-8 pr-4 py-2.5 text-sm bg-natural-input border border-natural-border rounded-xl focus:outline-none focus:ring-2 focus:ring-natural-primary focus:border-natural-primary transition-all text-natural-text font-bold"
                    id="form-product-cost"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-natural-text uppercase tracking-wider mb-1.5">
                  Impuesto Aplicado
                </label>
                <select
                  value={product.taxRate}
                  onChange={(e) => handleFieldChange("taxRate", parseInt(e.target.value))}
                  className="w-full px-4 py-2.5 text-sm bg-natural-input border border-natural-border rounded-xl focus:outline-none focus:ring-2 focus:ring-natural-primary focus:border-natural-primary transition-all text-natural-text font-semibold"
                  id="form-product-tax"
                >
                  <option value={16}>IVA General (16%)</option>
                  <option value={8}>IVA Fronterizo (8%)</option>
                  <option value={21}>IVA Europeo (21%)</option>
                  <option value={0}>Exento / Tasa 0%</option>
                </select>
              </div>
            </div>

            {/* Live Profit Meter */}
            <div className="bg-natural-bg/40 border border-natural-border p-4 rounded-2xl flex flex-col gap-3.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-natural-text font-bold flex items-center gap-1">
                  <TrendingUp className="h-3.5 w-3.5 text-natural-muted" />
                  Margen Bruto de Ganancia
                </span>
                <span className={`px-2 py-0.5 rounded-md font-bold text-xs border ${marginStyle.bg}`} id="live-margin-badge">
                  {marginPercentage.toFixed(1)}% Margen
                </span>
              </div>

              {/* Progress Meter bar */}
              <div className="w-full h-3 bg-natural-surface rounded-full overflow-hidden relative border border-natural-border/30">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${marginStyle.meter}`}
                  style={{ width: `${Math.min(100, Math.max(0, marginPercentage))}%` }}
                />
              </div>

              {/* breakdown */}
              <div className="grid grid-cols-2 gap-4 pt-1.5 text-center">
                <div className="border-r border-natural-border">
                  <span className="text-[10px] text-natural-muted uppercase tracking-wider block font-bold">
                    Ganancia por Unidad
                  </span>
                  <span className="text-base font-extrabold text-natural-dark block mt-0.5">
                    ${profit.toFixed(2)}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-natural-muted uppercase tracking-wider block font-bold">
                    IVA Incluido en Precio
                  </span>
                  <span className="text-base font-extrabold text-natural-dark block mt-0.5">
                    ${(price - (price / (1 + product.taxRate / 100))).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= SECTION 3: MEDIA & GALLERY ================= */}
        {activeTab === "media" && (
          <div className="space-y-5 animate-fade-in">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <div className="h-6 w-6 rounded bg-slate-100 text-slate-600 flex items-center justify-center">
                <ImageIcon className="h-3.5 w-3.5" />
              </div>
              <h3 className="text-sm font-bold text-slate-800">Galería de Imágenes</h3>
            </div>

            {/* Direct Upload Simulator */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              <div className="border-2 border-dashed border-slate-200 rounded-2xl p-5 flex flex-col items-center justify-center text-center bg-slate-50 hover:bg-slate-100/50 hover:border-indigo-400 transition-all cursor-pointer relative group">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLocalImageUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  id="form-image-file-upload"
                />
                <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center text-indigo-600 shadow-sm group-hover:scale-110 transition-transform mb-3">
                  <Upload className="h-5 w-5" />
                </div>
                <span className="text-xs font-semibold text-slate-700 block">
                  Subir archivo local
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  Soporta PNG, JPG (Simulación en tiempo real)
                </span>
              </div>

              <div className="flex flex-col justify-center gap-2">
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  O pega un URL de imagen de internet
                </label>
                <input
                  type="url"
                  value={product.imageUrl}
                  onChange={(e) => handleFieldChange("imageUrl", e.target.value)}
                  placeholder="https://ejemplo.com/foto.jpg"
                  className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-slate-800 font-mono"
                  id="form-product-image-url"
                />
                {product.imageUrl && (
                  <button
                    onClick={() => handleFieldChange("imageUrl", "")}
                    className="text-left text-[11px] font-semibold text-rose-500 hover:underline self-start"
                  >
                    Remover imagen actual
                  </button>
                )}
              </div>
            </div>

            {/* Preset Library Quick Select */}
            <div>
              <span className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2.5">
                Galería de Demostración POS (Selección Rápida)
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {MOCK_PRESET_IMAGES.map((img) => (
                  <div
                    key={img.url}
                    onClick={() => handleFieldChange("imageUrl", img.url)}
                    className={`relative aspect-video rounded-xl overflow-hidden cursor-pointer border group transition-all ${
                      product.imageUrl === img.url
                        ? "ring-2 ring-indigo-600 border-transparent shadow-sm"
                        : "border-slate-100 hover:border-slate-300"
                    }`}
                  >
                    <img
                      src={img.url}
                      alt={img.name}
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-1.5">
                      <span className="text-[9px] font-medium text-white block truncate">
                        {img.name}
                      </span>
                    </div>
                    {product.imageUrl === img.url && (
                      <div className="absolute top-1 right-1 bg-indigo-600 text-white rounded-full p-0.5">
                        <Check className="h-2.5 w-2.5" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= SECTION 4: INVENTORY CONTROLS ================= */}
        {activeTab === "inventory" && (
          <div className="space-y-5 animate-fade-in">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <div className="h-6 w-6 rounded bg-slate-100 text-slate-600 flex items-center justify-center">
                <Database className="h-3.5 w-3.5" />
              </div>
              <h3 className="text-sm font-bold text-slate-800">Control de Existencias</h3>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div>
                <span className="text-xs font-bold text-slate-800 block">
                  Seguimiento de Inventario Activo
                </span>
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  Habilita para alertar y descontar existencias automáticamente al vender en caja.
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={product.trackStock}
                  onChange={(e) => handleFieldChange("trackStock", e.target.checked)}
                  className="sr-only peer"
                  id="form-product-track-stock"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:width-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>

            {product.trackStock && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                    Stock Actual en Almacén
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={product.stock}
                    onChange={(e) => handleFieldChange("stock", Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-slate-800 font-bold"
                    id="form-product-stock"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                    Umbral de Stock Bajo (Alerta)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={product.lowStockThreshold}
                    onChange={(e) => handleFieldChange("lowStockThreshold", Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-slate-800 font-semibold"
                    id="form-product-low-stock-alert"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= SECTION 5: DYNAMIC VARIANTS ================= */}
        {activeTab === "variants" && (
          <div className="space-y-5 animate-fade-in">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded bg-slate-100 text-slate-600 flex items-center justify-center">
                  <Sliders className="h-3.5 w-3.5" />
                </div>
                <h3 className="text-sm font-bold text-slate-800">Variantes del Producto</h3>
              </div>
              <button
                type="button"
                onClick={handleAddVariant}
                id="btn-add-variant"
                className="flex items-center gap-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs px-3 py-1.5 rounded-lg border border-indigo-100 cursor-pointer"
              >
                <Plus className="h-3 w-3" />
                Agregar Variante
              </button>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100/60">
              Las variantes se utilizan para definir atributos que alteran el precio base o SKU (ej. tallas, tamaños). El precio final se calcula aplicando el ajuste al precio base de <strong>${product.price.toFixed(2)}</strong>.
            </p>

            {product.variants.length === 0 ? (
              <div className="text-center py-10 border border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                <Sliders className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                <p className="text-xs font-semibold text-slate-600">Este producto se vende como pieza única</p>
                <p className="text-[10px] text-slate-400 mt-0.5">No tiene variantes de tamaño, color o material.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {product.variants.map((v, index) => (
                  <div
                    key={v.id}
                    className="p-4 bg-slate-50 rounded-2xl border border-slate-200/60 flex flex-col gap-3 relative"
                    id={`variant-row-${index}`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-md uppercase">
                        Variante #{index + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveVariant(index)}
                        className="text-slate-400 hover:text-rose-600 p-1"
                        title="Eliminar Variante"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                          Nombre (Ej. Mediano)
                        </label>
                        <input
                          type="text"
                          required
                          value={v.name}
                          onChange={(e) => handleUpdateVariant(index, "name", e.target.value)}
                          className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-slate-800"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                          Código SKU Individual
                        </label>
                        <input
                          type="text"
                          value={v.sku}
                          onChange={(e) => handleUpdateVariant(index, "sku", e.target.value)}
                          className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-slate-800 font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                          Ajuste de Precio ($)
                        </label>
                        <div className="relative">
                          <span className="absolute left-2 top-2 text-[10px] text-slate-400 font-bold">$</span>
                          <input
                            type="number"
                            step="0.1"
                            value={v.priceAdjustment}
                            onChange={(e) => handleUpdateVariant(index, "priceAdjustment", parseFloat(e.target.value) || 0)}
                            className="w-full pl-5 pr-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-slate-800 font-bold"
                          />
                        </div>
                        <span className="text-[10px] text-slate-500 block mt-1">
                          Final: ${(product.price + v.priceAdjustment).toFixed(2)}
                        </span>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                          Stock Individual
                        </label>
                        <input
                          type="number"
                          min="0"
                          disabled={!product.trackStock}
                          value={v.stock}
                          onChange={(e) => handleUpdateVariant(index, "stock", Math.max(0, parseInt(e.target.value) || 0))}
                          className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-slate-800 font-bold disabled:bg-slate-100 disabled:text-slate-400"
                        />
                        {!product.trackStock && (
                          <span className="text-[9px] text-slate-400 block mt-1">
                            Control inactivo
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ================= SECTION 6: DYNAMIC MODIFIERS ================= */}
        {activeTab === "modifiers" && (
          <div className="space-y-5 animate-fade-in">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded bg-slate-100 text-slate-600 flex items-center justify-center">
                  <ListPlus className="h-3.5 w-3.5" />
                </div>
                <h3 className="text-sm font-bold text-slate-800">Modificadores y Extras (Formulario Anidado)</h3>
              </div>
              <button
                type="button"
                onClick={handleAddModifierGroup}
                id="btn-add-modifier-group"
                className="flex items-center gap-1 bg-amber-50 hover:bg-amber-100 text-amber-700 font-bold text-xs px-3 py-1.5 rounded-lg border border-amber-100 cursor-pointer"
              >
                <Plus className="h-3 w-3" />
                Nuevo Grupo
              </button>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100/60">
              Permite a los cajeros añadir extras (ej. "Tocino Extra", "Sin Cebolla") o tomar decisiones forzadas (ej. "Término de la carne") durante la venta.
            </p>

            {product.modifiers.length === 0 ? (
              <div className="text-center py-10 border border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                <ListPlus className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                <p className="text-xs font-semibold text-slate-600">Este producto no cuenta con modificadores</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Perfecto para retail o productos listos para servir.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {product.modifiers.map((group, gIndex) => (
                  <div
                    key={group.id}
                    className="p-5 border border-amber-100 rounded-2xl bg-amber-50/10 flex flex-col gap-4 relative shadow-sm"
                    id={`modifier-group-${gIndex}`}
                  >
                    
                    {/* Header Group */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-amber-100/60">
                      <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <div className="sm:col-span-1">
                          <label className="block text-[10px] font-bold text-amber-800 uppercase tracking-wider mb-1">
                            Título del Grupo (Ej. Extras)
                          </label>
                          <input
                            type="text"
                            required
                            value={group.name}
                            onChange={(e) => handleUpdateModifierGroup(gIndex, "name", e.target.value)}
                            className="w-full px-2.5 py-1 bg-white border border-amber-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500 text-xs font-semibold text-slate-800"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-amber-800 uppercase tracking-wider mb-1">
                            Selección Máxima
                          </label>
                          <input
                            type="number"
                            min="1"
                            value={group.maxSelections}
                            onChange={(e) => handleUpdateModifierGroup(gIndex, "maxSelections", Math.max(1, parseInt(e.target.value) || 1))}
                            className="w-full px-2.5 py-1 bg-white border border-amber-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500 text-xs text-slate-800"
                          />
                        </div>

                        <div className="flex items-center gap-2 pt-4">
                          <input
                            type="checkbox"
                            checked={group.required}
                            onChange={(e) => handleUpdateModifierGroup(gIndex, "required", e.target.checked)}
                            className="rounded border-amber-300 text-amber-600 focus:ring-amber-500 h-3.5 w-3.5"
                            id={`group-req-${gIndex}`}
                          />
                          <label htmlFor={`group-req-${gIndex}`} className="text-[11px] font-bold text-amber-800 uppercase tracking-wider cursor-pointer select-none">
                            Obligatorio en Caja
                          </label>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveModifierGroup(gIndex)}
                        className="text-amber-500 hover:text-rose-600 p-1 self-end sm:self-center"
                        title="Eliminar Grupo"
                      >
                        <Trash2 className="h-4.5 w-4.5" />
                      </button>
                    </div>

                    {/* Options Nested Rows */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                          Opciones del Grupo ({group.options.length})
                        </span>
                        <button
                          type="button"
                          onClick={() => handleAddModifierOption(gIndex)}
                          className="flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-100 hover:bg-amber-200 px-2 py-1 rounded-md transition-all cursor-pointer"
                        >
                          <Plus className="h-2.5 w-2.5" />
                          Agregar Opción
                        </button>
                      </div>

                      {group.options.length === 0 ? (
                        <p className="text-[10px] text-slate-400 italic">No hay opciones definidas. Añade una para vender.</p>
                      ) : (
                        <div className="space-y-1.5">
                          {group.options.map((opt, oIndex) => (
                            <div
                              key={opt.id}
                              className="flex items-center gap-3 bg-white p-2 rounded-xl border border-amber-100/40"
                            >
                              <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-2">
                                <input
                                  type="text"
                                  placeholder="Ej. Sin cebolla"
                                  value={opt.name}
                                  onChange={(e) => handleUpdateModifierOption(gIndex, oIndex, "name", e.target.value)}
                                  className="px-2 py-1 bg-slate-50 border border-slate-200 rounded text-xs text-slate-800"
                                />

                                <div className="relative">
                                  <span className="absolute left-2 top-1.5 text-[10px] text-slate-400 font-bold">$</span>
                                  <input
                                    type="number"
                                    step="0.05"
                                    value={opt.price}
                                    onChange={(e) => handleUpdateModifierOption(gIndex, oIndex, "price", parseFloat(e.target.value) || 0)}
                                    className="w-full pl-5 pr-2 py-1 bg-slate-50 border border-slate-200 rounded text-xs font-bold text-slate-800"
                                    placeholder="Costo extra"
                                  />
                                </div>

                                <div className="flex items-center gap-2 justify-end col-span-2 sm:col-span-1">
                                  <input
                                    type="checkbox"
                                    checked={opt.selectedByDefault}
                                    onChange={(e) => handleUpdateModifierOption(gIndex, oIndex, "selectedByDefault", e.target.checked)}
                                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 h-3 w-3"
                                    id={`opt-def-${gIndex}-${oIndex}`}
                                  />
                                  <label htmlFor={`opt-def-${gIndex}-${oIndex}`} className="text-[10px] font-medium text-slate-500 cursor-pointer select-none">
                                    Por Defecto
                                  </label>
                                </div>
                              </div>

                              <button
                                type="button"
                                onClick={() => handleRemoveModifierOption(gIndex, oIndex)}
                                className="text-slate-400 hover:text-rose-600 p-1"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ================= SECTION 7: DYNAMIC ATTRIBUTES / SPECIFICATIONS ================= */}
        {activeTab === "specs" && (
          <div className="space-y-5 animate-fade-in">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded bg-slate-100 text-slate-600 flex items-center justify-center">
                  <Tag className="h-3.5 w-3.5" />
                </div>
                <h3 className="text-sm font-bold text-slate-800">Ficha Técnica y Metadatos (Campos Dinámicos)</h3>
              </div>
              <button
                type="button"
                onClick={handleAddAttribute}
                id="btn-add-attribute"
                className="flex items-center gap-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs px-3 py-1.5 rounded-lg border border-indigo-100 cursor-pointer"
              >
                <Plus className="h-3 w-3" />
                Agregar Par Clave-Valor
              </button>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100/60">
              Crea propiedades personalizadas e información técnica del producto. Útil para informes, recetas, importación y visualización del cliente en catálogo.
            </p>

            {product.attributes.length === 0 ? (
              <div className="text-center py-10 border border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                <Tag className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                <p className="text-xs font-semibold text-slate-600">No hay atributos técnicos configurados</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Ejemplos: "Material", "Origen", "Proveedor", "Vegano".</p>
              </div>
            ) : (
              <div className="space-y-2">
                {product.attributes.map((attr, index) => (
                  <div
                    key={attr.id}
                    className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200/50"
                    id={`attr-row-${index}`}
                  >
                    <div className="flex-1 grid grid-cols-2 gap-3">
                      <div>
                        <input
                          type="text"
                          required
                          value={attr.key}
                          onChange={(e) => handleUpdateAttribute(index, "key", e.target.value)}
                          className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 font-semibold text-slate-800"
                          placeholder="Propiedad (ej. Marca)"
                        />
                      </div>

                      <div>
                        <input
                          type="text"
                          required
                          value={attr.value}
                          onChange={(e) => handleUpdateAttribute(index, "value", e.target.value)}
                          className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-800"
                          placeholder="Valor (ej. Adidas)"
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveAttribute(index)}
                      className="text-slate-400 hover:text-rose-600 p-1"
                      title="Eliminar atributo"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>

      {/* Footer status / feedback bar */}
      <div className="bg-slate-50 border-t border-slate-100 px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs">
        <span className="text-slate-500 font-medium flex items-center gap-1">
          <Settings className="h-3.5 w-3.5 animate-spin duration-1000" />
          Los cambios se sincronizan en tiempo real
        </span>
        <span className="text-slate-400 font-mono">
          ID: {product.id}
        </span>
      </div>

    </div>
  );
}
