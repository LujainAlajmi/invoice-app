import GoogleProvider from "next-auth/providers/google";

import type { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";

import prisma from "./prisma";
import { User } from "@prisma/client";
export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID as string,
      clientSecret: process.env.GOOGLE_SECRET as string,
    }),
  ],
  callbacks: {
    async session({ session }) {
      session.user = (await prisma.user.findUnique({
        where: { email: session.user?.email as string },
      })) as User;

      return session;
    },
  },

  secret: process.env.SECRET as string,
  session: {
    strategy: "jwt",
  },
};
