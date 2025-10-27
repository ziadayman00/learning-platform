// app/courses/CoursesHero.tsx
"use client";

import { Search, Loader2 } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function CoursesHero() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    setSearchQuery(searchParams.get('search') || '');
    setIsSearching(false);
  }, [searchParams]);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setIsSearching(true);
    
    // Update URL with search param
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set('search', value);
    } else {
      params.delete('search');
    }
    router.push(`/courses?${params.toString()}`, { scroll: false });
  };

  return (
    <section className="relative bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="max-w-3xl">
          <div className="text-sm uppercase tracking-widest text-gray-500 mb-6">
            Explore Courses
          </div>
          <h1 className="text-5xl md:text-7xl font-black leading-none mb-6">
            Learn anything.
            <br />
            Become anyone.
          </h1>
          <p className="text-xl text-gray-600 font-light leading-relaxed mb-8">
            Browse our collection of expert-led courses. Pay once, learn forever.
          </p>
          
          {/* Search Bar */}
          <div className="relative max-w-2xl">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            {isSearching && (
              <Loader2 className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 animate-spin" />
            )}
            <input
              type="text"
              placeholder="Search for courses..."
              id="course-search"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-14 pr-14 py-4 bg-gray-50 border-2 border-gray-200 rounded-full text-lg focus:outline-none focus:border-black transition-colors duration-300"
            />
          </div>
        </div>
      </div>
    </section>
  );
}