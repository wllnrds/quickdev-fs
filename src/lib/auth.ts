import NextAuth from "next-auth"
import Credential from "next-auth/providers/credentials"

import User from "@/controller/user";
 
export const { handlers, signIn, signOut, auth } = NextAuth({
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
  ]
})