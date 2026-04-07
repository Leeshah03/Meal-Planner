export default function WeekLoading() {
  return (
    <div className="max-w-lg mx-auto px-4 pt-5 space-y-2.5">
      {Array.from({ length: 7 }).map((_, i) => (
        <div
          key={i}
          className="h-[72px] rounded-xl animate-pulse"
          style={{ background: 'var(--color-border)' }}
        />
      ))}
    </div>
  )
}
