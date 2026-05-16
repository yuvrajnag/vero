import Link from "next/link";

export function Cta() {
  return (
    <section className="px-6 py-20 md:py-28">
      <div className="mx-auto max-w-4xl rounded-3xl bg-indigo-600 px-8 py-16 text-center md:px-16">
        <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
          Ready to optimize your workforce?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-indigo-100">
          Join teams allocating faster with Vero. Start free — no credit card
          required.
        </p>
        <Link
          href="/signup"
          className="mt-8 inline-block rounded-full bg-white px-8 py-3 text-sm font-medium text-indigo-600 transition hover:bg-indigo-50"
        >
          Create your account
        </Link>
      </div>
    </section>
  );
}
