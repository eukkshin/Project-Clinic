import styled, { css } from 'styled-components';

/**
 * CSS-only, stationary capsule.
 * 60px icon-only -> 224px text on hover/focus (NO bounce / GSAP / gooey).
 * DOM is portaled to body, avoiding DetailPage PageRoot overflow/stacking traps.
 */
export const SideNav = styled.nav<{ $mobileOpen: boolean; $hidden: boolean }>`
  position: fixed;
  z-index: 9500;
  top: 50%;
  left: clamp(14px, 2.5vw, 38px);
  transform: translateY(-50%);
  box-sizing: border-box;
  width: 60px;
  max-height: calc(100dvh - 120px);
  padding: 7px;
  border: 1px solid rgba(255, 255, 255, 0.85);
  border-radius: 30px;
  overflow-x: hidden;
  overflow-y: auto;
  background: rgba(249, 250, 246, 0.35);
  color: #45624f;
  box-shadow: 0 10px 30px rgba(22, 53, 34, 0.13);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }

  opacity: ${({ $hidden }) => ($hidden ? 0 : 1)};
  visibility: ${({ $hidden }) => ($hidden ? "hidden" : "visible")};
  pointer-events: ${({ $hidden }) => ($hidden ? "none" : "auto")};
  transition:
    width 0.5s ease-in-out,
    opacity 0.16s ease,
    visibility 0.16s ease,
    background 0.5s ease-in-out;

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      width: 224px;
      background: rgba(249, 250, 246, 0.88);
    }
  }
  /* 마우스 클릭 후 focus가 남아 알약이 계속 펼쳐지는 현상을 방지 */
  &:has(:focus-visible) {
    width: 224px;
  }

  @media (max-width: 900px) {
    top: auto;
    left: 14px;
    bottom: calc(84px + env(safe-area-inset-bottom, 0px));
    transform: none;
    width: min(224px, calc(100vw - 28px));
    max-height: min(430px, calc(100dvh - 170px));
    border-radius: 24px;
    opacity: ${({ $mobileOpen, $hidden }) => ($mobileOpen && !$hidden ? 1 : 0)};
    visibility: ${({ $mobileOpen, $hidden }) =>
      $mobileOpen && !$hidden ? "visible" : "hidden"};
    pointer-events: ${({ $mobileOpen, $hidden }) =>
      $mobileOpen && !$hidden ? "auto" : "none"};
    transition:
      opacity 0.16s ease,
      visibility 0.16s ease;
    &:has(:focus-visible) {
      width: min(224px, calc(100vw - 28px));
    }
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

export const NavList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
  width: 100%;
`;

export const NavButton = styled.button<{ $active: boolean }>`
  display: grid;
  grid-template-columns: 44px minmax(0, 1fr);
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
  height: 44px;
  min-height: 44px;
  padding: 0;
  border: 0;
  border-radius: 23px;
  background: ${({ $active }) =>
    $active ? "rgba(40, 75, 55, 0.35)" : "transparent"};
  ${SideNav}:hover & {
    background: ${({ $active }) =>
      $active ? "rgba(40, 75, 55, 0.9)" : "transparent"};
  }
  color: ${({ $active }) => ($active ? "#fff" : "#496a55")};
  text-align: left;
  font-family: inherit;
  cursor: pointer;
  transition:
    background 0.17s ease,
    color 0.17s ease;

  ${({ $active }) =>
    !$active &&
    css`
      &:hover {
        background: rgba(56, 97, 72, 0.09);
        color: #284b37;
      }
    `}
  &:focus-visible {
    outline: 2px solid #608c6c;
    outline-offset: -2px;
  }
`;

export const NavIcon = styled.span`
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  box-sizing: border-box;
  svg {
    display: block;
  }
`;

export const NavText = styled.span`
  box-sizing: border-box;
  display: block;
  min-width: 0;
  padding: 0 10px 0 4px;
  color: inherit;
  font-size: 12.5px;
  font-weight: 500;
  letter-spacing: -0.025em;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  opacity: 0;
  visibility: hidden;
  transition:
    opacity 0.14s ease,
    visibility 0.14s ease;

  @media (hover: hover) and (pointer: fine) {
    ${SideNav}:hover & {
      opacity: 1;
      visibility: visible;
    }
  }
  ${SideNav}:has(:focus-visible) & {
    opacity: 1;
    visibility: visible;
  }
  @media (max-width: 900px) {
    opacity: 1;
    visibility: visible;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

export const MobileToggle = styled.button<{ $hidden: boolean }>`
  display: none;
  @media (max-width: 900px) {
    position: fixed;
    z-index: 9501;
    left: 14px;
    bottom: calc(23px + env(safe-area-inset-bottom, 0px));
    box-sizing: border-box;
    display: grid;
    place-items: center;
    width: 48px;
    height: 48px;
    padding: 0;
    border: 1px solid rgba(255, 255, 255, 0.8);
    border-radius: 50%;
    background: rgba(249, 250, 246, 0.96);
    color: #284b37;
    box-shadow: 0 8px 26px rgba(25, 58, 38, 0.13);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    cursor: pointer;
    opacity: ${({ $hidden }) => ($hidden ? 0 : 1)};
    visibility: ${({ $hidden }) => ($hidden ? "hidden" : "visible")};
    pointer-events: ${({ $hidden }) => ($hidden ? "none" : "auto")};
    transition:
      opacity 0.16s ease,
      visibility 0.16s ease;
    &:focus-visible {
      outline: 2px solid #608c6c;
      outline-offset: 3px;
    }
    @media (prefers-reduced-motion: reduce) {
      transition: none;
    }
  }
`;
