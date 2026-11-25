-- ============================================================================
-- Formulário de interesse do site (casaforteinc.com.br) — banco idjzh.
-- Aditivo e idempotente: só cria a tabela nova. RLS ligada e SEM policy:
-- só o servidor do site (service role) grava/lê; anon/authenticated não veem.
-- ============================================================================
create table if not exists public.site_leads (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  telefone text not null,            -- só dígitos, com 55
  email text,
  empreendimento text,               -- slug do empreendimento (ou null = geral)
  mensagem text,
  pagina text,                       -- caminho de onde veio
  utm_source text, utm_medium text, utm_campaign text, utm_content text,
  ip_hash text,                      -- sha256 do IP (anti-spam; não guarda o IP)
  status text not null default 'novo' check (status in ('novo','em_atendimento','convertido','descartado')),
  responsavel text,
  avisado_em timestamptz,            -- quando o comercial foi avisado no WhatsApp
  observacoes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists site_leads_created_idx on public.site_leads (created_at desc);
create index if not exists site_leads_telefone_idx on public.site_leads (telefone);
create index if not exists site_leads_ip_idx on public.site_leads (ip_hash, created_at);
alter table public.site_leads enable row level security;
