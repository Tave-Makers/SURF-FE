import { HomeApiResponseData } from '../api/types';
import { mapMemberPartToBatch } from '@/entities/user/model/mappers';

export const mapHomeDataToHomeUI = (data: HomeApiResponseData) => {
  return {
    noticeDataMessage: data.message,
    noticeDataSender: data.sender,
    carouselImages: mapBannersToCarouselImages(data.banners),
    userName: data.memberName,
    userBatch: data.memberGeneration,
    userPart: mapMemberPartToBatch(data.memberPart),
    announcementTitle: data.nextScheduleTitle,
    announcementDate: data.nextScheduleDate,
    announcementDeepLink: data.nextScheduleDeepLink,
    // postId: data.postId,   // 필요시 추가
    // announcementCategory: data.announcementCategory, // 필요시 추가
  };
};

export const mapBannersToCarouselImages = (banners: HomeApiResponseData['banners']) => {
  return banners.map((banner) => ({
    src: banner.imageUrl,
    alt: `Banner ${banner.id}`,
    linkUrl: banner.linkUrl,
  }));
};
