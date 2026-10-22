import styled from "styled-components";

/**
 * Vlog → Brand → Safety의 배경을 한 장으로 칠하는 공통 부모.
 *
 * 가장 중요한 부분:
 * - VlogSlider.styles.ts, SafetySlider.styles.ts의 Section은 background: transparent
 * - 실제 색상은 Flow가 단 한 번만 렌더링
 * - 가상 요소를 각 섹션에 덧칠하지 않음
 *
 * CSS 변수는 VlogSafetyFlow.tsx가 ResizeObserver로 측정한 값이다.
 * 초기 값은 JS 실행 전에도 배경이 보이도록 하는 임시값이다.
 * 이후 화면 실제 크기로 자동 교체된다.
 */
export const Flow = styled.div`
  --vlog-height: 1060px;
  --bridge-height: 760px;

  position: relative;
  width: 100%;
  margin: 0;
  padding: 0;
  border: 0;

  /*
   * 하나의 linear-gradient가 Vlog부터 Safety 끝까지 이어진다.
   * 따라서 섹션 사이에 별개의 background가 맞닿는 경계가 없다.
   *
   * Vlog 끝나기 약 380px 전부터 점점 연한 세이지로 변한다.
   * 브랜드 장면 동안 차분히 진해진 뒤 Safety 시작점은 포레스트 그린이다.
   * 이후의 Safety는 같은 포레스트 그린을 계속 유지한다.
   */
  background: linear-gradient(
    to bottom,
    #f7f4ea 0px,
    #eff2ea calc(var(--vlog-height) - 380px),
    #cbdccb calc(var(--vlog-height) - 155px),
    #91ac97 var(--vlog-height),
    #6f977b calc(var(--vlog-height) + 185px),
    #3b5f4b calc(var(--vlog-height) + 420px),
    #17352b calc(var(--vlog-height) + var(--bridge-height)),
    #17352b 100%
  );

  /*
   * overflow:hidden을 부모에 주면 Safety의 position:sticky가
   * 작동하지 않을 수 있으므로 의도적으로 사용하지 않는다.
   */
`;

/**
 * Vlog 감싸는 요소.
 * background가 없고 margin도 없어서 부모의 배경이 그대로 비친다.
 */
export const VlogBlock = styled.div`
  width: 100%;
  margin: 0;
  background: transparent;
`;

/**
 * 스크롤 구간 자체는 일반 문서 흐름에 남아 있다.
 * pin 없이 세로 스크롤 길이만큼 브랜드 장면을 보여준다.
 */
export const Bridge = styled.section`
  position: relative;
  isolation: isolate;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: clamp(570px, 84svh, 940px);
  margin: 0;
  padding: 80px 24px;
  border: 0;
  background: transparent;
  color: #f7f6ee;
  overflow: hidden;

  @media (max-width: 768px) {
    height: clamp(490px, 77svh, 720px);
    padding: 65px 20px;
  }
`;

/**
 * 천천히 커지는 둥근 선.
 * 도형 자체는 단순한 장식이며 사용자의 클릭을 방해하지 않는다.
 */
export const Orbit = styled.div`
  position: absolute;
  z-index: 0;
  left: 50%;
  top: 50%;
  width: clamp(470px, 75vw, 1260px);
  aspect-ratio: 1;
  transform: translate(-50%, -50%);
  border: 1px solid rgba(240, 246, 237, 0.5);
  border-radius: 50%;
  pointer-events: none;

  /* 안쪽에는 두 번째 아주 희미한 원을 넣어 단조로움을 줄인다. */
  &::after {
    content: "";
    position: absolute;
    inset: 9%;
    border: 1px solid rgba(240, 246, 237, 0.24);
    border-radius: 50%;
  }

  @media (max-width: 768px) {
    width: min(128vw, 670px);
  }
`;

export const BrandContent = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  max-width: 1300px;
  text-align: center;
  pointer-events: none;
`;

export const Eyebrow = styled.p`
  margin: 0 0 clamp(25px, 4vw, 58px);
  color: #e1ebe0;
  font-size: clamp(10px, 0.9vw, 13px);
  font-weight: 400;
  letter-spacing: 0.3em;
`;

export const BrandTitle = styled.h2`
  margin: 0;
  padding: 0;
  color: #f8f7f0;
  font-family: inherit;
  font-size: clamp(72px, 17vw, 290px);
  font-weight: 400;
  line-height: 0.9;
  letter-spacing: -0.085em;
  text-shadow: 0 10px 70px rgba(14, 47, 25, 0.12);
  white-space: nowrap;

  @media (max-width: 500px) {
    font-size: clamp(62px, 18vw, 94px);
  }
`;

export const Tagline = styled.p`
  margin: clamp(23px, 3.6vw, 45px) 0 0;
  color: #edf2e9;
  font-size: clamp(10px, 1vw, 14px);
  font-weight: 400;
  letter-spacing: 0.24em;
`;

export const KoreanText = styled.p`
  margin: clamp(21px, 3.2vw, 40px) 0 0;
  color: #e4ede4;
  font-size: clamp(12px, 1.05vw, 15px);
  font-weight: 400;
  line-height: 2.1;
  letter-spacing: -0.02em;
  word-break: keep-all;
`;

export const EdgeNote = styled.span`
  position: absolute;
  bottom: clamp(28px, 4vw, 59px);
  left: clamp(20px, 5vw, 85px);
  z-index: 1;
  color: rgba(245, 248, 237, 0.74);
  font-size: 9px;
  letter-spacing: 0.18em;
  pointer-events: none;

  @media (max-width: 768px) {
    font-size: 8px;
    bottom: 26px;
  }
`;

/*
 * 애니메이션을 줄여 달라는 설정이 켜져 있으면
 * JS에서 GSAP 애니메이션을 등록하지 않는다.
 * 일반 CSS 상태가 보이는 상태이므로 텍스트를 바로 읽을 수 있다.
 */
