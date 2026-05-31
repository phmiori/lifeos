import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      try {
        const res = await fetch(`${process.env.BACKEND_URL}/api/auth/sync`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            google_id: user.id,
            email: user.email,
            name: user.name,
            avatar_url: user.image,
          }),
        })
        const data = await res.json()
        if (data.success) {
           user.role = data.data?.role ?? 'user'
           user.dbId = data.data?.id
        }
      } catch (err) {
        console.error('Error syncing with backend', err)
      }
      return true
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.dbId = user.dbId
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string
        session.user.dbId = token.dbId as string
      }
      return session
    },
  },
  pages: {
    signIn: '/login',
  },
})

export const { GET, POST } = handlers
