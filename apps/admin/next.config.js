/** @type {import('next').NextConfig} */

const KAKAO_CDN_HOSTS = [
  "k.kakaocdn.net",
  "img1.kakaocdn.net",
  "t1.kakaocdn.net",
];

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
  transpilePackages: ["@surf/ui"],

  turbopack: {
    rules: {
      "*.svg": { loaders: ["@svgr/webpack"], as: "*.js" },
    },
  },

  images: {
    remotePatterns: [
      ...KAKAO_CDN_HOSTS.map((hostname) => ({
        protocol: "https",
        hostname,
        pathname: "/**",
      })),

      {
        protocol: "https",
        hostname: "tavesurf-prod.s3.ap-northeast-2.amazonaws.com",
        pathname: "/**",
      },

      ...(S3_HOSTNAME
        ? [
            {
              protocol: "https",
              hostname: S3_HOSTNAME,
              pathname: "/**",
            },
          ]
        : []),
    ],
  },

  webpack(config) {
    const fileLoaderRule = config.module.rules.find((rule) =>
      rule.test?.test?.(".svg"),
    );

    // fileLoaderRule이 있을 때
    if (fileLoaderRule) {
      config.module.rules.push(
        // 2-1) *.svg?url 로 import하면 기존 규칙(이미지 경로)을 따름
        {
          ...fileLoaderRule,
          test: /\.svg$/i,
          resourceQuery: /url/,
          type: "asset/resource",
        },

        // 2-2) 나머지 → SVGR 컴포넌트로 처리
        {
          test: /\.svg$/i,
          issuer: fileLoaderRule.issuer,
          resourceQuery: {
            not: [...(fileLoaderRule.resourceQuery?.not || []), /url/],
          },
          use: ["@svgr/webpack"],
        },
      );

      // 기존 규칙에서 SVG를 제외
      fileLoaderRule.exclude = /\.svg$/i;
    } else {
      // 기존 규칙을 못 찾았다면 SVGR만 강제로 추가
      config.module.rules.push({
        test: /\.svg$/i,
        use: ["@svgr/webpack"],
      });
    }
    return config;
  },
};

export default nextConfig;
