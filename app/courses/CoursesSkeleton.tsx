// app/courses/CoursesSkeleton.tsx
export default function CoursesSkeleton() {
  return (
    <>
      {/* Category Filter Skeleton */}
      <section className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3 overflow-x-auto pb-2">
            <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-10 w-24 bg-gray-200 rounded-full animate-pulse"
                style={{ animationDelay: `${i * 0.1}s` }}
              ></div>
            ))}
          </div>
        </div>
      </section>

      {/* Courses Grid Skeleton */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div className="h-8 w-32 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-5 w-40 bg-gray-200 rounded animate-pulse"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl overflow-hidden border-2 border-gray-200"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Thumbnail Skeleton */}
                <div className="h-48 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse"></div>

                {/* Content Skeleton */}
                <div className="p-6">
                  {/* Title */}
                  <div className="h-7 bg-gray-200 rounded mb-3 animate-pulse"></div>
                  <div className="h-7 bg-gray-200 rounded w-2/3 mb-4 animate-pulse"></div>

                  {/* Description */}
                  <div className="h-4 bg-gray-200 rounded mb-2 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6 mb-4 animate-pulse"></div>

                  {/* Instructor */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-4 h-4 bg-gray-200 rounded-full animate-pulse"></div>
                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                  </div>

                  {/* Price and Button */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-10 w-24 bg-gray-200 rounded-full animate-pulse"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section Skeleton */}
      <section className="py-20 bg-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="h-12 bg-white/10 rounded mx-auto mb-4 w-3/4 animate-pulse"></div>
          <div className="h-6 bg-white/10 rounded mx-auto mb-8 w-1/2 animate-pulse"></div>
          <div className="h-12 w-48 bg-white/10 rounded-full mx-auto animate-pulse"></div>
        </div>
      </section>

    </>
  );
}