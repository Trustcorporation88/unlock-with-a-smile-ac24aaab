import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { addDays, formatBR, formatBRFull, isWorkingDay, toISODate, weekDates } from "@/lib/agenda";
import {
  checkAdmin,
  secretariaBlockSlot,
  secretariaListWeek,
  secretariaUnblockSlot,
  secretariaUpdateAppointmentStatus,
} from "@/lib/agenda.functions";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { Scissors, Plane, LogOut } from "lucide-react";

export const Route = createFileRoute("/secretaria")({
  component: SecretariaPage,
  head: () => ({
    meta: [
      { title: "Secretaria — Dra. Rebecca Rossener" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
});

type Block = { id: string; date: string; time: string; reason: "cirurgia" | "viagem" };
type Appt = {
  id: string; name: string; email: string; whatsapp: string;
  procedure: string | null; date: string; time: string;
  status: "aguardando" | "confirmada" | "cancelada"; created_at: string;
};
type WeekData = { slotTimes: string[]; blocks: Block[]; appointments: Appt[] };

function firstName(n: string) {
  return n.trim().split(/\s+/)[0] ?? n;
}

function SecretariaPage() {
  const listWeek = useServerFn(secretariaListWeek);
  const blockSlot = useServerFn(secretariaBlockSlot);
  const unblockSlot = useServerFn(secretariaUnblockSlot);
  const updateStatus = useServerFn(secretariaUpdateAppointmentStatus);
  const verifyAdmin = useServerFn(checkAdmin);

  const [authed, setAuthed] = useState(false);
  const [checking, setChecking] = useState(true);
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [reason, setReason] = useState<"cirurgia" | "viagem">("cirurgia");
  const [weekOffset, setWeekOffset] = useState(1);
  const [data, setData] = useState<WeekData | null>(null);
  const [loading, setLoading] = useState(false);

  const days = useMemo(
    () => weekDates(addDays(new Date(), weekOffset * 7)).filter(isWorkingDay),
    [weekOffset],
  );
  const rangeStart = toISODate(days[0]);
  const rangeEnd = toISODate(days[days.length - 1]);

  // On mount, check if there's a session and it's admin
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data: sess } = await supabase.auth.getSession();
      if (!sess.session) {
        if (!cancelled) setChecking(false);
        return;
      }
      try {
        await verifyAdmin();
        if (!cancelled) setAuthed(true);
      } catch {
        await supabase.auth.signOut();
      } finally {
        if (!cancelled) setChecking(false);
      }
    })();
    return () => { cancelled = true; };
  }, [verifyAdmin]);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const res = await listWeek({ data: { start: rangeStart, end: rangeEnd } });
      setData(res as WeekData);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erro ao carregar agenda.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, [rangeStart, rangeEnd, listWeek]);

  useEffect(() => {
    if (authed) refresh();
  }, [authed, refresh]);

  async function onAuth(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/secretaria` },
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
      await verifyAdmin();
      setAuthed(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Falha na autenticação.";
      toast.error(msg);
      await supabase.auth.signOut().catch(() => {});
    } finally {
      setSubmitting(false);
    }
  }

  async function onLogout() {
    await supabase.auth.signOut();
    setAuthed(false);
    setData(null);
    setEmail("");
    setPassword("");
  }

  function findBlock(date: string, time: string) {
    return data?.blocks.find((b) => b.date === date && b.time === time);
  }
  function findAppt(date: string, time: string) {
    return data?.appointments.find((a) => a.date === date && a.time === time && a.status !== "cancelada");
  }

  async function onCellClick(date: string, time: string) {
    const appt = findAppt(date, time);
    if (appt) { toast.error("Este horário tem consulta ativa."); return; }
    const block = findBlock(date, time);
    try {
      if (block) {
        await unblockSlot({ data: { date, time } });
        toast.success("Bloqueio removido.");
      } else {
        await blockSlot({ data: { date, time, reason } });
        toast.success(`Bloqueado como ${reason}.`);
      }
      await refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erro ao atualizar.";
      toast.error(msg);
    }
  }

  async function onConfirm(id: string) {
    try {
      await updateStatus({ data: { id, status: "confirmada" } });
      toast.success("Consulta confirmada.");
      await refresh();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Erro.");
    }
  }

  async function onCancel(id: string) {
    if (!confirm("Cancelar esta consulta? O horário voltará a ficar livre.")) return;
    try {
      await updateStatus({ data: { id, status: "cancelada" } });
      toast.success("Consulta cancelada.");
      await refresh();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Erro.");
    }
  }

  function waLink(appt: Appt) {
    const dateBR = formatBRFull(new Date(appt.date + "T00:00:00"));
    const msg = `Olá ${firstName(appt.name)}, aqui é do consultório da Dra. Rebecca Rossener. Podemos confirmar sua consulta de ${dateBR} às ${appt.time}? Responda CONFIRMAR.`;
    const digits = appt.whatsapp.replace(/\D/g, "");
    const num = digits.startsWith("55") ? digits : `55${digits}`;
    return `https://wa.me/${num}?text=${encodeURIComponent(msg)}`;
  }

  if (checking) {
    return (
      <section className="mx-auto max-w-md px-4 py-24 md:px-8">
        <p className="text-sm text-muted-foreground">Carregando…</p>
      </section>
    );
  }

  if (!authed) {
    return (
      <section className="mx-auto max-w-md px-4 py-24 md:px-8">
        <h1 className="font-serif text-3xl md:text-4xl">Área da secretaria</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Acesso restrito. Use suas credenciais de administrador.
        </p>
        <form onSubmit={onAuth} className="mt-6 space-y-4 rounded-2xl border border-border bg-card p-6">
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoFocus autoComplete="email" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete={mode === "signup" ? "new-password" : "current-password"} minLength={6} />
          </div>
          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? "..." : mode === "signup" ? "Criar conta" : "Entrar"}
          </Button>
          <button
            type="button"
            onClick={() => setMode(mode === "signup" ? "login" : "signup")}
            className="w-full text-center text-xs text-muted-foreground underline"
          >
            {mode === "signup" ? "Já tenho conta — entrar" : "Primeiro acesso? Criar conta de admin"}
          </button>
        </form>
      </section>
    );
  }

  const weekAppts = (data?.appointments ?? []).filter((a) => a.status !== "cancelada");

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 md:px-8">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl md:text-4xl">Agenda da semana</h1>
          <p className="text-sm text-muted-foreground">
            {days.length > 0 ? `${formatBR(days[0])} → ${formatBR(days[days.length - 1])}` : ""}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 rounded-full border border-border bg-card px-2 py-1 text-sm">
            <span className="pl-2 pr-1 text-xs text-muted-foreground">Modo:</span>
            <button
              onClick={() => setReason("cirurgia")}
              className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${reason === "cirurgia" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
            ><Scissors className="h-3 w-3" />Cirurgia</button>
            <button
              onClick={() => setReason("viagem")}
              className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${reason === "viagem" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
            ><Plane className="h-3 w-3" />Viagem</button>
          </div>
          <Button size="sm" variant="outline" onClick={() => setWeekOffset((w) => w - 1)}>← Semana</Button>
          <Button size="sm" variant="outline" onClick={() => setWeekOffset((w) => w + 1)}>Semana →</Button>
          <Button size="sm" variant="outline" onClick={refresh} disabled={loading}>{loading ? "..." : "Atualizar"}</Button>
          <Button size="sm" variant="ghost" onClick={onLogout} title="Sair">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </header>

      {/* Grade */}
      <div className="overflow-x-auto rounded-2xl border border-border bg-card">
        <table className="w-full min-w-[720px] text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              <th className="p-2 text-left font-medium text-muted-foreground">Horário</th>
              {days.map((d) => (
                <th key={toISODate(d)} className="p-2 text-center font-medium capitalize text-card-foreground">
                  {formatBR(d)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(data?.slotTimes ?? []).map((t) => (
              <tr key={t} className="border-b border-border/40">
                <td className="p-2 font-mono text-xs text-muted-foreground">{t}</td>
                {days.map((d) => {
                  const iso = toISODate(d);
                  const block = findBlock(iso, t);
                  const appt = findAppt(iso, t);
                  if (appt) {
                    const isConfirmed = appt.status === "confirmada";
                    return (
                      <td key={iso + t} className="p-1 text-center">
                        <div
                          className={
                            "rounded-md px-2 py-1 text-xs " +
                            (isConfirmed
                              ? "bg-emerald-500/20 text-emerald-900 dark:text-emerald-200"
                              : "bg-amber-500/20 text-amber-900 dark:text-amber-200")
                          }
                          title={`${appt.name} · ${appt.status}`}
                        >
                          <div className="truncate font-semibold">{firstName(appt.name)}</div>
                          <div className="text-[10px] capitalize opacity-80">{appt.status}</div>
                        </div>
                      </td>
                    );
                  }
                  if (block) {
                    const Icon = block.reason === "cirurgia" ? Scissors : Plane;
                    return (
                      <td key={iso + t} className="p-1 text-center">
                        <button
                          onClick={() => onCellClick(iso, t)}
                          className={
                            "flex w-full items-center justify-center gap-1 rounded-md px-2 py-1 text-xs capitalize " +
                            (block.reason === "cirurgia"
                              ? "bg-rose-500/20 text-rose-900 hover:bg-rose-500/30 dark:text-rose-200"
                              : "bg-indigo-500/20 text-indigo-900 hover:bg-indigo-500/30 dark:text-indigo-200")
                          }
                          title="Clique para liberar"
                        >
                          <Icon className="h-3 w-3" />
                          {block.reason}
                        </button>
                      </td>
                    );
                  }
                  return (
                    <td key={iso + t} className="p-1 text-center">
                      <button
                        onClick={() => onCellClick(iso, t)}
                        className="w-full rounded-md bg-background px-2 py-1 text-xs text-muted-foreground ring-1 ring-border hover:ring-primary"
                        title={`Bloquear como ${reason}`}
                      >
                        Livre
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Lista de consultas */}
      <div className="mt-10">
        <h2 className="mb-4 font-serif text-2xl">Consultas da semana</h2>
        {weekAppts.length === 0 ? (
          <p className="rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground">
            Nenhuma consulta nesta semana.
          </p>
        ) : (
          <div className="space-y-3">
            {weekAppts.map((a) => (
              <div key={a.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card p-4">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-card-foreground">{a.name}</p>
                    <span className={
                      "rounded-full px-2 py-0.5 text-xs font-medium capitalize " +
                      (a.status === "confirmada" ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300" :
                       "bg-amber-500/15 text-amber-700 dark:text-amber-300")
                    }>{a.status}</span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {formatBRFull(new Date(a.date + "T00:00:00"))} · {a.time} · {a.whatsapp}
                    {a.procedure ? ` · ${a.procedure}` : ""}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <a
                    href={waLink(a)} target="_blank" rel="noopener noreferrer"
                    className="rounded-full bg-[#25D366] px-4 py-2 text-xs font-semibold text-white hover:opacity-90"
                  >WhatsApp</a>
                  {a.status !== "confirmada" && (
                    <Button size="sm" variant="outline" onClick={() => onConfirm(a.id)}>Confirmar</Button>
                  )}
                  <Button size="sm" variant="ghost" onClick={() => onCancel(a.id)}>Cancelar</Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
