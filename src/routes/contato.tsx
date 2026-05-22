import { createFileRoute, Link } from "@tanstack/react-router";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export const Route = createFileRoute("/contato")({
  component: ContatoPage,
  head: () => ({
    meta: [
      { title: "Contato — Dra. Rebecca Rossener" },
      { name: "description", content: "Entre em contato para tirar dúvidas ou agendar sua consulta. Atendimento na Av. Paulista, São Paulo." },
    ],
  }),
});

function ContatoPage() {
  const [loading, setLoading] = useState(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      (e.target as HTMLFormElement).reset();
      toast.success("Mensagem enviada! Retornaremos em breve.");
    }, 700);
  }

  return (
    <>
      <section className="bg-radial-glow">
        <div className="mx-auto max-w-7xl px-4 py-14 md:px-8 md:py-28">
          <p className="text-xs uppercase tracking-[0.3em] text-primary">Contato</p>
          <h1 className="mt-3 max-w-3xl font-serif text-5xl md:text-6xl">Entre em <em className="text-primary">Contato</em></h1>
          <p className="mt-5 max-w-2xl text-muted-foreground">
            Estamos aqui para responder suas dúvidas e ajudar você a dar o próximo passo.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-2 md:px-8">
        <div className="space-y-5">
          <h2 className="font-serif text-3xl">Informações de Contato</h2>
          {[
            { icon: MapPin, t: "Endereço", lines: ["Av. Paulista, 1000 — Cj. 101", "Bela Vista, São Paulo — SP", "CEP 01310-100"] },
            { icon: Phone, t: "Telefone / WhatsApp", lines: ["(11) 99999-9999"] },
            { icon: Mail, t: "E-mail", lines: ["contato@drarebeccarossener.com.br"] },
            { icon: Clock, t: "Horário de Atendimento", lines: ["Segunda a Sexta: 8h às 18h", "Sábado: 8h às 13h"] },
          ].map((it) => (
            <div key={it.t} className="flex gap-4 rounded-2xl border border-white/10 bg-card p-5">
              <it.icon className="mt-1 h-5 w-5 shrink-0 text-primary" />
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-primary">{it.t}</p>
                {it.lines.map((l) => <p key={l} className="mt-1 text-sm text-foreground/85">{l}</p>)}
              </div>
            </div>
          ))}
          <Button asChild size="lg" className="w-full rounded-full bg-[#25D366] text-white hover:bg-[#1ebd5a]">
            <a href="https://wa.me/5511999999999?text=Ol%C3%A1!%20Gostaria%20de%20agendar%20uma%20consulta%20com%20a%20Dra.%20Rebecca%20Rossener." target="_blank" rel="noopener noreferrer">
              Falar pelo WhatsApp
            </a>
          </Button>
        </div>

        <form onSubmit={onSubmit} className="space-y-5 rounded-2xl border border-white/10 bg-card p-7">
          <h2 className="font-serif text-3xl">Envie uma mensagem</h2>
          <div className="space-y-2">
            <Label htmlFor="nome">Nome *</Label>
            <Input id="nome" required />
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail *</Label>
              <Input id="email" type="email" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="telefone">Telefone</Label>
              <Input id="telefone" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Assunto</Label>
            <Select>
              <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
              <SelectContent>
                <SelectItem value="agendamento">Agendamento de Consulta</SelectItem>
                <SelectItem value="duvidas">Dúvidas sobre Procedimentos</SelectItem>
                <SelectItem value="pos">Pós-Operatório</SelectItem>
                <SelectItem value="infos">Informações Gerais</SelectItem>
                <SelectItem value="outro">Outro</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="msg">Mensagem *</Label>
            <Textarea id="msg" rows={5} required />
          </div>
          <Button type="submit" size="lg" disabled={loading} className="w-full rounded-full">
            {loading ? "Enviando..." : "Enviar Mensagem"}
          </Button>
          <p className="text-xs text-muted-foreground">
            Ao enviar você concorda com a nossa <Link to="/" className="underline">Política de Privacidade</Link>.
          </p>
        </form>
      </section>
    </>
  );
}
