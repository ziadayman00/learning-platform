// app/dashboard/page.tsx
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import prisma from '@/lib/prisma';
import DashboardClient from './DashboardClient';

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
          sections: {
            include: {
              lessons: {
                select: {
                  id: true,
                },
              },
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

  const purchasesWithProgress = await Promise.all(
    purchases.map(async (purchase) => {
      const totalLessons = purchase.course.sections.reduce(
        (sum: number, section) => sum + section.lessons.length,
        0
      );

      const completedLessons = await prisma.lessonProgress.count({
        where: {
          userId: user.id,
          isCompleted: true,
          lesson: {
            section: {
              courseId: purchase.course.id,
            },
          },
        },
      });

      return {
        id: purchase.id,
        createdAt: purchase.createdAt,
        course: {
          id: purchase.course.id,
          title: purchase.course.title,
          slug: purchase.course.slug,
          description: purchase.course.description,
          thumbnail: purchase.course.thumbnail,
          instructor: purchase.course.instructor,
          category: purchase.course.category,
          _count: {
            reviews: purchase.course._count.reviews,
            lessons: totalLessons,
          },
        },
        completedLessons,
      };
    })
  );

  // ✅ Define a custom type for instructorCourses (because it's not a plain Prisma Course)
  type InstructorCourse = Awaited<ReturnType<typeof prisma.course.findFirst>> & {
    _count: {
      purchases: number;
      reviews: number;
    };
    category: {
      name: string;
    } | null;
  };

  let instructorCourses: InstructorCourse[] = [];
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

  const instructorStats =
    user.role === 'INSTRUCTOR' || user.role === 'ADMIN'
      ? {
          totalCourses: instructorCourses.length,
          publishedCourses: instructorCourses.filter(
            (c) => c.isPublished
          ).length,
          totalStudents: instructorCourses.reduce(
            (sum: number, course) => sum + course._count.purchases,
            0
          ),
          totalRevenue: instructorCourses.reduce(
            (sum: number, course) => sum + course.price * course._count.purchases,
            0
          ),
        }
      : null;

  return (
    <DashboardClient
      user={{
        id: user.id,
        name: user.name || '',
        email: user.email || '',
        image: user.image || null,
        role: user.role || 'user',
      }}
      purchases={purchasesWithProgress}
      instructorCourses={instructorCourses}
      instructorStats={instructorStats}
    />
  );
}
