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
              <span className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-xs"><Stethoscope className="h-4 w-4 text-primary" /> CRM-SP 176.098 · RQE 111.228</span>
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
            <p>Natural de <strong className="text-foreground">Taubaté (SP)</strong>, cresci em um ambiente familiar marcado por disciplina, comprometimento e empatia — valores que hoje guiam minha forma de me relacionar com cada paciente. Sou a filha mais velha de três irmãos e, desde o período escolar, nunca tive dúvida de que queria fazer medicina.</p>
            <p>Formei-me em Medicina pela <strong className="text-foreground">Faculdade de Medicina da USP em 2015</strong>, participando ativamente das Ligas Acadêmicas de Assistência Primária à Mulher, Genética Clínica e Acupuntura. Outro momento marcante foi o projeto <em>Bandeiras Científicas</em>, que leva atendimento médico a comunidades carentes do interior do Brasil — uma vivência que reforçou meu interesse pela área cirúrgica.</p>
            <p>Realizei residência em <strong className="text-foreground">Cirurgia Geral no Hospital das Clínicas da FMUSP</strong> (concluída em 2019) e, em seguida, especialização em <strong className="text-foreground">Cirurgia Plástica na mesma instituição</strong> (2023), sob orientação do Prof. Dov Goldenberg. Minha trajetória inclui ainda experiências internacionais relevantes: estágio observacional na Divisão de Cirurgia Plástica do <strong className="text-foreground">Hospital for Sick Children Foundation</strong> (Canadá) e participação em programa de verão no <strong className="text-foreground">Center for Reproductive Medicine da Cleveland Clinic Foundation</strong> (EUA).</p>
            <p>Hoje dedico-me à prática da cirurgia plástica com foco em resultados seguros, éticos e individualizados. Acredito que a técnica deve caminhar lado a lado com a sensibilidade e o respeito às particularidades de cada paciente — e que o estudo contínuo é a base de uma medicina verdadeiramente responsável.</p>
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

      <section className="mx-auto max-w-7xl px-4 py-16 md:px-8">
        <p className="text-xs uppercase tracking-[0.3em] text-primary">Mídia & Imprensa</p>
        <h2 className="mt-3 max-w-3xl font-serif text-4xl md:text-5xl">
          Reconhecida em <em className="text-primary">documentário</em> sobre ciência, ética e propósito
        </h2>
        <div className="mt-10 grid gap-6 md:grid-cols-5">
          <div className="md:col-span-2">
            <div className="aspect-[3/2] overflow-hidden rounded-2xl ring-1 ring-border">
              <img
                src="https://calonexp.com/storage/2026/04/GC_04207-768x512.jpg"
                alt="Dra. Rebecca Rossener no documentário Biografia© do Grupo CALONE"
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
          <article className="md:col-span-3 rounded-2xl border border-border bg-card p-7">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[10px] uppercase tracking-[0.25em] text-primary">
              <Film className="h-3 w-3" /> Biografia© Documentário · Grupo CALONE®
            </span>
            <h3 className="mt-4 font-serif text-2xl leading-snug">
              Dra. Rebecca Rossener destaca a cirurgia plástica como união entre técnica, ética e cuidado individualizado
            </h3>
            <p className="mt-3 text-sm text-muted-foreground">
              A Dra. Rebecca foi convidada a participar do <em>Biografia©</em>, projeto do Grupo CALONE® — signatário do Pacto Global da ONU — dedicado à Agenda 2030, que apresenta trajetórias de especialistas com propósito. A série será lançada na plataforma de streaming CALONE® XP.
            </p>
            <blockquote className="mt-5 border-l-2 border-primary/60 pl-4 font-serif text-base italic text-foreground/90">
              "O que mais me orgulha na minha trajetória é ser verdadeira no que acredito. Nunca abro mão dos meus valores."
            </blockquote>
            <a
              href="https://calonexp.com/dra-rebecca-rossener-participa-do-biografia-documentario-e-destaca-a-cirurgia-plastica-como-uniao-entre-tecnica-etica-e-cuidado-individualizado/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 text-sm text-primary hover:underline"
            >
              Ler matéria completa na CALONE® XP <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </article>
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
