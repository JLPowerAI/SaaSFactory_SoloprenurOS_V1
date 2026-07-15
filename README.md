# Solopreneur OS 2026

**Solopreneur OS 2026** es un ecosistema base (boilerplate de alto valor) para operar
automatizaciones técnicas y de contenido usando herramientas de frontera. Está pensado
para desarrolladores que operan en solitario y quieren un punto de partida productivo
que combine una aplicación web moderna con un "cerebro operativo" de agentes de IA.

## 🧱 Stack

- **Next.js** (App Router) + **TypeScript**
- **Tailwind CSS**
- **Supabase** (estructura recomendada preconfigurada — sin conexión real hasta definir tus variables de entorno)

## 🗂️ Estructura del proyecto

```
solopreneur-os-2026/
├── .claude/
│   └── skills/                  # Cerebro operativo: agentes especializados
│       ├── thumbnail-architect.md   # Director de Arte & CTR de YouTube
│       ├── viral-hook-engine.md     # Retención de audiencia & copywriting
│       └── algorithmic-editor.md    # Post-producción y edición
├── src/
│   ├── app/                     # Rutas y layout (App Router)
│   ├── components/              # Componentes de UI reutilizables
│   └── lib/
│       ├── agent-payments/      # ⚠️ Muro técnico A2A (ver README interno)
│       └── supabase/            # Clientes de Supabase (browser / server)
├── supabase/
│   ├── migrations/              # Migraciones de base de datos
│   └── functions/               # Edge Functions
└── public/                      # Activos estáticos
```

## 🧠 El cerebro operativo (`.claude/skills`)

El corazón de este boilerplate es la carpeta `.claude/skills`, donde viven agentes de IA
especializados que industrializan la producción de contenido:

| Skill | Rol |
| --- | --- |
| `thumbnail-architect` | Director de arte enfocado en CTR de miniaturas |
| `viral-hook-engine` | Arquitecto de retención y copywriting de guiones |
| `algorithmic-editor` | Director de post-producción y edición cinematográfica |

## 💸 Infraestructura de pagos agénticos (`src/lib/agent-payments`)

Este directorio es intencionalmente un **muro técnico**: no contiene código, solo una
advertencia crítica sobre por qué los pagos Agent-to-Agent (A2A) no deben construirse
sobre rieles de pago tradicionales pensados para humanos. Léelo antes de intentar
cualquier integración de pagos autónomos.

## 🚀 Puesta en marcha

```bash
npm install
cp .env.example .env.local   # completa tus credenciales de Supabase
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

---

> Diseñado para operar en solitario, pero pensar como una organización.
