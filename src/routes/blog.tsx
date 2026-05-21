import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, CalendarDays, Clock } from "lucide-react";

export const Route = createFileRoute("/blog")({
  component: BlogPage,
  head: () => ({
    meta: [
      { title: "Blog — Dra. Rebecca Rossener" },
      { name: "description", content: "Artigos sobre cirurgia plástica, recuperação, segurança e cuidados, com responsabilidade e base científica." },
    ],
  }),
});

const posts = [
  { slug: "mitos-cirurgia-plastica", title: "5 mitos sobre cirurgia plástica que precisam acabar", excerpt: "Separando crenças populares da realidade científica, com responsabilidade.", date: "10 Mai 2026", read: "6 min" },
  { slug: "pre-operatorio-seguro", title: "Pré-operatório: como se preparar para uma cirurgia segura", excerpt: "Exames, hábitos e cuidados que aumentam a segurança e a qualidade do resultado.", date: "28 Abr 2026", read: "5 min" },
  { slug: "cirurgia-pediatrica", title: "Cirurgia plástica em crianças: quando é indicada?", excerpt: "Entenda o papel da cirurgia reparadora pediátrica e seus principais cuidados.", date: "12 Abr 2026", read: "7 min" },
  { slug: "anomalias-vasculares", title: "Anomalias vasculares: hemangiomas e malformações", excerpt: "O que são, como diagnosticar e quais são as opções de tratamento atuais.", date: "02 Abr 2026", read: "8 min" },
  { slug: "pos-operatorio-resultado", title: "O pós-operatório como parte do resultado", excerpt: "Por que o acompanhamento próximo é tão importante quanto a cirurgia em si.", date: "20 Mar 2026", read: "4 min" },
  { slug: "expectativas-realistas", title: "Expectativas realistas: o melhor caminho para a satisfação", excerpt: "Como uma conversa franca antes da cirurgia transforma a experiência do paciente.", date: "08 Mar 2026", read: "5 min" },
];

function BlogPage() {
  return (
    <>
      <section className="bg-radial-glow">
        <div className="mx-auto max-w-7xl px-4 py-20 md:px-8 md:py-28">
          <p className="text-xs uppercase tracking-[0.3em] text-primary">Blog</p>
          <h1 className="mt-3 max-w-3xl font-serif text-5xl md:text-6xl">Informação com <em className="text-primary">responsabilidade</em></h1>
          <p className="mt-5 max-w-2xl text-muted-foreground">
            Conteúdos sobre cirurgia plástica, recuperação e cuidados, com base científica e linguagem acessível.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 md:px-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => (
            <article key={p.slug} className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-card transition hover:border-primary/40">
              <div className="relative aspect-[5/3] overflow-hidden bg-gradient-to-br from-primary/30 via-surface to-background">
                <div className="absolute inset-0 grid place-items-center font-serif text-5xl text-foreground/15 transition group-hover:scale-105">
                  R.R.
                </div>
              </div>
              <div className="flex flex-1 flex-col p-6">
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1"><CalendarDays className="h-3.5 w-3.5" /> {p.date}</span>
                  <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {p.read}</span>
                </div>
                <h2 className="mt-3 font-serif text-2xl leading-tight">{p.title}</h2>
                <p className="mt-3 flex-1 text-sm text-muted-foreground">{p.excerpt}</p>
                <Link to="/blog" className="mt-5 inline-flex items-center gap-1 text-sm text-primary">
                  Ler artigo <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
