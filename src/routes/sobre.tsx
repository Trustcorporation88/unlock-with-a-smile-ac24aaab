import { createFileRoute, Link } from "@tanstack/react-router";
import { Award, GraduationCap, Stethoscope, Heart, Quote, Film, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Medallion } from "@/components/site/Medallion";

export const Route = createFileRoute("/sobre")({
  component: SobrePage,
  head: () => ({
    meta: [
      { title: "Sobre a Dra. Rebecca Rossener — Cirurgiã Plástica USP" },
      { name: "description", content: "Natural de Taubaté (SP), formada em Medicina pela USP (2015), com residência em Cirurgia Geral e especialização em Cirurgia Plástica no HC-FMUSP. Experiência internacional em SickKids (Canadá) e Cleveland Clinic (EUA)." },
    ],
  }),
});

const values = [
  { t: "Acolhimento", d: "Cada paciente é recebido com escuta ativa, empatia e respeito à sua individualidade." },
  { t: "Ética", d: "Indicações honestas, transparência total e compromisso com o bem-estar do paciente acima de tudo." },
  { t: "Excelência", d: "Formação de alto nível pela USP e atualização contínua nas melhores técnicas cirúrgicas." },
  { t: "Conhecimento", d: "Medicina baseada em evidências, com rigor científico e responsabilidade em cada decisão." },
  { t: "Respeito", d: "Respeito à autonomia do paciente, ao seu corpo e às suas expectativas reais." },
  { t: "Honestidade", d: "Comunicação clara sobre indicações, riscos, limitações e resultados esperados." },
];

const timeline = [
  { period: "Graduação · 2015", title: "Medicina — USP", place: "Faculdade de Medicina da Universidade de São Paulo", desc: "Participação ativa nas Ligas Acadêmicas de Assistência Primária à Mulher, Genética Clínica e Acupuntura, e no projeto Bandeiras Científicas — levando atendimento médico a comunidades carentes do interior do Brasil." },
  { period: "Residência · 2019", title: "Cirurgia Geral", place: "Hospital das Clínicas — FMUSP", desc: "Formação completa em cirurgia geral no maior complexo hospitalar da América Latina." },
  { period: "Especialização · 2023", title: "Cirurgia Plástica", place: "Hospital das Clínicas — FMUSP", desc: "Especialização em cirurgia plástica sob orientação do Prof. Dov Goldenberg, com atuação em cirurgia reparadora, pediátrica e estética." },
  { period: "Internacional", title: "SickKids · Cleveland Clinic", place: "Toronto (Canadá) · Cleveland (EUA)", desc: "Estágio observacional na Divisão de Cirurgia Plástica do Hospital for Sick Children Foundation (Canadá) e programa de verão no Center for Reproductive Medicine da Cleveland Clinic Foundation (EUA)." },
];

function SobrePage() {
  return (
    <>
      <section className="bg-radial-glow">
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-14 md:grid-cols-2 md:px-8 md:py-28">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-primary">Sobre a Médica</p>
            <h1 className="mt-3 font-serif text-5xl leading-tight md:text-6xl">Dra. Rebecca Rossener</h1>
            <p className="mt-5 text-pretty text-lg text-muted-foreground">
              Cirurgiã plástica formada pela USP, com especialização em cirurgia reparadora,
              pediátrica e anomalias vasculares. Uma trajetória marcada pela dedicação, pelo
              amor à medicina e pelo cuidado genuinamente humano com cada paciente.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-xs"><GraduationCap className="h-4 w-4 text-primary" /> USP — Faculdade de Medicina</span>
              <span className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-xs"><Award className="h-4 w-4 text-primary" /> Membro SBCP</span>
            </div>
          </div>
          <Medallion className="mx-auto aspect-square w-full max-w-[480px]" />
        </div>
      </section>

      <section className="border-y border-border bg-surface/40">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-16 md:grid-cols-5 md:px-8">
          <div className="md:col-span-2">
            <p className="text-xs uppercase tracking-[0.3em] text-primary">Minha História</p>
            <h2 className="mt-3 font-serif text-4xl md:text-5xl">
              Uma vocação que <em className="text-primary">nasceu cedo</em> e cresceu com propósito
            </h2>
          </div>
          <div className="space-y-5 text-muted-foreground md:col-span-3">
            <p>Entrei na medicina com apenas 16 anos, sendo a primeira da família a seguir essa trajetória. Desde o início, sabia que queria mais do que tratar doenças — queria transformar vidas, restaurar a autoestima e cuidar de pessoas com um olhar humano e acolhedor.</p>
            <p>A cirurgia plástica surgiu como a especialidade que unia minha habilidade técnica ao meu propósito de vida. Ao longo da residência no Hospital das Clínicas da USP, apaixonei-me pela cirurgia pediátrica e pelo tratamento de anomalias vasculares — áreas em que a cirurgia reparadora pode mudar profundamente a qualidade de vida de crianças e de suas famílias.</p>
            <p>Participei de expedições cirúrgicas em regiões remotas do Brasil, levando cirurgia plástica reparadora a comunidades sem acesso a esse tipo de cuidado. Essa experiência reforçou meu compromisso com a medicina ética, acessível e humanizada.</p>
            <p>Hoje, atendo pacientes que buscam tanto procedimentos estéticos quanto reparadores, sempre com a mesma dedicação: resultados naturais, segurança em primeiro lugar e um cuidado que vai muito além da cirurgia.</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 md:px-8">
        <p className="text-xs uppercase tracking-[0.3em] text-primary">Valores</p>
        <h2 className="mt-3 max-w-2xl font-serif text-4xl md:text-5xl">O que guia minha <em className="text-primary">prática médica</em></h2>
        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {values.map((v) => (
            <div key={v.t} className="rounded-2xl border border-border bg-card p-6">
              <Heart className="h-5 w-5 text-primary" />
              <h3 className="mt-3 font-serif text-xl">{v.t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{v.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-surface/40">
        <div className="mx-auto max-w-7xl px-4 py-16 md:px-8">
          <p className="text-xs uppercase tracking-[0.3em] text-primary">Formação & Credenciais</p>
          <h2 className="mt-3 max-w-3xl font-serif text-4xl md:text-5xl">Trajetória <em className="text-primary">acadêmica</em> e profissional</h2>
          <div className="mt-12 grid gap-px overflow-hidden rounded-2xl bg-white/10 md:grid-cols-2">
            {timeline.map((t) => (
              <div key={t.title} className="bg-card p-7">
                <p className="text-xs uppercase tracking-[0.25em] text-primary">{t.period}</p>
                <h3 className="mt-2 font-serif text-xl">{t.title}</h3>
                <p className="mt-1 text-sm text-foreground/80">{t.place}</p>
                <p className="mt-2 text-sm text-muted-foreground">{t.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="flex items-start gap-3 rounded-2xl border border-border bg-card p-5">
              <Award className="mt-1 h-5 w-5 text-primary" />
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-primary">SBCP</p>
                <p className="mt-1 font-serif text-lg">Membro Titular da Sociedade Brasileira de Cirurgia Plástica</p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-2xl border border-border bg-card p-5">
              <Stethoscope className="mt-1 h-5 w-5 text-primary" />
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-primary">CRM/SP</p>
                <p className="mt-1 font-serif text-lg">CRM 176.098 · RQE 111.228</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-16 text-center md:px-8">
        <Quote className="mx-auto h-8 w-8 text-primary" />
        <blockquote className="mt-5 font-serif text-3xl leading-snug md:text-4xl">
          "Cuidar de uma pessoa é muito mais do que operar — é caminhar junto, ouvir e respeitar cada história."
        </blockquote>
        <p className="mt-5 text-xs uppercase tracking-[0.3em] text-muted-foreground">— Dra. Rebecca Rossener</p>
        <div className="mt-10">
          <Button asChild size="lg" className="rounded-full px-6">
            <Link to="/agendamento">Agendar Consulta</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
