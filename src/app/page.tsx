import Image from "next/image";
import { getLatestImage } from "@/actions/admin";
import styles from "./page.module.css";
import PdfViewerClient from "@/components/PdfViewerClient";

export const dynamic = "force-dynamic";

export default async function Home() {
  const latestUrl = await getLatestImage();

  if (!latestUrl) {
    return (
      <main className={styles.main}>
        <div className={styles.empty}>
          <p>No Content Available To Display</p>
          <a href="/login" className={styles.loginLink}>Admin Login</a>
        </div>
      </main>
    );
  }

  const isPdf = latestUrl.toLowerCase().endsWith(".pdf");

  return (
    <main className={styles.main}>
      {isPdf ? (
        <PdfViewerClient url={latestUrl} />
      ) : (
        <div className={styles.imageContainer}>
          <Image
            src={latestUrl}
            alt="Showcase Image"
            fill
            priority
            sizes="100vw"
            className={styles.image}
          />
        </div>
      )}
    </main>
  );
}
