/**
 * 자산 캐시 무효화를 위한 버전 관리
 * 외부 플랫폼(Notion, Slack 등)의 메타데이터 캐시를 무효화하기 위해
 * OG 이미지, favicon 등의 경로에 버전 파라미터로 추가됩니다.
 */
export const ASSET_VERSION = process.env.NEXT_PUBLIC_ASSET_VERSION || 'surf-1st';
