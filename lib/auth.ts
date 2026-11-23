import fs from "fs";
import path from "path";
import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

export interface UserPayload {
  userId: string;
  email: string;
  name: string;
  role: "admin" | "user";
}

export interface UserRecord extends UserPayload {
  password?: string;
}

const JWT_SECRET_ENV = process.env.JWT_SECRET;
if (!JWT_SECRET_ENV) {
  throw new Error("JWT_SECRET environment variable is missing.");
}

const secretKey = new TextEncoder().encode(JWT_SECRET_ENV);
const COOKIE_NAME = "session";

/**
 * Signs a JWT token with user payload.
 */
export async function signToken(payload: UserPayload): Promise<string> {
  const token = await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secretKey);
  return token;
}

/**
 * Verifies a JWT token and returns the payload if valid, or null otherwise.
 */
export async function verifyToken(token: string): Promise<UserPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey, {
      algorithms: ["HS256"],
    });
    return {
      userId: payload.userId as string,
      email: payload.email as string,
      name: payload.name as string,
      role: payload.role as "admin" | "user",
    };
  } catch {
    return null;
  }
}

/**
 * Reads and verifies the HTTP-only cookie session.
 */
export async function getSession(): Promise<UserPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return await verifyToken(token);
}

/**
 * Creates and sets the session cookie.
 */
export async function createSessionCookie(payload: UserPayload): Promise<void> {
  const token = await signToken(payload);
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

/**
 * Clears the session cookie.
 */
export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

/**
 * Authenticates user against data/users.json using bcryptjs.
 */
export async function authenticateUser(
  email: string,
  pass: string
): Promise<UserPayload | null> {
  try {
    const filePath = path.join(process.cwd(), "data", "users.json");
    if (!fs.existsSync(filePath)) {
      return null;
    }
    const fileData = fs.readFileSync(filePath, "utf8");
    const users: UserRecord[] = JSON.parse(fileData);

    const user = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );
    if (!user || !user.password) {
      return null;
    }

    const isValid = await bcrypt.compare(pass, user.password);
    if (!isValid) {
      return null;
    }

    return {
      userId: user.userId,
      email: user.email,
      name: user.name,
      role: user.role,
    };
  } catch (error) {
    console.error("authenticateUser error:", error);
    return null;
  }
}
