
CREATE TABLE public.blocked_slots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date date NOT NULL,
  time time NOT NULL,
  reason text NOT NULL CHECK (reason IN ('cirurgia','viagem')),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (date, time)
);
GRANT ALL ON public.blocked_slots TO service_role;
ALTER TABLE public.blocked_slots ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  whatsapp text NOT NULL,
  procedure text,
  date date NOT NULL,
  time time NOT NULL,
  status text NOT NULL DEFAULT 'aguardando' CHECK (status IN ('aguardando','confirmada','cancelada')),
  lgpd_consent boolean NOT NULL DEFAULT false,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.appointments TO service_role;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- Prevent double booking (only active appointments count)
CREATE UNIQUE INDEX appointments_unique_active_slot
  ON public.appointments (date, time)
  WHERE status <> 'cancelada';

CREATE INDEX appointments_date_idx ON public.appointments (date);
CREATE INDEX blocked_slots_date_idx ON public.blocked_slots (date);
