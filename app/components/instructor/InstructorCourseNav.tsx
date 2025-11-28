"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart, BookOpen, Settings } from "lucide-react";

type InstructorCourseNavProps = {
  courseId: string;
};

export default function InstructorCourseNav({ courseId }: InstructorCourseNavProps) {
  const pathname = usePathname();

  const routes = [
    {
      href: `/instructor/courses/${courseId}/edit`,
      label: "Settings",
      icon: Settings,
      active: pathname === `/instructor/courses/${courseId}/edit`,
    },
    {
      href: `/instructor/courses/${courseId}/content`,
      label: "Curriculum",
      icon: BookOpen,
      active: pathname === `/instructor/courses/${courseId}/content`,
    },
    {
      href: `/instructor/courses/${courseId}/analytics`,
      label: "Analytics",
      icon: BarChart,
      active: pathname === `/instructor/courses/${courseId}/analytics`,
    },
  ];

  return (
    <div className="flex items-center gap-x-2 overflow-x-auto pb-2 mb-6">
      {routes.map((route) => (
        <Link
          key={route.href}
          href={route.href}
          className={`
            flex items-center gap-x-2 px-4 py-2 rounded-full text-sm font-medium transition-colors
            ${
              route.active
                ? "bg-black text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-black"
            }
          `}
        >
          <route.icon className="w-4 h-4" />
          {route.label}
        </Link>
      ))}
    </div>
  );
}
