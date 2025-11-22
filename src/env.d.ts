/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  readonly VITE_GOOGLE_PLACES_API_KEY: string;
  readonly VITE_GEMINI_API_KEY: string;
  readonly VITE_STRIPE_SECRET_KEY: string;
  readonly VITE_STRIPE_PUBLISHABLE_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Type declarations for image imports
declare module "*.png" {
  const src: string;
  export default src;
}

declare module "*.jpg" {
  const src: string;
  export default src;
}

declare module "*.jpeg" {
  const src: string;
  export default src;
}

declare module "*.svg" {
  const src: string;
  export default src;
}

// Ensure Vite client types are properly extended
declare module "vite/client" {
  interface StaticImageData {
    src: string;
    height: number;
    width: number;
    blurDataURL?: string;
  }
}
