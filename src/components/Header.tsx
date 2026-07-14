import { Store, Wifi, RefreshCw, Layers } from "lucide-react";

interface HeaderProps {
  onResetPresets: () => void;
  productCount: number;
}

export default function Header({ onResetPresets, productCount }: HeaderProps) {
  return (
    <header className="border-b border-natural-border bg-white sticky top-0 z-40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          
          {/* Brand/Title */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-natural-primary text-white shadow-sm shadow-natural-primary/10">
              <Store className="h-5 w-5" id="header-logo-icon" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-natural-dark flex items-center gap-2">
                Gestor de Catálogo
                <span className="inline-flex items-center rounded-md bg-natural-bg px-2 py-1 text-xs font-medium text-natural-text ring-1 ring-inset ring-natural-border">
                  POS v4.2
                </span>
              </h1>
              <p className="text-xs text-natural-muted hidden sm:block font-medium">
                Configura productos, variantes y modificadores en tiempo real
              </p>
            </div>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 text-xs font-semibold text-natural-primary bg-natural-surface/50 px-2.5 py-1.5 rounded-lg border border-natural-border">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-natural-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-natural-primary"></span>
              </span>
              <span>Terminal Conectada</span>
            </div>

            <div className="text-xs text-natural-muted font-mono hidden lg:block bg-natural-bg px-2.5 py-1.5 rounded-lg border border-natural-border/60">
              {productCount} {productCount === 1 ? "Producto" : "Productos"}
            </div>

            <button
              onClick={onResetPresets}
              id="btn-reset-presets"
              className="flex items-center gap-1.5 text-xs font-semibold text-natural-primary bg-natural-bg hover:bg-natural-surface px-3 py-1.5 rounded-lg transition-colors border border-natural-border-sec"
              title="Restaurar valores de fábrica"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Restaurar Demos</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}
