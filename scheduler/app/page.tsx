export default function HomePage() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-6 py-16">
      <h1 className="text-3xl font-semibold">Vena Scheduler</h1>
      <p className="text-slate-600">
        This standalone Next.js app exposes the Calendly-style scheduler feature. Use
        the links in the README to run migrations, seed demo data, and explore the
        public booking and owner editor experiences under <code>/s/&lt;slug&gt;</code>.
      </p>
    </main>
  );
}
