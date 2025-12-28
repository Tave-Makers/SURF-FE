/** @type {import('next').NextConfig} */

const KAKAO_CDN_HOSTS = ['k.kakaocdn.net', 'img1.kakaocdn.net', 't1.kakaocdn.net'];

function hostnameFromUrl(url) {
  if (!url) return null;
  try {
    return new URL(url).hostname;
  } catch {
    if (/^[a-z0-9.-]+$/i.test(url)) return url;
    return null;
  }
}

const S3_HOSTNAME = hostnameFromUrl(process.env.NEXT_PUBLIC_S3_BUCKET_URL);

const nextConfig = {
  experimental: { reactCompiler: true },

  turbopack: {
    rules: {
      '*.svg': { loaders: ['@svgr/webpack'], as: '*.js' },
    },
  },

  images: {
    remotePatterns: [
      ...KAKAO_CDN_HOSTS.map((hostname) => ({
        protocol: 'https',
        hostname,
        pathname: '/**',
      })),

      ...(S3_HOSTNAME
        ? [
            {
              protocol: 'https',
              hostname: S3_HOSTNAME,
              pathname: '/**',
            },
          ]
        : []),
    ],
  },

  webpack(config) {
    const fileLoaderRule = config.module.rules.find((rule) => rule.test?.test?.('.svg'));

    if (!fileLoaderRule) {
      config.module.rules.push({
        test: /\.svg$/i,
        resourceQuery: /url/,
        type: 'asset/resource',
      });

      config.module.rules.push({
        test: /\.svg$/i,
        issuer: /\.[jt]sx?$/,
        resourceQuery: { not: [/url/] },
        use: ['@svgr/webpack'],
      });

      return config;
    }

    fileLoaderRule.exclude = /\.svg$/i;
    return config;
  },
};

export default nextConfig;
