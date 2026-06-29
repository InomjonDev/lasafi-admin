export function SkeletonList() {
  return (
    <div className="skeleton-list">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="skeleton-card" />
      ))}
    </div>
  )
}
