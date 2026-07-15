export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-8 text-center">
      <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
        Solopreneur OS <span className="text-emerald-400">2026</span>
      </h1>
      <p className="max-w-xl text-lg text-neutral-400">
        Ecosistema base para operar automatizaciones técnicas y de contenido
        usando herramientas de frontera.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-neutral-500">
        <span className="rounded-full border border-neutral-800 px-3 py-1">
          Next.js · App Router
        </span>
        <span className="rounded-full border border-neutral-800 px-3 py-1">
          TypeScript
        </span>
        <span className="rounded-full border border-neutral-800 px-3 py-1">
          Tailwind CSS
        </span>
        <span className="rounded-full border border-neutral-800 px-3 py-1">
          Supabase-ready
        </span>
      </div>
    </main>
  );
}
