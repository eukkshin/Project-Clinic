import styled, { css } from 'styled-components';

/**
 * AHNS Detail SideNav
 * - PC: 왼쪽 고정, 평소 희미한 Liquid Glass / Hover 또는 Focus 시 선명
 * - Mobile: 작은 토글 버튼으로 접고 펼침
 * - GSAP은 단일 LiquidIndicator의 위치/형태를 애니메이션
 */

export const SideNav = styled.nav<{ $mobileOpen: boolean }>`
  position: fixed;
  z-index: 120;
  top: 50%;
  left: clamp(12px, 2.5vw, 38px);
  transform: translateY(-50%);

  width: 204px;
  max-height: calc(100dvh - 130px);
  overflow-y: auto;
  box-sizing: border-box;
  padding: 18px 12px 14px;

  border: 1px solid rgba(255, 255, 255, 0.48);
  border-radius: 24px;
  background: rgba(247, 250, 244, 0.36);
  -webkit-backdrop-filter: blur(17px) saturate(150%);
  backdrop-filter: blur(17px) saturate(150%);

  box-shadow:
    0 10px 34px rgba(28, 62, 40, 0.09),
    inset 0 1px 0 rgba(255, 255, 255, 0.64);

  /* 본문/풀스크린 Hero를 방해하지 않도록 기본 상태를 희미하게 */
  opacity: 0.32;
  transition:
    opacity 0.36s cubic-bezier(0.22, 1, 0.36, 1),
    background 0.36s ease,
    border-color 0.36s ease,
    box-shadow 0.36s ease,
    backdrop-filter 0.36s ease;

  &:hover,
  &:focus-within {
    opacity: 1;
    background: rgba(247, 250, 244, 0.69);
    border-color: rgba(255, 255, 255, 0.72);
    -webkit-backdrop-filter: blur(25px) saturate(165%);
    backdrop-filter: blur(25px) saturate(165%);
    box-shadow:
      0 18px 48px rgba(28, 62, 40, 0.16),
      inset 0 1px 0 rgba(255, 255, 255, 0.82);
  }

  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(64, 105, 77, 0.22);
    border-radius: 999px;
  }

  @media (max-width: 768px) {
    top: auto;
    left: 14px;
    bottom: calc(84px + env(safe-area-inset-bottom, 0px));
    transform: ${({ $mobileOpen }) =>
      $mobileOpen ? 'translateY(0) scale(1)' : 'translateY(12px) scale(0.96)'};
    transform-origin: bottom left;
    width: min(204px, calc(100vw - 28px));
    max-height: min(400px, calc(100dvh - 180px));
    opacity: ${({ $mobileOpen }) => ($mobileOpen ? 1 : 0)};
    visibility: ${({ $mobileOpen }) => ($mobileOpen ? 'visible' : 'hidden')};
    pointer-events: ${({ $mobileOpen }) => ($mobileOpen ? 'auto' : 'none')};

    background: rgba(247, 250, 244, 0.85);
    -webkit-backdrop-filter: blur(24px) saturate(165%);
    backdrop-filter: blur(24px) saturate(165%);
    transition:
      transform 0.33s cubic-bezier(0.22, 1, 0.36, 1),
      opacity 0.33s ease,
      visibility 0.33s ease;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

export const NavEyebrow = styled.div`
  margin: 0 8px 13px;
  color: #66806b;
  font-size: 9px;
  font-weight: 700;
  line-height: 1.4;
  letter-spacing: 0.15em;
  white-space: nowrap;
`;

export const NavList = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

export const LiquidIndicator = styled.div<{ $ready: boolean }>`
  position: absolute;
  z-index: 0;
  top: 0;
  left: 0;
  width: 100%;
  height: 44px;
  box-sizing: border-box;
  pointer-events: none;
  opacity: ${({ $ready }) => ($ready ? 1 : 0)};

  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.46);
  background: linear-gradient(
    145deg,
    rgba(79, 132, 93, 0.95),
    rgba(34, 79, 56, 0.97)
  );
  box-shadow:
    0 6px 22px rgba(36, 69, 53, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.37),
    inset 0 -2px 7px rgba(10, 39, 24, 0.17);
  will-change: transform;

  &::before {
    content: '';
    position: absolute;
    top: 3px;
    left: 14%;
    width: 72%;
    height: 36%;
    border-radius: 50%;
    background: radial-gradient(
      ellipse,
      rgba(255, 255, 255, 0.29),
      transparent 75%
    );
  }
`;

export const LiquidRipple = styled.span`
  position: absolute;
  z-index: 0;
  inset: -4px;
  border: 1px solid rgba(129, 191, 139, 0.72);
  border-radius: inherit;
  box-shadow: 0 0 21px rgba(139, 203, 153, 0.28);
  opacity: 0;
  pointer-events: none;
`;

export const NavButton = styled.button<{ $active: boolean }>`
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 11px;
  width: 100%;
  height: 44px;
  padding: 0 14px;
  box-sizing: border-box;

  border: 0;
  border-radius: 999px;
  background: transparent;
  color: ${({ $active }) => ($active ? '#ffffff' : '#365743')};
  text-align: left;
  font: inherit;
  font-size: 12px;
  font-weight: ${({ $active }) => ($active ? 700 : 600)};
  white-space: nowrap;
  cursor: pointer;
  transition:
    color 0.2s ease,
    background 0.2s ease;

  ${({ $active }) =>
    !$active &&
    css`
      &:hover {
        background: rgba(156, 191, 160, 0.22);
      }
    `}

  &:focus-visible {
    outline: 2px solid #6f9a79;
    outline-offset: 2px;
  }
`;

export const NavNumber = styled.span<{ $active: boolean }>`
  color: ${({ $active }) =>
    $active ? 'rgba(230, 248, 233, 0.82)' : '#799581'};
  font-size: 10px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
`;

export const NavText = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const NavBottomLine = styled.div`
  width: 27px;
  height: 2px;
  margin: 13px 8px 0;
  border-radius: 999px;
  background: rgba(99, 143, 109, 0.45);
`;

export const MobileToggle = styled.button`
  display: none;

  @media (max-width: 768px) {
    position: fixed;
    z-index: 121;
    display: grid;
    place-items: center;
    left: 14px;
    bottom: calc(24px + env(safe-area-inset-bottom, 0px));
    width: 46px;
    height: 46px;

    border: 1px solid rgba(255, 255, 255, 0.67);
    border-radius: 50%;
    background: rgba(244, 250, 242, 0.78);
    color: #244535;
    -webkit-backdrop-filter: blur(19px) saturate(160%);
    backdrop-filter: blur(19px) saturate(160%);
    box-shadow:
      0 7px 25px rgba(28, 62, 40, 0.14),
      inset 0 1px 0 rgba(255, 255, 255, 0.75);
    cursor: pointer;

    &:focus-visible {
      outline: 2px solid #6f9a79;
      outline-offset: 3px;
    }
  }
`;
