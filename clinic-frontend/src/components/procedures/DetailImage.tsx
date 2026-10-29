import Image, { ImageProps } from 'next/image';

/**
 * 기존 next/image를 유지하면서 관리자가 입력한 Express 이미지 절대 URL도 지원합니다.
 * 로컬 /images/... 경로는 Next.js public/images를 그대로 참조합니다.
 * 외부 이미지는 next.config remotePatterns 변경 없이 원본 주소를 사용합니다.
 */
export default function DetailImage({ src, ...props }: ImageProps) {
  if (typeof src === "string") {
    const value = src.trim();
    const local = value.startsWith("/") && !value.startsWith("//");
    const remote = /^https?:\/\//i.test(value);
    if (!local && !remote) return null;
    return <Image {...props} src={value} unoptimized={remote} />;
  }
  return <Image {...props} src={src} />;
}
