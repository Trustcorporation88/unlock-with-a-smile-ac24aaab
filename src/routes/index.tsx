import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Award, Heart, Shield, Sparkles, Stethoscope, ChevronDown, Quote } from "lucide-react";
import { Medallion } from "@/components/site/Medallion";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  component: HomePage,
  head: () => ({
    meta: [
      { title: "Dra. Rebecca Rossener — Cirurgia Plástica em São Paulo" },
      { name: "description", content: "Cirurgia plástica em São Paulo e Taubaté. Formação pela Faculdade de Medicina da USP, com residência em Cirurgia Geral e especialização em Cirurgia Plástica no HC-FMUSP." },
    ],
  }),
});

const specialties = [
  { title: "Cirurgia Plástica Pediátrica", desc: "Cirurgia plástica em bebês, crianças e adolescentes, com técnica delicada e visão de longo prazo sobre o desenvolvimento.", icon: Heart },
  { title: "Cirurgia Reparadora", desc: "Reconstrução pós-trauma, pós-oncológica e revisão de cicatrizes — devolvendo forma e função com técnica precisa.", icon: Shield },
  { title: "Cirurgia Estética", desc: "Procedimentos faciais e corporais com foco em resultado natural e respeito à individualidade.", icon: Sparkles },
  { title: "Cuidado Individualizado", desc: "Cada caso estudado em profundidade, com indicação honesta, ética e baseada em evidências.", icon: Stethoscope },
];

const journey = [
  { n: "01", t: "Consulta Inicial", d: "Escuta ativa, avaliação personalizada e planejamento individualizado. Sem pressão para decisão imediata." },
  { n: "02", t: "Planejamento Cirúrgico", d: "Definição detalhada do procedimento, orientações pré-operatórias e esclarecimento de todas as dúvidas." },
  { n: "03", t: "Procedimento", d: "Cirurgia realizada com técnica precisa, em ambiente hospitalar seguro e com equipe qualificada." },
  { n: "04", t: "Pós-Operatório", d: "Acompanhamento próximo em cada etapa da recuperação, com suporte contínuo." },
  { n: "05", t: "Resultado & Bem-Estar", d: "Acompanhamento de longo prazo para garantir resultados duradouros e sua satisfação plena." },
];

const testimonials = [
  { text: "Encontrei na Dra. Rebecca uma médica que une excelência técnica a um cuidado verdadeiramente humano. Me senti acolhida do primeiro contato ao pós-operatório.", who: "Paciente · Mamoplastia" },
  { text: "Ela cuidou da cirurgia do meu filho com uma delicadeza impressionante. Explicou tudo, tirou todas as nossas dúvidas e o resultado foi acima das expectativas.", who: "Mãe · Cirurgia Pediátrica" },
  { text: "Procedimento seguro, resultado natural e um acompanhamento que faz toda a diferença. Indico de olhos fechados.", who: "Paciente · Rinoplastia" },
];

const faqs = [
  { q: "Em quanto tempo consigo agendar uma consulta?", a: "Em geral, conseguimos encaixar novas consultas em até 7 dias úteis. Para casos urgentes, entre em contato pelo WhatsApp." },
  { q: "Atendem convênios?", a: "Os atendimentos são particulares. Emitimos recibo para reembolso conforme as regras do seu plano." },
  { q: "Como funciona o pós-operatório?", a: "O acompanhamento é próximo e personalizado, com retornos programados e contato direto com a equipe sempre que necessário." },
  { q: "Onde são realizadas as cirurgias?", a: "Em hospitais acreditados de referência em São Paulo, com equipe multidisciplinar e anestesistas experientes." },
];

function HomePage() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-radial-glow">
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-10 md:grid-cols-2 md:px-8 md:py-16">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-primary">
              <Award className="h-3.5 w-3.5" /> Formação USP · CRM-SP 176.098 · RQE 111.228
            </span>
            <h1 className="mt-5 text-balance font-serif text-4xl leading-[1.1] md:text-5xl lg:text-6xl">
              Cirurgia plástica que entende <em className="not-italic text-primary"><span className="italic">a jornada inteira</span></em> — da infância à vida adulta
            </h1>
            <p className="mt-5 max-w-xl text-pretty text-base text-muted-foreground md:text-lg">
              Formada pela Faculdade de Medicina da USP, com residência em Cirurgia Geral e
              especialização em Cirurgia Plástica no HC-FMUSP. Atendimento ético, individualizado
              e baseado em evidências, em São Paulo e Taubaté.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="rounded-full px-6">
                <Link to="/agendamento">Agendar avaliação particular <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full border-border bg-transparent px-6 text-foreground hover:bg-muted/60">
                <Link to="/procedimentos">Ver Procedimentos</Link>
              </Button>
            </div>
            <div className="mt-10 flex flex-wrap gap-6 text-xs text-muted-foreground">
              <span className="flex items-center gap-2"><Award className="h-4 w-4 text-primary" /> Medicina USP (2015)</span>
              <span className="flex items-center gap-2"><Shield className="h-4 w-4 text-primary" /> Cirurgia Plástica HC-FMUSP (2023)</span>
              <span className="flex items-center gap-2"><Heart className="h-4 w-4 text-primary" /> SickKids · Cleveland Clinic</span>
            </div>
          </div>

          <div className="relative mx-auto aspect-[4/5] w-full max-w-[440px]">
            <Medallion className="h-full w-full" />
            <div className="absolute -left-3 top-6 rounded-2xl bg-primary px-4 py-2.5 text-xs text-primary-foreground shadow-xl md:-left-6">
              <p className="opacity-80">Formação</p>
              <p className="font-serif text-sm">USP São Paulo</p>
            </div>
            <div className="absolute -bottom-4 right-2 rounded-2xl bg-card px-4 py-2.5 text-xs shadow-xl ring-1 ring-border md:-right-6">
              <p className="text-muted-foreground">Atuação</p>
              <p className="font-serif text-sm font-semibold text-card-foreground">Pediátrica · Reparadora · Estética</p>
            </div>
          </div>

        </div>
        <div className="flex justify-center pb-6 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
          <a href="#sobre" className="flex flex-col items-center gap-2 hover:text-primary">
            Saiba mais <ChevronDown className="h-4 w-4 animate-bounce" />
          </a>
        </div>
      </section>

      {/* SOBRE TEASER */}
      <section id="sobre" className="border-y border-border bg-surface/50">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-14 md:grid-cols-5 md:px-8">
          <div className="md:col-span-2">
            <p className="text-xs uppercase tracking-[0.3em] text-primary">Sobre a Médica</p>
            <h2 className="mt-3 font-serif text-4xl md:text-5xl">
              Uma trajetória marcada pela <em className="text-primary">dedicação</em> e pelo cuidado
            </h2>
          </div>
          <div className="space-y-5 text-muted-foreground md:col-span-3">
            <p>
              Natural de <strong className="text-foreground">Taubaté (SP)</strong>, a Dra. Rebecca Rossener formou-se em
              Medicina pela <strong className="text-foreground">Faculdade de Medicina da USP em 2015</strong>. Realizou
              residência em Cirurgia Geral no <strong className="text-foreground">Hospital das Clínicas da FMUSP</strong> (2019)
              e, em seguida, especialização em Cirurgia Plástica na mesma instituição (2023),
              sob orientação do Prof. Dov Goldenberg.
            </p>
            <p>
              Sua trajetória inclui ainda experiências internacionais no <strong className="text-foreground">Hospital for
              Sick Children Foundation</strong> (Canadá) e no <strong className="text-foreground">Center for Reproductive
              Medicine da Cleveland Clinic Foundation</strong> (EUA). Atua hoje com foco em resultados seguros,
              éticos e individualizados — combinando técnica, estudo contínuo e respeito às particularidades de cada paciente.
            </p>
            <Button asChild variant="link" className="px-0 text-primary">
              <Link to="/sobre">Conheça minha história <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </section>


      {/* ESPECIALIDADES */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-primary">Especialidades</p>
          <h2 className="mt-3 font-serif text-4xl md:text-5xl">
            Procedimentos com excelência e <em className="text-primary">naturalidade</em>
          </h2>
          <p className="mt-4 text-muted-foreground">
            Cada procedimento é planejado de forma individualizada, respeitando sua anatomia,
            seus objetivos e sua segurança.
          </p>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {specialties.map((s) => (
            <div key={s.title} className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition hover:border-primary/40">
              <div className="absolute inset-x-0 -top-1 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 transition group-hover:opacity-100" />
              <s.icon className="h-7 w-7 text-primary" />
              <h3 className="mt-4 font-serif text-xl text-card-foreground">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Button asChild variant="outline" className="rounded-full border-border bg-transparent hover:bg-muted/60">
            <Link to="/procedimentos">Ver todos os procedimentos <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>
      </section>

      {/* JORNADA */}
      <section className="border-y border-border bg-surface/40">
        <div className="mx-auto max-w-7xl px-4 py-16 md:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-primary">Sua Jornada</p>
            <h2 className="mt-3 font-serif text-4xl md:text-5xl">
              Do primeiro contato ao <em className="text-primary">resultado final</em>
            </h2>
            <p className="mt-4 text-muted-foreground">
              Acompanhamento completo e humanizado em cada etapa da sua transformação.
            </p>
          </div>
          <ol className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-5">
            {journey.map((step) => (
              <li key={step.n} className="relative rounded-2xl border border-border bg-card p-6">
                <span className="font-serif text-3xl text-primary">{step.n}</span>
                <h3 className="mt-2 font-serif text-lg text-card-foreground">{step.t}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{step.d}</p>
              </li>
            ))}
          </ol>
          <div className="mt-12 text-center">
            <Button asChild size="lg" className="rounded-full px-6">
              <Link to="/agendamento">Iniciar minha jornada <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* DEPOIMENTOS */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-primary">Depoimentos</p>
          <h2 className="mt-3 font-serif text-4xl md:text-5xl">
            Histórias de <em className="text-primary">transformação</em> e confiança
          </h2>
          <p className="mt-4 text-sm text-muted-foreground">
            Depoimentos publicados com consentimento dos pacientes. Identidades preservadas para
            garantir privacidade e ética médica.
          </p>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <figure key={i} className="rounded-2xl border border-border bg-card p-7">
              <Quote className="h-6 w-6 text-primary" />
              <blockquote className="mt-4 font-serif text-lg leading-snug text-card-foreground">
                "{t.text}"
              </blockquote>
              <figcaption className="mt-5 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                {t.who}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="border-y border-border bg-surface/40">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-16 md:grid-cols-2 md:px-8">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-primary">Dúvidas Frequentes</p>
            <h2 className="mt-3 font-serif text-4xl md:text-5xl">
              Perguntas que nossos <em className="text-primary">pacientes</em> nos fazem
            </h2>
            <p className="mt-4 text-muted-foreground">
              Reunimos as principais dúvidas. Se a sua não estiver aqui, fale com a gente — terei prazer em responder.
            </p>
            <Button asChild variant="link" className="mt-4 px-0 text-primary">
              <Link to="/faq">Ver todas as perguntas <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
          </div>
          <div className="space-y-3">
            {faqs.map((f) => (
              <details key={f.q} className="group rounded-xl border border-border bg-card p-5 open:border-primary/40">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-serif text-lg text-card-foreground">
                  {f.q}
                  <ChevronDown className="h-4 w-4 text-primary transition group-open:rotate-180" />
                </summary>
                <p className="mt-3 text-sm text-muted-foreground">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-5xl px-4 py-16 text-center md:px-8">
        <h2 className="font-serif text-4xl md:text-5xl">
          Pronta para iniciar sua jornada de <em className="text-primary">transformação</em>?
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-muted-foreground">
          Agende sua consulta e descubra como a Dra. Rebecca pode ajudar você a alcançar seus objetivos
          com segurança, naturalidade e cuidado humanizado.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild size="lg" className="rounded-full px-6">
            <Link to="/agendamento">Agendar Consulta</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="rounded-full border-border bg-transparent px-6 hover:bg-muted/60">
            <Link to="/contato">Fale Conosco</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
