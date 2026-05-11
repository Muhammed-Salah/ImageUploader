import Image from "next/image";
import styles from "./page.module.css";

export default function DisplayPage() {
  // The filename is mentioned here as requested
  const imageName = "VijayaTheeram.png";

  return (
    <main className={styles.main}>
      <div className={styles.imageContainer}>
        <Image
          src={`/${imageName}`}
          alt="Showcase Image"
          fill
          priority
          className={styles.image}
        />
      </div>
    </main>
  );
}
