import type { Metadata } from 'next';
import FindPasswordForm from '@/components/auth/FindPasswordForm';

export const metadata: Metadata = {
  title: '비밀번호 찾기 | AHNS 성형외과',
  description: '등록 이메일을 통해 비밀번호를 재설정합니다.',
  robots: { index: false, follow: false },
};

export default function Page() {
  return <FindPasswordForm />;
}
