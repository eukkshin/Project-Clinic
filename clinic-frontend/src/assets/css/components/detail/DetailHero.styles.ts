import styled from 'styled-components';

/** 전체 화면을 사용하고 Header/Footer 레이아웃이나 SideNav 좌표는 건드리지 않습니다. */
export const Hero = styled.section`
  position: relative;
  isolation: isolate;
  width: 100%;
  min-height: 640px;
  min-height: 100svh;
  display: grid;
  align-items: center;
  overflow: hidden;
  background: linear-gradient(135deg, #aab9a7, #5b7265 55%, #324a3b);
`;

export const HeroImage = styled.div`
  position: absolute;
  inset: 0;
  z-index: -2;
  transform: scale(1.12);
  transform-origin: center;
  will-change: transform;
  & > img {
    object-fit: cover;
  }
  @media (prefers-reduced-motion: reduce) {
    transform: scale(1);
    will-change: auto;
  }
`;

export const HeroOverlay = styled.div`
  position: absolute;
  inset: 0;
  z-index: -1;
  background:
    linear-gradient(
      90deg,
      rgba(14, 38, 27, 0.57) 0%,
      rgba(16, 38, 27, 0.25) 42%,
      transparent 78%
    ),
    linear-gradient(0deg, rgba(20, 44, 31, 0.3), transparent 34%);
  pointer-events: none;
`;

export const HeroContent = styled.div`
  width: min(100% - 64px, 1440px);
  margin: 0 auto;
  padding: 150px clamp(18px, 8vw, 136px) 100px;
  box-sizing: border-box;
  color: #fff;
  text-shadow: 0 3px 23px rgba(15, 33, 21, 0.2);

  [data-detail-reveal] {
    opacity: 0;
    visibility: hidden;
    transform: translateY(-32px);
  }

  @media (max-width: 768px) {
    width: min(100% - 36px, 1440px);
    padding: 118px 14px 90px;
  }

  @media (prefers-reduced-motion: reduce) {
    [data-detail-reveal] {
      opacity: 1;
      visibility: visible;
      transform: none;
      filter: none;
    }
  }
`;

export const HeroEyebrow = styled.p`
  margin: 0 0 25px;
  font-size: clamp(10px, 0.82vw, 12px);
  font-weight: 700;
  letter-spacing: 0.3em;
`;

export const HeroTitle = styled.h1`
  width: min(800px, 100%);
  margin: 0;
  font-size: clamp(42px, 5.8vw, 94px);
  font-weight: 500;
  line-height: 1.12;
  letter-spacing: -0.065em;
  word-break: keep-all;
`;

export const HeroDescription = styled.p`
  max-width: 620px;
  margin: 30px 0 0;
  color: rgba(255, 255, 255, 0.9);
  font-size: clamp(14px, 1.35vw, 19px);
  line-height: 1.95;
  font-weight: 400;
  white-space: pre-line;
  word-break: keep-all;
`;

export const ScrollNote = styled.div`
  position: absolute;
  right: clamp(28px, 5vw, 90px);
  bottom: 35px;
  color: rgba(255, 255, 255, 0.86);
  display: flex;
  align-items: center;
  gap: 15px;
  font-size: 10px;
  letter-spacing: 0.12em;
  span {
    font-size: 20px;
    font-weight: 300;
  }
  @media (max-width: 768px) {
    right: 22px;
    bottom: 20px;
  }
`;
