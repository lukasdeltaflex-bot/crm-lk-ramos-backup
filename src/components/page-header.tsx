export function PageHeader({ title }: { title: string }) {
  return (
    <h1 className="text-3xl font-bold tracking-tight text-foreground mb-8">
      {title}
    </h1>
  );
}
