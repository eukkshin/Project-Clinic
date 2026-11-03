import styled, { css } from 'styled-components';

interface HeaderProps {
  $hidden: boolean;

  $transparent: boolean;

  $dark: boolean;

  $accent: string;

  $brandLight: boolean;
}

export const HeaderWrapper = styled.header<HeaderProps>`
  --header-text: ${({ $transparent, $dark, $brandLight }) =>
    $transparent && $brandLight
      ? "#1B3528"
      : $transparent || $dark
        ? "#F7F6F1"
        : "#2D4836"};

  --header-border: ${({ $transparent, $dark }) =>
    $transparent || $dark ? "rgba(255,255,255,.3)" : "rgba(40,75,53,.23)"};

  --header-accent: ${({ $accent }) => $accent};

  position: fixed;

  inset: 0 0 auto 0;

  z-index: 9999;

  width: 100%;

  color: var(--header-text);

  background: ${({ $transparent, $dark }) =>
    $transparent
      ? "transparent"
      : $dark
        ? "rgba(23,53,43,.94)"
        : "rgba(247,247,240,.94)"};

  border-bottom: 1px solid
    ${({ $transparent }) =>
      $transparent ? "transparent" : "var(--header-border)"};

  backdrop-filter: ${({ $transparent }) =>
    $transparent ? "none" : "blur(22px)"};

  -webkit-backdrop-filter: ${({ $transparent }) =>
    $transparent ? "none" : "blur(22px)"};

  transform: translateY(${({ $hidden }) => ($hidden ? "-101%" : "0")});

  text-shadow: ${({ $transparent, $brandLight }) =>
    $transparent && !$brandLight ? "0 2px 20px rgba(15,35,22,.28)" : "none"};

  transition:
    transform 0.5s cubic-bezier(0.22, 1, 0.36, 1),
    background 0.35s ease,
    border-color 0.35s ease,
    color 0.35s ease;

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

export const HeaderInner = styled.div<{ $searchOpen: boolean }>`
  width: min(100%, 1860px);

  height: 88px;

  margin: 0 auto;

  padding: 0 clamp(20px, 2.6vw, 52px);

  display: grid;

  grid-template-columns: ${({ $searchOpen }) =>
    $searchOpen
      ? "minmax(140px, auto) minmax(0, 1fr)"
      : "minmax(135px, 1fr) max-content minmax(0, 1fr)"};

  ${({ $searchOpen }) =>
    $searchOpen &&
    css`
      @media (min-width: 1501px) {
        > :last-child {
          width: 100%;
          min-width: 0;
          justify-self: stretch;
          flex-direction: row-reverse;
          justify-content: flex-start;
          gap: clamp(16px, 2vw, 30px);
        }
      }
    `}

  align-items: center;

  gap: clamp(12px, 1.5vw, 24px);

  @media (max-width: 1500px) {
    grid-template-columns: 1fr auto;
  }

  @media (max-width: 768px) {
    height: 68px;
  }
`;

export const LogoGroup = styled.div`
  min-width: 0;

  a {
    color: inherit;

    text-decoration: none;
  }
`;

export const Logo = styled.h1`
  margin: 0;

  font-family: var(--ahns-display, Georgia, serif);

  font-size: clamp(29px, 2.2vw, 40px);

  font-weight: 800;

  line-height: 1;

  letter-spacing: -0.08em;

  text-shadow: 0px 2px 10px rgba(0, 0, 0, 0.4);
`;

export const LogoImageBox = styled.div`
  position: relative;

  width: 180px;

  height: 49px;

  @media (max-width: 768px) {
    width: 130px;

    height: 38px;
  }
`;

export const NavGroup = styled.nav`
  display: flex;

  align-items: center;

  height: 100%;

  gap: clamp(14px, 1.5vw, 30px);

  white-space: nowrap;

  @media (max-width: 1500px) {
    display: none;
  }
`;

export const UtilGroup = styled.div`
  justify-self: end;

  display: flex;

  align-items: center;

  gap: 12px;
`;

export const DesktopOnly = styled.div`
  display: flex;

  align-items: center;

  gap: clamp(8px, 1vw, 16px);

  min-width: 0;

  @media (max-width: 1500px) {
    display: none;
  }
`;

export const PhoneButton = styled.a`
  display: inline-flex;

  align-items: center;

  gap: 9px;

  color: inherit;

  font-size: 12px;

  text-decoration: none;

  letter-spacing: 0.02em;

  white-space: nowrap;

  span {
    font-size: 9px;

    letter-spacing: 0.17em;

    opacity: 0.7;
  }

  &:hover {
    opacity: 0.76;
  }
`;

export const CtaButton = styled.a`
  display: inline-flex;

  align-items: center;

  justify-content: center;

  gap: 20px;

  height: 41px;

  padding: 0 19px;

  border: 1px solid var(--header-border);

  border-radius: 0;

  background: transparent;

  color: inherit;

  font-size: 12px;

  font-weight: 400;

  text-decoration: none;

  white-space: nowrap;

  transition:
    background 0.3s ease,
    color 0.3s ease,
    transform 0.3s ease;

  &:hover {
    background: rgba(117, 146, 117, 0.2);

    transform: translateY(-2px);
  }

  span {
    font-size: 16px;
  }
`;

export const ContactActionLink = styled.a`
  display: inline-flex;

  align-items: center;

  justify-content: center;

  gap: 7px;

  padding: 8px 2px;

  color: inherit;

  background: transparent;

  border: none;

  font-size: 11px;

  font-weight: 500;

  letter-spacing: -0.01em;

  text-decoration: none;

  white-space: nowrap;

  opacity: 0.85;

  transition:
    opacity 0.25s ease,
    transform 0.25s ease;

  &:hover {
    opacity: 1;

    transform: translateY(-2px);
  }
`;

export const ReservationActionLink = styled.a`
  display: inline-flex;

  align-items: center;

  justify-content: center;

  gap: 10px;

  height: 39px;

  padding: 0 15px;

  background: #294537;

  border: 1px solid #294537;

  border-radius: 2px;

  color: #fff;

  text-decoration: none;

  white-space: nowrap;

  font-size: 11px;

  font-weight: 500;

  letter-spacing: 0.01em;

  transition:
    background 0.3s ease,
    transform 0.3s ease,
    box-shadow 0.3s ease;

  &:hover {
    background: #3c624e;

    transform: translateY(-2px);

    box-shadow: 0 6px 20px rgba(20, 50, 32, 0.14);
  }

  &:focus-visible {
    outline: 2px solid var(--header-accent);

    outline-offset: 3px;
  }
`;

export const ActionStack = styled.div`
  display: flex;

  flex-direction: column;

  align-items: flex-end;

  justify-content: center;

  gap: 5px;

  min-width: 78px;

  white-space: nowrap;
`;

export const ContactStackLink = styled.a`
  display: inline-flex;

  align-items: center;

  justify-content: flex-end;

  gap: 5px;

  color: inherit;

  font-size: 10px;

  font-weight: 400;

  letter-spacing: 0.04em;

  text-decoration: none;

  line-height: 1.2;

  opacity: 0.7;

  transition:
    opacity 0.3s ease,
    transform 0.3s ease;

  &:hover {
    opacity: 1;

    transform: translateX(3px);
  }

  &:focus-visible {
    outline: 2px solid var(--header-accent);

    outline-offset: 4px;
  }
`;

export const ReservationStackLink = styled.a`
  display: inline-flex;

  align-items: center;

  justify-content: flex-end;

  gap: 6px;

  color: inherit;

  font-size: 13px;

  font-weight: 600;

  letter-spacing: -0.025em;

  text-decoration: none;

  line-height: 1.35;

  transition:
    color 0.3s ease,
    transform 0.3s ease;

  span {
    font-size: 13px;

    font-weight: 400;

    transition: transform 0.3s ease;
  }

  &:hover {
    color: var(--header-accent);

    transform: translateX(2px);
  }

  &:hover span {
    transform: translate(2px, -2px);
  }

  &:focus-visible {
    outline: 2px solid var(--header-accent);

    outline-offset: 4px;
  }
`;

export const IconLink = styled.a`
  color: inherit;

  text-decoration: none;

  font-size: 11px;

  letter-spacing: 0.12em;

  white-space: nowrap;

  span {
    margin-left: 3px;
  }

  &:hover {
    opacity: 0.75;
  }
`;

export const MobileContactLink = styled.a`
  display: none;

  color: inherit;

  text-decoration: none;

  font-size: 11px;

  letter-spacing: 0.11em;

  @media (max-width: 1500px) {
    display: inline-flex;
  }

  @media (max-width: 375px) {
    display: none;
  }
`;

export const HamburgerButton = styled.button<{ $open: boolean }>`
  display: none;

  width: 41px;

  height: 41px;

  padding: 0;

  flex-direction: column;

  align-items: center;

  justify-content: center;

  gap: 8px;

  border: 1px solid var(--header-border);

  border-radius: 50%;

  background: transparent;

  color: inherit;

  cursor: pointer;

  span {
    display: block;

    width: 17px;

    height: 1px;

    background: currentColor;

    transition: transform 0.35s ease;
  }

  ${({ $open }) =>
    $open &&
    css`
      span:first-child {
        transform: translateY(4.5px) rotate(45deg);
      }

      span:last-child {
        transform: translateY(-4.5px) rotate(-45deg);
      }
    `}

  @media (max-width: 1500px) {
    display: flex;
  }
`;

export const MobileMenuOverlay = styled.div<{ $open: boolean; $dark: boolean }>`
  position: fixed;

  inset: 0;

  z-index: 9998;

  height: 100dvh;

  overflow-y: auto;

  background: ${({ $dark }) => ($dark ? "#17352B" : "#F1F3E9")};

  color: ${({ $dark }) => ($dark ? "#F6F5ED" : "#244631")};

  visibility: ${({ $open }) => ($open ? "visible" : "hidden")};

  opacity: ${({ $open }) => ($open ? 1 : 0)};

  pointer-events: ${({ $open }) => ($open ? "auto" : "none")};

  transition:
    opacity 0.45s ease,
    visibility 0.45s ease;

  @media (min-width: 1501px) {
    display: none;
  }
`;

export const MobileMenuInner = styled.div`
  max-width: 1050px;

  min-height: 100%;

  margin: 0 auto;

  padding: 145px clamp(25px, 6vw, 80px) 45px;

  display: flex;

  flex-direction: column;

  @media (max-width: 600px) {
    padding-top: 118px;
  }
`;

export const MobileMenuCaption = styled.p`
  margin: 0 0 33px;

  color: inherit;

  opacity: 0.58;

  font-size: 10px;

  letter-spacing: 0.27em;
`;

export const MobileNav = styled.nav`
  display: flex;

  flex-direction: column;
`;

export const MobileNavLink = styled.a`
  display: flex;

  align-items: center;

  gap: 25px;

  padding: clamp(13px, 2.2vh, 22px) 0;

  border-bottom: 1px solid rgba(118, 147, 122, 0.32);

  color: inherit;

  text-decoration: none;

  font-family: inherit;

  font-size: clamp(28px, 5vw, 59px);

  font-weight: 400;

  letter-spacing: -0.058em;

  .number {
    align-self: flex-start;

    margin-top: 11px;

    font-size: 10px;

    letter-spacing: 0;

    opacity: 0.55;
  }

  .arrow {
    margin-left: auto;

    font-size: 20px;

    opacity: 0.55;

    transition: transform 0.3s ease;
  }

  &:hover .arrow {
    transform: translate(5px, -5px);
  }

  &:hover {
    opacity: 0.8;
  }

  @media (max-width: 500px) {
    gap: 16px;
  }
`;

export const MobileMenuFooter = styled.div`
  display: flex;

  align-items: center;

  flex-wrap: wrap;

  gap: 24px;

  margin-top: auto;

  padding-top: 60px;

  a {
    color: inherit;

    text-decoration: none;

    font-size: 12px;

    letter-spacing: 0.06em;
  }

  a:hover {
    opacity: 0.7;
  }
`;

/**
 * Refined AHNS CTA
 * 상담과 예약을 세로로 쌓지 않는다. 검색 오픈에서도 같은 수평 레이아웃.
 */
export const HeaderActionRow = styled.div<{ $searchOpen: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: flex-end;
  flex-direction: row;
  flex-wrap: nowrap;
  gap: ${({ $searchOpen }) =>
    $searchOpen ? "clamp(12px, 1.2vw, 20px)" : "18px"};
  width: max-content;
  flex: 0 0 auto;
  min-width: 0;
  white-space: nowrap;
`;

export const ConsultationEditorialLink = styled.a`
  display: inline-flex;
  position: relative;
  align-items: center;
  justify-content: center;
  gap: 10px;
  height: 44px;
  padding: 0 2px;
  color: inherit;
  text-decoration: none;
  white-space: nowrap;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: -0.02em;
  line-height: 1;
  transition: opacity 220ms ease;

  svg {
    opacity: 0.88;
    flex-shrink: 0;
  }

  > span {
    position: relative;
    display: inline-block;
  }

  > span::after {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    bottom: -7px;
    height: 1px;
    background: currentColor;
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 250ms ease;
  }
  &:hover > span::after,
  &:focus-visible > span::after {
    transform: scaleX(1);
  }
  &:focus-visible {
    outline: 2px solid var(--header-text);
    outline-offset: 5px;
  }

  @media (prefers-reduced-motion: reduce) {
    &,
    > span::after {
      transition: none;
    }
  }
`;

export const ActionDivider = styled.span`
  display: block;
  width: 1px;
  height: 19px;
  background: var(--header-border);
  flex: 0 0 1px;
`;

export const ReservationEditorialLink = styled.a<{
  $onHero: boolean;
  $inverse: boolean;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  flex: 0 0 auto;
  gap: 23px;
  min-width: 135px;
  height: 44px;
  padding: 0 17px 0 19px;
  border: 1px solid
    ${({ $onHero, $inverse }) =>
      $onHero ? "rgba(249, 247, 240, .85)" : $inverse ? "#F8F6F1" : "#193A32"};
  border-radius: 3px;
  background: ${({ $onHero, $inverse }) =>
    $onHero ? "rgba(25, 58, 50, .70)" : $inverse ? "#F8F6F1" : "#193A32"};
  color: ${({ $inverse }) => ($inverse ? "#193A32" : "#F8F6F1")};
  text-decoration: none;
  white-space: nowrap;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: -0.01em;
  line-height: 1;
  text-shadow: none;
  transition:
    background 240ms ease,
    border-color 240ms ease;

  > span {
    display: inline-block;
    font-size: 18px;
    font-weight: 400;
    line-height: 1;
    transition: transform 240ms ease;
  }
  &:hover {
    background: ${({ $onHero, $inverse }) =>
      $onHero ? "rgba(25, 58, 50, .94)" : $inverse ? "#E8E6DD" : "#2C5344"};
  }
  &:hover > span {
    transform: translateX(3px);
  }
  &:focus-visible {
    outline: 2px solid var(--header-text);
    outline-offset: 4px;
  }

  @media (prefers-reduced-motion: reduce) {
    &,
    > span {
      transition: none;
    }
  }
`;
