"use server";

import { redirect } from "next/navigation";
import { authenticateUser, createSessionCookie, clearSessionCookie } from "@/lib/auth";

export async function loginAction(prevState: any, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Please enter both email and password." };
  }

  const user = await authenticateUser(email, password);
  if (!user) {
    return { error: "Invalid email or password." };
  }

  await createSessionCookie(user);
  redirect("/dashboard");
}

export async function logoutAction() {
  await clearSessionCookie();
  redirect("/login");
}
