// app/courses/[slug]/CourseDetailSkeleton.tsx

export default function CourseDetailSkeleton() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Breadcrumb Skeleton */}
      <section className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2">
            <div className="h-4 w-16 bg-gray-200 rounded"></div>
            <span>/</span>
            <div className="h-4 w-24 bg-gray-200 rounded"></div>
            <span>/</span>
            <div className="h-4 w-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </section>

      {/* Hero Skeleton */}
      <section className="relative bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="h-8 w-32 bg-white/10 rounded-full mb-6"></div>
              <div className="h-16 bg-white/10 rounded mb-4"></div>
              <div className="h-16 bg-white/10 rounded w-3/4 mb-6"></div>
              <div className="h-6 bg-white/10 rounded mb-2"></div>
              <div className="h-6 bg-white/10 rounded w-5/6 mb-8"></div>

              <div className="flex gap-6 mb-8">
                <div className="h-5 w-32 bg-white/10 rounded"></div>
                <div className="h-5 w-40 bg-white/10 rounded"></div>
                <div className="h-5 w-28 bg-white/10 rounded"></div>
              </div>

              <div className="flex gap-4">
                <div className="h-14 w-48 bg-white/20 rounded-full"></div>
                <div className="h-14 w-40 bg-white/20 rounded-full"></div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white rounded-3xl overflow-hidden shadow-2xl">
                <div className="h-64 bg-gradient-to-br from-gray-200 to-gray-300"></div>
                <div className="p-8">
                  <div className="h-8 bg-gray-200 rounded mb-4"></div>
                  <div className="space-y-3">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="w-5 h-5 bg-gray-200 rounded-full"></div>
                        <div className="h-4 bg-gray-200 rounded flex-1"></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs Skeleton */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8">
            <div className="h-16 w-32 bg-gray-200 rounded-t"></div>
            <div className="h-16 w-32 bg-gray-200 rounded-t"></div>
          </div>
        </div>
      </section>

      {/* Content Skeleton */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white rounded-2xl p-8 border border-gray-200">
                <div className="h-8 bg-gray-200 rounded mb-6 w-1/3"></div>
                <div className="grid md:grid-cols-2 gap-4">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-6 bg-gray-200 rounded"></div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl p-8 border border-gray-200">
                <div className="h-8 bg-gray-200 rounded mb-6 w-1/3"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-8 border border-gray-200 sticky top-24">
                <div className="text-center mb-6">
                  <div className="h-12 bg-gray-200 rounded mx-auto mb-2 w-24"></div>
                  <div className="h-4 bg-gray-200 rounded mx-auto w-48"></div>
                </div>
                <div className="h-14 bg-gray-200 rounded-full mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mx-auto w-32 mb-6"></div>

                <div className="border-t border-gray-200 pt-6 space-y-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-5 h-5 bg-gray-200 rounded"></div>
                      <div className="h-4 bg-gray-200 rounded flex-1"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
