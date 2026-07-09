import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Calendar, ChevronLeft, ChevronRight, Clock, MapPin, ShieldCheck, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { CONTACT } from "@/lib/contact";
import { categories } from "@/lib/procedures";
import { createAppointment, getAvailability } from "@/lib/agenda.functions";
import { useServerFn } from "@tanstack/react-start";

export const Route = createFileRoute("/agendamento")({
  component: AgendamentoPage,
  head: () => ({
    meta: [
      { title: "Agendar Consulta — Dra. Rebecca Rossener" },
      {
        name: "description",
        content:
          "Agende sua consulta com a Dra. Rebecca Rossener — cirurgia plástica em São Paulo.",
      },
    ],
  }),
});

const WEEKDAY_TIMES = [
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30",
];
const SATURDAY_TIMES = [
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30",
];

const MIN_HOURS_AHEAD = 24;
const MAX_DAYS_AHEAD = 60;

const REASONS: string[] = [
  ...categories.flatMap((c) => c.procedures.map((p) => `${p.name} (${c.shortName})`)),
  "Avaliação geral",
  "Outro",
];

type Availability = { slotTimes: string[]; blocked: Record<string, string>; taken: string[] };

// ---------- helpers de data em America/Sao_Paulo ----------
function toISOInSP(date: Date): string {
  // Componentes locais no fuso America/Sao_Paulo
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const y = parts.find((p) => p.type === "year")!.value;
  const m = parts.find((p) => p.type === "month")!.value;
  const d = parts.find((p) => p.type === "day")!.value;
  return `${y}-${m}-${d}`;
}

function addDaysISO(iso: string, days: number): string {
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  dt.setUTCDate(dt.getUTCDate() + days);
  const yy = dt.getUTCFullYear();
  const mm = String(dt.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(dt.getUTCDate()).padStart(2, "0");
  return `${yy}-${mm}-${dd}`;
}

function weekdayOfISO(iso: string): number {
  const [y, m, d] = iso.split("-").map(Number);
  // 0=dom … 6=sáb, calculado em UTC (data pura, sem fuso)
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay();
}

function formatBRShort(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  return dt.toLocaleDateString("pt-BR", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
    timeZone: "UTC",
  });
}

function formatBRFullISO(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  return dt.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

function formatDDMM(iso: string): string {
  const [, m, d] = iso.split("-");
  return `${d}/${m}`;
}

function slotsForWeekday(dow: number): string[] {
  if (dow === 0) return [];
  if (dow === 6) return SATURDAY_TIMES;
  return WEEKDAY_TIMES;
}

function isPastMinNotice(iso: string, time: string): boolean {
  const [y, m, d] = iso.split("-").map(Number);
  const [hh, mm] = time.split(":").map(Number);
  // Interpreta como horário local do navegador (aproxima Brasil-continente);
  // servidor revalida com regra rígida de 24h.
  const when = new Date(y, m - 1, d, hh, mm).getTime();
  return when < Date.now() + MIN_HOURS_AHEAD * 60 * 60 * 1000;
}

// ---------- Página ----------
function AgendamentoPage() {
  const fetchAvailability = useServerFn(getAvailability);
  const submitAppointment = useServerFn(createAppointment);

  const todayISO = useMemo(() => toISOInSP(new Date()), []);
  const maxISO = useMemo(() => addDaysISO(todayISO, MAX_DAYS_AHEAD), [todayISO]);

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [reason, setReason] = useState<string>("");
  const [customReason, setCustomReason] = useState<string>("");

  // Semana visível — arranca no ISO de hoje
  const [weekStart, setWeekStart] = useState<string>(todayISO);
  const weekDays = useMemo(
    () => Array.from({ length: 7 }, (_, i) => addDaysISO(weekStart, i)),
    [weekStart],
  );

  const [availability, setAvailability] = useState<Availability | null>(null);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [lgpd, setLgpd] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [confirmation, setConfirmation] = useState<{
    name: string;
    date: string;
    time: string;
    reason: string;
  } | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoadingSlots(true);
    fetchAvailability({ data: { start: weekDays[0], end: weekDays[6] } })
      .then((res) => {
        if (!cancelled) setAvailability(res as Availability);
      })
      .catch(() => toast.error("Não foi possível carregar a agenda."))
      .finally(() => !cancelled && setLoadingSlots(false));
    return () => {
      cancelled = true;
    };
  }, [weekDays, fetchAvailability]);

  function reloadAvailability() {
    return fetchAvailability({ data: { start: weekDays[0], end: weekDays[6] } }).then(
      (res) => setAvailability(res as Availability),
    );
  }

  function slotStatus(iso: string, time: string): "free" | "taken" | "blocked" | "past" {
    if (!availability) return "free";
    const key = `${iso}|${time}`;
    if (availability.blocked[key]) return "blocked";
    if (availability.taken.includes(key)) return "taken";
    if (isPastMinNotice(iso, time)) return "past";
    return "free";
  }

  function canGoPrevWeek() {
    return weekStart > todayISO;
  }
  function canGoNextWeek() {
    return addDaysISO(weekStart, 7) <= maxISO;
  }

  const effectiveReason = reason === "Outro" ? customReason.trim() : reason;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!selectedDate || !selectedTime) {
      toast.error("Escolha data e horário.");
      return;
    }
    if (!lgpd) {
      toast.error("É necessário aceitar o tratamento de dados (LGPD).");
      return;
    }
    const digits = whatsapp.replace(/\D/g, "");
    if (digits.length < 10 || digits.length > 13) {
      toast.error("WhatsApp inválido. Informe DDD + número.");
      return;
    }

    setSubmitting(true);
    try {
      await submitAppointment({
        data: {
          name: name.trim(),
          email: email.trim(),
          whatsapp: digits,
          procedure: effectiveReason,
          date: selectedDate,
          time: selectedTime,
          lgpdConsent: true,
        },
      });
      setConfirmation({ name: name.trim(), date: selectedDate, time: selectedTime, reason: effectiveReason });
      setStep(4);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erro ao agendar.";
      toast.error(msg);
      if (msg.toLowerCase().includes("indisponível")) {
        await reloadAvailability();
        setSelectedTime(null);
        setStep(2);
      }
    } finally {
      setSubmitting(false);
    }
  }

  // -------- Success screen --------
  if (step === 4 && confirmation) {
    const dateFull = formatBRFullISO(confirmation.date);
    const dateShort = formatDDMM(confirmation.date);
    const msg = `Olá! Sou ${confirmation.name} e agendei consulta com a Dra. Rebecca Rossener para ${dateShort} às ${confirmation.time}. CONFIRMO minha presença.`;
    const waLink = `https://wa.me/${CONTACT.whatsappNumber}?text=${encodeURIComponent(msg)}`;
    return (
      <section className="mx-auto max-w-2xl px-4 py-16 text-center md:px-8">
        <div className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-full bg-primary/15 text-primary">
          <ShieldCheck className="h-8 w-8" />
        </div>
        <h1 className="font-serif text-3xl md:text-5xl">Solicitação recebida</h1>
        <p className="mt-4 text-muted-foreground">
          Seu horário está pré-reservado. Confirme sua presença pelo WhatsApp para finalizar.
        </p>

        <dl className="mx-auto mt-6 grid max-w-md gap-2 rounded-2xl border border-border bg-card p-5 text-left text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">Data</dt>
            <dd className="font-medium text-card-foreground">{dateFull}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">Horário</dt>
            <dd className="font-medium text-card-foreground">{confirmation.time}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">Motivo</dt>
            <dd className="text-right font-medium text-card-foreground">{confirmation.reason || "—"}</dd>
          </div>
        </dl>

        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-flex items-center justify-center gap-3 rounded-full bg-[#25D366] px-8 py-4 text-base font-semibold text-white shadow-lg transition hover:scale-105"
        >
          Confirmar pelo WhatsApp
        </a>

        <div className="mt-8">
          <Button
            variant="outline"
            onClick={() => {
              setConfirmation(null);
              setSelectedDate(null);
              setSelectedTime(null);
              setReason("");
              setCustomReason("");
              setName("");
              setEmail("");
              setWhatsapp("");
              setLgpd(false);
              setStep(1);
            }}
          >
            Fazer outro agendamento
          </Button>
        </div>

        <p className="mt-8 text-xs text-muted-foreground">
          Seus dados são tratados com sigilo, conforme a LGPD e o Código de Ética Médica.
        </p>
      </section>
    );
  }

  // -------- Wizard --------
  return (
    <>
      <section className="bg-radial-glow">
        <div className="mx-auto max-w-7xl px-4 py-12 md:px-8 md:py-16">
          <p className="text-xs uppercase tracking-[0.3em] text-primary">Agendamento · Particular</p>
          <h1 className="mt-3 max-w-3xl font-serif text-3xl md:text-5xl">
            Solicite sua <em className="text-primary">avaliação particular</em>
          </h1>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            Em três passos: motivo, data e horário, seus dados. Após enviar, você recebe um
            botão para <strong className="text-foreground">confirmar sua presença pelo WhatsApp</strong>.
          </p>

          {/* Stepper */}
          <ol className="mt-6 flex flex-wrap items-center gap-3 text-sm">
            {[
              { n: 1, label: "Motivo" },
              { n: 2, label: "Data e horário" },
              { n: 3, label: "Seus dados" },
            ].map((s) => {
              const active = step === s.n;
              const done = step > s.n;
              return (
                <li key={s.n} className="flex items-center gap-2">
                  <span
                    className={
                      "grid h-7 w-7 place-items-center rounded-full text-xs font-semibold " +
                      (active
                        ? "bg-primary text-primary-foreground"
                        : done
                        ? "bg-primary/20 text-primary"
                        : "bg-muted text-muted-foreground")
                    }
                  >
                    {done ? <Check className="h-3.5 w-3.5" /> : s.n}
                  </span>
                  <span className={active ? "font-medium text-foreground" : "text-muted-foreground"}>
                    {s.label}
                  </span>
                  {s.n < 3 && <span className="mx-1 h-px w-6 bg-border" />}
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-10 md:grid-cols-5 md:px-8">
        <aside className="space-y-4 md:col-span-2">
          {[
            {
              icon: Calendar,
              t: "Primeira consulta",
              d: "Avaliação completa do seu caso, com escuta ativa e planejamento individualizado.",
            },
            {
              icon: Clock,
              t: "Duração",
              d: "Aproximadamente 45 a 60 minutos. Sem pressa, sem pressão.",
            },
            {
              icon: MapPin,
              t: "Local",
              d: `${CONTACT.clinic.name} — ${CONTACT.clinic.address}, ${CONTACT.clinic.building} — ${CONTACT.clinic.neighborhood}, ${CONTACT.clinic.city} — ${CONTACT.clinic.state}.`,
            },
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
            Segunda a sexta: <strong>08:00–11:30</strong> e <strong>14:00–17:30</strong>.
            <br />
            Sábado: <strong>08:00–12:30</strong>. Domingo fechado.
          </div>
        </aside>

        <div className="space-y-6 md:col-span-3">
          {/* PASSO 1 */}
          {step === 1 && (
            <div className="rounded-2xl border border-border bg-card p-5 md:p-6">
              <h2 className="font-serif text-2xl text-card-foreground">1. Motivo da consulta</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Escolha o que melhor descreve sua necessidade. Você poderá detalhar na consulta.
              </p>

              <div className="mt-5 grid gap-2 sm:grid-cols-2">
                {REASONS.map((r) => {
                  const active = reason === r;
                  return (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setReason(r)}
                      className={
                        "rounded-xl border px-4 py-3 text-left text-sm transition " +
                        (active
                          ? "border-primary bg-primary/10 text-card-foreground ring-1 ring-primary"
                          : "border-border bg-background text-foreground hover:border-primary/60")
                      }
                    >
                      {r}
                    </button>
                  );
                })}
              </div>

              {reason === "Outro" && (
                <div className="mt-4 space-y-2">
                  <Label htmlFor="outro">Descreva brevemente</Label>
                  <Input
                    id="outro"
                    value={customReason}
                    onChange={(e) => setCustomReason(e.target.value)}
                    maxLength={120}
                    placeholder="Ex.: segunda opinião sobre cicatriz"
                  />
                </div>
              )}

              <div className="mt-6 flex justify-end">
                <Button
                  size="lg"
                  className="rounded-full"
                  disabled={!reason || (reason === "Outro" && !customReason.trim())}
                  onClick={() => setStep(2)}
                >
                  Continuar
                </Button>
              </div>
            </div>
          )}

          {/* PASSO 2 */}
          {step === 2 && (
            <div className="rounded-2xl border border-border bg-card p-5 md:p-6">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="font-serif text-2xl text-card-foreground">2. Data e horário</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Mostramos apenas horários livres. Antecedência mínima de 24h.
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setWeekStart((w) => addDaysISO(w, -7))}
                    disabled={!canGoPrevWeek()}
                    aria-label="Semana anterior"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setWeekStart((w) => addDaysISO(w, 7))}
                    disabled={!canGoNextWeek()}
                    aria-label="Próxima semana"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {loadingSlots && !availability ? (
                <p className="py-8 text-center text-sm text-muted-foreground">Carregando agenda…</p>
              ) : (
                <div className="space-y-3">
                  {weekDays.map((iso) => {
                    const dow = weekdayOfISO(iso);
                    const dayTimes = slotsForWeekday(dow);
                    const beyondMax = iso > maxISO;
                    return (
                      <div key={iso} className="rounded-xl border border-border/60 p-3">
                        <p className="mb-2 text-sm font-semibold capitalize text-card-foreground">
                          {formatBRShort(iso)}
                        </p>
                        {dow === 0 ? (
                          <p className="text-xs text-muted-foreground">Domingo — fechado.</p>
                        ) : beyondMax ? (
                          <p className="text-xs text-muted-foreground">
                            Fora do período de agendamento (máx. {MAX_DAYS_AHEAD} dias).
                          </p>
                        ) : (
                          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:flex md:flex-wrap">
                            {dayTimes.map((t) => {
                              const status = slotStatus(iso, t);
                              if (status !== "free") return null;
                              const isSelected = selectedDate === iso && selectedTime === t;
                              return (
                                <button
                                  key={t}
                                  type="button"
                                  onClick={() => {
                                    setSelectedDate(iso);
                                    setSelectedTime(t);
                                  }}
                                  className={
                                    "min-h-11 rounded-md px-3 py-2 text-sm font-medium transition " +
                                    (isSelected
                                      ? "bg-primary text-primary-foreground"
                                      : "bg-background text-foreground ring-1 ring-border hover:ring-primary")
                                  }
                                >
                                  {t}
                                </button>
                              );
                            })}
                            {dayTimes.every((t) => slotStatus(iso, t) !== "free") && (
                              <p className="text-xs text-muted-foreground">Sem horários livres.</p>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="mt-6 flex items-center justify-between gap-3">
                <Button variant="ghost" onClick={() => setStep(1)}>
                  ← Voltar
                </Button>
                <Button
                  size="lg"
                  className="rounded-full"
                  disabled={!selectedDate || !selectedTime}
                  onClick={() => setStep(3)}
                >
                  Continuar
                </Button>
              </div>
            </div>
          )}

          {/* PASSO 3 */}
          {step === 3 && (
            <form onSubmit={onSubmit} className="space-y-5 rounded-2xl border border-border bg-card p-5 md:p-6">
              <div>
                <h2 className="font-serif text-2xl text-card-foreground">3. Seus dados</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Usaremos para confirmar seu horário e enviar orientações.
                </p>
              </div>

              {selectedDate && selectedTime && (
                <div className="rounded-lg bg-primary/10 px-4 py-3 text-sm text-card-foreground">
                  <strong>{formatBRFullISO(selectedDate)}</strong> às <strong>{selectedTime}</strong>
                  {effectiveReason && <> · {effectiveReason}</>}
                </div>
              )}

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome completo *</Label>
                  <Input id="nome" value={name} onChange={(e) => setName(e.target.value)} required maxLength={120} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    maxLength={180}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="tel">WhatsApp com DDD *</Label>
                  <Input
                    id="tel"
                    inputMode="tel"
                    placeholder="(11) 99999-9999"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-lg border border-border p-4">
                <Checkbox id="lgpd" checked={lgpd} onCheckedChange={(v) => setLgpd(v === true)} />
                <label htmlFor="lgpd" className="text-sm text-foreground/85">
                  Autorizo o uso dos meus dados para fins de agendamento, conforme a <strong>LGPD</strong>.
                </label>
              </div>

              <div className="flex items-center justify-between gap-3">
                <Button type="button" variant="ghost" onClick={() => setStep(2)}>
                  ← Voltar
                </Button>
                <Button
                  type="submit"
                  size="lg"
                  disabled={submitting || !selectedDate || !selectedTime}
                  className="rounded-full"
                >
                  {submitting ? "Enviando..." : "Confirmar solicitação"}
                </Button>
              </div>

              <p className="text-xs text-muted-foreground">
                Seus dados são tratados com sigilo, conforme a LGPD e o Código de Ética Médica.
              </p>
            </form>
          )}
        </div>
      </section>
    </>
  );
}
