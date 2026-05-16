export function Bento() {
  return (
    <section id="bento" className="px-6 py-20 md:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 md:text-4xl dark:text-zinc-50">
            Built for modern teams
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-zinc-600 dark:text-zinc-400">
            A flexible platform that adapts to how you work.
          </p>
        </div>
        <div className="mt-14 grid gap-4 md:grid-cols-4 md:grid-rows-2">
          <BentoCard
            className="md:col-span-2 md:row-span-2"
            title="Unified dashboard"
            description="See metrics, users, and revenue in one place."
          />
          <BentoCard
            title="Real-time sync"
            description="Data updates instantly across your stack."
          />
          <BentoCard
            title="Custom domains"
            description="Brand your app with your own URL."
          />
          <BentoCard
            className="md:col-span-2"
            title="Enterprise ready"
            description="SSO, audit logs, and compliance tools when you need them."
          />
        </div>
      </div>
    </section>
  );
}

function BentoCard({
  title,
  description,
  className = "",
}: {
  title: string;
  description: string;
  className?: string;
}) {
  return (
    <article
      className={`flex min-h-[140px] flex-col justify-between rounded-2xl border border-zinc-200 bg-gradient-to-br from-zinc-50 to-white p-6 dark:border-zinc-800 dark:from-zinc-900 dark:to-zinc-950 ${className}`}
    >
      <div>
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">{title}</h3>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{description}</p>
      </div>
      <div className="mt-6 h-16 rounded-lg bg-zinc-200/60 dark:bg-zinc-800/60" />
    </article>
  );
}
