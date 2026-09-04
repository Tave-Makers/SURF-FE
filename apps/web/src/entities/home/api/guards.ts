import type { Guard } from '@/shared/api/types';
import type { HomeApiResponseData, HomeBanner } from './types';
import { isNumber, isString } from '@/shared/api/primitives';

const isNullable =
  <T>(g: Guard<T>): Guard<T | null> =>
  (x): x is T | null =>
    x === null || g(x);

const isOptionalNullable =
  <T>(g: Guard<T>): Guard<T | null | undefined> =>
  (x): x is T | null | undefined =>
    x === undefined || x === null || g(x);

const isHomeBanner: Guard<HomeBanner> = (x): x is HomeBanner => {
  if (typeof x !== 'object' || x === null) return false;
  const o = x as Record<string, unknown>;

  return (
    isNumber(o.id) &&
    isString(o.imageUrl) &&
    isNullable(isString)(o.linkUrl) &&
    isNumber(o.displayOrder)
  );
};

export const isHomeApiResponseData: Guard<HomeApiResponseData> = (x): x is HomeApiResponseData => {
  if (typeof x !== 'object' || x === null) return false;
  const o = x as Record<string, unknown>;

  return (
    (o.message === undefined || isNullable(isString)(o.message)) &&
    (o.sender === undefined || isNullable(isString)(o.sender)) &&
    Array.isArray(o.banners) &&
    o.banners.every(isHomeBanner) &&
    isString(o.memberName) &&
    isNumber(o.memberGeneration) &&
    isString(o.memberPart) &&
    isOptionalNullable(isString)(o.nextScheduleTitle) &&
    isOptionalNullable(isString)(o.nextScheduleDate) &&
    isOptionalNullable(isString)(o.nextScheduleDeepLink)
  );
};
