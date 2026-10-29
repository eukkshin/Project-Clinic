import styled from "styled-components";

/**
 * Selfies / CategoryNav와 공유하는 Ahn's 색상 계열.
 * 글자와 이미지에 집중하도록 진한 검은색이나 분홍색은 사용하지 않는다.
 */
const DARK = "#344638";
const SAGE = "#829E84";

/**
 * 섹션 배경
 * Selfies의 마지막 배경색이 #e1e9df이므로 첫 픽셀을 같은 색으로 맞춘다.
 * 두 섹션 사이에 border/box-shadow는 사용하지 않는다.
 *
 * 중요: GSAP pin이 있는 자손 요소를 위해 여기에 overflow:hidden,
 * transform, filter 등을 사용하지 않는다. 스크롤 고정의 기준이 달라질 수 있다.
 */
export const Section = styled.section`
  position: relative;
  width: 100%;
  color: ${DARK};
  background: transparent;
  padding: clamp(70px, 7vw, 108px) 0 clamp(80px, 8vw, 125px);

  @media (max-width: 1024px) {
    padding: 90px 0 86px;
  }

  @media (max-width: 640px) {
    padding: 75px 0 72px;
  }
`;

export const Inner = styled.div`
  max-width: 1760px;
  margin: 0 auto;
  padding: 0 clamp(24px, 6.5vw, 120px);
`;

/**
 * PC에서는 왼쪽 소개 38% / 오른쪽 이미지 62% 정도로 배치.
 * 세로 높이는 오른쪽 이벤트 목록이 결정하도록 align-items: stretch를 사용한다.
 * 좁은 화면에서는 한 줄로 쌓으므로 pin이 필요하지 않다.
 */
export const Layout = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 0.75fr) minmax(0, 1.25fr);
  column-gap: clamp(36px, 6vw, 116px);
  align-items: stretch;

  @media (max-width: 1024px) {
    grid-template-columns: minmax(0, 1fr);
    gap: 48px;
  }
`;

export const LeftColumn = styled.div`
  position: relative;
  min-width: 0;
  /* 본문의 오른쪽 높이를 따라 늘어나므로 Heading이 고정될 공간이 확보된다. */
`;

/**
 * 이 요소에만 GSAP ScrollTrigger의 pin 옵션을 적용한다.
 * position: sticky와 GSAP pin을 동시에 쓰면 서로 충돌할 수 있으므로
 * CSS에는 sticky를 작성하지 않는다.
 */
export const Heading = styled.div`
  position: relative;
  width: 100%;
  max-width: 590px;
  will-change: auto;
`;

export const HeadingMeta = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  margin-bottom: clamp(45px, 5vw, 85px);
`;

export const Eyebrow = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 12px;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.2em;
  white-space: nowrap;
  color: #668069;
`;

export const EyebrowLine = styled.span`
  display: inline-block;
  width: 23px;
  height: 1px;
  background: #76917a;
`;

export const SectionNumber = styled.span`
  font-size: 10px;
  font-weight: 400;
  letter-spacing: 0.13em;
  white-space: nowrap;
  color: #8a9e8e;

  @media (max-width: 470px) {
    display: none;
  }
`;

export const Title = styled.h2`
  margin: 0;
  color: ${DARK};
  font-family: var(--ahns-display, Georgia, serif);
  font-size: clamp(50px, 5vw, 90px);
  font-weight: 400;
  line-height: 1.04;
  letter-spacing: -0.075em;

  em {
    font-weight: 400;
    color: ${SAGE};
  }

  @media (max-width: 640px) {
    font-size: clamp(46px, 11vw, 74px);
  }
`;

export const TitleRule = styled.span`
  display: block;
  height: 1px;
  width: 55px;
  margin-top: clamp(25px, 3.2vw, 42px);
  background: #8da58e;
`;

export const Description = styled.p`
  margin: clamp(24px, 2.6vw, 34px) 0 0;
  font-family: inherit;
  color: #667c69;
  font-size: clamp(12px, 1vw, 14px);
  font-weight: 400;
  line-height: 2;
  word-break: keep-all;
`;

export const HeadingFoot = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 12px;
  margin-top: clamp(50px, 6vw, 90px);

  @media (max-width: 1024px) {
    margin-top: 35px;
  }
`;

export const CountNumber = styled.span`
  font-size: clamp(33px, 3.9vw, 65px);
  line-height: 0.96;
  letter-spacing: -0.06em;
  font-weight: 300;
  color: #94ad98;
`;

export const CountLabel = styled.span`
  padding-bottom: 4px;
  font-size: 9px;
  letter-spacing: 0.19em;
  color: #7d927f;
`;

export const RightColumn = styled.div`
  min-width: 0;
`;

/**
 * 2열 카드 그리드.
 * 1번 이벤트는 grid-column: span 2로 가로 전체를 사용한다.
 * 나머지는 자동으로 2열에 채워진다.
 */
export const EventGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  column-gap: clamp(14px, 1.8vw, 29px);
  row-gap: clamp(26px, 3.3vw, 52px);
  align-items: start;

  @media (max-width: 640px) {
    column-gap: 12px;
    row-gap: 35px;
  }
`;

/**
 * $featured는 styled-components의 transient prop이다.
 * 첫 번째 카드만 두 칸을 차지하고 큰 사진으로 강조한다.
 */
export const EventCard = styled.article<{ $featured: boolean }>`
  min-width: 0;
  grid-column: ${({ $featured }) => ($featured ? "span 2" : "span 1")};

  @media (max-width: 520px) {
    grid-column: span 2;
  }
`;

/**
 * Next/Image의 fill 모드는 position: relative인 부모가 필요하다.
 * 미리 aspect-ratio를 주면 DB 이미지가 늦게 로딩돼도 카드 높이가 일정하다.
 */
export const ImageArea = styled.div`
  position: relative;
  &::after {
    content: "";
    position: absolute;
    inset: 0;
    z-index: 2;
    pointer-events: none;
    background: linear-gradient(
      120deg,
      transparent 25%,
      rgba(255, 255, 255, 0.2) 50%,
      transparent 75%
    );
    transform: translateX(-145%);
    transition: transform 1.2s cubic-bezier(0.2, 0.65, 0.2, 1);
  }
  ${EventCard}:hover &::after {
    transform: translateX(145%);
  }
  @media (prefers-reduced-motion: reduce) {
    &::after {
      transition: none;
      display: none;
    }
  }
  width: 100%;
  /* Landscape event cards, rather than oversized portrait posters. */
  aspect-ratio: 4 / 3.4;
  overflow: hidden;
  border-radius: 0;
  background: #cad8c8;

  img {
    transform: scale(1.001);
    transition: transform 850ms cubic-bezier(0.2, 0.7, 0.15, 1);
  }

  ${EventCard}:hover & img {
    transform: scale(1.045);
  }

  ${EventCard}:first-child & {
    aspect-ratio: 5 / 3.25;
  }

  @media (prefers-reduced-motion: reduce) {
    img {
      transition: none;
    }
    ${EventCard}:hover & img {
      transform: none;
    }
  }
`;

export const ImageShade = styled.div`
  pointer-events: none;
  position: absolute;
  z-index: 1;
  inset: 0;
  background: linear-gradient(
    180deg,
    rgba(23, 43, 29, 0.22) 0%,
    transparent 30%,
    transparent 40%,
    rgba(19, 39, 28, 0.62) 100%
  );
`;

export const ImageTop = styled.div`
  position: absolute;
  z-index: 2;
  top: clamp(16px, 2vw, 30px);
  left: clamp(15px, 2vw, 32px);
  right: clamp(15px, 2vw, 32px);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 9px;
  color: white;
`;

export const ImageIndex = styled.span`
  font-size: clamp(10px, 1vw, 12px);
  letter-spacing: 0.04em;
  white-space: nowrap;
  span {
    opacity: 0.6;
  }
`;

export const ImageTag = styled.span`
  color: white;
  font-size: clamp(8px, 0.8vw, 10px);
  letter-spacing: 0.12em;
  white-space: nowrap;
  opacity: 0.88;
`;

export const ImageBottom = styled.div`
  position: absolute;
  z-index: 2;
  bottom: clamp(20px, 2.6vw, 45px);
  left: clamp(15px, 2vw, 32px);
  right: clamp(15px, 2vw, 32px);
  color: white;
`;

export const ImageCaption = styled.p`
  margin: 0 0 10px;
  color: white;
  font-size: 9px;
  letter-spacing: 0.19em;
  opacity: 0.78;
`;

export const ImageTitle = styled.h3`
  margin: 0;
  color: white;
  font-family: inherit;
  font-size: clamp(18px, 1.65vw, 28px);
  font-weight: 400;
  line-height: 1.2;
  letter-spacing: -0.04em;
  word-break: keep-all;

  ${EventCard}:first-child & {
    font-size: clamp(32px, 3.25vw, 58px);
  }
`;

export const CardFooter = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  padding-top: 16px;
  margin-top: 13px;
  border-top: 1px solid rgba(52, 70, 56, 0.18);
`;

export const CardInfo = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
  gap: 8px;
`;

export const FooterIndex = styled.span`
  font-size: 9px;
  letter-spacing: 0.17em;
  color: #819783;
`;

export const FooterTitle = styled.p`
  margin: 0;
  font-size: clamp(13px, 1.1vw, 18px);
  line-height: 1.45;
  font-weight: 400;
  color: ${DARK};
  word-break: keep-all;
`;

export const Price = styled.span`
  flex: 0 0 auto;
  max-width: 48%;
  color: #687f6b;
  font-size: clamp(11px, 0.92vw, 14px);
  line-height: 1.5;
  font-weight: 500;
  text-align: right;
  overflow-wrap: anywhere;
`;

export const Status = styled.p`
  margin: 0;
  padding: 100px 20px;
  text-align: center;
  border-top: 1px solid rgba(52, 70, 56, 0.13);
  border-bottom: 1px solid rgba(52, 70, 56, 0.13);
  font-size: 12px;
  color: #69806d;
  letter-spacing: 0.09em;
`;

export const Bottom = styled.footer`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: clamp(48px, 5.5vw, 86px);
  padding-top: 20px;
  border-top: 1px solid rgba(52, 70, 56, 0.15);

  span {
    color: #819684;
    font-size: 9px;
    font-weight: 500;
    letter-spacing: 0.16em;
  }
`;
