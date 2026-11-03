// 이전의 가짜 PASS 화면 URL 호환용. 인증 UI를 가장하지 않고 요청 화면으로 이동합니다.
import { redirect } from 'next/navigation';

export default function Page() {
  redirect('/find');
}
