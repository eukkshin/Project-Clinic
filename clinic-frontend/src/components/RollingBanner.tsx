"use client";

import * as S from "@/assets/css/components/RollingBanner.styles";

// 배너에 반복해서 표시할 브랜드 문구
const TEXT = "Ahn's Plastic Surgery";
const TEXT2 = "The Art Of Beauty";
const TEXT3 = "Beauty In Your Own Way";

// 같은 문구를 3번 배치한다.
// 텍스트가 반복되어 흐르는 디자인을 만들기 위해 사용한다.
const ITEMS = Array.from({ length: 3 }, (_, index) => index);

export default function RollingBanner() {
  return (
    // 배경 없는 투명 배너
    // Hero 이미지 위에 자연스럽게 겹쳐 보이도록 한다.
    <S.BannerWrapper aria-label={TEXT}>
      <S.Track>
        {/*
          같은 그룹을 2번 반복하는 이유

          첫 번째 그룹이 왼쪽으로 이동할 때
          두 번째 그룹이 그 뒤를 이어서 등장한다.

          애니메이션이 끝나면 처음 위치로 돌아가지만
          두 그룹이 동일하므로 끊기지 않고 계속
          움직이는 것처럼 보인다.
        */}
        {[0, 1].map((group) => (
          <S.TextGroup key={group} aria-hidden="true">
            {ITEMS.map((index) => (
              <S.TextItem key={index}>
                <S.Text>{TEXT}</S.Text>

                {/* 작은 장식은 텍스트 사이를 구분하는 역할 */}
                <S.Decoration aria-hidden="true">✦</S.Decoration>
                <S.Text>{TEXT2}</S.Text>
                <S.Decoration aria-hidden="true">✦</S.Decoration>
                <S.Text>{TEXT3}</S.Text>
              </S.TextItem>
            ))}
          </S.TextGroup>
        ))}
      </S.Track>
    </S.BannerWrapper>
  );
}
