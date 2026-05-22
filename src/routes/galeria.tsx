import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/galeria")({
  component: GaleriaPage,
  head: () => ({
    meta: [
      { title: "Galeria — Dra. Rebecca Rossener" },
      { name: "description", content: "Casos selecionados, publicados com consentimento dos pacientes e identidades preservadas, em conformidade com o Código de Ética Médica." },
    ],
  }),
});

function GaleriaPage() {
  const cards = Array.from({ length: 9 });
  return (
    <>
      <section className="bg-radial-glow">
        <div className="mx-auto max-w-7xl px-4 py-14 md:px-8 md:py-28">
          <p className="text-xs uppercase tracking-[0.3em] text-primary">Galeria</p>
          <h1 className="mt-3 max-w-3xl font-serif text-5xl md:text-6xl">Casos selecionados, com <em className="text-primary">ética</em> e privacidade</h1>
          <p className="mt-5 max-w-2xl text-muted-foreground">
            Imagens publicadas com consentimento expresso dos pacientes. Identidades preservadas em
            conformidade com o Código de Ética Médica e a Resolução CFM nº 1.974/2011.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 md:px-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((_, i) => (
            <div key={i} className="group relative aspect-[4/5] overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-surface via-background to-surface">
              <div className="absolute inset-0 grid place-items-center font-serif text-2xl text-foreground/15">
                Caso #{String(i + 1).padStart(2, "0")}
              </div>
              <div className="absolute inset-x-0 bottom-0 translate-y-full bg-background/90 p-5 text-sm text-foreground/90 backdrop-blur transition group-hover:translate-y-0">
                <p className="font-serif text-base">Procedimento individualizado</p>
                <p className="mt-1 text-xs text-muted-foreground">Resultado natural — fotos com consentimento.</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 rounded-2xl border border-primary/30 bg-primary/5 p-8 text-center">
          <h2 className="font-serif text-3xl">Quer ver mais casos?</h2>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
            Por respeito à privacidade, parte do acervo é apresentado apenas em consulta presencial,
            com casos compatíveis com o seu perfil.
          </p>
          <div className="mt-5">
            <Button asChild size="lg" className="rounded-full px-6">
              <Link to="/agendamento">Agendar Consulta</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
