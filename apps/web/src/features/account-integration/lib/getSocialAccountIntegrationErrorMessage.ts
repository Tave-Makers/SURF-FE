import axios from 'axios';

export function getSocialAccountIntegrationErrorMessage(error: unknown) {
  const status = axios.isAxiosError(error) ? error.response?.status : undefined;

  if (status === 410 || status === 404) {
    return '연동 가능 시간이 지났습니다. 처음부터 다시 시도해주세요.';
  }

  if (status === 409) {
    return '기존 계정과 연동할 수 없습니다. 입력하신 정보를 확인하시거나 운영진에게 문의해주세요.';
  }

  return '계정 연동에 실패했습니다. 잠시 후 다시 시도해주세요.';
}
