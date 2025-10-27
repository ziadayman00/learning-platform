import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const categoryProgramming = await prisma.category.create({
    data: {
      name: "Programming",
      slug: "programming",
      description: "Courses related to programming",
    },
  });

  const categoryDesign = await prisma.category.create({
    data: {
      name: "Design",
      slug: "design",
      description: "Courses related to design",
    },
  });

  const userAlice = await prisma.user.create({
    data: {
      name: "Alice",
      email: "alice@example.com",
      emailVerified: true,
      role: "USER",
    },
  });

  const instructorBob = await prisma.user.create({
    data: {
      name: "Bob",
      email: "Bob@example.com",
      emailVerified: true,
      role: "INSTRUCTOR",
    },
  });

  const course1 = await prisma.course.create({
    data: {
      title: "Learn TypeScript",
      slug: "learn-typescript",
      description: "Complete guide to TypeScript",
      price: 50,
      isPublished: true,
      instructorId: instructorBob.id,
      categoryId: categoryProgramming.id,
    },
  });

  const course2 = await prisma.course.create({
    data: {
      title: "UI/UX Design Basics",
      slug: "ui-ux-design-basics",
      description: "Introduction to UI/UX design",
      price: 40,
      isPublished: true,
      instructorId: instructorBob.id,
      categoryId: categoryDesign.id,
    },
  });

  const course3 = await prisma.course.create({
    data: {
      title: "Next.js Basics",
      slug: "nextjs-basics",
      description: "Introduction to Next.js",
      price: 40,
      isPublished: true,
      instructorId: instructorBob.id,
      categoryId: categoryProgramming.id,
    },
  });

  await prisma.purchase.create({
    data: {
      userId: userAlice.id,
      courseId: course1.id,
      amount: 50,
      paymentStatus: "COMPLETED",
    },
  });

  console.log("Seeding finished.");
}

main()
  .catch((e) => console.errldor(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
