import { Link } from "@tanstack/react-router";
import { Menu, Phone, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";


const nav = [
  { to: "/", label: "Início" },
  { to: "/sobre", label: "Sobre" },
  { to: "/procedimentos", label: "Procedimentos" },
  { to: "/blog", label: "Blog" },
  { to: "/galeria", label: "Galeria" },
  { to: "/contato", label: "Contato" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-8">
        <Link to="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <img src={logo} alt="Dra. Rebecca Rossener" className="h-12 w-12 rounded-full object-contain" />
          <span className="leading-tight">
            <span className="block font-serif text-base text-foreground">Dra. Rebecca Rossener</span>
            <span className="block text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
              Cirurgia Plástica
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="text-sm text-foreground/80 transition-colors hover:text-primary [&.active]:text-primary"
              activeOptions={{ exact: n.to === "/" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:block">
          <Button asChild size="lg" className="rounded-full">
            <Link to="/agendamento">
              <Phone className="mr-2 h-4 w-4" /> Agendar Consulta
            </Link>
          </Button>
        </div>

        <button
          aria-label="Abrir menu"
          className="rounded-md p-2 text-foreground lg:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-background/95 lg:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2 text-sm text-foreground/85 hover:bg-muted/60 [&.active]:text-primary"
                activeOptions={{ exact: n.to === "/" }}
              >
                {n.label}
              </Link>
            ))}
            <Button asChild className="mt-2 rounded-full">
              <Link to="/agendamento" onClick={() => setOpen(false)}>
                Agendar Consulta
              </Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
