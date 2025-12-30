import { HomeApiResponseData } from '../api/types';
import { mapMemberPartToBatch } from '@/entities/user/model/mappers';

export const mapHomeDataToHomeUI = (data: HomeApiResponseData) => {
  return {
    // 왼쪽 UI 모델에 맞게 수정 필요
    noticeDataMainText: data.mainText,
    //noticeDataSender: data.senderName,
    carouselImages: mapBannersToCarouselImages(data.banners),
    userName: data.memberName,
    userBatch: data.memberGeneration,
    userPart: mapMemberPartToBatch(data.memberPart),
    announcementTitle: data.nextScheduleTitle,
    announcementDate: data.nextScheduleDate,
    // deepLink: data.deepLink, // 필요시 추가
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
