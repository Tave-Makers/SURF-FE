/**
 * 이벤트 이름
 */
export const MESSAGE_EVENTS = {
  PAGE_VIEW: 'page_view',
  INPUT_EMAIL: 'input_email',
  INPUT_SNS: 'input_sns',
  INPUT_TITLE: 'input_title',
  INPUT_BODY: 'input_body',
  LETTER_SEND: 'letter_send',
  LEAVE_CONFIRM: 'leave_confirm',
};

/**
 * 이벤트별 속성 타입 매핑
 */
export type MessageEventPropsMap = {
  [MESSAGE_EVENTS.PAGE_VIEW]: { page_name: string };
  [MESSAGE_EVENTS.INPUT_EMAIL]: { field_name: string };
  [MESSAGE_EVENTS.INPUT_SNS]: { field_name: string };
  [MESSAGE_EVENTS.INPUT_TITLE]: { text_length: number };
  [MESSAGE_EVENTS.INPUT_BODY]: { text_length: number };
  [MESSAGE_EVENTS.LETTER_SEND]: { success: boolean };
  [MESSAGE_EVENTS.LEAVE_CONFIRM]: { action: string };
};
