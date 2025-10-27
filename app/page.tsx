import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Zap, Target, Play, BookOpen, Clock, Award } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col">
{/* Hero Section */}
      <section className="relative bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top Row - Text */}
          <div className="pt-32 pb-16">
            <div className="max-w-4xl">
              <h1 className="text-[5rem] md:text-[7rem] lg:text-[9rem] font-black leading-none tracking-tighter mb-8">
                Skillify
              </h1>
              <div className="flex items-start gap-12">
                <div className="w-px h-24 bg-black"></div>
                <div className="flex-1 max-w-xl">
                  <p className="text-2xl md:text-3xl text-gray-600 font-light leading-relaxed mb-8">
                    Video courses from industry experts. Watch, learn, and build your future.
                  </p>
                  <div className="flex items-center gap-6">
                    <Link 
                      href="/courses"
                      className="text-lg font-medium text-black hover:text-gray-600 transition-colors flex items-center gap-2 group"
                    >
                      View all courses
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <span className="text-gray-300">|</span>
                    <Link 
                      href="/about"
                      className="text-lg font-medium text-gray-500 hover:text-black transition-colors"
                    >
                      About us
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Row - Stats */}
          <div className="border-t border-gray-200 py-8 grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <div className="text-4xl font-bold mb-1">500+</div>
              <div className="text-sm text-gray-500 uppercase tracking-wider">Courses</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-1">50K+</div>
              <div className="text-sm text-gray-500 uppercase tracking-wider">Students</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-1">100+</div>
              <div className="text-sm text-gray-500 uppercase tracking-wider">Instructors</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-1">4.8/5</div>
              <div className="text-sm text-gray-500 uppercase tracking-wider">Rating</div>
            </div>
          </div>
        </div>
      </section>
      {/* Marquee Section - Course Categories */}
      <section className="py-16 bg-black text-white overflow-hidden">
        <div className="flex whitespace-nowrap animate-marquee hover:pause">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex gap-8 px-4">
              <span className="text-5xl font-bold opacity-50 hover:opacity-100 transition-opacity duration-500">Development</span>
              <span className="text-5xl font-bold">•</span>
              <span className="text-5xl font-bold opacity-50 hover:opacity-100 transition-opacity duration-500">Design</span>
              <span className="text-5xl font-bold">•</span>
              <span className="text-5xl font-bold opacity-50 hover:opacity-100 transition-opacity duration-500">Marketing</span>
              <span className="text-5xl font-bold">•</span>
              <span className="text-5xl font-bold opacity-50 hover:opacity-100 transition-opacity duration-500">Business</span>
              <span className="text-5xl font-bold">•</span>
              <span className="text-5xl font-bold opacity-50 hover:opacity-100 transition-opacity duration-500">Photography</span>
              <span className="text-5xl font-bold">•</span>
            </div>
          ))}
        </div>
      </section>

      {/* Bento Grid Features */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-4">
              Why choose Skillify
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to accelerate your learning
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Large Card */}
            <div className="md:col-span-2 md:row-span-2 bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-12 flex flex-col justify-between min-h-[500px] hover:shadow-2xl hover:scale-[1.02] transition-all duration-500 cursor-pointer group border border-gray-200">
              <div>
                <div className="bg-white w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-500">
                  <Zap className="w-8 h-8 text-black" />
                </div>
                <h3 className="text-4xl font-bold mb-4">
                  Video-based learning
                  <br />
                  made simple
                </h3>
                <p className="text-xl text-gray-600 leading-relaxed">
                  High-quality video lessons you can watch anytime. Pause, rewind, and learn at your own pace with lifetime access.
                </p>
              </div>
              <div className="flex gap-4 mt-8 flex-wrap">
                <div className="bg-white px-6 py-3 rounded-full text-sm font-medium shadow-sm hover:shadow-md hover:scale-105 transition-all duration-300 border border-gray-200">
                  HD Video Quality
                </div>
                <div className="bg-white px-6 py-3 rounded-full text-sm font-medium shadow-sm hover:shadow-md hover:scale-105 transition-all duration-300 border border-gray-200">
                  Downloadable Resources
                </div>
              </div>
            </div>

            {/* Small Card 1 */}
            <div className="bg-black text-white rounded-3xl p-8 flex flex-col justify-between min-h-[240px] hover:scale-105 hover:bg-gray-900 transition-all duration-500 cursor-pointer group">
              <div className="bg-white/10 w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                <Target className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-2xl font-bold mb-2">Self-paced</h4>
                <p className="text-gray-400">Learn on your schedule</p>
              </div>
            </div>

            {/* Small Card 2 */}
            <div className="bg-gray-100 rounded-3xl p-8 flex flex-col justify-between min-h-[240px] hover:scale-105 hover:bg-gray-200 transition-all duration-500 cursor-pointer group border border-gray-200">
              <div className="bg-white w-12 h-12 rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-500">
                <Award className="w-6 h-6 text-black" />
              </div>
              <div>
                <h4 className="text-2xl font-bold mb-2">Certificates</h4>
                <p className="text-gray-600">Earn completion certificates</p>
              </div>
            </div>

            {/* Medium Card */}
            <div className="md:col-span-2 bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-3xl p-12 min-h-[240px] flex items-center justify-between hover:shadow-2xl hover:scale-[1.02] transition-all duration-500 cursor-pointer group overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-r from-gray-700/20 to-gray-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <h4 className="text-3xl font-bold mb-2">Lifetime access</h4>
                <p className="text-gray-400 text-lg">Once you buy, it's yours forever</p>
              </div>
              <div className="text-7xl font-black text-white/10 group-hover:text-white/20 transition-colors duration-500 relative z-10">∞</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-4">How it works</h2>
            <p className="text-xl text-gray-600">Start learning in three simple steps</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="bg-black text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                1
              </div>
              <h4 className="text-xl font-bold mb-3">Browse courses</h4>
              <p className="text-gray-600 leading-relaxed">
                Explore our catalog and find the perfect course for your goals
              </p>
            </div>

            <div className="text-center group">
              <div className="bg-black text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                2
              </div>
              <h4 className="text-xl font-bold mb-3">Purchase & enroll</h4>
              <p className="text-gray-600 leading-relaxed">
                Secure checkout with instant access to your course
              </p>
            </div>

            <div className="text-center group">
              <div className="bg-black text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                3
              </div>
              <h4 className="text-xl font-bold mb-3">Start watching</h4>
              <p className="text-gray-600 leading-relaxed">
                Stream lessons instantly and learn at your own pace
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-4">Loved by learners</h2>
            <p className="text-xl text-gray-600">See what our students have to say</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-50 rounded-2xl p-8 border-2 border-gray-200 hover:shadow-xl hover:-translate-y-2 transition-all duration-500 cursor-pointer">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-2xl hover:scale-125 inline-block transition-transform duration-300">⭐</span>
                ))}
              </div>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                "The course structure is perfect. I can watch lessons during my commute and the quality is excellent. Already recommended to my colleagues."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                <div>
                  <div className="font-bold">Emma Wilson</div>
                  <div className="text-sm text-gray-600">Marketing Manager</div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-2xl p-8 border-2 border-gray-200 hover:shadow-xl hover:-translate-y-2 transition-all duration-500 cursor-pointer">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-2xl hover:scale-125 inline-block transition-transform duration-300">⭐</span>
                ))}
              </div>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                "Best online learning platform I've used. The instructors are knowledgeable and the content is always up-to-date."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                <div>
                  <div className="font-bold">James Park</div>
                  <div className="text-sm text-gray-600">Software Engineer</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-6xl md:text-7xl font-black mb-6 hover:scale-105 transition-transform duration-500 inline-block cursor-default">
            Ready to start?
          </h2>
          <p className="text-2xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
            Join thousands of learners already advancing their careers with Skillify courses.
          </p>
          <Button 
            size="lg" 
            className="bg-white text-black hover:bg-gray-100 h-16 px-12 text-xl rounded-full font-bold hover:scale-110 hover:shadow-2xl transition-all duration-500"
            asChild
          >
            <Link href="/courses">
              Browse All Courses
            </Link>
          </Button>
          <p className="text-sm text-gray-500 mt-6 hover:text-gray-400 transition-colors duration-300">Start learning today • Lifetime access</p>
        </div>
      </section>
    </div>
  );
}