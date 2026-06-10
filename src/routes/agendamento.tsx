import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Calendar, Clock, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export const Route = createFileRoute("/agendamento")({
  component: AgendamentoPage,
  head: () => ({
    meta: [
      { title: "Agendar Consulta — Dra. Rebecca Rossener" },
      { name: "description", content: "Agende sua consulta com a Dra. Rebecca Rossener — cirurgia plástica em São Paulo." },
    ],
  }),
});

function AgendamentoPage() {
  const [loading, setLoading] = useState(false);
  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      (e.target as HTMLFormElement).reset();
      toast.success("Solicitação recebida — nossa equipe entrará em contato para confirmar o horário da sua avaliação.");
    }, 700);
  }
  return (
    <>
      <section className="bg-radial-glow">
        <div className="mx-auto max-w-7xl px-4 py-14 md:px-8 md:py-28">
          <p className="text-xs uppercase tracking-[0.3em] text-primary">Agendamento · Particular</p>
          <h1 className="mt-3 max-w-3xl font-serif text-5xl md:text-6xl">Solicite sua <em className="text-primary">avaliação particular</em></h1>
          <p className="mt-5 max-w-2xl text-muted-foreground">
            Preencha o formulário abaixo. Esta é uma <strong>solicitação de horário</strong> —
            nossa equipe entrará em contato para confirmar a melhor data para a sua avaliação.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-5 md:px-8">
        <aside className="space-y-4 md:col-span-2">
          {[
            { icon: Calendar, t: "Primeira consulta", d: "Avaliação completa do seu caso, com escuta ativa e planejamento individualizado." },
            { icon: Clock, t: "Duração", d: "Aproximadamente 45 a 60 minutos. Sem pressa, sem pressão." },
            { icon: MapPin, t: "Local", d: "Av. Fictícia, 123, Sala 45 — Bairro Exemplo, São Paulo — SP." },
          ].map((it) => (
            <div key={it.t} className="flex gap-4 rounded-2xl border border-border bg-card p-5">
              <it.icon className="mt-1 h-5 w-5 shrink-0 text-primary" />
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-primary">{it.t}</p>
                <p className="mt-1 text-sm text-foreground/85">{it.d}</p>
              </div>
            </div>
          ))}
          <div className="rounded-2xl border border-primary/30 bg-primary/10 p-5 text-sm text-foreground/90">
            Prefere falar agora? <Link to="/contato" className="font-medium text-primary underline-offset-2 hover:underline">Fale com a gente</Link> ou clique no botão do WhatsApp.
          </div>
        </aside>

        <form onSubmit={onSubmit} className="space-y-5 rounded-2xl border border-border bg-card p-7 md:col-span-3">
          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2"><Label htmlFor="nome">Nome completo *</Label><Input id="nome" required /></div>
            <div className="space-y-2"><Label htmlFor="email">E-mail *</Label><Input id="email" type="email" required /></div>
            <div className="space-y-2"><Label htmlFor="tel">Telefone / WhatsApp *</Label><Input id="tel" required /></div>
            <div className="space-y-2"><Label htmlFor="data">Data preferida</Label><Input id="data" type="date" /></div>
          </div>
          <div className="space-y-2"><Label htmlFor="motivo">Motivo da consulta</Label><Textarea id="motivo" rows={5} placeholder="Conte brevemente o que você gostaria de avaliar." /></div>
          <Button type="submit" size="lg" disabled={loading} className="w-full rounded-full">
            {loading ? "Enviando..." : "Solicitar avaliação particular"}
          </Button>
          <p className="text-xs text-muted-foreground">
            Seus dados são tratados com sigilo, conforme o Código de Ética Médica e a LGPD.
          </p>
        </form>
      </section>
    </>
  );
}
