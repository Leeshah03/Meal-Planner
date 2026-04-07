export default function RecipesLoading() {
  return (
    <div className="max-w-lg mx-auto px-4 pt-5 space-y-3">
      <div className="flex items-center justify-between mb-5">
        <div className="h-8 w-28 rounded-lg animate-pulse" style={{ background: 'var(--color-border)' }} />
        <div className="h-9 w-20 rounded-xl animate-pulse" style={{ background: 'var(--color-border)' }} />
      </div>
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="h-24 rounded-xl animate-pulse" style={{ background: 'var(--color-border)' }} />
      ))}
    </div>
  )
}
