export default function ProductSkeleton() {
  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-gray-100">
      {/* Image Skeleton */}
      <div className="relative aspect-[4/5] bg-gray-200 animate-pulse" />

      {/* Content Skeleton */}
      <div className="p-5 space-y-3">
        {/* Category Tag */}
        <div className="w-20 h-3 bg-gray-200 rounded-full animate-pulse" />

        {/* Title */}
        <div className="space-y-2">
          <div className="w-3/4 h-5 bg-gray-200 rounded-md animate-pulse" />
          <div className="w-1/2 h-5 bg-gray-200 rounded-md animate-pulse" />
        </div>

        {/* Price */}
        <div className="w-16 h-6 bg-gray-200 rounded-md animate-pulse pt-2" />
      </div>
    </div>
  );
}
