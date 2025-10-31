import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
  // Check if we're using Accelerate URL (starts with prisma://)
  const databaseUrl = process.env.DATABASE_URL || ''
  
  if (databaseUrl.startsWith('prisma://')) {
    // Using Accelerate - no adapter needed
    return new PrismaClient()
  } else {
    // Using direct connection - works locally and on Vercel
    return new PrismaClient()
  }
}

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>
}

const prisma = globalThis.prisma ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma

export default prisma