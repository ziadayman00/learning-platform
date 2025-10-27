// types/better-auth.d.ts
import type { Role } from "@prisma/client";

declare module "better-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      emailVerified: boolean;
      image?: string | null;
      role: Role;
      createdAt: Date;
      updatedAt: Date;
    };
  }

  interface User {
    id: string;
    name: string;
    email: string;
    emailVerified: boolean;
    image?: string | null;
    role: Role;
    createdAt: Date;
    updatedAt: Date;
  }
}