-- ============================================================================
-- Área do Cliente — vínculo 100% pelo Sienge + liberação por empreendimento.
-- Aditivo e idempotente. Rodar no SQL Editor do idjzh DEPOIS do 01_area_cliente.sql.
--
-- Regra de acesso (aplicada no servidor do site):
--   CPF/CNPJ → cliente no Sienge → contratos de venda (não cancelados)
--   → só os contratos de empreendimentos com status:
--        'liberado'  → qualquer cliente do empreendimento
--        'teste'     → apenas CPFs ativos em area_cliente_testadores
--        'desligado' → ninguém
--   Financeiro: só os títulos desses contratos. Obra/RDO: só a obra ligada ao
--   empreendimento (obra_id). Sem contrato liberado = sem acesso.
-- ============================================================================

create table if not exists public.area_cliente_empreendimentos (
  sienge_enterprise_id integer primary key,      -- enterpriseId do Sienge
  nome text not null,
  status text not null default 'desligado' check (status in ('desligado', 'teste', 'liberado')),
  obra_id uuid references public.obras(id) on delete set null,  -- obra do RDO que os clientes acompanham
  observacao text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.area_cliente_testadores (
  cpf text primary key,                           -- CPF/CNPJ (só dígitos) de um TITULAR de contrato no Sienge
  nome text,
  telefone_whatsapp text,                         -- se preenchido, o link de senha vai para ESTE número (ex.: diretoria testando)
  ativo boolean not null default true,
  observacao text,
  created_at timestamptz not null default now()
);

alter table public.area_cliente_empreendimentos enable row level security;
alter table public.area_cliente_testadores enable row level security;
revoke all on public.area_cliente_empreendimentos from anon, authenticated;
revoke all on public.area_cliente_testadores from anon, authenticated;

-- Empreendimentos do Sienge (ids conferidos em 13/10/2026). Só o UMÁ em teste.
insert into public.area_cliente_empreendimentos (sienge_enterprise_id, nome, status) values
  (1, 'MAUI', 'desligado'),
  (2, 'UMÁ MILAGRES', 'teste'),
  (4, 'SANTORINI', 'desligado'),
  (5, 'JAVA', 'desligado'),
  (6, 'VILLA NATUR', 'desligado')
on conflict (sienge_enterprise_id) do nothing;

-- Para testar: cadastre o CPF de um titular do UMÁ e o SEU WhatsApp, ex.:
--   insert into public.area_cliente_testadores (cpf, nome, telefone_whatsapp, observacao)
--   values ('00000000000', 'Cliente X (teste)', '5582999999999', 'teste diretoria');
--
-- A obra do RDO é achada pelo vínculo obras.sienge_enterprise_id (ver
-- casaforte-obras/sql/07_obras_sienge.sql, que também remove a coluna obra_id daqui).
--
-- Para abrir aos clientes do UMÁ (fim do teste):
--   update public.area_cliente_empreendimentos set status = 'liberado' where sienge_enterprise_id = 2;

-- ROLLBACK:
--   drop table if exists public.area_cliente_testadores;
--   drop table if exists public.area_cliente_empreendimentos;
