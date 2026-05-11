"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { upload } from "@vercel/blob/client";
import { logout, getLatestImage, cleanupOldBlobs } from "@/actions/admin";
import styles from "./admin.module.css";
import { FileText } from "lucide-react";

export default function AdminPage() {
  const [currentFile, setCurrentFile] = useState<string | null>(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [isPdf, setIsPdf] = useState(false);

  useEffect(() => {
    getLatestImage().then(url => {
      setCurrentFile(url);
      setIsPdf(url?.toLowerCase().endsWith(".pdf") || false);
    });
  }, []);

  async function handleLogout() {
    await logout();
    window.location.href = "/login";
  }

  async function handleUpload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fileInput = form.querySelector('input[type="file"]') as HTMLInputElement;
    const file = fileInput.files?.[0];

    if (!file) {
      setStatus("Please select a file first.");
      return;
    }

    setLoading(true);
    setStatus("Uploading...");

    try {
      const timestamp = Date.now();
      const ext = file.name.split(".").pop() || "bin";
      const blob = await upload(`original-${timestamp}.${ext}`, file, {
        access: "public",
        handleUploadUrl: "/api/upload",
      });

      // Cleanup old files and revalidate
      await cleanupOldBlobs(blob.url);
      
      setCurrentFile(blob.url);
      setIsPdf(blob.url.toLowerCase().endsWith(".pdf"));
      setStatus("Successfully uploaded!");
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

        {currentFile && (
          <div className={styles.previewSection}>
            <p className={styles.previewLabel}>Current File</p>
            <div className={styles.previewWrapper}>
              {isPdf ? (
                <div className={styles.pdfPlaceholder}>
                  <FileText size={48} />
                  <span>PDF Document</span>
                  <a href={currentFile} target="_blank" rel="noopener noreferrer" className={styles.viewLink}>View PDF</a>
                </div>
              ) : (
                <Image 
                  src={currentFile} 
                  alt="Current display" 
                  fill 
                  priority
                  sizes="(max-width: 768px) 100vw, 400px"
                  className={styles.previewImage}
                />
              )}
            </div>
          </div>
        )}
        
        <form onSubmit={handleUpload} className={styles.form}>
          <div className={styles.uploadBox}>
            <label htmlFor="image">Select image or PDF</label>
            <input type="file" id="image" name="image" accept="image/*,application/pdf" required className={styles.fileInput} />
            <p className={styles.hint}>Images or PDF (Slides) supported. Max size: 50MB.</p>
          </div>
          
          <button type="submit" disabled={loading} className={styles.button}>
            {loading ? "Uploading..." : "Upload File"}
          </button>
        </form>
        
        {status && <p className={styles.status}>{status}</p>}
      </div>
    </main>
  );
}
