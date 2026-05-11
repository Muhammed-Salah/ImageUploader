"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { uploadImage, logout, getLatestImage } from "@/actions/admin";
import styles from "./admin.module.css";

export default function AdminPage() {
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getLatestImage().then(setCurrentImage);
  }, []);

  async function handleLogout() {
    await logout();
    window.location.href = "/login";
  }

  async function handleUpload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setLoading(true);
    setStatus("Uploading...");

    const formData = new FormData(form);
    try {
      const result = await uploadImage(formData);
      setCurrentImage(result.url || null);
      setStatus("Successfully uploaded! Image replaced.");
      form.reset();
    } catch (err) {
      setStatus("Error: " + (err instanceof Error ? err.message : "Upload failed"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className={styles.main}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>Admin Dashboard</h1>
          <button onClick={handleLogout} className={styles.logoutBtn}>Logout</button>
        </div>

        {currentImage && (
          <div className={styles.previewSection}>
            <p className={styles.previewLabel}>Current Image</p>
            <div className={styles.previewWrapper}>
              <Image 
                src={currentImage} 
                alt="Current display" 
                fill 
                className={styles.previewImage}
              />
            </div>
          </div>
        )}
        
        <form onSubmit={handleUpload} className={styles.form}>
          <div className={styles.uploadBox}>
            <label htmlFor="image">Select image</label>
            <input type="file" id="image" name="image" accept="image/*" required className={styles.fileInput} />
            <p className={styles.hint}>Recommended: High resolution landscape image</p>
          </div>
          
          <button type="submit" disabled={loading} className={styles.button}>
            {loading ? "Processing..." : "Replace Image"}
          </button>
        </form>
        
        {status && <p className={styles.status}>{status}</p>}
      </div>
    </main>
  );
}
