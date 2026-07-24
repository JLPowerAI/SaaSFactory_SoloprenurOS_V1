# Auditoría: OpenHuman como avatar para práctica del examen de ciudadanía

**Repo auditado:** [tinyhumansai/openhuman](https://github.com/tinyhumansai/openhuman) (commit `7db104b`, julio 2026)
**Objetivo:** evaluar si OpenHuman sirve como base para un avatar conversacional que simule la entrevista de naturalización (N-400 / examen cívico de USCIS) para clientes de Immigration Easy USA.
**Fecha:** 2026-07-24

---

## 1. Qué es OpenHuman

OpenHuman es un asistente de IA personal de escritorio, open source y "local-first". No es un producto de avatares: es un *harness* de agentes de propósito general que incluye un avatar como una de sus muchas piezas.

| Aspecto | Detalle |
|---|---|
| Tipo de app | Aplicación de escritorio (Tauri 2): núcleo en **Rust** + frontend **React/TypeScript** |
| Tamaño | Monorepo de ~125 MB, ~5.200 archivos, 6 subproyectos vendorizados (tinyagents, tinyflows, tinychannels, etc.) |
| Licencia | **GPL-3.0** (copyleft fuerte) |
| Madurez | **Beta temprana**, desarrollo muy activo (5.100+ PRs) |
| Plataformas | macOS, Windows, Linux (instaladores nativos). El shell web (`app/src-tauri-web`) existe pero es **experimental, solo para pruebas E2E** — no está listo para producto |
| Idiomas UI | 15 locales, **incluye español** (`app/src/lib/i18n/es.ts`) |

### Las piezas relevantes para un "avatar de examen"

- **La mascota (el avatar).** Personaje animado con **Rive** (`tiny_mascot.riv`) con estados de ánimo (idle, escuchando, pensando, hablando, sorprendido) y **lip-sync real**: la boca se sincroniza con el audio TTS mediante un mapa de visemas. La biblioteca de mascotas viene de un manifiesto en GitHub (`tinyhumansai/mascots`) y también acepta un **GIF personalizado por URL**. Soporta voz configurable por mascota (presets de ElevenLabs).
- **Voz nativa.** STT con Whisper en proceso (transcripción en streaming, push-to-talk, detección de actividad de voz) y TTS alojado en el backend de OpenHuman. Esto es exactamente la tubería que necesita una entrevista oral simulada.
- **Sistema de persona.** El comportamiento se define en archivos editables (`SOUL.md` + `IDENTITY.md`) más un panel de Personalidad. La documentación incluye una guía oficial de cómo crear un asistente vertical (`gitbooks/guides/doctor-assistant.md`) — el mismo patrón aplicaría para un "oficial de USCIS simulado".
- **Skills.** Sistema de skills compatible con el ecosistema de Claude; el banco de 100 preguntas cívicas, el flujo del examen y la rúbrica de calificación se empaquetarían como una skill.

---

## 2. Veredicto

**OpenHuman NO es la base adecuada para un producto orientado a clientes, pero SÍ sirve como herramienta interna de práctica en la oficina.** Las razones:

### Obstáculos para un producto cliente-final (SaaS)

1. **Es una app de escritorio que cada cliente tendría que instalar.** No hay versión web usable: el shell web es documentación + arnés de pruebas. Un cliente de Immigration Easy no va a instalar un `.msi`/`.dmg`, configurar un modelo y editar un `SOUL.md`.
2. **Requiere suscripción o claves de API de modelos por usuario.** El enrutamiento de modelos asume la suscripción de OpenHuman o claves propias (Anthropic/OpenAI). Multiplicar eso por cliente no escala comercialmente.
3. **Licencia GPL-3.0.** Cualquier versión modificada que se distribuya a clientes obliga a **publicar el código fuente completo** de la modificación. Para un producto comercial cerrado, es un bloqueo directo. (Uso interno sin distribuir no tiene esa obligación.)
4. **Es un martillo neumático para clavar una tachuela.** Memoria persistente de todo el usuario, bucle "subconsciente" autónomo, 17 canales de mensajería, orquestación de flotas de agentes, integración con Google Meet… El avatar de examen necesita ~5% de eso, y el 95% restante es superficie de riesgo (datos de clientes en memoria local, acciones autónomas, alucinaciones) y costo de mantenimiento sobre una beta que cambia a diario.
5. **Compilar y mantener un fork es caro.** Toolchain de Rust + CEF + Tauri + pnpm workspace; el proyecto publica releases casi continuas. Mantener un fork divergente en beta temprana es una carga permanente para un solo operador.

### Lo que sí vale la pena tomar de OpenHuman

- **El patrón de avatar:** Rive + mapa de visemas sincronizado al stream de TTS. Es la técnica correcta y es reproducible en una página web con `@rive-app/react-canvas` (~50 KB) sin cargar con todo el harness.
- **El patrón de persona vertical:** la guía del "doctor assistant" es el molde exacto — persona estricta, límites de datos, disclaimers horneados en el prompt.
- **La tubería de voz:** push-to-talk → STT streaming → LLM → TTS → lip-sync. En web esto se logra con Web Speech API (gratis) o Whisper/ElevenLabs (mejor calidad).

---

## 3. Recomendación: dos rutas según el objetivo

### Ruta A — Herramienta interna de práctica (esfuerzo: 1–2 días)

Usar OpenHuman **tal cual, sin fork**, en una computadora de la oficina para sesiones de práctica guiadas con el cliente presente:

1. Instalar el release oficial (Homebrew/MSI/deb).
2. Redactar un `SOUL.md` de "oficial de USCIS": entrevista en inglés, tono formal pero amable, hace las preguntas del N-400 (small talk, juramento, preguntas del formulario, 10 preguntas cívicas al azar de las 100, lectura y escritura), corrige pronunciación, y al final entrega un reporte de desempeño en español.
3. Empaquetar como skill el banco oficial de 100 preguntas cívicas (versión 2008, que es la vigente para la mayoría de solicitantes) + preguntas típicas del N-400 + rúbrica (6 de 10 correctas = aprobado), con las variantes 50/20 y 55/15 (derecho a examen en español).
4. Elegir mascota con voz formal (preset ElevenLabs) y usar push-to-talk para que el cliente responda oralmente.

Esto no se distribuye a nadie, así que la GPL no impone obligaciones y no hay que mantener ningún fork.

### Ruta B — Producto para clientes (recomendada para el SaaS): construir ligero, no forkear

Para un avatar accesible por los clientes desde el navegador o el teléfono, lo correcto es una app web pequeña **dentro de este mismo repo** (Next.js + Supabase ya están aquí), reutilizando los *patrones* de OpenHuman pero no su código:

| Componente | Solución ligera | Equivalente en OpenHuman |
|---|---|---|
| Avatar animado | Rive (`@rive-app/react-canvas`) o video-avatar (HeyGen/D-ID API) | Mascota Rive + visemas |
| Voz del cliente (STT) | Web Speech API (gratis) o Whisper API | Whisper en proceso |
| Voz del avatar (TTS) | ElevenLabs u OpenAI TTS con visemas | TTS alojado |
| Cerebro | Claude API con prompt de "oficial USCIS" + banco de preguntas como datos | SOUL.md + skill |
| Sesión/scoring | Tabla en Supabase: intentos, preguntas falladas, progreso por cliente | Memory Tree (innecesario) |

Estimación: un MVP funcional (avatar 2D con lip-sync básico, entrevista oral completa, reporte de resultados en español para el preparador) es un proyecto de **2–4 semanas** para un solo desarrollador con agentes, contra meses de domesticar y mantener un fork GPL de una beta de 125 MB.

Ventajas adicionales de la Ruta B: control total de costos de API (una sola clave, facturable por cliente), sin instalación, funciona en el teléfono del cliente (donde realmente va a practicar), sin obligaciones de copyleft, y los datos del cliente viven en la base de datos del negocio, no en la memoria local de una app de terceros.

---

## 4. Riesgos y consideraciones de cumplimiento

- **Contenido del examen:** las 100 preguntas cívicas y sus respuestas aceptadas son dominio público (USCIS), pero algunas respuestas cambian (gobernador, representantes, presidente). El banco de preguntas debe tener las respuestas dinámicas marcadas y actualizables.
- **Disclaimer obligatorio:** el avatar es práctica, no asesoría legal ni garantía de aprobación; el disclaimer debe ir horneado en el prompt (mismo patrón que la guía clínica de OpenHuman) y visible en la UI.
- **Datos del cliente:** una sesión de práctica revela información migratoria sensible. En la Ruta B, minimizar lo que se guarda (resultados, no transcripciones completas) y no usar la memoria persistente de propósito general de OpenHuman precisamente por esto.
- **Alucinaciones:** las preguntas y respuestas correctas deben venir del banco de datos, nunca generadas por el modelo; el modelo solo conduce la conversación y evalúa contra la respuesta oficial.

## 5. Conclusión

OpenHuman confirma que el concepto es viable y muestra la arquitectura correcta (avatar Rive con lip-sync + STT/TTS en streaming + persona vertical), pero como base de producto es la herramienta equivocada: escritorio-first, GPL-3.0, beta temprana y 20 veces más grande que el problema. **Usarlo como referencia técnica y, si se quiere, como herramienta interna de práctica (Ruta A); construir el producto para clientes como módulo web ligero en este repo (Ruta B).**
