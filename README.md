# LifeOS — Sistema Completo de Produtividade & Gestão de Vida

Uma plataforma integrada multiplataforma (Web + Mobile) para centralizar finanças, saúde, rotina e produtividade pessoal com auxílio de Inteligência Artificial.

## 🚀 Como Executar Localmente

### Pré-requisitos
- Node.js 18.18 ou superior
- NPM ou PNPM

### Instalação

1. Acesse o diretório do projeto:
```bash
cd lifeos
```

2. Instale as dependências:
```bash
npm install
```

3. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

4. Abra [http://localhost:3000](http://localhost:3000) no seu navegador para ver o resultado.

---

## 🎨 Funcionalidades (Fase 1 - MVP Web)

O sistema atual conta com uma UI/UX premium usando:
- Next.js 14 App Router
- Tailwind CSS v4
- Framer Motion para animações fluidas
- Zustand para estado global
- Gráficos interativos com Recharts

### Módulos Implementados
✅ **Dashboard**: Visão geral com estatísticas, tarefas, hábitos e gráficos
✅ **Finanças**: Gestão de saldo, contas, transações, investimentos e orçamentos
✅ **Tarefas**: Gerenciamento de tarefas em lista, Kanban e hábitos
✅ **Saúde & Fitness**: Acompanhamento de peso, macros de nutrição e treinos
✅ **Calendário**: Calendário interativo para eventos do mês
✅ **IA Assistente**: Interface de chat com assistente baseado em mock data
✅ **Compras**: Lista de compras separadas por categoria com checkbox e barra de progresso
✅ **Metas & Gamificação**: Metas financeiras e conquistas desbloqueáveis
✅ **Configurações**: Gerenciamento de perfil, tema (dark/light), segurança e configurações da IA

> **Nota**: Este repositório atualmente contém a interface visual (Frontend) completa com _mock data_ para demonstração das funcionalidades. O backend em NestJS com banco de dados PostgreSQL está planejado para as próximas fases.
