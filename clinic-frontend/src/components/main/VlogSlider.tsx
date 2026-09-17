"use client";
import React, { useRef } from "react";

import * as S from "@/assets/css/Style.style";

//MockData Vlog
const VLOG_DATA = [
  {
    id: 1,
    desc: "답답했던 눈매·복코·얼굴살 완벽 개선",
    img: "/images/main/vlog/vlog1.jpg",
  },
  {
    id: 2,
    desc: "광대·사각턱·이중턱 싹 지우고 여신 등극",
    img: "/images/main/vlog/vlog2.jpg",
  },
  {
    id: 3,
    desc: '"성형 어디서 했냐고 DM 폭발" 그 비결은?',
    img: "/images/main/vlog/vlog3.jpg",
  },
  {
    id: 4,
    desc: "광대 싹 밀고 눈·가슴까지 다 갈아엎은 썰",
    img: "/images/main/vlog/vlog4.jpg",
  },
  {
    id: 5,
    desc: "턱밑 지방이랑 광대 싹 지우고 V라인 완성",
    img: "/images/main/vlog/vlog5.jpg",
  },
];

export const VlogSlider = () => {
  //슬라이더 (가로 스크롤 영역)의 실제 HTML DOM 요소에 직접 접근하기위해
  const sliderRef = useRef<HTMLDivElement>(null);
  //화살표 버튼을 누를때 실행될 스크롤 조작함수 ('left' 또는 'right'를 인자로 받습니다.)
  const scroll = (direction: "left" | "right") => {
    //sliderRef.current가 존재하는지(화면에 슬라이더 요소가 정상적으로 렌더링되어 있는지) 여부를 확인합니다.
    if (sliderRef.current) {
      //left 왼쪽으로 -260 , right 오른쪽으로 +260 이동
      //260인 이유 : 카드 1개 너비(240px) + 카드 사이 패딩(20px) 합쳐서 딱 한칸씩만 정확하게 넘어가도록 계산
      const scrollAmount = direction === "left" ? -260 : 260;
      //자바스크립트 내장 DOM API 인 scrollBy()를 사용하여 scrollAmount 값만큼 스크롤 조작
      sliderRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <>
      <S.VlogSection>
        <S.VlogInner>
          {/* 헤더 영역 (타이틀 및 컨트롤 버튼) */}
          <S.VlogHeader>
            <S.VlogTitleGroup>
              <S.VlogMainTitle>Ahn's VLOG.</S.VlogMainTitle>
            </S.VlogTitleGroup>
            <S.VlogControls>
              <S.VlogViewMoreBtn>view more +</S.VlogViewMoreBtn>
              <S.VlogArrowBtn onClick={() => scroll("left")}>
                &lt;
              </S.VlogArrowBtn>
              <S.VlogArrowBtn onClick={() => scroll("right")}>
                &gt;
              </S.VlogArrowBtn>
            </S.VlogControls>
          </S.VlogHeader>
          {/* 슬라이더 영역 */}
          <S.VlogSliderWrapper ref={sliderRef}>
            {VLOG_DATA.map((item) => (
              <S.VlogCard key={item.id}>
                <S.VlogImageWrapper>
                  <img src={item.img} alt={`브이로그 ${item.id}`} />
                </S.VlogImageWrapper>
                <S.VlogInfo>
                  <S.VlogDesc>{item.desc}</S.VlogDesc>
                </S.VlogInfo>
              </S.VlogCard>
            ))}
          </S.VlogSliderWrapper>
        </S.VlogInner>
      </S.VlogSection>
    </>
  );
};
