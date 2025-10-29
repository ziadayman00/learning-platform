import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

export async function GET(request: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const url = new URL(request.url);
  const slug = url.searchParams.get('slug') || 'tailwind-course';

  const course = await prisma.course.findUnique({
    where: { slug },
    include: {
      sections: {
        orderBy: { position: 'asc' },
        include: {
          lessons: {
            orderBy: { position: 'asc' },
            include: {
              progress: {
                where: { userId: session.user.id },
              },
            },
          },
        },
      },
    },
  });

  if (!course) {
    return NextResponse.json({ error: 'Course not found' }, { status: 404 });
  }

  const allLessons = course.sections.flatMap((s: any) => s.lessons);
  const totalLessons = allLessons.length;
  const completedLessons = allLessons.filter((l: any) => l.progress[0]?.isCompleted).length;

  return NextResponse.json({
    courseTitle: course.title,
    totalLessons,
    completedLessons,
    percentage: totalLessons > 0 ? ((completedLessons / totalLessons) * 100).toFixed(1) : 0,
    isComplete: totalLessons > 0 && completedLessons === totalLessons,
    sections: course.sections.map((section: any) => ({
      title: section.title,
      lessons: section.lessons.map((lesson: any) => ({
        id: lesson.id,
        title: lesson.title,
        isCompleted: lesson.progress[0]?.isCompleted || false,
        progress: lesson.progress[0] || null,
      })),
    })),
  });
}