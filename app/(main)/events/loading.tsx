export default function Loading() {
  return (
    <section className="flex flex-col gap-2">
      <h1 className="text-2xl font-semibold tracking-tight">Loading...</h1>
      <p className="text-muted-foreground">
        Please wait while we load the events data. This may take a moment.
      </p>
    </section>
  );
}
