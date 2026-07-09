
-- Deny-all policies to make RLS intent explicit on server-only tables.
-- All reads/writes to these tables are performed through server functions
-- using the service role, which bypasses RLS. Clients (anon/authenticated)
-- must not have any direct Data API access.

CREATE POLICY "No client access to appointments"
  ON public.appointments FOR ALL
  TO anon, authenticated
  USING (false)
  WITH CHECK (false);

CREATE POLICY "No client access to blocked_slots"
  ON public.blocked_slots FOR ALL
  TO anon, authenticated
  USING (false)
  WITH CHECK (false);

-- has_role is only invoked from trusted server code (service role).
-- Revoke direct execute permission from public API roles to prevent
-- SECURITY DEFINER exposure via PostgREST RPC.
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon, authenticated;
