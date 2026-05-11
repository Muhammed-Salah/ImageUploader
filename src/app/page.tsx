import Image from "next/image";
import { list } from "@vercel/blob";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

export default async function Home() {
  // 1. Fetch the latest blob and find the original high-quality image
  const { blobs } = await list();
  const latestImage = blobs.find(b => b.pathname.startsWith("original-")) || blobs[0];

  if (!latestImage) {
    return (
      <main className={styles.main}>
        <div className={styles.empty}>
          <p>No Image Available To Display</p>
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
          sizes="100vw"
          className={styles.image}
        />
      </div>
    </main>
  );
}
