// components/CertificateNotReady.tsx
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Award, ArrowRight, CheckCircle2, Circle } from 'lucide-react';

type CertificateNotReadyProps = {
  courseSlug: string;
  courseName: string;
  completionPercentage: number;
  completedLessons: number;
  totalLessons: number;
  remainingLessons: string[]; // Array of lesson titles
};

export default function CertificateNotReady({
  courseSlug,
  courseName,
  completionPercentage,
  completedLessons,
  totalLessons,
  remainingLessons,
}: CertificateNotReadyProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-12 border-2 border-gray-200">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
              <Award className="w-10 h-10 text-gray-400" />
            </div>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-black mb-3">
              Certificate Not Ready Yet
            </h1>
            <p className="text-lg text-gray-600">
              Complete all lessons to unlock your certificate for <strong>{courseName}</strong>
            </p>
          </div>

          {/* Progress Section */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-700">
                Your Progress
              </span>
              <span className="text-2xl font-black text-gray-900">
                {completionPercentage.toFixed(0)}%
              </span>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
              <div
                className="bg-gradient-to-r from-blue-500 to-indigo-600 h-4 rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                style={{ width: `${completionPercentage}%` }}
              >
                {completionPercentage > 10 && (
                  <span className="text-xs font-bold text-white">
                    {completedLessons}/{totalLessons}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">
                {completedLessons} of {totalLessons} lessons completed
              </span>
              <span className="font-bold text-indigo-600">
                {totalLessons - completedLessons} remaining
              </span>
            </div>
          </div>

          {/* Remaining Lessons */}
          {remainingLessons.length > 0 && remainingLessons.length <= 5 && (
            <div className="mb-8">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Circle className="w-5 h-5 text-gray-400" />
                Lessons to Complete
              </h3>
              <ul className="space-y-3">
                {remainingLessons.slice(0, 5).map((lesson, idx) => (
                  <li 
                    key={idx}
                    className="flex items-start gap-3 text-sm text-gray-700 bg-gray-50 p-3 rounded-lg"
                  >
                    <Circle className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <span>{lesson}</span>
                  </li>
                ))}
              </ul>
              {remainingLessons.length > 5 && (
                <p className="text-sm text-gray-500 mt-3 text-center">
                  + {remainingLessons.length - 5} more lessons
                </p>
              )}
            </div>
          )}

          {/* Motivation */}
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-6 mb-8">
            <p className="text-center text-sm text-gray-700">
              <strong className="text-yellow-800">You're almost there! 🎯</strong>
              <br />
              Keep learning to earn your certificate and showcase your achievement.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href={`/courses/${courseSlug}/learn`} className="flex-1">
              <Button 
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold h-12"
              >
                Continue Learning
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href={`/courses/${courseSlug}`} className="flex-1">
              <Button 
                variant="outline"
                className="w-full h-12 font-semibold"
              >
                Course Details
              </Button>
            </Link>
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Need help? Check out the course discussion or contact your instructor.
          </p>
        </div>
      </div>
    </div>
  );
}