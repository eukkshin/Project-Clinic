"use client";

import Link from 'next/link';

import * as S from '@/assets/css/components/dropdown/MobileProcedureSubmenu.styles';

interface Props {
  items: { name: string; url: string }[];
  onNavigate: () => void;
}

function safeHref(url: string): string {
  const value = url.trim();
  if (value.startsWith("/") && !value.startsWith("//")) return value;
  if (/^https?:\/\//i.test(value)) return value;
  return "/";
}

/** 기존 모바일 상위 메뉴 아래에만 작은 하위 메뉴를 노출한다. */
export default function MobileProcedureSubmenu({ items, onNavigate }: Props) {
  if (!items.length) return null;
  return (
    <S.Root>
      <S.Toggle>
        세부 메뉴 보기 <span aria-hidden="true">⌄</span>
      </S.Toggle>
      <S.Items>
        {items.map((item) => (
          <S.ItemLink
            as={Link}
            key={`${item.name}-${item.url}`}
            href={safeHref(item.url)}
            onClick={onNavigate}
          >
            {item.name}
          </S.ItemLink>
        ))}
      </S.Items>
    </S.Root>
  );
}
