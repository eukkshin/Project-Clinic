import styled from "styled-components";

/**
 * One atmospheric canvas beneath CategoryNav, Selfies and Events.
 * IMPORTANT: never give this ancestor transform/filter/overflow:hidden,
 * because the photo Hero uses a ScrollTrigger pin and Safety uses sticky.
 */
export const HomeCanvas = styled.div`
  position: relative;
  width: 100%;
  color: #244535;
  /* 2026 editorial: single background canvas for all light sections.
     Do not set transform, overflow:hidden, filter or backdrop-filter here:
     pinned Hero/Category and sticky Safety depend on the ancestor chain. */
  --ahns-display: Georgia, "Times New Roman", serif;
  --ahns-forest: #244535;
  --ahns-ivory: #f7f4ea;
  background-color: var(--ahns-ivory);
  background-image:
    url("/images/ahns-editorial-shadows.webp"),
    radial-gradient(ellipse 48% 30% at 9% 9%, rgba(175,195,169,.32) 0%, transparent 76%),
    radial-gradient(ellipse 42% 29% at 88% 46%, rgba(203,216,197,.22) 0%, transparent 82%),
    linear-gradient(180deg, #eff0e5 0%, #f7f4ea 31%, #f6f3e9 66%, #f7f4ea 100%);
  background-size: min(1850px, 125vw) auto, 100% 100%, 100% 100%, 100% 100%;
  background-position: center top, center, center, center;
  background-repeat: repeat-y, no-repeat, no-repeat, no-repeat;
  @media (max-width: 768px) {
    background-size: 1180px auto, 100% 100%, 100% 100%, 100% 100%;
  }
`;
