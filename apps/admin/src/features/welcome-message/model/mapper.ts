import { HomeContentResDto, UpdateHomeContentRequest } from '@/features/welcome-message/api/types';
import { UpdateWelcomeMessageInput, WelcomeMessage } from '@/features/welcome-message/model/types';

export const mapHomeContentResDtoToWelcomeMessage = (dto: HomeContentResDto): WelcomeMessage => ({
  id: dto.id,
  main: dto.message,
  sub: dto.sender,
});

export const mapUpdateWelcomeMessageInputToRequest = ({
  main,
  sub,
}: UpdateWelcomeMessageInput): UpdateHomeContentRequest => ({
  message: main,
  sender: sub,
});
