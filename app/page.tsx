'use client'
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Zap, Target, Play, BookOpen, Clock, Award, TrendingUp, Users, CheckCircle2 } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col bg-white">
      {/* Hero Section */}
      <section className="relative bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top Row - Text */}
          <div className="pt-20 sm:pt-32 pb-12 sm:pb-16">
            <div className="max-w-4xl">
              <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black leading-none tracking-tighter mb-6 sm:mb-8">
                Skillify
              </h1>
              <div className="flex flex-col sm:flex-row items-start gap-6 sm:gap-12">
                <div className="hidden sm:block w-px h-24 bg-black"></div>
                <div className="flex-1 max-w-xl">
                  <p className="text-xl sm:text-2xl md:text-3xl text-gray-600 font-light leading-relaxed mb-6 sm:mb-8">
                    Video courses from industry experts. Watch, learn, and build your future.
                  </p>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                    <Link 
                      href="/courses"
                      className="text-base sm:text-lg font-medium text-black hover:text-gray-600 transition-colors flex items-center gap-2 group"
                    >
                      View all courses
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <span className="hidden sm:inline text-gray-300">|</span>
                    <Link 
                      href="/about"
                      className="text-base sm:text-lg font-medium text-gray-500 hover:text-black transition-colors"
                    >
                      About us
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Row - Stats */}
          <div className="border-t border-gray-200 py-6 sm:py-8 grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            <div>
              <div className="text-3xl sm:text-4xl font-bold mb-1">500+</div>
              <div className="text-xs sm:text-sm text-gray-500 uppercase tracking-wider">Courses</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-bold mb-1">50K+</div>
              <div className="text-xs sm:text-sm text-gray-500 uppercase tracking-wider">Students</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-bold mb-1">100+</div>
              <div className="text-xs sm:text-sm text-gray-500 uppercase tracking-wider">Instructors</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-bold mb-1">4.8/5</div>
              <div className="text-xs sm:text-sm text-gray-500 uppercase tracking-wider">Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Animated Categories Strip */}
      <section className="relative bg-black text-white py-12 sm:py-16 md:py-20 overflow-hidden">
        <div className="flex gap-8 sm:gap-12 animate-marquee">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex gap-8 sm:gap-12 items-center shrink-0">
              {["Web Development", "UI/UX Design", "Digital Marketing", "Data Science", "Photography", "Business Strategy"].map((cat, idx) => (
                <span key={idx} className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black opacity-30 hover:opacity-100 transition-opacity duration-500 cursor-pointer whitespace-nowrap">
                  {cat}
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 sm:py-24 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12 sm:mb-16 md:mb-20">
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-4 sm:mb-6 leading-tight">
              Learning that fits your life
            </h2>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-600 leading-relaxed">
              Everything you need to master new skills and advance your career
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6">
            {/* Hero Feature */}
            <div className="md:col-span-8 md:row-span-2 bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white rounded-2xl sm:rounded-3xl p-8 sm:p-12 md:p-16 flex flex-col justify-between min-h-[500px] sm:min-h-[600px] hover:shadow-2xl transition-all duration-500 group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative z-10">
                <div className="inline-flex items-center justify-center bg-white/10 backdrop-blur-sm w-16 h-16 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl mb-6 sm:mb-8 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                  <Zap className="w-8 h-8 sm:w-10 sm:h-10" />
                </div>
                
                <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-4 sm:mb-6 leading-tight">
                  Premium video learning
                </h3>
                <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-300 leading-relaxed max-w-2xl">
                  Crystal-clear HD videos, downloadable resources, and hands-on projects. Learn by doing with real-world examples.
                </p>
              </div>
              
              <div className="flex flex-wrap gap-2 sm:gap-3 relative z-10 mt-6 sm:mt-0">
                {["HD Quality", "Offline Access", "Mobile Friendly", "Code Along"].map((tag, i) => (
                  <span key={i} className="bg-white/10 backdrop-blur-sm px-4 sm:px-5 py-2 sm:py-3 rounded-full text-xs sm:text-sm font-semibold hover:bg-white/20 hover:scale-105 transition-all duration-300">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Side Features */}
            <div className="md:col-span-4 bg-gradient-to-br from-gray-50 to-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 flex flex-col justify-between border-2 border-gray-200 hover:border-gray-900 hover:shadow-xl transition-all duration-500 group min-h-[240px] sm:min-h-[290px]">
              <div className="bg-black w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                <Target className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              <div>
                <h4 className="text-2xl sm:text-3xl font-black mb-2 sm:mb-3">Learn at your pace</h4>
                <p className="text-gray-600 text-base sm:text-lg">No deadlines. No pressure. Study when it works for you.</p>
              </div>
            </div>

            <div className="md:col-span-4 bg-black text-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 flex flex-col justify-between hover:bg-gray-900 hover:scale-105 transition-all duration-500 group min-h-[240px] sm:min-h-[290px]">
              <div className="bg-white/10 w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                <Award className="w-6 h-6 sm:w-7 sm:h-7" />
              </div>
              <div>
                <h4 className="text-2xl sm:text-3xl font-black mb-2 sm:mb-3">Get certified</h4>
                <p className="text-gray-400 text-base sm:text-lg">Earn shareable certificates to showcase your achievements.</p>
              </div>
            </div>

            {/* Bottom Feature */}
            <div className="md:col-span-12 bg-gradient-to-r from-gray-100 via-gray-50 to-white rounded-2xl sm:rounded-3xl p-8 sm:p-10 md:p-12 flex flex-col sm:flex-row items-center justify-between gap-6 border-2 border-gray-200 hover:shadow-xl transition-all duration-500 group overflow-hidden relative">
              <div className="absolute right-0 top-0 w-1/3 h-full bg-gradient-to-l from-gray-200/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative z-10 text-center sm:text-left">
                <h4 className="text-3xl sm:text-4xl md:text-5xl font-black mb-2 sm:mb-3">Lifetime Access</h4>
                <p className="text-gray-600 text-lg sm:text-xl">Buy once, learn forever. All updates included.</p>
              </div>
              
              <div className="text-7xl sm:text-8xl md:text-9xl font-black text-gray-900/10 group-hover:text-gray-900/20 group-hover:scale-110 transition-all duration-500 relative z-10">
                ∞
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section id="how-it-works" className="py-16 sm:py-24 md:py-32 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12 sm:mb-16 md:mb-20">
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-4 sm:mb-6 leading-tight">From curious to capable</h2>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-600">Your learning journey, visualized</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {/* Step 1 */}
            <div className="relative bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 border-2 border-gray-900 hover:shadow-2xl transition-all duration-500 group overflow-hidden">
              <div className="absolute top-0 right-0 text-7xl sm:text-8xl md:text-9xl font-black text-gray-100 group-hover:text-gray-200 transition-colors leading-none">01</div>
              <div className="relative z-10">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-black rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:rotate-12 transition-transform duration-500">
                  <Target className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <h4 className="text-2xl sm:text-3xl font-black mb-3 sm:mb-4">Discover</h4>
                <p className="text-gray-600 text-base sm:text-lg leading-relaxed mb-4 sm:mb-6">
                  Explore our curated catalog of expert-led courses designed for real-world success
                </p>
                <div className="inline-block bg-gray-100 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold">
                  500+ Courses
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative bg-black text-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 hover:bg-gray-900 hover:shadow-2xl transition-all duration-500 group overflow-hidden">
              <div className="absolute top-0 right-0 text-7xl sm:text-8xl md:text-9xl font-black text-white/10 group-hover:text-white/20 transition-colors leading-none">02</div>
              <div className="relative z-10">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/10 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:rotate-12 transition-transform duration-500 backdrop-blur-sm">
                  <Zap className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <h4 className="text-2xl sm:text-3xl font-black mb-3 sm:mb-4">Unlock</h4>
                <p className="text-gray-300 text-base sm:text-lg leading-relaxed mb-4 sm:mb-6">
                  Secure checkout gets you instant, lifetime access to all course materials
                </p>
                <div className="inline-block bg-white/10 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold backdrop-blur-sm">
                  Instant Access
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative bg-gradient-to-br from-gray-900 to-black text-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 hover:shadow-2xl transition-all duration-500 group overflow-hidden">
              <div className="absolute top-0 right-0 text-7xl sm:text-8xl md:text-9xl font-black text-white/10 group-hover:text-white/20 transition-colors leading-none">03</div>
              <div className="relative z-10">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/10 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:rotate-12 transition-transform duration-500 backdrop-blur-sm">
                  <Play className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <h4 className="text-2xl sm:text-3xl font-black mb-3 sm:mb-4">Master</h4>
                <p className="text-gray-300 text-base sm:text-lg leading-relaxed mb-4 sm:mb-6">
                  Learn by doing with hands-on projects and earn certificates to prove your skills
                </p>
                <div className="inline-block bg-white/10 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold backdrop-blur-sm">
                  Build Portfolio
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Benefits */}
          <div className="mt-12 sm:mt-16 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 md:gap-8">
            <div className="flex items-center gap-2 sm:gap-3 text-gray-600">
              <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-black flex-shrink-0" />
              <span className="font-medium text-sm sm:text-base">No subscriptions</span>
            </div>
            <div className="hidden sm:block w-px h-6 bg-gray-300"></div>
            <div className="flex items-center gap-2 sm:gap-3 text-gray-600">
              <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-black flex-shrink-0" />
              <span className="font-medium text-sm sm:text-base">Learn at your pace</span>
            </div>
            <div className="hidden sm:block w-px h-6 bg-gray-300"></div>
            <div className="flex items-center gap-2 sm:gap-3 text-gray-600">
              <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-black flex-shrink-0" />
              <span className="font-medium text-sm sm:text-base">Lifetime updates</span>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 sm:py-24 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16 md:mb-20">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black mb-4 sm:mb-6">Success stories</h2>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-600">Real results from real learners</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {[
              {
                quote: "The course structure is perfect. I can watch lessons during my commute and the quality is excellent. Already recommended to my colleagues.",
                name: "Emma Wilson",
                role: "Marketing Manager",
                color: "from-blue-50 to-indigo-50"
              },
              {
                quote: "Best online learning platform I've used. The instructors are knowledgeable and the content is always up-to-date. Worth every penny.",
                name: "James Park",
                role: "Software Engineer",
                color: "from-purple-50 to-pink-50"
              }
            ].map((testimonial, i) => (
              <div key={i} className={`bg-gradient-to-br ${testimonial.color} rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 border-2 border-gray-200 hover:border-gray-900 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group`}>
                <div className="flex gap-1 sm:gap-2 mb-4 sm:mb-6">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 sm:w-6 sm:h-6 text-black group-hover:scale-125 transition-transform duration-300" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                
                <p className="text-lg sm:text-xl text-gray-800 mb-6 sm:mb-8 leading-relaxed font-medium">
                  "{testimonial.quote}"
                </p>
                
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-gray-900 to-gray-700 rounded-full flex-shrink-0"></div>
                  <div>
                    <div className="font-bold text-base sm:text-lg">{testimonial.name}</div>
                    <div className="text-gray-600 text-sm sm:text-base">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section id="courses" className="relative py-20 sm:py-32 md:py-40 bg-black text-white overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-white/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-6 sm:mb-8 leading-tight">
            Your future starts here
          </h2>
          <p className="text-xl sm:text-2xl md:text-3xl text-gray-300 mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed">
            Join thousands of learners transforming their careers with Skillify
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center">
            <Link 
              href="/courses"
              className="inline-flex items-center gap-2 sm:gap-3 bg-white text-black px-8 sm:px-10 py-4 sm:py-5 rounded-full text-lg sm:text-xl font-black hover:bg-gray-100 hover:scale-110 hover:shadow-2xl transition-all duration-500 group w-full sm:w-auto justify-center"
            >
              Browse All Courses
              <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-2 transition-transform" />
            </Link>
            
            <div className="flex items-center gap-2 sm:gap-3 text-gray-400">
              <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
              <span className="text-xs sm:text-sm">30-day money-back guarantee</span>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        
        .animate-marquee {
          animation: marquee 40s linear infinite;
        }
        
        .delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </div>
  );
}