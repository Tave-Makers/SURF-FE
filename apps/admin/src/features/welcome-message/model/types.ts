export interface WelcomeMessage {
  id: number;
  main: string;
  sub: string;
}

export interface UpdateWelcomeMessageInput {
  main: string;
  sub: string;
}
