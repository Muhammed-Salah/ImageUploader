import Image from "next/image";
import { list } from "@vercel/blob";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

export default async function Home() {
  // 1. Fetch the latest blob
  const { blobs } = await list();
  const latestImage = blobs[0]; // Since we delete old ones, there should be only one

  if (!latestImage) {
    return (
      <main className={styles.main}>
        <div className={styles.empty}>
          <p>No image uploaded yet.</p>
          <a href="/login" className={styles.loginLink}>Admin Login</a>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.main}>
      <div className={styles.imageContainer}>
        <Image
          src={latestImage.url}
          alt="Showcase Image"
          fill
          priority
          className={styles.image}
        />
      </div>
    </main>
  );
}
