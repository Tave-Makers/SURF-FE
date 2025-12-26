/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    reactCompiler: true
  },

  turbopack: {
    // Turbopack 전용 설정
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },

images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'k.kakaocdn.net',
      pathname: '/**',
    },
    {
      protocol: 'http',
      hostname: 'k.kakaocdn.net',
      pathname: '/**',
    },
    {
      protocol: 'https',
      hostname: 'img1.kakaocdn.net',
      pathname: '/**',
    },
    {
      protocol: 'http',
      hostname: 'img1.kakaocdn.net',
      pathname: '/**',
    },
    {
      protocol: 'https',
      hostname: 't1.kakaocdn.net',
      pathname: '/**',
    },
    {
      protocol: 'http',
      hostname: 't1.kakaocdn.net',
      pathname: '/**',
    },
  ],
},


  webpack(config) {
    const fileLoaderRule = config.module.rules.find(
      (rule) => rule.test?.test?.('.svg')
    );
    
    // fileLoaderRule이 있을 때
    if (fileLoaderRule) {
      config.module.rules.push(
        // 2-1) *.svg?url 로 import하면 기존 규칙(이미지 경로)을 따름
        {
          ...fileLoaderRule,
          test: /\.svg$/i,
          resourceQuery: /url/,
          type: 'asset/resource',
        },
        
        // 2-2) 나머지 → SVGR 컴포넌트로 처리
        {
          test: /\.svg$/i,
          issuer: fileLoaderRule.issuer,
          resourceQuery: { not: [...(fileLoaderRule.resourceQuery?.not || []), /url/] },
          use: ['@svgr/webpack'],
        }
      );

      // 3. 기존 규칙에서 SVG를 제외합니다.
      fileLoaderRule.exclude = /\.svg$/i;
    } else {
      // 기존 규칙을 못 찾았다면 SVGR만 강제로 추가
      config.module.rules.push({
        test: /\.svg$/i,
        use: ['@svgr/webpack'],
      });
    }
    return config;
  },
};

export default nextConfig;