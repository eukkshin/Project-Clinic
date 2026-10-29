import Link from 'next/link';

import * as S from '@/assets/css/components/about/AboutTextNav.styles';

// 페이지 별로 같은 컴포넌트를 재사용할 수 있도록 현재 경로만 받습니다.
const aboutLinks = [
  { href: "/about/brand", label: "브랜드 소개" },
  { href: "/about/philosophy", label: "진료 철학" },
  { href: "/about/doctors", label: "의료진 소개" },
  { href: "/about/facilities", label: "진료 환경" },
  { href: "/about/safety", label: "안전 시스템" },
  { href: "/about/location", label: "오시는 길" },
] as const;

interface AboutTextNavProps {
  current: string;
}

export default function AboutTextNav({ current }: AboutTextNavProps) {
  return (
    <S.Nav aria-label="병원소개 하위 페이지">
      <S.NavIdentity aria-hidden="true">
        ABOUT <span>/</span>
      </S.NavIdentity>
      <S.NavLinks>
        {aboutLinks.map(({ href, label }) => (
          <S.NavLink
            key={href}
            as={Link}
            href={href}
            $active={current === href}
            aria-current={current === href ? "page" : undefined}
          >
            {label}
          </S.NavLink>
        ))}
      </S.NavLinks>
    </S.Nav>
  );
}
