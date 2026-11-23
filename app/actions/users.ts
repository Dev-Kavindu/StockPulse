"use server";
import { Pool } from "pg";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export async function getUsers() {
  const session = await getSession();
  if (!session || session.role !== "admin") throw new Error("Unauthorized");
  const res = await pool.query("SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC");
  return res.rows;
}

export async function updateUserRole(formData: FormData) {
  const session = await getSession();
  if (!session || session.role !== "admin") throw new Error("Unauthorized");
  
  const userId = formData.get("userId") as string;
  const role = formData.get("role") as "admin" | "user";

  if (userId === session.userId) throw new Error("Cannot modify your own role");
  await pool.query("UPDATE users SET role = $1 WHERE id = $2", [role, userId]);
  revalidatePath("/users");
}

export async function deleteUser(formData: FormData) {
  const session = await getSession();
  if (!session || session.role !== "admin") throw new Error("Unauthorized");
  
  const userId = formData.get("userId") as string;

  if (userId === session.userId) throw new Error("Cannot delete yourself");
  await pool.query("DELETE FROM users WHERE id = $1", [userId]);
  revalidatePath("/users");
}