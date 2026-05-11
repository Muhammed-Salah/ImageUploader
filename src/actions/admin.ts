"use server";

import { put, del, list } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { verifyPassword, ADMIN_USERNAME } from "@/lib/auth";
import sharp from "sharp";

export async function getLatestImage() {
  const { blobs } = await list();
  // Return the original image (prefixed with original-)
  const original = blobs.find(b => b.pathname.startsWith("original-"));
  return original?.url || blobs[0]?.url || null;
}

export async function getLatestThumbnail() {
  const { blobs } = await list();
  const thumb = blobs.find(b => b.pathname.startsWith("thumb-"));
  return thumb?.url || null;
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

  // 1. Prepare buffers
  const buffer = Buffer.from(await file.arrayBuffer());
  
  // 2. Generate Thumbnail (Max 1200x630, maintaining aspect ratio without padding)
  const thumbnailBuffer = await sharp(buffer)
    .resize(1200, 630, {
      fit: 'inside',
      withoutEnlargement: true
    })
    .jpeg({ quality: 80 })
    .toBuffer();

  // 3. Delete existing blobs in parallel
  const { blobs } = await list();
  if (blobs.length > 0) {
    await Promise.all(blobs.map(blob => del(blob.url)));
  }

  // 4. Upload new image and thumbnail in parallel
  const timestamp = Date.now();
  const ext = file.name.split(".").pop() || "jpg";
  
  const originalName = `original-${timestamp}.${ext}`;
  const thumbName = `thumb-${timestamp}.jpg`;

  // Start both uploads simultaneously
  const [originalBlob] = await Promise.all([
    put(originalName, file, { access: "public" }),
    put(thumbName, thumbnailBuffer, {
      access: "public",
      contentType: "image/jpeg",
    })
  ]);

  revalidatePath("/");
  return { success: true, url: originalBlob.url };
}
