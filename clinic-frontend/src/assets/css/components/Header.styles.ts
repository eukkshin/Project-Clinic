import styled, { css } from "styled-components";

/*
 * Header.styles.ts — Sage/Forest editorial navigation
 * [색상 규칙]
 * ① Hero 최초 상태: 투명 + 흰색 글씨 (사진 위에 자연스럽게 겹침)
 * ② 스크롤된 밝은 테마: 밝은 크림 바탕 + 포레스트 그린 글씨
 * ③ 관리자 다크 테마: 짙은 녹색 바탕 + 밝은 글씨
 * [중요]
 * position: fixed는 ScrollTrigger의 pin 컨테이너 안으로 들어가지 않아야 한다.
 * 즉, Header는 기존처럼 layout.tsx 쪽에서 렌더링하고 Hero 안으로 옮기지 않는다.
 */
interface HeaderProps {
  $hidden: boolean;
  $transparent: boolean;
  $dark: boolean;
  $accent: string;
}

export const HeaderWrapper = styled.header<HeaderProps>`
  --header-text: ${({ $transparent, $dark }) =>
    $transparent || $dark ? "#F7F6F1" : "#2D4836"};
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
  text-shadow: ${({ $transparent }) =>
    $transparent ? "0 2px 20px rgba(15,35,22,.28)" : "none"};
  transition:
    transform 0.5s cubic-bezier(0.22, 1, 0.36, 1),
    background 0.35s ease,
    border-color 0.35s ease,
    color 0.35s ease;
  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;
export const HeaderInner = styled.div`
  width: min(100%, 1860px);
  height: 88px;
  margin: 0 auto;
  padding: 0 clamp(20px, 3.6vw, 68px);
  display: grid;
  grid-template-columns: minmax(130px, 1fr) auto minmax(130px, 1fr);
  align-items: center;
  gap: 20px;
  @media (max-width: 1200px) {
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
  font-family: inherit;
  font-size: clamp(29px, 2.2vw, 40px);
  font-weight: 400;
  line-height: 1;
  letter-spacing: -0.08em;
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
  gap: clamp(18px, 2.1vw, 38px);
  @media (max-width: 1200px) {
    display: none;
  }
`;
export const NavLink = styled.a<{ $active: boolean }>`
  position: relative;
  display: inline-flex;
  align-items: center;
  padding: 12px 0;
  white-space: nowrap;
  color: inherit;
  font-size: 13px;
  font-weight: 400;
  text-decoration: none;
  letter-spacing: -0.015em;
  transition: opacity 0.25s ease;
  &::after {
    content: "";
    position: absolute;
    left: 0;
    bottom: 5px;
    width: 100%;
    height: 1px;
    background: currentColor;
    transform-origin: left;
    transform: scaleX(${({ $active }) => ($active ? 1 : 0)});
    transition: transform 0.3s ease;
  }
  &:hover::after {
    transform: scaleX(1);
  }
  &:hover {
    opacity: 0.78;
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
  gap: clamp(10px, 1.3vw, 22px);
  @media (max-width: 1200px) {
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
  @media (max-width: 1200px) {
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
  @media (max-width: 1200px) {
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
  @media (min-width: 1201px) {
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
