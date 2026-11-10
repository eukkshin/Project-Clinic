import styled from 'styled-components';

export const HomeCanvas = styled.div`
  position: relative;
  width: 100%;
  color: #244535;

  --ahns-display: var(--font-cormorant), "Cormorant Garamond", Georgia, serif;
  --ahns-forest: #244535;
  --ahns-ivory: #f7f4ea;
  background-color: var(--ahns-ivory);
  background-image:
    url("/images/ahns-editorial-shadows.webp"),
    radial-gradient(
      ellipse 48% 30% at 9% 9%,
      rgba(175, 195, 169, 0.32) 0%,
      transparent 76%
    ),
    radial-gradient(
      ellipse 42% 29% at 88% 46%,
      rgba(203, 216, 197, 0.22) 0%,
      transparent 82%
    ),
    linear-gradient(180deg, #eff0e5 0%, #f7f4ea 31%, #f6f3e9 66%, #f7f4ea 100%);
  background-size:
    min(1850px, 125vw) auto,
    100% 100%,
    100% 100%,
    100% 100%;
  background-position:
    center top,
    center,
    center,
    center;
  background-repeat: repeat-y, no-repeat, no-repeat, no-repeat;
  @media (max-width: 768px) {
    background-size:
      1180px auto,
      100% 100%,
      100% 100%,
      100% 100%;
  }
`;
