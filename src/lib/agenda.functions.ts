import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const SLOT_TIMES = [
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30",
];

function isWorkingDayISO(iso: string): boolean {
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  const dow = dt.getDay();
  return dow >= 1 && dow <= 6;
}

function normTime(t: string) {
  return t.slice(0, 5);
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
    if (!SLOT_TIMES.includes(data.time)) {
      throw new Error("Horário fora da grade de atendimento.");
    }
    const digits = data.whatsapp.replace(/\D/g, "");
    if (digits.length !== 10 && digits.length !== 11) {
      throw new Error("WhatsApp inválido: informe DDD + número.");
    }

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // Bloqueio ativo?
    const { data: blk } = await supabaseAdmin
      .from("blocked_slots")
      .select("id")
      .eq("date", data.date)
      .eq("time", data.time)
      .maybeSingle();
    if (blk) throw new Error("Horário indisponível.");

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

// ==================== SECRETARIA (código-gate) ====================

async function assertSecretariaCode(code: string) {
  const expected = process.env.SECRETARIA_CODE;
  if (!expected) throw new Error("Código da secretaria não configurado no servidor.");
  if (code !== expected) throw new Error("Código de acesso inválido.");
}

export const secretariaLogin = createServerFn({ method: "POST" })
  .inputValidator((data: { code: string }) => z.object({ code: z.string() }).parse(data))
  .handler(async ({ data }) => {
    await assertSecretariaCode(data.code);
    return { ok: true as const };
  });

export const secretariaListWeek = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    z.object({ code: z.string(), start: z.string(), end: z.string() }).parse(data),
  )
  .handler(async ({ data }) => {
    await assertSecretariaCode(data.code);
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
  .inputValidator((data: unknown) =>
    z
      .object({
        code: z.string(),
        date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        time: z.string().regex(/^\d{2}:\d{2}$/),
        reason: z.enum(["cirurgia", "viagem"]),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    await assertSecretariaCode(data.code);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    // upsert manual: se existe, atualiza motivo; senão insere.
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
  .inputValidator((data: unknown) =>
    z
      .object({
        code: z.string(),
        date: z.string(),
        time: z.string(),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    await assertSecretariaCode(data.code);
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
  .inputValidator((data: unknown) =>
    z
      .object({
        code: z.string(),
        id: z.string().uuid(),
        status: z.enum(["aguardando", "confirmada", "cancelada"]),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    await assertSecretariaCode(data.code);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("appointments")
      .update({ status: data.status })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });
