import { useState, useMemo, useEffect } from "react";
import { Product, Variant, ModifierGroup, ModifierOption } from "../types";
import {
  Smartphone,
  Receipt,
  Eye,
  CheckCircle2,
  ShoppingCart,
  ShoppingBag,
  Info,
  ChevronRight,
  TrendingUp,
  Award,
  AlertCircle
} from "lucide-react";

interface POSPreviewPanelProps {
  product: Product;
  onEditClick?: () => void;
}

interface SimulatedSaleItem {
  id: string;
  name: string;
  category: string;
  variantSelected: Variant | null;
  modifiersSelected: { groupName: string; option: ModifierOption }[];
  quantity: number;
  basePrice: number;
  unitPrice: number;
  totalPrice: number;
  taxAmount: number;
}

export default function POSPreviewPanel({ product, onEditClick }: POSPreviewPanelProps) {
  // Tabs for the preview modes
  const [previewTab, setPreviewTab] = useState<"terminal" | "simulator" | "ticket" | "kiosk">("simulator");

  // --- LOCAL SIMULATION STATE ---
  // Users can select variants & modifiers dynamically to test pricing
  const [selectedVariantId, setSelectedVariantId] = useState<string>("");
  const [selectedModifiers, setSelectedModifiers] = useState<Record<string, string[]>>({}); // groupName: [optionIds]
  const [quantity, setQuantity] = useState<number>(1);
  const [simulatedCart, setSimulatedCart] = useState<SimulatedSaleItem[]>([]);
  const [simulatedCheckoutSuccess, setSimulatedCheckoutSuccess] = useState(false);

  // Sync selected variant when product changes
  useEffect(() => {
    if (product.variants && product.variants.length > 0) {
      setSelectedVariantId(product.variants[0].id);
    } else {
      setSelectedVariantId("");
    }

    // Reset modifiers to default selections
    const defaults: Record<string, string[]> = {};
    product.modifiers.forEach((group) => {
      const defOptions = group.options
        .filter((o) => o.selectedByDefault)
        .map((o) => o.id);
      defaults[group.id] = defOptions;
    });
    setSelectedModifiers(defaults);
    setQuantity(1);
    setSimulatedCheckoutSuccess(false);
  }, [product]);

  // Find active variant object
  const activeVariant = useMemo(() => {
    return product.variants.find((v) => v.id === selectedVariantId) || null;
  }, [product.variants, selectedVariantId]);

  // Calculate pricing for the current simulator settings
  const currentCalculations = useMemo(() => {
    let base = product.price;

    // Apply variant adjustment
    if (activeVariant) {
      base += activeVariant.priceAdjustment;
    }

    // Apply modifier additions
    let modifierTotal = 0;
    const chosenModifiersList: { groupName: string; option: ModifierOption }[] = [];

    product.modifiers.forEach((group) => {
      const chosenIds = selectedModifiers[group.id] || [];
      group.options.forEach((opt) => {
        if (chosenIds.includes(opt.id)) {
          modifierTotal += opt.price;
          chosenModifiersList.push({
            groupName: group.name,
            option: opt,
          });
        }
      });
    });

    const singleUnitPrice = base + modifierTotal;
    const finalCalculatedPrice = singleUnitPrice * quantity;

    // Tax amount
    const taxFactor = product.taxRate / 100;
    const taxAmount = finalCalculatedPrice - (finalCalculatedPrice / (1 + taxFactor));

    return {
      unitPrice: singleUnitPrice,
      totalPrice: finalCalculatedPrice,
      chosenModifiersList,
      taxAmount,
    };
  }, [product, activeVariant, selectedModifiers, quantity]);

  // --- Handlers for simulation ---
  const handleToggleModifier = (groupId: string, optionId: string, maxSelections: number) => {
    const currentList = selectedModifiers[groupId] || [];
    let updated: string[] = [];

    if (maxSelections === 1) {
      // Single choice radio behavior
      updated = [optionId];
    } else {
      // Multi choice behavior
      if (currentList.includes(optionId)) {
        updated = currentList.filter((id) => id !== optionId);
      } else {
        if (currentList.length < maxSelections) {
          updated = [...currentList, optionId];
        } else {
          // Replace first selection if limit reached
          updated = [...currentList.slice(1), optionId];
        }
      }
    }

    setSelectedModifiers({
      ...selectedModifiers,
      [groupId]: updated,
    });
  };

  const handleAddToCartSimulation = () => {
    const newItem: SimulatedSaleItem = {
      id: `cart-${Date.now()}`,
      name: product.name || "Producto sin nombre",
      category: product.category,
      variantSelected: activeVariant,
      modifiersSelected: currentCalculations.chosenModifiersList,
      quantity: quantity,
      basePrice: product.price,
      unitPrice: currentCalculations.unitPrice,
      totalPrice: currentCalculations.totalPrice,
      taxAmount: currentCalculations.taxAmount,
    };

    setSimulatedCart([newItem, ...simulatedCart]);
    setSimulatedCheckoutSuccess(false);
  };

  const handleClearCart = () => {
    setSimulatedCart([]);
    setSimulatedCheckoutSuccess(false);
  };

  const handleSimulateCheckout = () => {
    setSimulatedCheckoutSuccess(true);
    setSimulatedCart([]);
  };

  // Sum cart properties
  const cartTotals = useMemo(() => {
    let subtotal = 0;
    let tax = 0;
    simulatedCart.forEach((item) => {
      subtotal += item.totalPrice;
      tax += item.taxAmount;
    });
    return {
      subtotal,
      tax,
      total: subtotal, // prices are tax inclusive in typical POS
    };
  }, [simulatedCart]);

  return (
    <div className="bg-[#1C1C14] text-white rounded-[24px] p-5 shadow-xl border border-[#2D2D24] flex flex-col h-full overflow-hidden" id="pos-preview-panel-container">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#2D2D24]">
        <div>
          <span className="text-[10px] text-[#D4CBB3] font-bold uppercase tracking-wider block">
            Previsualizador POS en Vivo
          </span>
          <h2 className="text-base font-bold text-white flex items-center gap-1.5 mt-0.5">
            <Smartphone className="h-4.5 w-4.5 text-[#D4CBB3]" />
            Entorno de Ejecución POS
          </h2>
        </div>
        
        {/* Device Mode Selectors */}
        <div className="flex bg-[#24241B] p-1 rounded-lg border border-[#2D2D24] text-[10px] font-bold">
          {[
            { id: "simulator", label: "Simular Venta", icon: ShoppingCart },
            { id: "terminal", label: "Vista Cajero", icon: Smartphone },
            { id: "kiosk", label: "Ficha Kiosco", icon: Eye },
            { id: "ticket", label: "Ticket Térmico", icon: Receipt },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = previewTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setPreviewTab(tab.id as any)}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded transition-colors cursor-pointer ${
                  isSelected
                    ? "bg-natural-primary text-white shadow-sm"
                    : "text-[#A09F92] hover:text-white"
                }`}
                title={tab.label}
              >
                <Icon className="h-3 w-3" />
                <span className="hidden xl:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Preview Screen */}
      <div className="flex-1 overflow-y-auto py-5 px-1 min-h-[350px]">        {/* ================= PREVIEW MODE: INTERACTIVE SIMULATOR ================= */}
        {previewTab === "simulator" && (
          <div className="space-y-4 animate-fade-in text-[#e8e7e0]">
            
            <div 
              onClick={onEditClick}
              className="bg-[#24241B]/85 p-4 rounded-xl border border-[#2D2D24] flex gap-4 hover:border-natural-primary/60 cursor-pointer transition-all group/card relative"
              title="Haz clic para editar los detalles de este producto"
            >
              {/* Product Visual */}
              <div className="relative h-16 w-16 rounded-xl overflow-hidden bg-[#1C1C14] flex-shrink-0 border border-[#2D2D24]">
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className={`h-full w-full bg-gradient-to-br ${product.imageColor || "from-amber-600 to-amber-800"} flex items-center justify-center font-bold text-lg text-white`}>
                    {product.name ? product.name.slice(0, 2).toUpperCase() : "?"}
                  </div>
                )}
              </div>

              <div className="flex-1">
                <span className="text-[10px] font-bold text-[#D4CBB3] uppercase tracking-widest bg-natural-primary/30 border border-natural-primary/50 px-1.5 py-0.5 rounded">
                  {product.category || "General"}
                </span>
                <h3 className="text-sm font-bold text-white mt-1.5">
                  {product.name || <span className="text-[#838275] italic">Nombre sin asignar</span>}
                </h3>
                <span className="text-xs text-[#A09F92] font-mono block mt-0.5">
                  Base: ${product.price.toFixed(2)} | SKU: {product.sku || "Sin SKU"}
                </span>
              </div>

              {/* Hover Badge */}
              <div className="absolute top-2.5 right-2.5 bg-natural-primary border border-natural-primary/50 text-white text-[8px] font-bold tracking-wider px-1.5 py-0.5 rounded uppercase opacity-0 group-hover/card:opacity-100 transition-all duration-200">
                Editar
              </div>
            </div>

            {/* Simulated Selection inputs */}
            <div className="bg-[#24241B]/50 p-4 rounded-xl border border-[#2D2D24] space-y-4">
              
              {/* 1. Variants Selection */}
              {product.variants.length > 0 && (
                <div>
                  <label className="block text-[10px] font-bold text-[#A09F92] uppercase tracking-wider mb-2">
                    1. Elige una Variante (Tamaño/Atributo):
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {product.variants.map((v) => (
                      <button
                        key={v.id}
                        onClick={() => setSelectedVariantId(v.id)}
                        className={`p-2.5 text-left text-xs rounded-lg border transition-all cursor-pointer flex justify-between items-center ${
                          selectedVariantId === v.id
                            ? "bg-natural-primary/30 border-natural-primary text-white font-bold ring-1 ring-natural-primary/50"
                            : "bg-[#1C1C14]/50 border-[#2D2D24] text-slate-300 hover:bg-[#24241B] hover:border-[#2D2D24]"
                        }`}
                      >
                        <span className="truncate">{v.name}</span>
                        <span className="font-semibold text-[#D4CBB3]">
                          {v.priceAdjustment >= 0 ? "+" : ""}${v.priceAdjustment.toFixed(2)}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 2. Modifiers options */}
              {product.modifiers.length > 0 && (
                <div className="space-y-4">
                  {product.modifiers.map((group) => {
                    const chosenOptionIds = selectedModifiers[group.id] || [];
                    return (
                      <div key={group.id} className="border-t border-[#2D2D24] pt-3">
                        <div className="flex justify-between items-center mb-2">
                          <label className="text-[10px] font-bold text-[#A09F92] uppercase tracking-wider">
                            2. {group.name} 
                            {group.required && <span className="text-rose-400 ml-1 font-bold">*</span>}
                          </label>
                          <span className="text-[9px] text-[#838275] italic">
                            (Máx: {group.maxSelections} {group.maxSelections === 1 ? "selección" : "selecciones"})
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {group.options.map((opt) => {
                            const isSelected = chosenOptionIds.includes(opt.id);
                            return (
                              <button
                                key={opt.id}
                                onClick={() => handleToggleModifier(group.id, opt.id, group.maxSelections)}
                                className={`p-2 text-left text-xs rounded-lg border transition-all cursor-pointer flex justify-between items-center ${
                                  isSelected
                                    ? "bg-amber-500/20 border-amber-500/70 text-amber-200 font-bold"
                                    : "bg-[#1C1C14]/40 border-[#2D2D24] text-[#A09F92] hover:bg-[#24241B]"
                                }`}
                              >
                                <span className="truncate flex items-center gap-1.5">
                                  <span className={`h-2 w-2 rounded-full ${isSelected ? "bg-amber-400" : "bg-[#2D2D24]"}`} />
                                  {opt.name}
                                </span>
                                {opt.price > 0 && (
                                  <span className="text-[10px] text-amber-400/80 font-bold">
                                    +${opt.price.toFixed(2)}
                                  </span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Quantity selector and Cart controls */}
              <div className="border-t border-[#2D2D24] pt-3.5 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-[#A09F92] uppercase tracking-wider">
                    Cantidad:
                  </span>
                  <div className="flex items-center bg-[#1C1C14] rounded-lg border border-[#2D2D24] overflow-hidden">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-2.5 py-1 text-[#A09F92] hover:text-white hover:bg-[#24241B] text-xs font-bold transition-colors cursor-pointer"
                    >
                      -
                    </button>
                    <span className="px-3.5 text-xs font-bold text-white font-mono">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-2.5 py-1 text-[#A09F92] hover:text-white hover:bg-[#24241B] text-xs font-bold transition-colors cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[9px] text-[#A09F92] block uppercase font-bold">Precio de Venta</span>
                  <span className="text-lg font-black text-[#D4CBB3] font-mono">
                    ${currentCalculations.totalPrice.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Add item button */}
              <button
                onClick={handleAddToCartSimulation}
                id="btn-simulate-add-to-cart"
                className="w-full flex items-center justify-center gap-2 bg-natural-primary hover:bg-[#4a4a40] text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-colors shadow-lg shadow-natural-primary/10 cursor-pointer active:scale-95"
              >
                <ShoppingCart className="h-4 w-4" />
                Agregar a Venta Simulada
              </button>
            </div>

            {/* Simulated Live Cart Display */}
            {simulatedCheckoutSuccess && (
              <div className="bg-emerald-950/40 border border-emerald-900 text-emerald-300 p-3.5 rounded-xl text-center text-xs flex items-center justify-center gap-2 animate-bounce">
                <CheckCircle2 className="h-4.5 w-4.5" />
                <span>¡Cobro simulado exitosamente! El ticket y caja se actualizaron.</span>
              </div>
            )}

            {simulatedCart.length > 0 && (
              <div className="bg-[#24241B] p-4 rounded-xl border border-[#2D2D24] space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#A09F92] flex items-center gap-1.5">
                    <ShoppingBag className="h-4 w-4 text-[#A09F92]" />
                    Caja Registradora Simulada ({simulatedCart.length})
                  </h4>
                  <button
                    onClick={handleClearCart}
                    className="text-[10px] font-semibold text-rose-400 hover:underline cursor-pointer"
                  >
                    Vaciar Caja
                  </button>
                </div>

                <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                  {simulatedCart.map((item) => (
                    <div key={item.id} className="text-xs flex justify-between items-start border-b border-[#2D2D24]/40 pb-2">
                      <div>
                        <div className="font-bold text-white flex items-center gap-1.5">
                          <span>{item.quantity}x</span>
                          <span className="truncate max-w-[150px]">{item.name}</span>
                        </div>
                        {item.variantSelected && (
                          <div className="text-[10px] text-[#D4CBB3] font-semibold pl-4">
                            └ Variante: {item.variantSelected.name}
                          </div>
                        )}
                        {item.modifiersSelected.length > 0 && (
                          <div className="text-[10px] text-amber-400 font-medium pl-4 truncate max-w-[180px]">
                            └ Extras: {item.modifiersSelected.map(m => m.option.name).join(", ")}
                          </div>
                        )}
                      </div>
                      <span className="font-mono font-bold text-slate-300">
                        ${item.totalPrice.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-[#2D2D24] pt-3 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-[#A09F92]">Impuestos (IVA):</span>
                    <span className="font-mono">${cartTotals.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-white">
                    <span>TOTAL A PAGAR:</span>
                    <span className="font-mono text-[#D4CBB3] text-base">${cartTotals.total.toFixed(2)}</span>
                  </div>
                  
                  <button
                    onClick={handleSimulateCheckout}
                    className="w-full bg-natural-primary hover:bg-[#4a4a40] text-white font-bold py-2 rounded-xl text-xs transition-colors uppercase tracking-wider cursor-pointer"
                  >
                    Simular Cobro en Terminal
                  </button>
                </div>
              </div>
            )}

          </div>
        )}

        {/* ================= PREVIEW MODE: CASHIER TILE ================= */}
        {previewTab === "terminal" && (
          <div className="space-y-5 animate-fade-in text-slate-300">
            <p className="text-xs text-slate-400">
              Así es como se representará el botón de venta rápida en la pantalla de la terminal táctil del cajero:
            </p>

            <div className="flex justify-center py-6 bg-slate-950 rounded-2xl border border-slate-800 relative">
              
              {/* Cashier grid button button tile */}
              <button
                onClick={onEditClick}
                className="w-40 h-40 bg-slate-900 rounded-2xl overflow-hidden border border-slate-700 text-left flex flex-col justify-between shadow-lg relative cursor-pointer hover:border-natural-primary/70 transition-all focus:outline-none"
                style={{ contentVisibility: "auto" }}
              >
                {/* Visual Image / Gradient fallback */}
                <div className="h-20 w-full relative bg-slate-800 flex-shrink-0">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className={`h-full w-full bg-gradient-to-br ${product.imageColor || "from-amber-500 to-rose-600"} flex items-center justify-center font-black text-white text-2xl`}>
                      {product.name ? product.name.slice(0, 2).toUpperCase() : "POS"}
                    </div>
                  )}

                  {/* Price badge overlaid on top */}
                  <span className="absolute top-1.5 right-1.5 bg-slate-950/90 backdrop-blur-sm text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md font-mono">
                    ${product.price.toFixed(2)}
                  </span>

                  {/* Stock warning */}
                  {product.trackStock && product.stock <= product.lowStockThreshold && (
                    <span className="absolute bottom-1 left-1.5 bg-rose-600 text-white text-[8px] font-bold px-1 rounded uppercase">
                      {product.stock === 0 ? "Sin Stock" : `Stock: ${product.stock}`}
                    </span>
                  )}
                </div>

                {/* Text Content */}
                <div className="p-2.5 flex-1 flex flex-col justify-between bg-slate-900 w-full">
                  <div>
                    <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest block truncate">
                      {product.category || "GENERAL"}
                    </span>
                    <h4 className="text-xs font-bold text-white mt-0.5 leading-tight line-clamp-2">
                      {product.name || <span className="text-slate-600 italic">Sin nombre</span>}
                    </h4>
                  </div>

                  {/* Variants/modifiers indicators icons */}
                  <div className="flex gap-1.5 items-center mt-1">
                    {product.variants.length > 0 && (
                      <span className="text-[7px] bg-indigo-950 text-indigo-400 font-bold px-1 py-0.2 rounded border border-indigo-900 uppercase">
                        {product.variants.length} Var
                      </span>
                    )}
                    {product.modifiers.length > 0 && (
                      <span className="text-[7px] bg-amber-950 text-amber-400 font-bold px-1 py-0.2 rounded border border-amber-900 uppercase">
                        {product.modifiers.length} Mod
                      </span>
                    )}
                  </div>
                </div>
              </button>
            </div>

            {/* Quick specifications for cashiers */}
            <div className="bg-slate-850 p-3.5 rounded-xl border border-slate-800 text-xs text-slate-400 space-y-2">
              <span className="font-bold text-white block">Diseñado para alto rendimiento:</span>
              <ul className="list-disc pl-4 space-y-1">
                <li>Compatible con pantallas touch resistivas y capacitivas.</li>
                <li>Las dimensiones cumplen con el estándar táctil ergonómico de 160px.</li>
                <li>Los contrastes garantizan legibilidad bajo luces industriales del local.</li>
              </ul>
            </div>
          </div>
        )}

        {/* ================= PREVIEW MODE: RECEIPT TICKET ================= */}
        {previewTab === "ticket" && (
          <div className="space-y-4 animate-fade-in flex flex-col items-center">
            
            {/* The Thermal paper ticket visual */}
            <div className="w-full max-w-[320px] bg-white text-slate-900 p-5 font-mono text-xs shadow-2xl relative rounded-sm border border-slate-200">
              
              {/* Thermal receipt jagged top */}
              <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-b from-slate-200/50 to-transparent" />
              
              {/* Receipt Header */}
              <div className="text-center space-y-1 mb-4">
                <span className="text-sm font-extrabold block">POS TERMINAL #01</span>
                <span className="text-[10px] text-slate-500 block">Calle de la Innovación 128, Piso 2</span>
                <span className="text-[10px] text-slate-500 block">RFC: POS990113-XX4</span>
                <span className="text-[10px] text-slate-500 block">Fecha: 13/07/2026 - {new Date().toLocaleTimeString()}</span>
              </div>

              {/* Dashed line separator */}
              <div className="border-b border-dashed border-slate-400 my-2" />

              {/* Items Table */}
              <div className="space-y-3 my-3">
                <div className="flex justify-between text-[11px] font-bold text-slate-700">
                  <span>DESCRIPCIÓN</span>
                  <span>TOTAL</span>
                </div>
                <div className="border-b border-slate-200 my-1" />

                {/* Dynamic Item row based on simulator state */}
                <div className="space-y-1">
                  <div className="flex justify-between font-bold">
                    <span>{quantity}x {product.name || "PRODUCTO DEMO"}</span>
                    <span>${(product.price * quantity).toFixed(2)}</span>
                  </div>

                  {activeVariant && (
                    <div className="text-[11px] text-slate-600 pl-4 flex justify-between">
                      <span>• Var: {activeVariant.name}</span>
                      <span>+${(activeVariant.priceAdjustment * quantity).toFixed(2)}</span>
                    </div>
                  )}

                  {currentCalculations.chosenModifiersList.map((m, idx) => (
                    <div key={idx} className="text-[11px] text-slate-600 pl-4 flex justify-between">
                      <span>• {m.groupName}: {m.option.name}</span>
                      {m.option.price > 0 ? (
                        <span>+${(m.option.price * quantity).toFixed(2)}</span>
                      ) : (
                        <span>Incluido</span>
                      )}
                    </div>
                  ))}
                </div>

                {/* Other simulated cart items if any */}
                {simulatedCart.map((item, idx) => (
                  <div key={idx} className="space-y-0.5 border-t border-slate-100 pt-1.5">
                    <div className="flex justify-between font-bold">
                      <span>{item.quantity}x {item.name}</span>
                      <span>${item.totalPrice.toFixed(2)}</span>
                    </div>
                    {item.variantSelected && (
                      <div className="text-[10px] text-slate-600 pl-4">
                        • {item.variantSelected.name}
                      </div>
                    )}
                    {item.modifiersSelected.map((m, mIdx) => (
                      <div key={mIdx} className="text-[10px] text-slate-500 pl-4">
                        • {m.groupName}: {m.option.name}
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              <div className="border-b border-dashed border-slate-400 my-3" />

              {/* Subtotal, tax and total pricing calculations */}
              <div className="space-y-1 text-right">
                <div className="flex justify-between">
                  <span>Subtotal Gravable:</span>
                  <span>${((simulatedCart.length > 0 ? cartTotals.subtotal : currentCalculations.totalPrice) - (simulatedCart.length > 0 ? cartTotals.tax : currentCalculations.taxAmount)).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>IVA Trasladado ({product.taxRate}%):</span>
                  <span>${(simulatedCart.length > 0 ? cartTotals.tax : currentCalculations.taxAmount).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-extrabold text-slate-900 pt-1 border-t border-slate-100 mt-1">
                  <span>TOTAL COBRADO:</span>
                  <span>${(simulatedCart.length > 0 ? cartTotals.total : currentCalculations.totalPrice).toFixed(2)}</span>
                </div>
              </div>

              <div className="border-b border-dashed border-slate-400 my-3" />

              {/* Barcode representation */}
              <div className="flex flex-col items-center justify-center space-y-1 py-1">
                <div className="h-8 w-44 bg-slate-900/10 flex items-center justify-between px-2 text-[6px] tracking-[4px] text-slate-800">
                  |||||| ||||||| | ||||| | ||| |||||| ||
                </div>
                <span className="text-[9px] text-slate-500 tracking-widest">{product.barcode || "00000000000"}</span>
              </div>

              {/* Footer phrase */}
              <div className="text-center text-[10px] text-slate-500 mt-4 leading-relaxed">
                ¡Gracias por su preferencia!<br />
                Soporte en: www.tiendapos.com
              </div>

            </div>

            <p className="text-[11px] text-slate-400 text-center max-w-[280px]">
              El impuesto se calcula dinámicamente aplicando el {product.taxRate}% configurado en la pestaña "Precio".
            </p>
          </div>
        )}

        {/* ================= PREVIEW MODE: CUSTOMER KIOSK ================= */}
        {previewTab === "kiosk" && (
          <div className="space-y-4 animate-fade-in text-slate-300">
            
            <div className="bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
              <div className="bg-slate-900 rounded-xl overflow-hidden border border-slate-800 flex flex-col">
                
                {/* Hero image header */}
                <div className="h-44 w-full relative bg-slate-950 overflow-hidden">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className={`h-full w-full bg-gradient-to-br ${product.imageColor || "from-sky-500 to-indigo-600"} flex items-center justify-center text-white text-3xl font-extrabold`}>
                      {product.name ? product.name.slice(0, 2).toUpperCase() : "POS"}
                    </div>
                  )}

                  {/* Category tag */}
                  <span className="absolute top-3 left-3 bg-indigo-600 text-white font-bold text-[9px] px-2 py-0.5 rounded-full uppercase tracking-wider">
                    {product.category || "Menú Kiosco"}
                  </span>
                </div>

                {/* Content */}
                <div className="p-4 space-y-3.5">
                  <div>
                    <h3 className="text-base font-black text-white leading-snug">
                      {product.name || <span className="text-slate-500 italic">Producto sin nombre</span>}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed mt-1.5">
                      {product.description || <span className="text-slate-600 italic">Agrega una descripción para tus clientes en el formulario general.</span>}
                    </p>
                  </div>

                  {/* Stock counter */}
                  {product.trackStock && (
                    <div className={`p-2 rounded-lg border text-xs flex items-center gap-2 ${
                      product.stock === 0
                        ? "bg-rose-950/20 border-rose-900/60 text-rose-400"
                        : product.stock <= product.lowStockThreshold
                        ? "bg-amber-950/20 border-amber-900/60 text-amber-400"
                        : "bg-emerald-950/20 border-emerald-900/60 text-emerald-400"
                    }`}>
                      <AlertCircle className="h-4 w-4" />
                      <span>
                        {product.stock === 0 
                          ? "Temporalmente Agotado" 
                          : product.stock <= product.lowStockThreshold
                          ? `¡Pocas unidades disponibles! Solo quedan ${product.stock}`
                          : `Disponible en tienda - ${product.stock} unidades en stock`
                        }
                      </span>
                    </div>
                  )}

                  {/* Technical Specifications list */}
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2.5">
                      Ficha Técnica y Detalles:
                    </span>
                    {product.attributes.length === 0 ? (
                      <p className="text-[10px] text-slate-500 italic">No hay especificaciones adicionales.</p>
                    ) : (
                      <div className="grid grid-cols-2 gap-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                        {product.attributes.map((attr) => (
                          <div key={attr.id} className="text-[11px] leading-tight border-b border-slate-900 pb-1">
                            <span className="text-slate-500 block truncate">{attr.key}:</span>
                            <span className="text-white font-semibold block truncate" title={attr.value}>{attr.value}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </div>

            <p className="text-[11px] text-slate-400 text-center leading-relaxed">
              La vista de Kiosco muestra la información del producto optimizada para autoservicio, lectura de menús digitales y códigos QR.
            </p>
          </div>
        )}

      </div>

      {/* Panel Footer */}
      <div className="bg-slate-950 px-4 py-3 border-t border-slate-800 text-[10px] text-slate-500 flex items-center justify-between rounded-b-xl">
        <span className="flex items-center gap-1">
          <Eye className="h-3 w-3 text-slate-400" />
          Previsualizaciones 100% en tiempo real
        </span>
        <span className="font-semibold text-indigo-400">
          Entorno POS Sandbox
        </span>
      </div>

    </div>
  );
}
