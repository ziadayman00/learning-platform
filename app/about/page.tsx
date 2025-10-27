import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Target, Users, Sparkles, BookOpen, Award, Globe } from "lucide-react";

export default function About() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="max-w-3xl">
            <div className="text-sm uppercase tracking-widest text-gray-500 mb-6">About Skillify</div>
            <h1 className="text-6xl md:text-7xl font-black leading-none mb-8">
              Where knowledge
              <br />
              meets ambition.
            </h1>
            <p className="text-2xl text-gray-600 font-light leading-relaxed">
              A platform built for creators who teach and learners who grow. 
              Share your expertise, master new skills, and shape the future of education.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-5xl font-bold mb-6">
                Built for both sides of learning
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed mb-6">
                Skillify isn't just another course platform. It's a ecosystem where expert instructors 
                and ambitious learners connect. Whether you're here to teach or to learn, we've created 
                the tools you need to succeed.
              </p>
              <p className="text-xl text-gray-600 leading-relaxed">
                No bureaucracy. No gatekeeping. Just great content, fair pricing, and a community 
                that values real skills over empty credentials.
              </p>
            </div>
            <div className="bg-gray-50 rounded-3xl p-12 border border-gray-200">
              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="bg-black text-white rounded-full p-3">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">For Learners</h3>
                    <p className="text-gray-600">Access world-class courses from experts who actually do the work. Learn practical skills that matter.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-black text-white rounded-full p-3">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">For Instructors</h3>
                    <p className="text-gray-600">Share your knowledge, build your brand, and earn revenue doing what you love.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-gray-50 border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-4">Impact in numbers</h2>
            <p className="text-xl text-gray-600">Growing every single day</p>
          </div>
          <div className="grid md:grid-cols-4 gap-12">
            <div className="text-center">
              <div className="text-6xl font-black mb-4">500+</div>
              <div className="text-lg text-gray-600">Active courses across all categories</div>
            </div>
            <div className="text-center">
              <div className="text-6xl font-black mb-4">50K+</div>
              <div className="text-lg text-gray-600">Students learning and growing</div>
            </div>
            <div className="text-center">
              <div className="text-6xl font-black mb-4">100+</div>
              <div className="text-lg text-gray-600">Expert instructors sharing knowledge</div>
            </div>
            <div className="text-center">
              <div className="text-6xl font-black mb-4">92%</div>
              <div className="text-lg text-gray-600">Course completion rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* What Makes Us Different */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-5xl font-bold mb-6">What makes us different</h2>
            <p className="text-xl text-gray-600">We're not trying to be the biggest. We're trying to be the best.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="border-l-4 border-black pl-6">
              <div className="mb-4">
                <Target className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Quality over quantity</h3>
              <p className="text-gray-600 leading-relaxed">
                Every course is reviewed. Every instructor is vetted. We only showcase content 
                that actually delivers value. No fluff, no filler.
              </p>
            </div>

            <div className="border-l-4 border-black pl-6">
              <div className="mb-4">
                <Sparkles className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Fair for creators</h3>
              <p className="text-gray-600 leading-relaxed">
                Instructors keep the majority of revenue. We don't take massive cuts. 
                Your expertise, your earnings. Simple as that.
              </p>
            </div>

            <div className="border-l-4 border-black pl-6">
              <div className="mb-4">
                <Globe className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Truly accessible</h3>
              <p className="text-gray-600 leading-relaxed">
                Lifetime access to every course you purchase. Learn at your own pace. 
                No subscriptions, no expiration dates, no nonsense.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-24 bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <Award className="w-16 h-16 mb-6" />
              <h2 className="text-5xl font-bold mb-6">Our vision</h2>
            </div>
            <p className="text-2xl text-gray-300 leading-relaxed mb-8">
              We believe education shouldn't be locked behind expensive degrees or exclusive institutions. 
              Real knowledge comes from real practitioners—people in the trenches, building, creating, and innovating.
            </p>
            <p className="text-2xl text-gray-300 leading-relaxed mb-8">
              Skillify exists to democratize expertise. To give anyone with internet access the ability to learn 
              from the best in the world. And to give experts a platform where their knowledge is valued and fairly compensated.
            </p>
            <p className="text-2xl text-gray-300 leading-relaxed">
              This is education, reimagined.
            </p>
          </div>
        </div>
      </section>

      {/* Join Section */}
      <section className="py-24 bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            {/* For Learners */}
            <div className="bg-white rounded-3xl p-12 border border-gray-200 hover:shadow-xl transition-shadow duration-500">
              <h3 className="text-3xl font-bold mb-4">Start learning</h3>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Explore courses taught by industry professionals. Pay once, learn forever.
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <div className="bg-black text-white rounded-full p-1 mt-1">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                  <span className="text-gray-700">Lifetime access to all purchased courses</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-black text-white rounded-full p-1 mt-1">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                  <span className="text-gray-700">Learn at your own pace, on any device</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-black text-white rounded-full p-1 mt-1">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                  <span className="text-gray-700">Certificates upon completion</span>
                </li>
              </ul>
              <Button size="lg" className="w-full" asChild>
                <Link href="/courses">
                  Browse Courses
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>

            {/* For Instructors */}
            <div className="bg-black text-white rounded-3xl p-12 hover:shadow-xl transition-shadow duration-500">
              <h3 className="text-3xl font-bold mb-4">Teach with us</h3>
              <p className="text-lg text-gray-300 mb-8 leading-relaxed">
                Share your expertise with thousands of eager learners. Build your brand and earn revenue.
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <div className="bg-white text-black rounded-full p-1 mt-1">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                  <span className="text-gray-300">Keep the majority of your course revenue</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-white text-black rounded-full p-1 mt-1">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                  <span className="text-gray-300">Full control over pricing and content</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-white text-black rounded-full p-1 mt-1">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                  <span className="text-gray-300">Marketing and analytics support</span>
                </li>
              </ul>
              <Button size="lg" variant="outline" className="w-full border-white  hover:bg-white text-black" asChild>
                <Link href="/become-instructor">
                  Become an Instructor
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 bg-white border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-6xl font-black mb-6">
            Your journey starts here.
          </h2>
          <p className="text-xl text-gray-600 mb-12">
            Join thousands who are already learning, teaching, and growing on Skillify.
          </p>
          <Button size="lg" className="h-16 px-12 text-lg" asChild>
            <Link href="/courses">
              Get Started Today
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}