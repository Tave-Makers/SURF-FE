// 온보딩 필요 여부 응답
export type ValidStatusResponse = {
  code: number;
  message: string;
  data: boolean;
};

// 카카오로그인 회원 정보 응답
export type KakaoLoginResponse = {
  status: number;
  message: string;
  data: {
    accessToken: string;
    nickname: string;
    email: string;
    profileImageUrl: string;
  };
};
