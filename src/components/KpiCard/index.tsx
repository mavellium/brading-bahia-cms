export default function KpiCard({ title, value }: { title: string; value: string}) {
  return (
    <div className="rounded-xl border p-4">
      <p className="text-sm text-muted-foreground">{title}</p>
      <p className="text-3xl font-semibold">{value}</p>
    </div>
  );
}
