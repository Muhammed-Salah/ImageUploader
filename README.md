# Image Uploader & Showcase

A minimal, secure Next.js application to manage and display a full-screen image.

## Features
- **Full-Screen Display**: The root page (`/`) shows the latest uploaded image.
- **Admin Dashboard**: Secure `/admin` route for replacing the image.
- **Vercel Blob Integration**: High-performance image storage and delivery.
- **Automatic Cleanup**: Old images are deleted automatically upon new uploads.
- **Minimalist UI**: Modern, monochromatic design.

## Setup
1. Enable **Vercel Blob** in your Vercel project.
2. Pull environment variables: `npx vercel env pull .env.local`
3. Install dependencies: `npm install`
4. Run locally: `npm run dev`

## Deployment
Push to the `main` branch to trigger a Vercel deployment.
