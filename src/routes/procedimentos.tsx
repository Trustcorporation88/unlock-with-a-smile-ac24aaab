import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/procedimentos")({
  component: ProceduresPage,
  head: () => ({
    meta: [
      { title: "Procedimentos — Dra. Rebecca Rossener" },
      { name: "description", content: "Procedimentos realizados pela Dra. Rebecca Rossener: cirurgia plástica pediátrica, reparadora e estética, em São Paulo e Taubaté." },
    ],
  }),
});

type Category = "Todos" | "Pediátrica" | "Reparadora" | "Estética";
const categories: Category[] = ["Todos", "Pediátrica", "Reparadora", "Estética"];

const procedures: { name: string; category: Exclude<Category, "Todos">; desc: string }[] = [
  { name: "Otoplastia (Orelha em Abano)", category: "Pediátrica", desc: "Correção cirúrgica de orelhas em abano em crianças e adultos, com técnica delicada e cicatrizes discretas atrás da orelha." },
  { name: "Cirurgia Pediátrica Reparadora", category: "Pediátrica", desc: "Procedimentos reparadores em bebês e crianças realizados com técnica precisa, cuidado humanizado e equipe pediátrica especializada." },
  { name: "Reconstrução de Cicatrizes", category: "Reparadora", desc: "Tratamento de cicatrizes hipertróficas, queloides e sequelas pós-traumáticas, com técnicas avançadas de revisão cicatricial." },
  { name: "Cirurgia Pós-Trauma", category: "Reparadora", desc: "Reparação de defeitos faciais e corporais após acidentes, mordeduras ou ressecções oncológicas." },
  { name: "Reconstrução Mamária", category: "Reparadora", desc: "Reconstrução mamária pós-mastectomia com técnicas modernas e planejamento individualizado." },
  { name: "Rinoplastia", category: "Estética", desc: "Cirurgia do nariz para harmonização estética e/ou funcional, com resultado natural e respeito à anatomia." },
  { name: "Blefaroplastia", category: "Estética", desc: "Cirurgia das pálpebras para rejuvenescimento do olhar, removendo excesso de pele e bolsas." },
  { name: "Mamoplastia", category: "Estética", desc: "Aumento, redução ou levantamento das mamas com planejamento personalizado." },
  { name: "Abdominoplastia", category: "Estética", desc: "Remodelagem do abdômen com remoção de pele e correção da musculatura — comum no pós-gestação." },
  { name: "Lipoaspiração", category: "Estética", desc: "Contorno corporal com remoção localizada de gordura, com técnicas modernas e recuperação otimizada." },
];

function ProceduresPage() {
  const [filter, setFilter] = useState<Category>("Todos");
  const list = filter === "Todos" ? procedures : procedures.filter((p) => p.category === filter);

  return (
    <>
      <section className="bg-radial-glow">
        <div className="mx-auto max-w-7xl px-4 py-14 md:px-8 md:py-28">
          <p className="text-xs uppercase tracking-[0.3em] text-primary">Especialidades</p>
          <h1 className="mt-3 max-w-3xl font-serif text-5xl md:text-6xl">Procedimentos</h1>
          <p className="mt-5 max-w-2xl text-muted-foreground">
            Cada procedimento é planejado de forma individualizada, com técnicas modernas, segurança e resultados naturais.
          </p>
          <div className="mt-10 flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setFilter(c)}
                className={`rounded-full border px-4 py-2 text-xs uppercase tracking-[0.2em] transition ${
                  filter === c
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border text-foreground/80 hover:border-primary/40 hover:text-primary"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 md:px-8">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {list.map((p) => {
            const slug =
              p.category === "Pediátrica" || p.category === "MOBE"
                ? p.category === "MOBE"
                  ? "otoplastia-modelagem"
                  : p.name.toLowerCase().includes("otoplastia")
                    ? "otoplastia-modelagem"
                    : "cirurgia-pediatrica"
                : p.category === "Anomalias Vasculares"
                  ? "anomalias-vasculares"
                  : p.category === "Reparadora"
                    ? "reparadora"
                    : "estetica";
            return (
              <Link
                key={p.name}
                to="/procedimentos/$slug"
                params={{ slug }}
                className="group flex flex-col rounded-2xl border border-border bg-card p-7 transition hover:border-primary/40"
              >
                <p className="text-xs uppercase tracking-[0.2em] text-primary">{p.category}</p>
                <h3 className="mt-2 font-serif text-2xl text-card-foreground">{p.name}</h3>
                <p className="mt-3 flex-1 text-sm text-muted-foreground">{p.desc}</p>
                <span className="mt-5 inline-flex items-center gap-1 text-sm text-primary">
                  Saiba mais <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="border-t border-border bg-surface/40">
        <div className="mx-auto max-w-5xl px-4 py-16 text-center md:px-8">
          <h2 className="font-serif text-4xl md:text-5xl">Não sabe qual procedimento é <em className="text-primary">ideal</em> para você?</h2>
          <p className="mx-auto mt-5 max-w-2xl text-muted-foreground">
            Agende uma consulta de avaliação. A Dra. Rebecca irá analisar seu caso individualmente
            e indicar o melhor caminho.
          </p>
          <div className="mt-8">
            <Button asChild size="lg" className="rounded-full px-6">
              <Link to="/agendamento">Agendar Consulta de Avaliação</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
