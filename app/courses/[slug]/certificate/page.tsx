// app/courses/[slug]/certificate/page.tsx
import { redirect, notFound } from 'next/navigation';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import prisma from '@/lib/prisma';
import CertificateClient from './CertificateClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function CertificatePage({ params }: PageProps) {
  const { slug } = await params;

  // 1. Check authentication
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect('/signin');
  }

  const user = session.user;

  // 2. Fetch course with lessons and progress
  const course = await prisma.course.findUnique({
    where: { slug },
    include: {
      instructor: {
        select: {
          name: true,
          image: true,
        },
      },
      sections: {
        include: {
          lessons: {
            include: {
              progress: {
                where: {
                  userId: user.id,
                },
                select: {
                  isCompleted: true,
                  updatedAt: true,
                },
              },
            },
            orderBy: { position: 'asc' },
          },
        },
        orderBy: { position: 'asc' },
      },
    },
  });

  if (!course) {
    notFound();
  }

  // 3. Check if user purchased the course
  const purchase = await prisma.purchase.findUnique({
    where: {
      userId_courseId: {
        userId: user.id,
        courseId: course.id,
      },
      paymentStatus: 'COMPLETED',
    },
  });

  if (!purchase) {
    console.log(`❌ User ${user.id} has not purchased course ${course.id}`);
    redirect(`/courses/${slug}`);
  }

  // 4. Calculate completion
  const allLessons = course.sections.flatMap((s: any) => s.lessons);
  const totalLessons = allLessons.length;
  
  if (totalLessons === 0) {
    console.log(`⚠️ Course has no lessons`);
    redirect(`/courses/${slug}/learn`);
  }

  const completedLessons = allLessons.filter(
    lesson => lesson.progress[0]?.isCompleted === true
  ).length;

  const completionPercentage = (completedLessons / totalLessons) * 100;
  const isCompleted = completionPercentage === 100;

  // Debug logging
  console.log('=== CERTIFICATE ACCESS CHECK ===');
  console.log(`Course: ${course.title}`);
  console.log(`User: ${user.name} (${user.id})`);
  console.log(`Total Lessons: ${totalLessons}`);
  console.log(`Completed: ${completedLessons}`);
  console.log(`Percentage: ${completionPercentage.toFixed(1)}%`);
  console.log(`Is Completed: ${isCompleted}`);
  
  if (process.env.NODE_ENV === 'development') {
    console.log('Lesson Progress:');
    allLessons.forEach((lesson, idx) => {
      const completed = lesson.progress[0]?.isCompleted;
      console.log(`  ${idx + 1}. ${lesson.title}: ${completed ? '✅' : '❌'}`);
    });
  }
  console.log('================================');

  // 5. Redirect if not completed
  if (!isCompleted) {
    console.log(`⚠️ Course not 100% complete (${completionPercentage.toFixed(1)}%), redirecting...`);
    redirect(`/courses/${slug}/learn`);
  }

  // 6. Get completion date (most recent lesson completion)
  const completionDates = allLessons
    .map(lesson => lesson.progress[0]?.updatedAt)
    .filter((date): date is Date => date !== undefined);

  const completionDate = completionDates.length > 0
    ? new Date(Math.max(...completionDates.map(d => d.getTime())))
    : new Date();

  // 7. Generate certificate data
  const certificateData = {
    studentName: user.name || 'Student',
    courseName: course.title,
    instructorName: course.instructor.name,
    completionDate,
    certificateId: `CERT-${course.id.slice(0, 8).toUpperCase()}-${user.id.slice(0, 8).toUpperCase()}`,
  };

  return <CertificateClient certificate={certificateData} courseSlug={slug} />;
}