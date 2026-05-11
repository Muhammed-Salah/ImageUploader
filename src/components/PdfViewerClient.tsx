"use client";

import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

const PdfViewer = dynamic(() => import("./PdfViewer"), { 
  ssr: false,
  loading: () => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: '#000', color: '#fff', gap: '12px', flexDirection: 'column' }}>
      <Loader2 style={{ animation: 'spin 1s linear infinite' }} size={32} />
      <p>Loading Slides...</p>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  )
});

export default function PdfViewerClient({ url }: { url: string }) {
  return <PdfViewer url={url} />;
}
