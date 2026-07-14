import { useState, useMemo } from "react";
import { Product } from "../types";
import { Search, PlusCircle, ShoppingBag, FolderOpen, AlertTriangle } from "lucide-react";
import { PRESET_CATEGORIES } from "../data";

interface SidebarListProps {
  products: Product[];
  selectedProductId: string;
  onSelectProduct: (id: string) => void;
  onAddProduct: () => void;
}

export default function SidebarList({
  products,
  selectedProductId,
  onSelectProduct,
  onAddProduct,
}: SidebarListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Filter products based on search term and category
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.barcode.includes(searchTerm);
      
      const matchesCategory =
        selectedCategory === "all" || product.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, selectedCategory]);

  return (
    <div className="flex flex-col h-full bg-white w-full">
      {/* Search & Actions Panel */}
      <div className="p-4 border-b border-natural-border flex flex-col gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-natural-muted" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nombre, SKU, barra..."
            className="w-full pl-9 pr-4 py-2 text-sm bg-natural-input border border-natural-border rounded-xl focus:outline-none focus:ring-2 focus:ring-natural-primary focus:border-natural-primary transition-all text-natural-text placeholder-natural-muted font-sans"
            id="sidebar-search-input"
          />
        </div>

        <button
          onClick={onAddProduct}
          id="btn-add-new-product"
          className="w-full flex items-center justify-center gap-2 bg-natural-primary hover:bg-[#4a4a40] text-white py-2.5 px-4 rounded-xl text-sm font-semibold shadow-sm shadow-natural-primary/10 transition-all transform active:scale-[0.98]"
        >
          <PlusCircle className="h-4.5 w-4.5" />
          Nuevo Producto
        </button>
      </div>

      {/* Category Horizontal Filter List */}
      <div className="px-4 py-2.5 border-b border-natural-border bg-natural-bg/40 flex gap-2 overflow-x-auto no-scrollbar scroll-smooth">
        <button
          onClick={() => setSelectedCategory("all")}
          className={`px-3 py-1 text-xs font-semibold rounded-full whitespace-nowrap transition-colors ${
            selectedCategory === "all"
              ? "bg-natural-primary text-white"
              : "bg-white text-natural-text border border-natural-border hover:bg-natural-surface"
          }`}
        >
          Todos
        </button>
        {PRESET_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1 text-xs font-semibold rounded-full whitespace-nowrap transition-colors ${
              selectedCategory === cat
                ? "bg-natural-primary text-white"
                : "bg-white text-natural-text border border-natural-border hover:bg-natural-surface"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Product List Content */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1.5 min-h-[250px] lg:min-h-0">
        {filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center px-4">
            <FolderOpen className="h-10 w-10 text-natural-muted mb-3 stroke-[1.5]" />
            <p className="text-sm font-semibold text-natural-text">No hay productos</p>
            <p className="text-xs text-natural-muted mt-1 leading-relaxed">
              Intenta cambiando el filtro o agrega un producto nuevo.
            </p>
          </div>
        ) : (
          filteredProducts.map((product) => {
            const isSelected = product.id === selectedProductId;
            const isLowStock = product.trackStock && product.stock <= product.lowStockThreshold;
            const isOutOfStock = product.trackStock && product.stock === 0;

            return (
              <div
                key={product.id}
                onClick={() => onSelectProduct(product.id)}
                className={`group flex items-center gap-3 p-2.5 rounded-xl cursor-pointer transition-all border ${
                  isSelected
                    ? "bg-natural-surface/40 border-natural-border-sec shadow-sm"
                    : "bg-white border-transparent hover:bg-natural-bg hover:border-natural-border"
                }`}
                id={`sidebar-item-${product.id}`}
              >
                {/* Thumbnail Preview with Fallback */}
                <div className="relative h-11 w-11 rounded-lg overflow-hidden bg-natural-input flex-shrink-0 border border-natural-border">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className={`h-full w-full bg-gradient-to-br ${product.imageColor || "from-slate-400 to-slate-500"} flex items-center justify-center text-white text-[10px] font-bold`}>
                      {product.name.slice(0, 2).toUpperCase()}
                    </div>
                  )}

                  {/* Badges on Thumbnail */}
                  {isOutOfStock && (
                    <div className="absolute inset-0 bg-red-700/90 flex items-center justify-center text-[8px] font-bold text-white uppercase tracking-wider">
                      Agotado
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[10px] font-bold text-natural-muted uppercase tracking-wider block truncate">
                      {product.category.split(" ").slice(1).join(" ") || product.category}
                    </span>
                    {isLowStock && !isOutOfStock && (
                      <span className="inline-flex items-center text-[10px] font-bold text-amber-700 bg-amber-50 px-1 py-0.5 rounded gap-0.5">
                        <AlertTriangle className="h-2.5 w-2.5" />
                        Bajo
                      </span>
                    )}
                  </div>
                  <h3 className={`text-xs truncate ${isSelected ? "text-natural-dark font-bold" : "text-natural-text font-semibold"}`}>
                    {product.name || <span className="text-natural-muted italic">Producto sin nombre</span>}
                  </h3>
                  <div className="flex items-center justify-between text-[11px] text-natural-muted mt-0.5">
                    <span className="font-mono text-natural-muted/80 truncate max-w-[110px]" title={product.sku}>
                      {product.sku || "Sin SKU"}
                    </span>
                    <span className="font-bold text-natural-primary">
                      ${product.price.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer Info */}
      <div className="p-4 border-t border-natural-border bg-natural-bg/30 text-[11px] text-natural-muted flex items-center justify-between font-medium">
        <span>Total: {products.length} ítems</span>
        <span>POS Local DB</span>
      </div>
    </div>
  );
}
