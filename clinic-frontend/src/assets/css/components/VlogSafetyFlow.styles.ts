import styled from 'styled-components';

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
  --bridge-height: 900px;
  /* Hydration 전 임시 색상 위치. ResizeObserver에서 실제 높이로 갱신됨. */
  --tone-16: 1204px;
  --tone-34: 1366px;
  --tone-52: 1528px;
  --tone-70: 1690px;
  --tone-86: 1834px;
  --tone-end: 1960px;

  position: relative;
  width: 100%;
  margin: 0;
  padding: 0;
  border: 0;

  /*
   * Vlog 후반의 밝은 공간에서 천천히 톤을 낮추고,
   * Bridge 0~100% 전체를 활용해 세이지 → 포레스트 그린으로 변화시킨다.
   * --tone-* 변수는 브리지 실측 높이에 비례하여 TSX에서 설정한다.
   * 고정 px값으로 Bridge 뒤쪽에 색상을 몰아넣지 않으므로 모바일도 부드럽다.
   */
  background-image:
    radial-gradient(
      ellipse 42% 24% at 80% 93%,
      rgba(161, 190, 157, 0.14),
      transparent 100%
    ),
    linear-gradient(
      to bottom,
      #f7f4ea 0px,
      #f7f4ea calc(var(--vlog-height) - 650px),
      #f1f1e9 calc(var(--vlog-height) - 500px),
      #e3eade calc(var(--vlog-height) - 340px),
      #d2dfce calc(var(--vlog-height) - 210px),
      #c1d3bf calc(var(--vlog-height) - 80px),
      #b3c9b1 var(--vlog-height),
      #a2bca2 var(--tone-16),
      #8eaa91 var(--tone-34),
      #74957b var(--tone-52),
      #567760 var(--tone-70),
      #385a45 var(--tone-86),
      #31543f var(--tone-end),
      #294d39 calc(var(--tone-end) + 115px),
      #244535 calc(var(--tone-end) + 240px),
      #1b3528 calc(var(--tone-end) + 650px),
      #1b3528 100%
    );

  background-size:
    100% 100%,
    100% 100%;
  background-repeat: no-repeat;
  background-blend-mode: normal;

  /* Reverse-colour organic mist only over the dark Safety region. */
  &::before {
    content: "";
    position: absolute;
    top: calc(var(--vlog-height) + var(--bridge-height) - 240px);
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 0;
    pointer-events: none;
    background-image:
      url("/images/ahns-editorial-mist.webp"),
      radial-gradient(
        ellipse at 6% 70%,
        rgba(211, 225, 203, 0.1),
        transparent 65%
      ),
      radial-gradient(
        ellipse at 85% 25%,
        rgba(173, 204, 171, 0.1),
        transparent 58%
      );
    background-size:
      1550px auto,
      100% 100%,
      100% 100%;
    background-repeat: repeat, no-repeat, no-repeat;
    opacity: 0.65;
    /* Safety 시작점에 텍스처가 즉시 보이지 않도록 상단에서 점진적으로 나타나게 한다.
       마지막에는 다음 Footer의 텍스처가 자연스럽게 이어지도록 220px에 걸쳐 소멸. */
    -webkit-mask-image: linear-gradient(
      to bottom,
      transparent 0px,
      rgba(0, 0, 0, 0.15) 120px,
      #000 520px,
      #000 calc(100% - 360px),
      transparent 100%
    );
    mask-image: linear-gradient(
      to bottom,
      transparent 0px,
      rgba(0, 0, 0, 0.15) 120px,
      #000 520px,
      #000 calc(100% - 360px),
      transparent 100%
    );
  }

  /* 마지막 배경의 반투명 광원까지 짙은 그린으로 정리해
     Footer 시작점과 픽셀 색상을 맞춘다. 콘텐츠는 z-index:1로 위에 유지. */
  &::after {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 220px;
    z-index: 0;
    pointer-events: none;
    background: linear-gradient(180deg, rgba(27, 53, 40, 0), #1b3528);
  }

  > * {
    position: relative;
    z-index: 1;
  }

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
  /* 기존 42svh보다 길게: 실제 스크롤 전환에 한 화면가량 사용한다. */
  height: clamp(720px, 100svh, 1080px);
  box-sizing: border-box;
  margin: 0;
  padding: 92px 24px;
  border: 0;
  background: transparent;
  color: #f7f6ee;
  overflow: hidden;

  @media (max-width: 768px) {
    height: clamp(560px, 86svh, 800px);
    padding: 76px 20px;
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
  width: clamp(380px, 64vw, 1050px);
  aspect-ratio: 1;
  transform: translate(-50%, -50%);
  border: 1px solid rgba(240, 246, 237, 0.07);
  border-radius: 50%;
  pointer-events: none;

  /* 안쪽에는 두 번째 아주 희미한 원을 넣어 단조로움을 줄인다. */
  &::after {
    content: "";
    position: absolute;
    inset: 9%;
    border: 1px solid rgba(240, 246, 237, 0.12);
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
  font-family: var(--ahns-display, Georgia, serif);
  font-size: clamp(72px, 8.7vw, 145px);
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
  font-size: clamp(10px, 0.9vw, 12px);
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
