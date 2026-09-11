import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";

const ADMIN_GITHUB_LOGIN = process.env.ADMIN_GITHUB_LOGIN;

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [GitHub],
  pages: {
    signIn: "/admin/login",
    error: "/admin/login",
  },
  callbacks: {
    async signIn({ profile }) {
      if (!ADMIN_GITHUB_LOGIN) return false;
      const login = (profile as { login?: string } | undefined)?.login;
      return login === ADMIN_GITHUB_LOGIN;
    },
    async jwt({ token, profile }) {
      if (profile) {
        token.login = (profile as { login?: string }).login;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.login = token.login as string | undefined;
      }
      return session;
    },
  },
});
