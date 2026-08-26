-- Episode history alone does not prove that a series is complete.
-- Keep Bingers active-state hardening, but only create Completed when official
-- metadata or an explicit manual state can prove it.

drop trigger if exists trg_finalize_bingers_series_states on public.imports;
drop function if exists public.ct_finalize_bingers_series_states();
