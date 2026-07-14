import { useState, useMemo, useEffect } from "react";
import { Product } from "./types";
import { INITIAL_PRODUCTS } from "./data";
import Header from "./components/Header";
import SidebarList from "./components/SidebarList";
import ProductForm from "./components/ProductForm";
import POSPreviewPanel from "./components/POSPreviewPanel";
import { Sparkles, AlertCircle, RefreshCw, PlusCircle, X } from "lucide-react";

interface Toast {
  id: string;
  message: string;
  type: "success" | "info" | "warning" | "error";
}

export default function App() {
  // Main Products state
  const [products, setProducts] = useState<Product[]>(() => {
    // Attempt local storage persistence if desired
    const saved = localStorage.getItem("pos_products_db");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_PRODUCTS;
      }
    }
    return INITIAL_PRODUCTS;
  });

  // Selected product ID state
  const [selectedProductId, setSelectedProductId] = useState<string>(() => {
    return products.length > 0 ? products[0].id : "";
  });

  // Edit Modal visibility state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Toast notification state
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Sync products state to localStorage
  useEffect(() => {
    localStorage.setItem("pos_products_db", JSON.stringify(products));
  }, [products]);

  // Handle Escape key to close the modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsEditModalOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Helper to trigger toast notifications
  const showToast = (message: string, type: Toast["type"] = "success") => {
    const newToast: Toast = {
      id: `toast-${Date.now()}-${Math.random()}`,
      message,
      type,
    };
    setToasts((prev) => [...prev, newToast]);
    
    // Auto remove after 3.5s
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
    }, 3500);
  };

  // Find active product
  const activeProduct = useMemo(() => {
    return products.find((p) => p.id === selectedProductId) || null;
  }, [products, selectedProductId]);

  // --- ACTIONS ---

  // Update product properties
  const handleUpdateProduct = (updatedProduct: Product) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    );
  };

  // Add a brand-new blank product
  const handleAddProduct = () => {
    const newId = `prod-${Date.now()}`;
    const newProduct: Product = {
      id: newId,
      name: "Nuevo Producto Demo",
      description: "Descripción del nuevo artículo para venta rápida en caja.",
      sku: `RET-NEW-${Math.floor(100 + Math.random() * 900)}`,
      barcode: Math.floor(100000000000 + Math.random() * 900000000000).toString(),
      category: "🍔 Comida Rápida",
      price: 10.00,
      cost: 4.00,
      taxRate: 16,
      imageUrl: "",
      imageColor: "from-sky-400 to-indigo-600",
      trackStock: true,
      stock: 25,
      lowStockThreshold: 5,
      variants: [],
      modifiers: [],
      attributes: [
        { id: `attr-${Date.now()}-1`, key: "Origen", value: "Nacional" }
      ],
    };

    setProducts((prev) => [...prev, newProduct]);
    setSelectedProductId(newId);
    setIsEditModalOpen(true);
    showToast("¡Nuevo producto creado! Configura sus detalles.", "success");
  };

  // Delete product from catalog
  const handleDeleteProduct = (id: string) => {
    const productToDelete = products.find((p) => p.id === id);
    const updatedProducts = products.filter((p) => p.id !== id);
    
    setProducts(updatedProducts);
    showToast(`"${productToDelete?.name || "Producto"}" eliminado del catálogo.`, "warning");

    // Re-select next remaining or empty state
    if (updatedProducts.length > 0) {
      setSelectedProductId(updatedProducts[0].id);
    } else {
      setSelectedProductId("");
    }
  };

  // Restore factory demo presets
  const handleResetPresets = () => {
    if (window.confirm("¿Estás seguro de que deseas restaurar las demostraciones de fábrica? Esto sobrescribirá tus cambios locales.")) {
      setProducts(INITIAL_PRODUCTS);
      setSelectedProductId(INITIAL_PRODUCTS[0].id);
      showToast("Catálogo restablecido con los productos demo oficiales.", "info");
    }
  };

  return (
    <div className="min-h-screen bg-natural-bg font-sans flex flex-col antialiased selection:bg-natural-primary/10 selection:text-natural-primary" id="app-root-container">
      
      {/* 1. Header component */}
      <Header onResetPresets={handleResetPresets} productCount={products.length} />

      {/* 2. Main content container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-6">
        
        {/* Banner callout */}
        <div className="bg-[#4a4a40] text-[#f7f6f2] p-5 rounded-[24px] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md relative overflow-hidden border border-natural-border/10">
          <div className="absolute top-0 right-0 h-40 w-40 bg-natural-surface/10 rounded-full blur-3xl" />
          <div className="flex items-start sm:items-center gap-3 relative z-10">
            <div className="h-9 w-9 rounded-xl bg-natural-bg/15 flex items-center justify-center text-[#edebe4]">
              <Sparkles className="h-5 w-5 animate-pulse text-[#d6d4ca]" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold tracking-tight text-white font-sans">
                Catálogo de Alimentos & Bebidas
              </h2>
              <p className="text-xs text-[#d6d4ca] mt-0.5">
                Haz clic en cualquier comida del catálogo para abrir el panel de edición modal y personalizar precios, variantes o extras.
              </p>
            </div>
          </div>
          <div className="text-[11px] text-[#f7f6f2] font-medium sm:text-right flex-shrink-0 bg-black/10 border border-white/15 px-3 py-1.5 rounded-xl self-start sm:self-center">
            Gestión Rápida & Editor Emergente
          </div>
        </div>

        {/* 3. Centered Elegant Food Catalog Table */}
        <div className="max-w-4xl w-full mx-auto flex flex-col rounded-[24px] overflow-hidden shadow-sm border border-natural-border bg-white" id="food-catalog-container">
          <SidebarList
            products={products}
            selectedProductId={selectedProductId}
            onSelectProduct={(id) => {
              setSelectedProductId(id);
              setIsEditModalOpen(true);
            }}
            onAddProduct={handleAddProduct}
          />
        </div>

      </main>

      {/* 5. Elegant Edit Modal Overlay */}
      {isEditModalOpen && activeProduct && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
          id="product-edit-modal-backdrop"
          onClick={() => setIsEditModalOpen(false)}
        >
          <div 
            className="bg-white rounded-[24px] shadow-2xl border border-natural-border w-full max-w-2xl md:max-w-3xl overflow-hidden max-h-[90vh] flex flex-col animate-scale-in"
            id="product-edit-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-[#4a4a40] text-white px-6 py-4 flex items-center justify-between border-b border-[#5a5a40]/10">
              <div className="flex items-center gap-2.5">
                <span className="text-lg">🍔</span>
                <div>
                  <h3 className="text-sm font-bold font-sans text-white">
                    Editar Comida: {activeProduct.name || "Sin nombre"}
                  </h3>
                  <p className="text-[10px] text-[#edebe4]/85 mt-0.5">
                    Modifica detalles, precios, extras o stock. Los cambios se guardan automáticamente.
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="p-1.5 rounded-lg bg-black/10 hover:bg-black/25 text-white/80 hover:text-white transition-colors cursor-pointer"
                title="Cerrar modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-6 bg-natural-bg/30">
              <ProductForm
                product={activeProduct}
                onUpdateProduct={handleUpdateProduct}
                onDeleteProduct={(id) => {
                  handleDeleteProduct(id);
                  setIsEditModalOpen(false);
                }}
              />
            </div>

            {/* Modal Footer */}
            <div className="bg-white px-6 py-4 border-t border-natural-border flex items-center justify-between gap-4">
              <span className="text-[10px] text-natural-muted">
                * Todos los cambios se aplican y guardan en tiempo real.
              </span>
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="bg-natural-primary hover:bg-[#4a4a40] text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-sm transition-all cursor-pointer"
              >
                Listo / Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Elegant Toast Notifications Container (Floating) */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-md w-full px-4 sm:px-0">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`p-3.5 rounded-xl shadow-lg border text-xs font-semibold flex items-start gap-2.5 animate-fade-in backdrop-blur-md transition-all ${
              toast.type === "success"
                ? "bg-[#5A5A40] text-white border-[#e8e7e0]/20 shadow-[#5a5a40]/15"
                : toast.type === "warning"
                ? "bg-rose-700 text-white border-rose-500/20"
                : toast.type === "info"
                ? "bg-[#4a4a40] text-white border-[#e8e7e0]/20"
                : "bg-neutral-800 text-white border-neutral-700"
            }`}
          >
            <div className="flex-1">{toast.message}</div>
          </div>
        ))}
      </div>

    </div>
  );
}
