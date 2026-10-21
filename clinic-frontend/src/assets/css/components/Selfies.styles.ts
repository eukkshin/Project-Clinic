import styled from "styled-components";

/**
 * 홈페이지 전반에서 쓰는 같은 색상이다.
 * Hero·CategoryNav에서 사용한 컬러를 이어 받아 섹션마다 다른 사이트처럼 보이지 않게 한다.
 */
const DARK = "#344638";
const SAGE = "#A1AF96";
const IVORY = "#F7F4EA";

export const Section = styled.section`
  position: relative;
  isolation: isolate;
  width: 100%;
  min-height: 700px;
  padding: clamp(100px, 12vw, 175px) 0 clamp(90px, 10vw, 150px);
  overflow: hidden;
  color: ${DARK};

  /* 바로 앞의 CategoryNav가 아이보리이므로, 갑작스러운 색상 전환 없이 세이지를 살짝 섞는다. */
  background: linear-gradient(180deg, ${IVORY} 0%, #eff0e6 55%, #e1e9df 100%);

  --moments-y: 80px;
  --moments-opacity: 0;

  &::before {
    content: "MOMENTS";
    position: absolute;
    z-index: -1;
    top: 125px;
    right: -0.06em;

    font-family: inherit;
    font-size: clamp(100px, 19vw, 330px);
    font-weight: 400;
    letter-spacing: -0.085em;
    line-height: 1;
    white-space: nowrap;

    color: #6c8b71;

    /*
     * GSAP이 변경하는 변수를 실제 스타일에 연결한다.
     *
     * --moments-y가 80px이면 아래로 80px 이동하고,
     * 0px이면 원래 위치로 돌아온다.
     */
    transform: translateY(var(--moments-y));

    /*
     * 0은 완전히 투명,
     * 0.07은 아주 연하게 보이는 상태다.
     */
    opacity: var(--moments-opacity);

    pointer-events: none;
  }

  /* 움직임 감소 설정에서는 처음부터 글씨가 보이도록 한다. */
  @media (prefers-reduced-motion: reduce) {
    --moments-y: 0px;
    --moments-opacity: 0.07;
  }

  @media (max-width: 768px) {
    min-height: 0;
    padding: 82px 0 80px;
  }
`;

export const Inner = styled.div`
  width: 100%;
  max-width: 1760px;
  margin: 0 auto;
`;

export const Heading = styled.div`
  padding: 0 clamp(24px, 7vw, 140px);
  margin-bottom: clamp(35px, 5vw, 80px);
`;

export const HeadingMeta = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding-bottom: 24px;
  border-bottom: 1px solid rgba(52, 70, 56, 0.2);
`;

export const Eyebrow = styled.span`
  color: #68806b;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.22em;
`;

export const SectionNumber = styled.span`
  color: #829584;
  font-size: 10px;
  letter-spacing: 0.14em;
`;

export const HeadingRow = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
  margin-top: clamp(28px, 4vw, 62px);

  @media (max-width: 768px) {
    align-items: flex-end;
    gap: 14px;
  }
`;

export const HeadingMain = styled.div`
  min-width: 0;
`;

export const Title = styled.h2`
  margin: 0;
  font-family: inherit;
  font-weight: 400;
  font-size: clamp(41px, 5.7vw, 96px);
  line-height: 1.06;
  letter-spacing: -0.066em;
  word-break: keep-all;

  em {
    font-weight: 400;
    color: #829e84;
  }

  @media (max-width: 768px) {
    font-size: clamp(36px, 8vw, 56px);
  }
`;

export const Description = styled.p`
  margin: 28px 0 0;
  color: #657b69;
  font-size: clamp(12px, 1vw, 14px);
  font-weight: 400;
  line-height: 1.95;
  word-break: keep-all;

  @media (max-width: 768px) {
    margin-top: 20px;
  }
`;

export const Controls = styled.div`
  display: flex;
  gap: 10px;
  flex: 0 0 auto;
  padding-bottom: 7px;

  @media (max-width: 480px) {
    flex-direction: column;
    padding-bottom: 0;
  }
`;

export const ArrowButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 54px;
  height: 54px;
  padding: 0;
  border: 1px solid rgba(52, 70, 56, 0.35);
  border-radius: 50%;
  color: ${DARK};
  background: transparent;
  font-family: inherit;
  font-size: 20px;
  cursor: pointer;
  transition:
    background 0.2s ease,
    color 0.2s ease,
    opacity 0.2s ease;

  &:hover:not(:disabled) {
    background: ${DARK};
    color: ${IVORY};
  }

  &:disabled {
    cursor: default;
    opacity: 0.22;
  }

  &:focus-visible {
    outline: 2px solid ${DARK};
    outline-offset: 3px;
  }

  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
    font-size: 16px;
  }
`;

/**
 * 가로 사진 갤러리
 *
 * ScrollTrigger.pin이 아닌 CSS overflow-x:auto를 사용한다.
 * 가로 스크롤을 직접 할 수 있어 모바일·PC 양쪽에서 조작이 직관적이고,
 * 바로 앞의 CategoryNav pin과 스크롤 위치를 경쟁하지 않는다.
 */
export const GalleryViewport = styled.div`
  display: flex;
  align-items: flex-start;
  gap: clamp(15px, 2vw, 30px);
  width: 100%;
  padding: 0 clamp(24px, 7vw, 140px) 12px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scroll-padding-inline: clamp(24px, 7vw, 140px);
  overscroll-behavior-x: contain;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  outline-offset: -5px;

  &::-webkit-scrollbar {
    display: none;
  }
  &:focus-visible {
    outline: 2px solid #829e84;
  }

  @media (prefers-reduced-motion: reduce) {
    scroll-behavior: auto;
  }
`;

// CardSlot에는 정적인 위치 차이만 적용한다.
// GSAP은 안쪽 CardMotion만 움직이므로 두 transform이 충돌하지 않는다.
export const CardSlot = styled.article`
  flex: 0 0 auto;
  width: clamp(270px, 28vw, 425px);
  scroll-snap-align: start;

  &:nth-child(even) {
    padding-top: clamp(24px, 3vw, 55px);
  }

  @media (max-width: 768px) {
    width: min(76vw, 370px);
    &:nth-child(even) {
      padding-top: 28px;
    }
  }
`;

export const CardMotion = styled.div`
  width: 100%;
`;

export const PhotoButton = styled.button`
  display: block;
  width: 100%;
  padding: 0;
  border: none;
  background: none;
  cursor: zoom-in;
  text-align: left;

  &:focus-visible {
    outline: 3px solid #829e84;
    outline-offset: 5px;
    border-radius: 14px;
  }
`;

export const PhotoFrame = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 0.79;
  overflow: hidden;
  border-radius: 15px;
  background: ${SAGE};
  isolation: isolate;

  /* 움직이는 것은 사진 자체만이다. 배경과 카드 전체가 흔들리는 느낌을 줄인다. */
  img {
    transition: transform 0.85s cubic-bezier(0.2, 0.75, 0.23, 1);
  }

  ${PhotoButton}:hover & img {
    transform: scale(1.045);
  }

  @media (prefers-reduced-motion: reduce) {
    img {
      transition: none;
    }
    ${PhotoButton}:hover & img {
      transform: none;
    }
  }
`;

export const PhotoIndex = styled.span`
  position: absolute;
  z-index: 2;
  top: 22px;
  left: 24px;
  color: #fff;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.14em;
  text-shadow: 0 1px 8px rgba(0, 0, 0, 0.2);
`;

export const ZoomSymbol = styled.span`
  position: absolute;
  z-index: 2;
  right: 20px;
  bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 46px;
  height: 46px;
  border: 1px solid rgba(255, 255, 255, 0.85);
  border-radius: 50%;
  color: #fff;
  background: rgba(52, 70, 56, 0.12);
  backdrop-filter: blur(8px);
  font-size: 19px;
  transition:
    background 0.25s ease,
    color 0.25s ease;

  ${PhotoButton}:hover & {
    background: #f7f4ea;
    color: ${DARK};
  }
`;

export const CardCaption = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 17px 3px 0;
`;

export const CardCaptionTitle = styled.span`
  color: #55705b;
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.18em;
  white-space: nowrap;
`;

export const Stats = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  color: #718472;
  font-size: 11px;
  white-space: nowrap;

  @media (max-width: 410px) {
    gap: 8px;
    font-size: 10px;
  }
`;

export const GalleryFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding: 36px clamp(24px, 7vw, 140px) 0;

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const FooterMessage = styled.span`
  color: #879988;
  font-size: 11px;
  letter-spacing: 0.15em;
`;

export const ProgressArea = styled.div`
  display: flex;
  align-items: center;
  gap: 18px;
`;

export const ProgressTrack = styled.div`
  width: clamp(95px, 12vw, 175px);
  height: 2px;
  background: rgba(52, 70, 56, 0.17);
`;

export const ProgressFill = styled.div`
  height: 100%;
  background: ${DARK};
  transition: width 0.3s ease;
  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

export const ProgressText = styled.span`
  color: ${DARK};
  font-size: 12px;
  font-variant-numeric: tabular-nums;
  span {
    color: #9ba99c;
  }
`;

export const StatusMessage = styled.div`
  min-height: 370px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 17px;
  padding: 24px;
  color: #718472;
  font-size: 12px;
  letter-spacing: 0.09em;
  text-align: center;
`;

export const RetryButton = styled.button`
  border: 1px solid #819681;
  border-radius: 30px;
  padding: 10px 17px;
  color: ${DARK};
  background: transparent;
  font: inherit;
  cursor: pointer;
  &:hover {
    background: #e4ebe0;
  }
`;

export const Lightbox = styled.div`
  position: fixed;
  z-index: 2000;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 18px;
  background: rgba(24, 35, 28, 0.9);
  backdrop-filter: blur(14px);
`;

export const ModalInner = styled.div`
  position: relative;
  width: min(92vw, 980px);
  height: min(90vh, 840px);
  padding: 24px;
  --moments-y: 80px;
  --moments-opacity: 0;

  &::before {
    content: "MOMENTS";
    position: absolute;
    z-index: -1;
    top: 125px;
    right: -0.06em;

    font-family: inherit;
    font-size: clamp(100px, 19vw, 330px);
    font-weight: 400;
    letter-spacing: -0.085em;
    line-height: 1;
    white-space: nowrap;

    color: #6c8b71;

    /*
     * GSAP이 변경하는 변수를 실제 스타일에 연결한다.
     *
     * --moments-y가 80px이면 아래로 80px 이동하고,
     * 0px이면 원래 위치로 돌아온다.
     */
    transform: translateY(var(--moments-y));

    /*
     * 0은 완전히 투명,
     * 0.07은 아주 연하게 보이는 상태다.
     */
    opacity: var(--moments-opacity);

    pointer-events: none;
  }

  /* 움직임 감소 설정에서는 처음부터 글씨가 보이도록 한다. */
  @media (prefers-reduced-motion: reduce) {
    --moments-y: 0px;
    --moments-opacity: 0.07;
  }
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 16px;
  background: #24352a;
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    padding: 12px;
  }
`;

export const ModalImage = styled.div`
  position: relative;
  flex: 1;
  min-height: 0;
  overflow: hidden;
`;

export const ModalFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 18px 4px 0;
  color: #e8efe6;
  font-size: 11px;
  letter-spacing: 0.1em;
`;

export const CloseButton = styled.button`
  position: absolute;
  z-index: 2;
  top: 22px;
  right: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  border: 1px solid rgba(255, 255, 255, 0.7);
  border-radius: 50%;
  background: rgba(20, 30, 24, 0.66);
  color: #fff;
  font-size: 14px;
  cursor: pointer;

  &:focus-visible {
    outline: 2px solid #fff;
    outline-offset: 3px;
  }
`;
