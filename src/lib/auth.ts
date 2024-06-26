import NextAuth from "next-auth"
import Credential from "next-auth/providers/credentials"

import User from "@/controller/user";
 
export const { handlers, signIn, signOut, auth } = NextAuth({
  pages:{
    signIn: '/auth/login',
  },
  providers: [
    Credential({
        credentials: {
            email: {},
            password: {}
        },
        authorize: async ( credentials ) => {
            let user = await User.login({ 
              email: credentials?.email,
              password: credentials?.password
            })

            if( user?.error ){
              throw new Error( user.error )
            }

            return user;
        }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },
  callbacks:{
    async jwt({ token, user, trigger, session } ){
      if( user ){
        token.id = user.id
        token.name = user.name
      }

      if( trigger === 'update' && session ){
        token.name = session.name
        token.id = session.id
      }

      return token;
    },
    async session({ session, token }){
      session.user.name = token.name
      session.user.id = `${ token.id }`

      return session
    }
  }
})