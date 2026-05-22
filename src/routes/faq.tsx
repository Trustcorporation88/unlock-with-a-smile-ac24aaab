import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/faq")({
  component: FaqPage,
  head: () => ({
    meta: [
      { title: "Perguntas Frequentes — Dra. Rebecca Rossener" },
      { name: "description", content: "Respostas às principais dúvidas sobre consultas, cirurgias, pós-operatório e segurança." },
    ],
  }),
});

const faqs = [
  { q: "Em quanto tempo consigo agendar uma consulta?", a: "Em geral, conseguimos encaixar novas consultas em até 7 dias úteis. Para casos urgentes, entre em contato pelo WhatsApp." },
  { q: "Atendem convênios?", a: "Os atendimentos são particulares. Emitimos recibo para reembolso conforme as regras do seu plano." },
  { q: "Como é a primeira consulta?", a: "É um momento de escuta. Avaliamos seu caso, conversamos sobre expectativas, indicações, riscos e elaboramos um plano cirúrgico personalizado." },
  { q: "Em quais hospitais são realizadas as cirurgias?", a: "Em hospitais acreditados de referência em São Paulo, com equipe multidisciplinar e anestesistas experientes." },
  { q: "Como funciona o pós-operatório?", a: "O acompanhamento é próximo e personalizado, com retornos programados e contato direto com a equipe sempre que necessário." },
  { q: "Existe garantia de resultado?", a: "Nenhum procedimento médico tem garantia absoluta de resultado. Trabalhamos com responsabilidade, previsibilidade e total transparência sobre o que é possível esperar." },
  { q: "Crianças podem realizar cirurgia plástica?", a: "Sim, em casos específicos e bem indicados — sobretudo cirurgias reparadoras e tratamento de anomalias vasculares. Cada caso é avaliado individualmente." },
  { q: "Como é a recuperação?", a: "Varia conforme o procedimento. Você receberá um plano detalhado de cuidados pré e pós-operatórios para uma recuperação segura e confortável." },
];

function FaqPage() {
  return (
    <>
      <section className="bg-radial-glow">
        <div className="mx-auto max-w-7xl px-4 py-14 md:px-8 md:py-28">
          <p className="text-xs uppercase tracking-[0.3em] text-primary">Dúvidas Frequentes</p>
          <h1 className="mt-3 max-w-3xl font-serif text-5xl md:text-6xl">Perguntas que nossos <em className="text-primary">pacientes</em> nos fazem</h1>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-14 md:px-8">
        <div className="space-y-3">
          {faqs.map((f) => (
            <details key={f.q} className="group rounded-xl border border-border bg-card p-5 open:border-primary/40">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-serif text-lg">
                {f.q}
                <ChevronDown className="h-4 w-4 text-primary transition group-open:rotate-180" />
              </summary>
              <p className="mt-3 text-sm text-muted-foreground">{f.a}</p>
            </details>
          ))}
        </div>
        <div className="mt-12 text-center">
          <p className="text-muted-foreground">Sua dúvida não está aqui?</p>
          <Button asChild size="lg" className="mt-4 rounded-full px-6">
            <Link to="/contato">Fale com a gente</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
