import type { Metadata } from 'next';
import { ASSET_VERSION } from './assetVersion';

const title = 'SURF';
const description = '당신의 더 나은 동아리 생활을 함께 SURF!';

const defaultURL = process.env.NEXT_PUBLIC_APP_URL;
const metadataBase = defaultURL ? new URL(defaultURL) : undefined;

const images = [
  {
    url: `icons/og-image.png?v=${ASSET_VERSION}`,
    width: 800,
    height: 400,
    alt: 'SURF 대표 이미지',
  },
];

export const DEFAULT_METADATA: Metadata = {
  ...(metadataBase ? { metadataBase } : {}),

  /* =========================
   * 기본 SEO
   * ========================= */
  title,
  description,

  /* =========================
   * Favicon / App Icon
   * ========================= */
  icons: {
    icon: [
      { url: `/icons/favicon.ico?v=${ASSET_VERSION}` },
      { url: `/icons/favicon-16x16.png?v=${ASSET_VERSION}`, sizes: '16x16', type: 'image/png' },
      {
        url: `/icons/favicon-32x32.png?v=${ASSET_VERSION}`,
        sizes: '32x32',
        type: 'image/png',
      },
      {
        url: `/icons/favicon-96x96.png?v=${ASSET_VERSION}`,
        sizes: '96x96',
        type: 'image/png',
      },
    ],
    apple: [
      {
        url: `/icons/apple-icon-180x180.png?v=${ASSET_VERSION}`,
        sizes: '180x180',
      },
    ],
  },

  manifest: `/icons/manifest.json?v=${ASSET_VERSION}`,

  /* =========================
   * Open Graph (SNS)
   * ========================= */
  openGraph: {
    type: 'website',
    title,
    description,
    url: defaultURL,
    images,
  },

  /* =========================
   * Twitter
   * ========================= */
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images,
  },
};
