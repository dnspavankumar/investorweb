const ShimmerCard = () => (
  <div className="p-5 border-b border-border">
    <div className="flex items-center justify-between mb-3">
      <div className="h-4 w-32 shimmer-bg rounded-md" />
      <div className="h-8 w-14 shimmer-bg rounded-md" />
    </div>
    <div className="flex gap-3 mb-3">
      <div className="h-5 w-16 shimmer-bg rounded-full" />
      <div className="h-5 w-24 shimmer-bg rounded-full" />
    </div>
    <div className="h-1.5 w-full shimmer-bg rounded-full" />
  </div>
);

export default ShimmerCard;
