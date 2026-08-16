"use server";

import { auth, signIn, signOut } from "@/auth";
import { db } from "@/lib/db";
import { cookies } from "next/headers";


export const getUserById = async (id:string)=>{
    try {
        const user = await db.user.findUnique({
            where:{id},
            include:{accounts:true}
        })
        return user
    } catch (error) {
        console.log(error)
        return null
    }
}

export const getAccountByUserId = async (userId:string)=>{
    try {
        const account = await db.account.findFirst({
            where:{
                userId
            }
        })
        return account
    } catch (error) {
        console.log(error)
        return null
    }
}

export const currentUser = async()=>{
    const user = await auth()
    return user?.user;
}

export const signInWithGoogle = async () => {
  await signIn("google", { redirectTo: "/dashboard" });
};

export const signInWithGithub = async () => {
  await signIn("github", { redirectTo: "/dashboard" });
};

export const logout = async () => {
  try {
    const cookieStore = await cookies();
    const allCookies = cookieStore.getAll();
    for (const cookie of allCookies) {
      if (
        cookie.name.includes("session-token") ||
        cookie.name.includes("csrf-token") ||
        cookie.name.includes("callback-url") ||
        cookie.name.includes("authjs") ||
        cookie.name.includes("next-auth")
      ) {
        cookieStore.delete(cookie.name);
      }
    }
  } catch (error) {
    console.error("Error clearing cookies in logout action:", error);
  }

  await signOut({ redirectTo: "/" });
};
