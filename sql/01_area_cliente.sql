-- ============================================================================
-- Área do Cliente (casaforteinc.com.br/cliente) — banco idjzh.
-- Aditivo e idempotente: só CRIA tabelas novas; não altera nada existente.
--
-- Segurança: o cliente NÃO recebe sessão do Supabase (auth.users). O login é
-- próprio (CPF + senha, sessão assinada em cookie) e TODO acesso a dados é feito
-- no servidor do site com a service role, filtrado pelo CPF da conta. Por isso
-- as tabelas abaixo têm RLS ligada e NENHUMA policy: anon/authenticated não leem
-- nada; só a service role.
-- ============================================================================

create table if not exists public.cliente_contas (
  id uuid primary key default gen_random_uuid(),
  cpf text not null unique,                 -- CPF/CNPJ só dígitos (chave com o Sienge e clientes.cpf_cnpj)
  nome text,
  sienge_customer_id integer,               -- cache do id do cliente no Sienge
  telefone text,                            -- WhatsApp usado no primeiro acesso / troca de senha
  senha_hash text,                          -- scrypt (salt$hash), null até definir a senha
  senha_definida_em timestamptz,
  sessao_versao integer not null default 1, -- incrementa ao trocar a senha → derruba sessões antigas
  token_hash text,                          -- sha256 do link de definir senha (uso único)
  token_expira_em timestamptz,
  token_enviado_em timestamptz,
  falhas_login integer not null default 0,
  bloqueado_ate timestamptz,
  ultimo_login_em timestamptz,
  ativo boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists cliente_contas_token_idx on public.cliente_contas(token_hash);

create table if not exists public.cliente_solicitacoes (
  id uuid primary key default gen_random_uuid(),
  protocolo text not null unique,
  conta_id uuid references public.cliente_contas(id) on delete set null,
  tipo text not null check (tipo in ('contato', 'ouvidoria')),
  categoria text,                           -- ouvidoria: reclamacao | sugestao | elogio | denuncia; contato: assunto livre
  assunto text,
  mensagem text not null,
  sigiloso boolean not null default false,
  status text not null default 'aberta' check (status in ('aberta', 'em_andamento', 'respondida', 'encerrada')),
  resposta text,
  respondido_em timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists cliente_solicitacoes_conta_idx on public.cliente_solicitacoes(conta_id, created_at desc);

alter table public.cliente_contas enable row level security;
alter table public.cliente_solicitacoes enable row level security;
revoke all on public.cliente_contas from anon, authenticated;
revoke all on public.cliente_solicitacoes from anon, authenticated;

-- ROLLBACK (só se nada tiver sido usado ainda):
--   drop table if exists public.cliente_solicitacoes;
--   drop table if exists public.cliente_contas;
