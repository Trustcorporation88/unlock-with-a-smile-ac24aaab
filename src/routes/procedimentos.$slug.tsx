import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowRight, ArrowLeft, Check, Sparkles, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCategoryBySlug, categories, type ProcedureCategory } from "@/lib/procedures";

export const Route = createFileRoute("/procedimentos/$slug")({
  loader: ({ params }) => {
    const category = getCategoryBySlug(params.slug);
    if (!category) throw notFound();
    return { category };
  },
  head: ({ loaderData }) => {
    const c = loaderData?.category;
    const title = c ? `${c.name} — Dra. Rebecca Rossener` : "Procedimento — Dra. Rebecca Rossener";
    const desc = c?.tagline ?? "Procedimentos da Dra. Rebecca Rossener.";
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
      ],
    };
  },
  component: CategoryPage,
  notFoundComponent: () => (
    <div className="mx-auto max-w-3xl px-4 py-24 text-center md:px-8">
      <p className="text-xs uppercase tracking-[0.3em] text-primary">404</p>
      <h1 className="mt-3 font-serif text-4xl">Procedimento não encontrado</h1>
      <Button asChild className="mt-8 rounded-full">
        <Link to="/procedimentos">Ver todos os procedimentos</Link>
      </Button>
    </div>
  ),
  errorComponent: ({ error, reset }) => (
    <div className="mx-auto max-w-3xl px-4 py-24 text-center md:px-8">
      <h1 className="font-serif text-3xl">Algo deu errado</h1>
      <p className="mt-3 text-muted-foreground">{error.message}</p>
      <Button onClick={reset} className="mt-6 rounded-full">Tentar novamente</Button>
    </div>
  ),
});

function CategoryPage() {
  const { category } = Route.useLoaderData();
  const related = categories.filter((c) => c.slug !== category.slug).slice(0, 3);

  return (
    <>
      {/* HERO */}
      <section className="bg-radial-glow">
        <div className="mx-auto max-w-5xl px-4 py-14 md:px-8 md:py-20">
          <Link to="/procedimentos" className="inline-flex items-center gap-1 text-sm text-primary hover:underline">
            <ArrowLeft className="h-4 w-4" /> Procedimentos
          </Link>
          <p className="mt-6 text-xs uppercase tracking-[0.3em] text-primary">Especialidade</p>
          <h1 className="mt-3 font-serif text-4xl md:text-6xl">{category.name}</h1>
          <p className="mt-5 max-w-2xl text-lg text-muted-foreground">{category.tagline}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" className="rounded-full px-6">
              <Link to="/agendamento">Agendar avaliação <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full border-border bg-transparent px-6 hover:bg-muted/60">
              <Link to="/contato">Tirar dúvidas</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* INTRO */}
      <section className="mx-auto max-w-5xl px-4 py-12 md:px-8 md:py-16">
        <p className="text-lg leading-relaxed text-foreground/90">{category.intro}</p>
      </section>

      {/* HIGHLIGHTS + INDICAÇÕES */}
      <section className="border-y border-border bg-surface/40">
        <div className="mx-auto grid max-w-5xl gap-8 px-4 py-14 md:grid-cols-2 md:px-8">
          <div className="rounded-2xl border border-border bg-card p-7">
            <div className="flex items-center gap-2 text-primary">
              <Sparkles className="h-5 w-5" />
              <p className="text-xs uppercase tracking-[0.2em]">Diferenciais</p>
            </div>
            <ul className="mt-5 space-y-3">
              {category.highlights.map((h) => (
                <li key={h} className="flex gap-3 text-sm text-card-foreground">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-border bg-card p-7">
            <p className="text-xs uppercase tracking-[0.2em] text-primary">Principais indicações</p>
            <ul className="mt-5 space-y-3">
              {category.indications.map((i) => (
                <li key={i} className="flex gap-3 text-sm text-card-foreground">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span>{i}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* PROCEDIMENTOS */}
      <section className="mx-auto max-w-5xl px-4 py-14 md:px-8">
        <p className="text-xs uppercase tracking-[0.3em] text-primary">Procedimentos incluídos</p>
        <h2 className="mt-3 font-serif text-3xl md:text-4xl">O que oferecemos</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {category.procedures.map((p) => (
            <article key={p.name} className="rounded-2xl border border-border bg-card p-6">
              <h3 className="font-serif text-xl text-card-foreground">{p.name}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{p.desc}</p>
            </article>
          ))}
        </div>
      </section>

      {/* RECUPERAÇÃO */}
      <section className="border-t border-border bg-surface/40">
        <div className="mx-auto max-w-5xl px-4 py-14 md:px-8">
          <div className="flex items-center gap-2 text-primary">
            <Clock className="h-5 w-5" />
            <p className="text-xs uppercase tracking-[0.2em]">Recuperação</p>
          </div>
          <p className="mt-4 max-w-3xl text-foreground/90">{category.recovery}</p>
        </div>
      </section>

      {/* RELACIONADOS */}
      <section className="mx-auto max-w-5xl px-4 py-14 md:px-8">
        <h2 className="font-serif text-3xl">Outras especialidades</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {related.map((r) => (
            <Link
              key={r.slug}
              to="/procedimentos/$slug"
              params={{ slug: r.slug }}
              className="group rounded-2xl border border-border bg-card p-6 transition hover:border-primary/40"
            >
              <p className="text-xs uppercase tracking-[0.2em] text-primary">{r.shortName}</p>
              <h3 className="mt-2 font-serif text-lg text-card-foreground">{r.name}</h3>
              <span className="mt-4 inline-flex items-center gap-1 text-sm text-primary">
                Saiba mais <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-4xl px-4 py-16 text-center md:px-8">
        <h2 className="font-serif text-3xl md:text-4xl">
          Quer entender se este é o procedimento <em className="text-primary">certo</em> para você?
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
          Agende uma consulta de avaliação. Cada caso é único e merece um plano individualizado.
        </p>
        <Button asChild size="lg" className="mt-8 rounded-full px-6">
          <Link to="/agendamento">Agendar Consulta</Link>
        </Button>
      </section>
    </>
  );
}
