export function Features() {
  return (
    <section id="features" className="bg-white px-6 py-20 md:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl md:ml-64">
          <h2 className="whitespace-nowrap text-left text-4xl font-bold tracking-tight text-zinc-900 md:text-6xl">Vero Workspace</h2>
          <p className="mt-4 text-left text-zinc-600">
            Connect availability, pricing, and qualification analysis in one workspace.
            <br />
            Built to help your team allocate and negotiate at scale.
          </p>
        </div>
        <img
          className="mt-8 h-auto w-full rounded-2xl"
          src="/features.png?v=2"
          alt="Vero features"
        />
      </div>
    </section>
  );
}
