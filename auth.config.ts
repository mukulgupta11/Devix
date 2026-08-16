import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"
import type { NextAuthConfig } from "next-auth"

export default{
    // Netlify terminates HTTPS before forwarding requests to Next.js.
    // Auth.js must trust those forwarded host/protocol headers for redirects.
    trustHost: true,
    secret: process.env.AUTH_SECRET,
    providers:[
        GitHub({
            clientId:process.env.AUTH_GITHUB_ID,
            clientSecret:process.env.AUTH_GITHUB_SECRET
        }),
        Google({
            clientId:process.env.AUTH_GOOGLE_ID,
            clientSecret:process.env.AUTH_GOOGLE_SECRET,
        })
    ]
} satisfies NextAuthConfig
