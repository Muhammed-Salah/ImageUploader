"use server";

import { put, del, list } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { verifyPassword, ADMIN_USERNAME } from "@/lib/auth";

export async function getLatestImage() {
  const { blobs } = await list();
  return blobs[0]?.url || null;
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

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_session");
  return { success: true };
}

export async function uploadImage(formData: FormData) {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");
  if (!session) throw new Error("Unauthorized");

  const file = formData.get("image") as File;
  if (!file) throw new Error("No file uploaded");

  // 1. List existing blobs to delete old ones
  const { blobs } = await list();
  for (const blob of blobs) {
    await del(blob.url);
  }

  // 2. Upload new image
  const filename = `upload-${Date.now()}.${file.name.split(".").pop()}`;
  const blob = await put(filename, file, {
    access: "public",
  });

  revalidatePath("/");
  return { success: true, url: blob.url };
}
