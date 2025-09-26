import { redirect } from 'next/navigation';

export default function RootPage() {
  // 추후 로그인 로직 반영 예정
  redirect('/home');
}
