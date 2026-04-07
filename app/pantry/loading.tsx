export default function PantryLoading() {
  return (
    <div className="max-w-lg mx-auto px-4 pt-5 space-y-2">
      <div className="flex items-center justify-between mb-5">
        <div className="h-8 w-24 rounded-lg animate-pulse" style={{ background: 'var(--color-border)' }} />
        <div className="h-9 w-20 rounded-xl animate-pulse" style={{ background: 'var(--color-border)' }} />
      </div>
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-16 rounded-xl animate-pulse" style={{ background: 'var(--color-border)' }} />
      ))}
    </div>
  )
}
