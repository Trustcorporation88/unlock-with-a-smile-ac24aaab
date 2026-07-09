import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Calendar, Clock, MapPin, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { CONTACT } from "@/lib/contact";
import { WHATSAPP_NUMBER } from "@/lib/whatsapp";
import {
  addDays,
  formatBR,
  formatBRFull,
  isWorkingDay,
  isValidBRWhatsApp,
  onlyDigits,
  toISODate,
  weekDates,
} from "@/lib/agenda";
import { createAppointment, getAvailability } from "@/lib/agenda.functions";
import { useServerFn } from "@tanstack/react-start";

export const Route = createFileRoute("/agendamento")({
  component: AgendamentoPage,
  head: () => ({
    meta: [
      { title: "Agendar Consulta — Dra. Rebecca Rossener" },
      { name: "description", content: "Agende sua consulta com a Dra. Rebecca Rossener — cirurgia plástica em São Paulo." },
    ],
  }),
});

type Availability = { slotTimes: string[]; blocked: Record<string, string>; taken: string[] };

function AgendamentoPage() {
  const fetchAvailability = useServerFn(getAvailability);
  const submitAppointment = useServerFn(createAppointment);

  const [weekOffset, setWeekOffset] = useState(0);
  const [availability, setAvailability] = useState<Availability | null>(null);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [procedure, setProcedure] = useState("");
  const [lgpd, setLgpd] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [confirmation, setConfirmation] = useState<{ name: string; date: string; time: string } | null>(null);

  const days = useMemo(() => {
    const base = addDays(new Date(), weekOffset * 7);
    return weekDates(base).filter(isWorkingDay);
  }, [weekOffset]);

  const rangeStart = toISODate(days[0]);
  const rangeEnd = toISODate(days[days.length - 1]);

  useEffect(() => {
    let cancelled = false;
    setLoadingSlots(true);
    fetchAvailability({ data: { start: rangeStart, end: rangeEnd } })
      .then((res) => {
        if (!cancelled) setAvailability(res as Availability);
      })
      .catch(() => toast.error("Não foi possível carregar a agenda."))
      .finally(() => !cancelled && setLoadingSlots(false));
    return () => { cancelled = true; };
  }, [rangeStart, rangeEnd, fetchAvailability]);

  function slotStatus(date: string, time: string): "free" | "taken" | "blocked" | "past" {
    if (!availability) return "free";
    const key = `${date}|${time}`;
    const now = new Date();
    const [y, m, d] = date.split("-").map(Number);
    const [hh, mm] = time.split(":").map(Number);
    if (new Date(y, m - 1, d, hh, mm) < now) return "past";
    if (availability.blocked[key]) return "blocked";
    if (availability.taken.includes(key)) return "taken";
    return "free";
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!selectedDate || !selectedTime) { toast.error("Escolha data e horário."); return; }
    if (!lgpd) { toast.error("É necessário aceitar o tratamento de dados (LGPD)."); return; }
    if (!isValidBRWhatsApp(whatsapp)) { toast.error("WhatsApp inválido. Ex: (11) 99999-9999"); return; }

    setSubmitting(true);
    try {
      await submitAppointment({
        data: {
          name, email, whatsapp,
          procedure,
          date: selectedDate, time: selectedTime,
          lgpdConsent: true,
        },
      });
      setConfirmation({ name, date: selectedDate, time: selectedTime });
      // Recarrega grade
      const res = await fetchAvailability({ data: { start: rangeStart, end: rangeEnd } });
      setAvailability(res as Availability);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erro ao agendar.";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  }

  if (confirmation) {
    const dateBR = formatBRFull(new Date(confirmation.date + "T00:00:00"));
    const msg = `Olá! Sou ${confirmation.name} e agendei consulta para ${dateBR} às ${confirmation.time}. CONFIRMO minha presença.`;
    const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
    return (
      <section className="mx-auto max-w-2xl px-4 py-20 text-center md:px-8">
        <div className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-full bg-primary/15 text-primary">
          <ShieldCheck className="h-8 w-8" />
        </div>
        <h1 className="font-serif text-4xl md:text-5xl">Solicitação recebida</h1>
        <p className="mt-4 text-muted-foreground">
          Seu horário está pré-reservado para <strong className="text-foreground">{dateBR}</strong> às
          {" "}<strong className="text-foreground">{confirmation.time}</strong>.
        </p>
        <p className="mt-2 text-muted-foreground">
          Confirme sua presença pelo WhatsApp para finalizar o agendamento.
        </p>
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-flex items-center justify-center gap-3 rounded-full bg-[#25D366] px-8 py-4 text-base font-semibold text-white shadow-lg transition hover:scale-105"
        >
          Confirmar presença no WhatsApp
        </a>
        <div className="mt-8">
          <Button variant="outline" onClick={() => { setConfirmation(null); setSelectedDate(null); setSelectedTime(null); }}>
            Fazer outro agendamento
          </Button>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="bg-radial-glow">
        <div className="mx-auto max-w-7xl px-4 py-14 md:px-8 md:py-20">
          <p className="text-xs uppercase tracking-[0.3em] text-primary">Agendamento · Particular</p>
          <h1 className="mt-3 max-w-3xl font-serif text-4xl md:text-6xl">
            Solicite sua <em className="text-primary">avaliação particular</em>
          </h1>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            Escolha um horário disponível abaixo. Após enviar, você receberá um botão para
            <strong className="text-foreground"> confirmar sua presença pelo WhatsApp</strong>.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:grid-cols-5 md:px-8">
        <aside className="space-y-4 md:col-span-2">
          {[
            { icon: Calendar, t: "Primeira consulta", d: "Avaliação completa do seu caso, com escuta ativa e planejamento individualizado." },
            { icon: Clock, t: "Duração", d: "Aproximadamente 45 a 60 minutos. Sem pressa, sem pressão." },
            { icon: MapPin, t: "Local", d: `${CONTACT.clinic.name} — ${CONTACT.clinic.address}, ${CONTACT.clinic.building} — ${CONTACT.clinic.neighborhood}, ${CONTACT.clinic.city} — ${CONTACT.clinic.state}.` },
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
            Horários de atendimento: <strong>08:00–11:30</strong> e <strong>14:00–17:30</strong>, segunda a sábado.
          </div>
        </aside>

        <div className="space-y-6 md:col-span-3">
          {/* Grade de horários */}
          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-serif text-2xl">Escolha data e horário</h2>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => setWeekOffset((w) => Math.max(0, w - 1))} disabled={weekOffset === 0}>← Semana</Button>
                <Button size="sm" variant="outline" onClick={() => setWeekOffset((w) => w + 1)}>Semana →</Button>
              </div>
            </div>
            {loadingSlots && !availability ? (
              <p className="py-8 text-center text-sm text-muted-foreground">Carregando agenda…</p>
            ) : (
              <div className="space-y-3">
                {days.map((day) => {
                  const iso = toISODate(day);
                  return (
                    <div key={iso} className="rounded-xl border border-border/60 p-3">
                      <p className="mb-2 text-sm font-semibold capitalize text-card-foreground">{formatBR(day)}</p>
                      <div className="flex flex-wrap gap-2">
                        {(availability?.slotTimes ?? []).map((t) => {
                          const status = slotStatus(iso, t);
                          const isSelected = selectedDate === iso && selectedTime === t;
                          const disabled = status !== "free";
                          return (
                            <button
                              key={t}
                              type="button"
                              disabled={disabled}
                              onClick={() => { setSelectedDate(iso); setSelectedTime(t); }}
                              className={
                                "rounded-md px-3 py-1.5 text-sm font-medium transition " +
                                (isSelected
                                  ? "bg-primary text-primary-foreground"
                                  : status === "free"
                                  ? "bg-background text-foreground ring-1 ring-border hover:ring-primary"
                                  : status === "taken"
                                  ? "cursor-not-allowed bg-muted text-muted-foreground line-through"
                                  : status === "blocked"
                                  ? "cursor-not-allowed bg-destructive/10 text-destructive/70 line-through"
                                  : "cursor-not-allowed bg-muted/50 text-muted-foreground/60")
                              }
                              title={status === "blocked" ? "Indisponível" : status === "taken" ? "Reservado" : status === "past" ? "Horário já passou" : "Disponível"}
                            >
                              {t}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Formulário */}
          <form onSubmit={onSubmit} className="space-y-5 rounded-2xl border border-border bg-card p-6">
            {selectedDate && selectedTime ? (
              <p className="rounded-lg bg-primary/10 px-4 py-3 text-sm text-card-foreground">
                Horário selecionado: <strong>{formatBRFull(new Date(selectedDate + "T00:00:00"))} às {selectedTime}</strong>
              </p>
            ) : (
              <p className="rounded-lg bg-muted px-4 py-3 text-sm text-muted-foreground">
                Selecione um horário livre acima para continuar.
              </p>
            )}

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2"><Label htmlFor="nome">Nome completo *</Label><Input id="nome" value={name} onChange={(e) => setName(e.target.value)} required /></div>
              <div className="space-y-2"><Label htmlFor="email">E-mail *</Label><Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
              <div className="space-y-2">
                <Label htmlFor="tel">WhatsApp com DDD *</Label>
                <Input id="tel" placeholder="(11) 99999-9999" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} required />
              </div>
              <div className="space-y-2"><Label htmlFor="proc">Procedimento de interesse</Label><Input id="proc" placeholder="Ex: rinoplastia, avaliação pediátrica..." value={procedure} onChange={(e) => setProcedure(e.target.value)} /></div>
            </div>

            <div className="flex items-start gap-3 rounded-lg border border-border p-4">
              <Checkbox id="lgpd" checked={lgpd} onCheckedChange={(v) => setLgpd(v === true)} />
              <label htmlFor="lgpd" className="text-sm text-foreground/85">
                Autorizo o tratamento dos meus dados para fins de agendamento e contato,
                conforme a <strong>LGPD</strong> e o Código de Ética Médica.
              </label>
            </div>

            <Button type="submit" size="lg" disabled={submitting || !selectedDate || !selectedTime} className="w-full rounded-full">
              {submitting ? "Enviando..." : "Solicitar avaliação particular"}
            </Button>
            <p className="text-xs text-muted-foreground">
              Após enviar, use o botão do WhatsApp para <strong>confirmar sua presença</strong> —
              sem essa confirmação, o horário pode ser liberado.
            </p>
          </form>
        </div>
      </section>
    </>
  );
}

// Suppress unused import warning
void onlyDigits;
