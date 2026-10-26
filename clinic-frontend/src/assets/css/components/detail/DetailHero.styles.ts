import styled from 'styled-components';

export const Hero = styled.section`
  position: relative;
  width: 100%;
  min-height: 100svh;
  overflow: hidden;
  isolation: isolate;

  display: flex;
  align-items: center;
  justify-content: center;
`;

export const HeroImage = styled.div`
  position: absolute;
  inset: 0;
  z-index: -2;

  /* 처음에는 12% 확대 */
  transform: scale(1.12);
  transform-origin: center center;
  will-change: transform;

  @media (prefers-reduced-motion: reduce) {
    transform: scale(1);
  }
`;

export const HeroContent = styled.div`
  position: relative;
  z-index: 1;
  text-align: center;
  color: #ffffff;

  [data-hero-text] {
    opacity: 0;
  }

  @media (prefers-reduced-motion: reduce) {
    [data-hero-text] {
      opacity: 1;
      visibility: visible;
      transform: none;
    }
  }
`;
