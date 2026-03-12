const ShimmerCard = () => (
  <div className="p-5 border-b border-border animate-pulse">
    <div className="flex items-baseline justify-between mb-3">
      <div className="h-4 w-32 bg-muted rounded" />
      <div className="h-6 w-12 bg-muted rounded" />
    </div>
    <div className="flex gap-3 mb-3">
      <div className="h-4 w-16 bg-muted rounded" />
      <div className="h-4 w-24 bg-muted rounded" />
    </div>
    <div className="h-1 w-full bg-muted rounded" />
  </div>
);

export default ShimmerCard;
