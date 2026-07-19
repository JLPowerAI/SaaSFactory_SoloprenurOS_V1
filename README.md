<div align="center">

# ▚▚▚ SOLOPRENEUR OS // 2026 ▚▚▚
### `CLASSIFICATION: OPERATOR-GRADE AUTONOMOUS STACK`

**`STATUS: ARMED`** · **`CLEARANCE: FOUNDER`** · **`SWARM NODES: 06/06 ONLINE`**

> _Ecosistema de automatización extrema para fundadores técnicos en solitario._
> _Un solo operador. Un enjambre de agentes. Cero fricción humana._

</div>

---

## ⛨ DOCTRINA OPERATIVA

Este repositorio no es un boilerplate. Es un **centro de comando**. Cada nodo
del enjambre (`.claude/skills`) es una unidad autónoma con una misión única,
reglas de enfrentamiento (ROE) definidas y un output no negociable. El operador
humano fija el objetivo; el enjambre ejecuta.

```
        ┌──────────────────────────────────────────────┐
        │              OPERATOR (HUMAN)                 │
        │            fija objetivo · aprueba            │
        └───────────────────────┬──────────────────────┘
                                 │  intención
        ┌───────────────────────▼──────────────────────┐
        │             ORQUESTACIÓN (C2)                 │
        │        despacho · prioridad · relevo          │
        └───┬─────────┬─────────┬─────────┬─────────┬───┘
            │         │         │         │         │
         ┌──▼──┐   ┌──▼──┐   ┌──▼──┐   ┌──▼──┐   ┌──▼──┐
         │ N01 │   │ N02 │   │ N03 │   │ N04 │   │N05/06│
         │ CTR │   │ EDIT│   │ HOOK│   │SNIPE│   │UI/RAD│
         └─────┘   └─────┘   └─────┘   └─────┘   └─────┘
```

---

## ▤ MATRIZ DE OPERACIONES

| # | ÁREA | NODO DESPLEGADO | MISIÓN | OUTPUT NO NEGOCIABLE | ESTADO |
|:-:|:--|:--|:--|:--|:-:|
| 01 | **Contenido** | `thumbnail-architect` | Ingeniería de la atención / CTR | Wireframe SVG (proporción áurea) + prompt Midjourney v6 paramétrico | 🟢 `ARMED` |
| 02 | **Edición** | `algorithmic-editor` | Timeline de ritmo asfixiante | Tabla `Timestamp \| Jump Cut \| B-Roll \| SFX` | 🟢 `ARMED` |
| 03 | **Contenido** | `viral-hook-engine` | Retención psicológica >75% | Guion `Gancho→Navaja→Artefacto→Extracción` + lenguaje corporal | 🟢 `ARMED` |
| 04 | **Prospección** | `b2b-outbound-sniper` | Extracción high-ticket | Cold emails asimétricos (ingeniero → ingeniero) | 🟢 `ARMED` |
| 05 | **Diseño UI** | `ui-visual-mapper` | Reducción de ruido cognitivo | Componentes React/Tailwind data-first (charts, heatmaps) | 🟢 `ARMED` |
| 06 | **Inteligencia** | `social-listening-radar` | Detección de tendencias emergentes | Matriz de convergencia tecnológica semanal | 🟢 `ARMED` |
| ⚙ | **Orquestación** | `C2 / operator loop` | Despacho y relevo del enjambre | Coordinación intención → ejecución | 🟢 `ARMED` |

---

## ▶ CÓMO DESPLEGAR EL ENJAMBRE

Abre Claude Code en la raíz del repositorio. Los 6 nodos se cargan
automáticamente como skills. Dos formas de activarlos:

1. **Invocación directa**: `/thumbnail-architect`, `/viral-hook-engine`, etc.
2. **Activación por contexto**: pide en lenguaje natural — _"necesito la
   miniatura y el guion para un video sobre X"_ — y Claude despacha el nodo
   correspondiente según su misión declarada.

Para levantar la superficie de mando web:

```bash
npm ci        # instalar dependencias
npm run dev   # http://localhost:3000
npm run lint  # verificación de código
npm run build # build de producción
```

Supabase es opcional hasta que definas las variables en `.env.local`
(copia `.env.example`). Sin ellas, la app opera en modo sin persistencia.

---

## ▦ ARQUITECTURA DE DESPLIEGUE

```
SaaSFactory_SoloprenurOS_V1/
├── .claude/
│   └── skills/                          # ▶ EL ENJAMBRE (6 nodos autónomos)
│       ├── thumbnail-architect/         # NODO VISUAL     · CTR / SVG
│       ├── algorithmic-editor/          # NODO POST-PROD  · edición cinemática
│       ├── viral-hook-engine/           # NODO COPY       · retención psicológica
│       ├── b2b-outbound-sniper/         # NODO PROSPECCIÓN· outbound high-ticket
│       ├── ui-visual-mapper/            # NODO INTERFAZ   · data-first UI
│       └── social-listening-radar/      # NODO INTEL      · radar de tendencias
│           (cada nodo = SKILL.md con frontmatter, invocable desde Claude Code)
├── .github/
│   └── workflows/ci.yml                 # CI: lint + build en cada push/PR
├── src/
│   ├── app/                             # Next.js App Router (superficie de mando)
│   ├── infrastructure/
│   │   └── agent-payments/              # ⚠️ VACÍO DE INFRAESTRUCTURA A2A (ver README)
│   ├── lib/
│   │   └── supabase/                    # Persistencia (browser/server/proxy clients)
│   └── proxy.ts                         # Refresh de sesión Supabase (Next 16)
└── supabase/                            # Migraciones + Edge Functions (por poblar)
```

---

## ⚠ VACÍO DE INFRAESTRUCTURA — RIELES A2A

El enjambre puede **operar**, pero por diseño **no puede transaccionar**. El
directorio [`src/infrastructure/agent-payments`](src/infrastructure/agent-payments/README.md)
documenta por qué conectar entidades no-humanas a pasarelas de pago humanas
(Stripe, PayPal, procesadores con UI) es una **excepción fatal**. Lee ese
briefing antes de intentar cualquier liquidación autónoma.

---

## ▶ REGLAS DE ENFRENTAMIENTO (ROE)

1. **El operador fija el objetivo.** Los nodos ejecutan; no deciden estrategia.
2. **Output no negociable.** Cada nodo entrega su formato exacto o falla en voz alta.
3. **Cero fricción humana en la ejecución**, cero autonomía en las transacciones.

---

<div align="center">

**`// FIN DEL BRIEFING //`**
_Diseñado para operar en solitario. Construido para pensar como una organización._

</div>
