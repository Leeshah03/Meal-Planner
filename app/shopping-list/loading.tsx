export default function ShoppingLoading() {
  return (
    <div className="max-w-lg mx-auto px-4 pt-5">
      {['Produce', 'Dairy & Protein', 'Pantry Staples'].map(cat => (
        <div key={cat} className="mb-6">
          <div className="h-3 w-24 rounded animate-pulse mb-3" style={{ background: 'var(--color-border)' }} />
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-12 rounded-xl mb-1.5 animate-pulse" style={{ background: 'var(--color-border)' }} />
          ))}
        </div>
      ))}
    </div>
  )
}
