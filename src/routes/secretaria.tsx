import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { addDays, formatBR, formatBRFull, isWorkingDay, toISODate, weekDates } from "@/lib/agenda";
import {
  secretariaBlockSlot,
  secretariaListWeek,
  secretariaLogin,
  secretariaUnblockSlot,
  secretariaUpdateAppointmentStatus,
} from "@/lib/agenda.functions";
import { useServerFn } from "@tanstack/react-start";
import { WHATSAPP_NUMBER } from "@/lib/whatsapp";

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

function SecretariaPage() {
  const login = useServerFn(secretariaLogin);
  const listWeek = useServerFn(secretariaListWeek);
  const blockSlot = useServerFn(secretariaBlockSlot);
  const unblockSlot = useServerFn(secretariaUnblockSlot);
  const updateStatus = useServerFn(secretariaUpdateAppointmentStatus);

  const [code, setCode] = useState("");
  const [authed, setAuthed] = useState(false);
  const [reason, setReason] = useState<"cirurgia" | "viagem">("cirurgia");
  // Começa na próxima semana (offset 1) conforme pedido
  const [weekOffset, setWeekOffset] = useState(1);
  const [data, setData] = useState<WeekData | null>(null);
  const [loading, setLoading] = useState(false);

  const days = useMemo(
    () => weekDates(addDays(new Date(), weekOffset * 7)).filter(isWorkingDay),
    [weekOffset],
  );
  const rangeStart = toISODate(days[0]);
  const rangeEnd = toISODate(days[days.length - 1]);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const res = await listWeek({ data: { code, start: rangeStart, end: rangeEnd } });
      setData(res as WeekData);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erro ao carregar agenda.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, [code, rangeStart, rangeEnd, listWeek]);

  useEffect(() => {
    if (authed) refresh();
  }, [authed, refresh]);

  async function onLogin(e: React.FormEvent) {
    e.preventDefault();
    try {
      await login({ data: { code } });
      setAuthed(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Código inválido.";
      toast.error(msg);
    }
  }

  function findBlock(date: string, time: string) {
    return data?.blocks.find((b) => b.date === date && b.time === time);
  }
  function findAppt(date: string, time: string) {
    return data?.appointments.find((a) => a.date === date && a.time === time && a.status !== "cancelada");
  }

  async function onToggleSlot(date: string, time: string) {
    const appt = findAppt(date, time);
    if (appt) { toast.error("Este horário tem consulta ativa."); return; }
    const block = findBlock(date, time);
    try {
      if (block) {
        await unblockSlot({ data: { code, date, time } });
        toast.success("Bloqueio removido.");
      } else {
        await blockSlot({ data: { code, date, time, reason } });
        toast.success(`Bloqueado como ${reason}.`);
      }
      await refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erro ao atualizar.";
      toast.error(msg);
    }
  }

  async function onUpdateAppt(id: string, status: "confirmada" | "cancelada") {
    try {
      await updateStatus({ data: { code, id, status } });
      toast.success(status === "confirmada" ? "Consulta confirmada." : "Consulta cancelada.");
      await refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erro.";
      toast.error(msg);
    }
  }

  function waLink(appt: Appt) {
    const dateBR = formatBRFull(new Date(appt.date + "T00:00:00"));
    const msg = `Olá, ${appt.name}! Aqui é da equipe da Dra. Rebecca Rossener. Confirmo sua consulta para ${dateBR} às ${appt.time}. Podemos confirmar sua presença?`;
    const digits = appt.whatsapp.replace(/\D/g, "");
    const num = digits.startsWith("55") ? digits : `55${digits}`;
    return `https://wa.me/${num}?text=${encodeURIComponent(msg)}`;
  }

  if (!authed) {
    return (
      <section className="mx-auto max-w-md px-4 py-24 md:px-8">
        <h1 className="font-serif text-3xl md:text-4xl">Área da secretaria</h1>
        <p className="mt-2 text-sm text-muted-foreground">Digite o código de acesso.</p>
        <form onSubmit={onLogin} className="mt-6 space-y-4 rounded-2xl border border-border bg-card p-6">
          <div className="space-y-2">
            <Label htmlFor="code">Código</Label>
            <Input id="code" type="password" value={code} onChange={(e) => setCode(e.target.value)} required autoFocus />
          </div>
          <Button type="submit" className="w-full">Entrar</Button>
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
          <div className="flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-sm">
            <span className="text-muted-foreground">Bloquear como:</span>
            <button
              onClick={() => setReason("cirurgia")}
              className={`rounded-full px-3 py-1 text-xs font-medium ${reason === "cirurgia" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
            >Cirurgia</button>
            <button
              onClick={() => setReason("viagem")}
              className={`rounded-full px-3 py-1 text-xs font-medium ${reason === "viagem" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
            >Viagem</button>
          </div>
          <Button size="sm" variant="outline" onClick={() => setWeekOffset((w) => w - 1)}>← Semana</Button>
          <Button size="sm" variant="outline" onClick={() => setWeekOffset((w) => w + 1)}>Semana →</Button>
          <Button size="sm" variant="outline" onClick={refresh} disabled={loading}>{loading ? "..." : "Atualizar"}</Button>
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
                  return (
                    <td key={iso + t} className="p-1 text-center">
                      {appt ? (
                        <div className="rounded-md bg-primary/15 px-2 py-1 text-xs text-card-foreground">
                          <div className="truncate font-medium">{appt.name}</div>
                          <div className="text-[10px] text-muted-foreground capitalize">{appt.status}</div>
                        </div>
                      ) : block ? (
                        <button
                          onClick={() => onToggleSlot(iso, t)}
                          className="w-full rounded-md bg-destructive/20 px-2 py-1 text-xs text-destructive hover:bg-destructive/30 capitalize"
                          title="Clique para liberar"
                        >
                          {block.reason}
                        </button>
                      ) : (
                        <button
                          onClick={() => onToggleSlot(iso, t)}
                          className="w-full rounded-md bg-background px-2 py-1 text-xs text-muted-foreground ring-1 ring-border hover:ring-primary"
                          title={`Bloquear como ${reason}`}
                        >
                          livre
                        </button>
                      )}
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
                      (a.status === "confirmada" ? "bg-primary/15 text-primary" :
                       a.status === "aguardando" ? "bg-amber-500/15 text-amber-700 dark:text-amber-400" :
                       "bg-muted text-muted-foreground")
                    }>{a.status}</span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {formatBRFull(new Date(a.date + "T00:00:00"))} · {a.time} · {a.email} · {a.whatsapp}
                    {a.procedure ? ` · ${a.procedure}` : ""}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <a
                    href={waLink(a)} target="_blank" rel="noopener noreferrer"
                    className="rounded-full bg-[#25D366] px-4 py-2 text-xs font-semibold text-white hover:opacity-90"
                  >WhatsApp</a>
                  {a.status !== "confirmada" && (
                    <Button size="sm" variant="outline" onClick={() => onUpdateAppt(a.id, "confirmada")}>Confirmar</Button>
                  )}
                  {a.status !== "cancelada" && (
                    <Button size="sm" variant="ghost" onClick={() => onUpdateAppt(a.id, "cancelada")}>Cancelar</Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <p className="mt-8 text-xs text-muted-foreground">WhatsApp da assessoria: {WHATSAPP_NUMBER}</p>
    </section>
  );
}
