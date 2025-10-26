import NextAuth from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import bcrypt from 'bcryptjs'
import type { JWT } from 'next-auth/jwt'
import { db } from './db'

type ExtendedToken = JWT & {
  id?: string
  role?: string | null
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/auth/login',
    signOut: '/auth/logout',
    error: '/auth/error',
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Invalid credentials')
        }

        const user = await db.user.findUnique({
          where: {
            email: credentials.email as string,
          },
        })

        if (!user || !user.password) {
          throw new Error('User not found')
        }

        const isValid = await bcrypt.compare(credentials.password as string, user.password)

        if (!isValid) {
          throw new Error('Invalid password')
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      const extendedToken = token as ExtendedToken

      if (user) {
        extendedToken.id = user.id
        extendedToken.role = 'role' in user ? (user as { role?: string | null }).role ?? null : null
      }

      return extendedToken
    },
    async session({ session, token }) {
      const extendedToken = token as ExtendedToken

      if (session.user) {
        const sessionUser = session.user as typeof session.user & { id?: string; role?: string | null }
        sessionUser.id = extendedToken.id ?? ''
        sessionUser.role = extendedToken.role ?? null
      }

      return session
    },
  },
})

