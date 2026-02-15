export default function Loading() {
  return (
    <main className="min-h-screen pt-24 md:pt-32 pb-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <div className="w-32 h-4 bg-gray-200 rounded animate-pulse" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Image Skeleton */}
          <div className="aspect-[4/5] bg-gray-200 rounded-[2.5rem] animate-pulse" />

          {/* Details Skeleton */}
          <div className="space-y-10">
            <div className="space-y-4">
              <div className="w-3/4 h-16 bg-gray-200 rounded-lg animate-pulse" />
              <div className="w-1/4 h-10 bg-gray-200 rounded-lg animate-pulse" />
            </div>

            <div className="space-y-4 pt-8">
              <div className="w-full h-4 bg-gray-200 rounded animate-pulse" />
              <div className="w-full h-4 bg-gray-200 rounded animate-pulse" />
              <div className="w-2/3 h-4 bg-gray-200 rounded animate-pulse" />
            </div>

            <div className="pt-8">
              <div className="w-full md:w-64 h-16 bg-gray-200 rounded-2xl animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
