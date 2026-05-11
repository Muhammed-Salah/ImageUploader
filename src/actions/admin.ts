"use server";

import { put, del, list } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { verifyPassword, ADMIN_USERNAME } from "@/lib/auth";
import sharp from "sharp";

export async function getLatestImage() {
  const { blobs } = await list();
  // Find the original file (prefixed with original-)
  const original = blobs.find(b => b.pathname.startsWith("original-"));
  return original?.url || blobs[0]?.url || null;
}

export async function login(formData: FormData) {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  if (username === ADMIN_USERNAME && verifyPassword(password)) {
    const cookieStore = await cookies();
    cookieStore.set("admin_session", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 1 day
      path: "/",
    });
    return { success: true };
  }

  return { success: false, error: "Invalid credentials" };
}

export async function cleanupOldBlobs(keepUrl?: string) {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");
  if (!session) throw new Error("Unauthorized");

  const { blobs } = await list();
  if (blobs.length > 0) {
    // Delete all blobs except the one we just uploaded (if keepUrl provided)
    const toDelete = keepUrl 
      ? blobs.filter(b => b.url !== keepUrl)
      : blobs;
    
    if (toDelete.length > 0) {
      await Promise.all(toDelete.map(blob => del(blob.url)));
    }
  }
  revalidatePath("/");
  return { success: true };
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_session");
  return { success: true };
}
