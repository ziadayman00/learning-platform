// app/dashboard/page.tsx
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import DashboardClient from './DashboardClient';
import prisma from '@/lib/prisma';

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect('/signin');
  }

  const user = session.user;

  // Fetch user's purchased courses
  const purchases = await prisma.purchase.findMany({
    where: {
      userId: user.id,
      paymentStatus: 'COMPLETED',
    },
    include: {
      course: {
        include: {
          instructor: {
            select: {
              name: true,
              image: true,
            },
          },
          category: {
            select: {
              name: true,
            },
          },
          _count: {
            select: {
              reviews: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  // If user is an instructor, fetch their courses
  let instructorCourses = [];
  if (user.role === 'INSTRUCTOR' || user.role === 'ADMIN') {
    instructorCourses = await prisma.course.findMany({
      where: {
        instructorId: user.id,
      },
      include: {
        category: {
          select: {
            name: true,
          },
        },
        _count: {
          select: {
            purchases: true,
            reviews: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  // Calculate instructor stats
  const instructorStats = user.role === 'INSTRUCTOR' || user.role === 'ADMIN' ? {
    totalCourses: instructorCourses.length,
    publishedCourses: instructorCourses.filter(c => c.isPublished).length,
    totalStudents: instructorCourses.reduce((sum, course) => sum + course._count.purchases, 0),
    totalRevenue: instructorCourses.reduce((sum, course) => sum + (course.price * course._count.purchases), 0),
  } : null;

  return (
    <DashboardClient
      user={{
        id: user.id,
        name: user.name || '',
        email: user.email || '',
        image: user.image || null,
        role: user.role,
      }}
      purchases={purchases}
      instructorCourses={instructorCourses}
      instructorStats={instructorStats}
    />
  );
}