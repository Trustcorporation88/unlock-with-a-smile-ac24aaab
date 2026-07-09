import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const SLOT_TIMES = [
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30",
  "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30",
];

const WEEKDAY_TIMES = new Set([
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30",
]);
const SATURDAY_TIMES = new Set([
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30",
]);

function isWorkingDayISO(iso: string): boolean {
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  const dow = dt.getDay();
  return dow >= 1 && dow <= 6;
}

function isValidSlotForDate(iso: string, time: string): boolean {
  const [y, m, d] = iso.split("-").map(Number);
  const dow = new Date(y, m - 1, d).getDay();
  if (dow === 0) return false;
  if (dow === 6) return SATURDAY_TIMES.has(time);
  return WEEKDAY_TIMES.has(time);
}

function normTime(t: string) {
  return t.slice(0, 5);
}

async function assertAdmin(userId: string) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Acesso restrito à secretaria.");
}

// ==================== PÚBLICO ====================

// Grade de disponibilidade para um intervalo de datas [start, end] (inclusivo).
export const getAvailability = createServerFn({ method: "POST" })
  .inputValidator((data: { start: string; end: string }) =>
    z.object({ start: z.string(), end: z.string() }).parse(data),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const [{ data: blocks, error: e1 }, { data: appts, error: e2 }] = await Promise.all([
      supabaseAdmin
        .from("blocked_slots")
        .select("date,time,reason")
        .gte("date", data.start)
        .lte("date", data.end),
      supabaseAdmin
        .from("appointments")
        .select("date,time,status")
        .gte("date", data.start)
        .lte("date", data.end)
        .neq("status", "cancelada"),
    ]);

    if (e1) throw new Error(e1.message);
    if (e2) throw new Error(e2.message);

    const blockedMap = new Map<string, string>();
    (blocks ?? []).forEach((b) => {
      blockedMap.set(`${b.date}|${normTime(b.time)}`, b.reason);
    });
    const takenSet = new Set<string>();
    (appts ?? []).forEach((a) => {
      takenSet.add(`${a.date}|${normTime(a.time)}`);
    });

    return {
      slotTimes: SLOT_TIMES,
      blocked: Object.fromEntries(blockedMap),
      taken: Array.from(takenSet),
    };
  });

// Cria a consulta.
export const createAppointment = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    z
      .object({
        name: z.string().trim().min(2).max(120),
        email: z.string().trim().email().max(180),
        whatsapp: z.string().trim().min(10).max(20),
        procedure: z.string().trim().max(200).optional().default(""),
        date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        time: z.string().regex(/^\d{2}:\d{2}$/),
        lgpdConsent: z.literal(true),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    if (!isWorkingDayISO(data.date)) {
      throw new Error("Data indisponível: atendemos de segunda a sábado.");
    }
    if (!isValidSlotForDate(data.date, data.time)) {
      throw new Error("Horário fora da grade de atendimento.");
    }
    const [y, m, d] = data.date.split("-").map(Number);
    const [hh, mm] = data.time.split(":").map(Number);
    const when = new Date(y, m - 1, d, hh, mm).getTime();
    if (when < Date.now() + 24 * 60 * 60 * 1000) {
      throw new Error("O agendamento deve ser feito com no mínimo 24h de antecedência.");
    }
    const digits = data.whatsapp.replace(/\D/g, "");
    if (digits.length < 10 || digits.length > 13) {
      throw new Error("WhatsApp inválido: informe DDD + número (10 a 13 dígitos).");
    }

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: blk } = await supabaseAdmin
      .from("blocked_slots")
      .select("id")
      .eq("date", data.date)
      .eq("time", data.time)
      .maybeSingle();
    if (blk) throw new Error("Este horário acabou de ficar indisponível");

    const { data: taken } = await supabaseAdmin
      .from("appointments")
      .select("id")
      .eq("date", data.date)
      .eq("time", data.time)
      .neq("status", "cancelada")
      .maybeSingle();
    if (taken) throw new Error("Este horário acabou de ficar indisponível");

    const { error } = await supabaseAdmin.from("appointments").insert({
      name: data.name,
      email: data.email,
      whatsapp: digits,
      procedure: data.procedure ?? "",
      date: data.date,
      time: data.time,
      status: "aguardando",
      lgpd_consent: true,
    });

    if (error) {
      if (error.code === "23505") {
        throw new Error("Este horário acabou de ser reservado. Escolha outro.");
      }
      throw new Error(error.message);
    }
    return { ok: true as const };
  });

// ==================== SECRETARIA (admin autenticado) ====================

export const checkAdmin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.userId);
    return { ok: true as const };
  });

export const secretariaListWeek = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z.object({ start: z.string(), end: z.string() }).parse(data),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const [{ data: blocks }, { data: appts }] = await Promise.all([
      supabaseAdmin
        .from("blocked_slots")
        .select("id,date,time,reason")
        .gte("date", data.start)
        .lte("date", data.end),
      supabaseAdmin
        .from("appointments")
        .select("id,name,email,whatsapp,procedure,date,time,status,created_at")
        .gte("date", data.start)
        .lte("date", data.end)
        .order("date", { ascending: true })
        .order("time", { ascending: true }),
    ]);

    return {
      slotTimes: SLOT_TIMES,
      blocks: (blocks ?? []).map((b) => ({ ...b, time: normTime(b.time) })),
      appointments: (appts ?? []).map((a) => ({ ...a, time: normTime(a.time) })),
    };
  });

export const secretariaBlockSlot = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z
      .object({
        date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        time: z.string().regex(/^\d{2}:\d{2}$/),
        reason: z.enum(["cirurgia", "viagem"]),
      })
      .parse(data),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: exists } = await supabaseAdmin
      .from("blocked_slots")
      .select("id")
      .eq("date", data.date)
      .eq("time", data.time)
      .maybeSingle();
    if (exists) {
      const { error } = await supabaseAdmin
        .from("blocked_slots")
        .update({ reason: data.reason })
        .eq("id", exists.id);
      if (error) throw new Error(error.message);
    } else {
      const { error } = await supabaseAdmin
        .from("blocked_slots")
        .insert({ date: data.date, time: data.time, reason: data.reason });
      if (error) throw new Error(error.message);
    }
    return { ok: true as const };
  });

export const secretariaUnblockSlot = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z.object({ date: z.string(), time: z.string() }).parse(data),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("blocked_slots")
      .delete()
      .eq("date", data.date)
      .eq("time", data.time);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

export const secretariaUpdateAppointmentStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z
      .object({
        id: z.string().uuid(),
        status: z.enum(["aguardando", "confirmada", "cancelada"]),
      })
      .parse(data),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("appointments")
      .update({ status: data.status })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });
