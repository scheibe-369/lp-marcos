/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_META_PIXEL_ID: string;
  readonly PUBLIC_GTM_ID: string;
  readonly PUBLIC_GA4_ID: string;
  readonly PUBLIC_CALCOM_LINK: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
