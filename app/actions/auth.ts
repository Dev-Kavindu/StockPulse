"use server";

import { redirect } from "next/navigation";
import { authenticateUser, registerUser, checkEmailExists, createSessionCookie, clearSessionCookie } from "@/lib/auth";

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

export async function registerAction(prevState: any, formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!name || !email || !password) {
    return { error: "Please fill in all fields." };
  }

  if (password.length < 6) {
    return { error: "Password must be at least 6 characters long." };
  }

  const exists = await checkEmailExists(email);
  if (exists) {
    return { error: "Email already registered." };
  }

  const user = await registerUser(name, email, password);
  await createSessionCookie(user);
  redirect("/dashboard");
}

export async function logoutAction() {
  await clearSessionCookie();
  redirect("/login");
}
