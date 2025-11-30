/** @type {import('next').NextConfig} */
const nextConfig = {
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
      protocol: 'https',
      hostname: 't1.kakaocdn.net',
      pathname: '/**',
    },
  ],
},


  webpack(config) {
    const fileLoaderRule = config.module.rules.find(
      (rule) => rule.test?.test?.('.svg')
    );
    
    // fileLoaderRule이 없으면 안전 가드 처리
    if (!fileLoaderRule) {
      // 1) *.svg?url → 그냥 자산으로 처리
      config.module.rules.push({
        test: /\.svg$/i,
        resourceQuery: /url/,
        type: 'asset/resource',
      });
    
      // 2) 나머지 → SVGR 컴포넌트로 처리
      config.module.rules.push({
        test: /\.svg$/i,
        issuer: /\.[jt]sx?$/,
        resourceQuery: { not: [/url/] },
        use: ['@svgr/webpack'],
      });
    
      return config;
    }
    
    // 정상적으로 fileLoaderRule을 찾은 경우 원래 방식 수행
    fileLoaderRule.exclude = /\.svg$/i;
    return config;
  },
};

export default nextConfig;
