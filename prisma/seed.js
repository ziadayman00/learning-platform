// prisma/seed.js
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

  // Upsert Categories (create or update if exists)
  const categoryProgramming = await prisma.category.upsert({
    where: { slug: "programming" },
    update: {},
    create: {
      name: "Programming",
      slug: "programming",
      description: "Master programming languages and development skills",
    },
  });

  const categoryDesign = await prisma.category.upsert({
    where: { slug: "design" },
    update: {},
    create: {
      name: "Design",
      slug: "design",
      description: "Learn design principles and creative tools",
    },
  });

  const categoryMarketing = await prisma.category.upsert({
    where: { slug: "marketing" },
    update: {},
    create: {
      name: "Marketing",
      slug: "marketing",
      description: "Digital marketing and growth strategies",
    },
  });

  const categoryBusiness = await prisma.category.upsert({
    where: { slug: "business" },
    update: {},
    create: {
      name: "Business",
      slug: "business",
      description: "Business strategy and entrepreneurship",
    },
  });

  console.log("✅ Categories created/updated");

  // Upsert Users
  const userZyad = await prisma.user.upsert({
    where: { email: "zyadd.aymann@gmail.com" },
    update: {
      role: "INSTRUCTOR", // Make sure you're an instructor
    },
    create: {
      name: "Zyad Ayman",
      email: "zyadd.aymann@gmail.com",
      emailVerified: true,
      role: "INSTRUCTOR",
    },
  });

  const userAlice = await prisma.user.upsert({
    where: { email: "alice@example.com" },
    update: {},
    create: {
      name: "Alice Johnson",
      email: "alice@example.com",
      emailVerified: true,
      role: "USER",
    },
  });

  const userJohn = await prisma.user.upsert({
    where: { email: "john@example.com" },
    update: {},
    create: {
      name: "John Doe",
      email: "john@example.com",
      emailVerified: true,
      role: "USER",
    },
  });

  const userSarah = await prisma.user.upsert({
    where: { email: "sarah@example.com" },
    update: {},
    create: {
      name: "Sarah Williams",
      email: "sarah@example.com",
      emailVerified: true,
      role: "USER",
    },
  });

  const instructorBob = await prisma.user.upsert({
    where: { email: "bob@example.com" },
    update: {},
    create: {
      name: "Bob Smith",
      email: "bob@example.com",
      emailVerified: true,
      role: "INSTRUCTOR",
    },
  });

  const instructorEmily = await prisma.user.upsert({
    where: { email: "emily@example.com" },
    update: {},
    create: {
      name: "Emily Chen",
      email: "emily@example.com",
      emailVerified: true,
      role: "INSTRUCTOR",
    },
  });

  console.log("✅ Users created/updated");

  // Upsert Courses
  const course1 = await prisma.course.upsert({
    where: { slug: "learn-typescript" },
    update: {
      description: "Complete guide to TypeScript for modern web development. Master type systems, interfaces, generics, and advanced TypeScript patterns. Build type-safe applications with confidence.",
      price: 49.99,
    },
    create: {
      title: "Learn TypeScript",
      slug: "learn-typescript",
      description: "Complete guide to TypeScript for modern web development. Master type systems, interfaces, generics, and advanced TypeScript patterns. Build type-safe applications with confidence.",
      price: 49.99,
      isPublished: true,
      instructorId: instructorBob.id,
      categoryId: categoryProgramming.id,
    },
  });

  const course2 = await prisma.course.upsert({
    where: { slug: "ui-ux-design-basics" },
    update: {
      description: "Introduction to UI/UX design principles. Learn user research, wireframing, prototyping, and creating beautiful user interfaces that convert. Perfect for beginners.",
      price: 39.99,
    },
    create: {
      title: "UI/UX Design Basics",
      slug: "ui-ux-design-basics",
      description: "Introduction to UI/UX design principles. Learn user research, wireframing, prototyping, and creating beautiful user interfaces that convert. Perfect for beginners.",
      price: 39.99,
      isPublished: true,
      instructorId: instructorEmily.id,
      categoryId: categoryDesign.id,
    },
  });

  const course3 = await prisma.course.upsert({
    where: { slug: "nextjs-basics" },
    update: {
      description: "Learn the fundamentals of Next.js, the React framework for production. Cover routing, server components, API routes, and deployment. Build full-stack applications.",
      price: 44.99,
    },
    create: {
      title: "Next.js Basics",
      slug: "nextjs-basics",
      description: "Learn the fundamentals of Next.js, the React framework for production. Cover routing, server components, API routes, and deployment. Build full-stack applications.",
      price: 44.99,
      isPublished: true,
      instructorId: instructorBob.id,
      categoryId: categoryProgramming.id,
    },
  });

  const course4 = await prisma.course.upsert({
    where: { slug: "advanced-react-patterns" },
    update: {},
    create: {
      title: "Advanced React Patterns",
      slug: "advanced-react-patterns",
      description: "Deep dive into advanced React patterns including custom hooks, context patterns, compound components, and performance optimization techniques.",
      price: 59.99,
      isPublished: true,
      instructorId: instructorBob.id,
      categoryId: categoryProgramming.id,
    },
  });

  const course5 = await prisma.course.upsert({
    where: { slug: "digital-marketing-masterclass" },
    update: {},
    create: {
      title: "Digital Marketing Masterclass",
      slug: "digital-marketing-masterclass",
      description: "Complete digital marketing course covering SEO, social media marketing, email campaigns, analytics, and conversion optimization strategies.",
      price: 54.99,
      isPublished: true,
      instructorId: instructorEmily.id,
      categoryId: categoryMarketing.id,
    },
  });

  const course6 = await prisma.course.upsert({
    where: { slug: "figma-for-beginners" },
    update: {},
    create: {
      title: "Figma for Beginners",
      slug: "figma-for-beginners",
      description: "Master Figma from scratch. Learn design systems, prototyping, collaboration, and creating production-ready designs for web and mobile.",
      price: 34.99,
      isPublished: true,
      instructorId: instructorEmily.id,
      categoryId: categoryDesign.id,
    },
  });

  // Add courses for Zyad (your account)
  const courseZyad1 = await prisma.course.upsert({
    where: { slug: "fullstack-web-development" },
    update: {},
    create: {
      title: "Full-Stack Web Development",
      slug: "fullstack-web-development",
      description: "Comprehensive guide to building modern full-stack applications with Next.js, React, TypeScript, and Prisma. Learn best practices and deploy production-ready apps.",
      price: 79.99,
      isPublished: true,
      instructorId: userZyad.id,
      categoryId: categoryProgramming.id,
    },
  });

  const courseZyad2 = await prisma.course.upsert({
    where: { slug: "modern-authentication-systems" },
    update: {},
    create: {
      title: "Modern Authentication Systems",
      slug: "modern-authentication-systems",
      description: "Master authentication and authorization in modern web applications. Implement secure login systems, OAuth, JWT, and session management.",
      price: 64.99,
      isPublished: true,
      instructorId: userZyad.id,
      categoryId: categoryProgramming.id,
    },
  });

  const courseZyad3 = await prisma.course.upsert({
    where: { slug: "building-saas-applications" },
    update: {},
    create: {
      title: "Building SaaS Applications",
      slug: "building-saas-applications",
      description: "Learn how to build and launch your own Software as a Service application. Cover subscription management, payments, multi-tenancy, and scaling.",
      price: 99.99,
      isPublished: false, // Draft course
      instructorId: userZyad.id,
      categoryId: categoryBusiness.id,
    },
  });

  console.log("✅ Courses created/updated");

  // Create Purchases (skip if already exists)
  const purchases = [
    // Zyad's purchases (courses you're learning)
    { userId: userZyad.id, courseId: course1.id, amount: 49.99 },
    { userId: userZyad.id, courseId: course2.id, amount: 39.99 },
    { userId: userZyad.id, courseId: course4.id, amount: 59.99 },
    
    // Other users purchases
    { userId: userAlice.id, courseId: course1.id, amount: 49.99 },
    { userId: userAlice.id, courseId: course2.id, amount: 39.99 },
    { userId: userAlice.id, courseId: courseZyad1.id, amount: 79.99 },
    { userId: userJohn.id, courseId: course1.id, amount: 49.99 },
    { userId: userJohn.id, courseId: course3.id, amount: 44.99 },
    { userId: userJohn.id, courseId: courseZyad1.id, amount: 79.99 },
    { userId: userJohn.id, courseId: courseZyad2.id, amount: 64.99 },
    { userId: userSarah.id, courseId: course2.id, amount: 39.99 },
    { userId: userSarah.id, courseId: courseZyad1.id, amount: 79.99 },
  ];

  for (const purchase of purchases) {
    await prisma.purchase.upsert({
      where: {
        userId_courseId: {
          userId: purchase.userId,
          courseId: purchase.courseId,
        },
      },
      update: {},
      create: {
        ...purchase,
        paymentStatus: "COMPLETED",
      },
    });
  }

  console.log("✅ Purchases created/updated");

  // Create Reviews (skip if already exists)
  const reviews = [
    // Reviews for Zyad's courses
    {
      userId: userAlice.id,
      courseId: courseZyad1.id,
      rating: 5,
      comment: "Outstanding course! Zyad explains everything clearly and the projects are real-world applicable. Best full-stack course I've taken!",
    },
    {
      userId: userJohn.id,
      courseId: courseZyad1.id,
      rating: 5,
      comment: "Incredible depth and quality. The instructor really knows his stuff. I built a complete SaaS app following this course!",
    },
    {
      userId: userSarah.id,
      courseId: courseZyad1.id,
      rating: 4,
      comment: "Very comprehensive and well-structured. Great for intermediate developers looking to level up their skills.",
    },
    {
      userId: userJohn.id,
      courseId: courseZyad2.id,
      rating: 5,
      comment: "Finally understand authentication properly! The security best practices section was invaluable.",
    },
    
    // Reviews for other courses
    {
      userId: userZyad.id,
      courseId: course1.id,
      rating: 5,
      comment: "Excellent TypeScript course! Clear explanations and great examples. Highly recommended for anyone learning TypeScript.",
    },
    {
      userId: userZyad.id,
      courseId: course2.id,
      rating: 4,
      comment: "Great introduction to UI/UX design. Learned a lot about design principles and user research.",
    },
    {
      userId: userAlice.id,
      courseId: course1.id,
      rating: 5,
      comment: "Excellent course! The explanations are clear and the examples are practical. I learned so much about TypeScript and can now use it confidently in my projects.",
    },
    {
      userId: userJohn.id,
      courseId: course1.id,
      rating: 4,
      comment: "Great content and well-structured. The instructor explains complex concepts in a simple way. Would recommend to anyone learning TypeScript.",
    },
    {
      userId: userAlice.id,
      courseId: course2.id,
      rating: 5,
      comment: "Amazing design course! Learned the fundamentals of UI/UX and created my first portfolio project. The instructor is very knowledgeable.",
    },
    {
      userId: userSarah.id,
      courseId: course2.id,
      rating: 5,
      comment: "Perfect for beginners! The course covers everything you need to know about UI/UX design. Highly recommended!",
    },
    {
      userId: userJohn.id,
      courseId: course3.id,
      rating: 5,
      comment: "Best Next.js course I've taken. Covers all the essentials and goes into depth on important topics. Built a full application by the end!",
    },
  ];

  for (const review of reviews) {
    await prisma.review.upsert({
      where: {
        userId_courseId: {
          userId: review.userId,
          courseId: review.courseId,
        },
      },
      update: {},
      create: review,
    });
  }

  console.log("✅ Reviews created/updated");

  console.log("\n🎉 Database seeded successfully!");
  console.log("📚 Total courses:", await prisma.course.count());
  console.log("👥 Total users:", await prisma.user.count());
  console.log("🛒 Total purchases:", await prisma.purchase.count());
  console.log("⭐ Total reviews:", await prisma.review.count());
  
  console.log("\n👨‍💼 Your Account (Zyad):");
  console.log("- Role: INSTRUCTOR");
  console.log("- Courses Created: 3 (2 published, 1 draft)");
  console.log("- Courses Purchased: 3");
  console.log("- Students Enrolled in Your Courses: 5");
  console.log("- Total Revenue: $", (79.99 * 3 + 64.99 * 1).toFixed(2));
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });