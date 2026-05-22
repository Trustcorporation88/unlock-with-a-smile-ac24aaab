import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/procedimentos")({
  component: ProceduresPage,
  head: () => ({
    meta: [
      { title: "Procedimentos — Dra. Rebecca Rossener" },
      { name: "description", content: "Conheça os procedimentos realizados pela Dra. Rebecca Rossener: cirurgia facial, corporal, pediátrica, anomalias vasculares e tratamentos não-cirúrgicos." },
    ],
  }),
});

type Category = "Todos" | "Facial" | "Corporal" | "Pediátrica" | "Anomalias Vasculares" | "Não-Cirúrgico";
const categories: Category[] = ["Todos", "Facial", "Corporal", "Pediátrica", "Anomalias Vasculares", "Não-Cirúrgico"];

const procedures: { name: string; category: Exclude<Category, "Todos">; desc: string }[] = [
  { name: "Rinoplastia", category: "Facial", desc: "Cirurgia do nariz para harmonização estética e/ou funcional, com resultado natural." },
  { name: "Blefaroplastia", category: "Facial", desc: "Cirurgia das pálpebras para rejuvenescimento do olhar." },
  { name: "Lifting Facial", category: "Facial", desc: "Reposicionamento dos tecidos do rosto e pescoço para um resultado natural e duradouro." },
  { name: "Otoplastia", category: "Facial", desc: "Correção cirúrgica de orelhas em abano." },
  { name: "Mamoplastia de Aumento", category: "Corporal", desc: "Aumento das mamas com próteses de alta qualidade e planejamento individualizado." },
  { name: "Mamoplastia Redutora", category: "Corporal", desc: "Redução das mamas com melhora postural e estética." },
  { name: "Mastopexia", category: "Corporal", desc: "Levantamento das mamas com ou sem prótese." },
  { name: "Abdominoplastia", category: "Corporal", desc: "Remodelagem do abdômen com remoção de pele e correção da musculatura." },
  { name: "Lipoaspiração", category: "Corporal", desc: "Contorno corporal com remoção localizada de gordura." },
  { name: "Cirurgia Pediátrica Reparadora", category: "Pediátrica", desc: "Procedimentos reparadores em crianças com técnica e cuidado especializado." },
  { name: "Correção de Orelhas em Crianças", category: "Pediátrica", desc: "Otoplastia infantil realizada com técnica delicada e segura." },
  { name: "Hemangiomas", category: "Anomalias Vasculares", desc: "Avaliação e tratamento cirúrgico de hemangiomas, com abordagem individualizada." },
  { name: "Malformações Vasculares", category: "Anomalias Vasculares", desc: "Tratamento cirúrgico de malformações vasculares em adultos e crianças." },
  { name: "Toxina Botulínica", category: "Não-Cirúrgico", desc: "Aplicação para suavização de rugas dinâmicas e harmonização facial." },
  { name: "Preenchimentos", category: "Não-Cirúrgico", desc: "Preenchimento com ácido hialurônico para áreas estratégicas do rosto." },
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
          {list.map((p) => (
            <article key={p.name} className="group flex flex-col rounded-2xl border border-border bg-card p-7 transition hover:border-primary/40">
              <p className="text-xs uppercase tracking-[0.2em] text-primary">{p.category}</p>
              <h3 className="mt-2 font-serif text-2xl">{p.name}</h3>
              <p className="mt-3 flex-1 text-sm text-muted-foreground">{p.desc}</p>
              <Link to="/agendamento" className="mt-5 inline-flex items-center gap-1 text-sm text-primary opacity-0 transition group-hover:opacity-100">
                Agendar avaliação <ArrowRight className="h-4 w-4" />
              </Link>
            </article>
          ))}
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
