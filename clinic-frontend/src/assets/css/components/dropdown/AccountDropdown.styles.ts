import styled, { css, keyframes } from "styled-components";

/* 헤더 전체의 스크롤/레이아웃은 바꾸지 않고 계정 버튼에만 적용합니다. */
const reveal = keyframes`
  from { opacity: 0; transform: translateY(-6px) scale(.985); }
  to { opacity: 1; transform: translateY(0) scale(1); }
`;

export const AccountRoot = styled.div<{ $mobile: boolean }>`
  position: relative;
  display: inline-flex;
  align-items: center;
  ${({ $mobile }) =>
    $mobile &&
    css`
      width: 100%;
      display: block;
    `}
`;

export const AccountTrigger = styled.button<{
  $mobile: boolean;
  $open: boolean;
}>`
  display: inline-flex;
  align-items: center;
  gap: 9px;
  width: auto;
  min-height: 40px;
  padding: 5px 9px 5px 6px;
  border: 1px solid
    ${({ $open }) => ($open ? "rgba(255,255,255,.58)" : "transparent")};
  border-radius: 999px;
  background: ${({ $open }) =>
    $open ? "rgba(255,255,255,.13)" : "transparent"};
  color: inherit;
  font: inherit;
  cursor: pointer;
  white-space: nowrap;
  transition:
    background 0.18s ease,
    border-color 0.18s ease;

  &:hover {
    background: rgba(137, 167, 138, 0.16);
  }
  &:focus-visible {
    outline: 2px solid #77997d;
    outline-offset: 3px;
  }
  ${({ $mobile }) =>
    $mobile &&
    css`
      width: 100%;
      justify-content: flex-start;
      padding: 11px 13px;
      border: 1px solid rgba(111, 144, 119, 0.22);
      background: rgba(143, 170, 147, 0.1);
    `}
`;

export const Avatar = styled.span`
  display: inline-grid;
  flex: none;
  place-items: center;
  width: 28px;
  height: 28px;
  border: 1px solid rgba(255, 255, 255, 0.52);
  border-radius: 50%;
  background: linear-gradient(145deg, #86a68b, #345a41);
  color: #fff;
  font-family: Georgia, serif;
  font-size: 13px;
  font-weight: 500;
  text-shadow: none;
  box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.36);
`;

export const TriggerName = styled.span`
  display: inline-block;
  max-width: 105px;
  overflow: hidden;
  text-overflow: ellipsis;
  color: inherit;
  font-size: 12px;
  font-weight: 550;
  letter-spacing: -0.03em;
`;

export const Chevron = styled.span<{ $open: boolean }>`
  display: inline-flex;
  align-items: center;
  color: inherit;
  opacity: 0.72;
  transition: transform 0.18s ease;
  transform: rotate(${({ $open }) => ($open ? "180deg" : "0deg")});
`;

export const GlassPanel = styled.div<{ $mobile: boolean }>`
  position: absolute;
  top: calc(100% + 13px);
  right: 0;
  z-index: 30;
  width: 284px;

  overflow: hidden;
  isolation: isolate;
  border-radius: 22px;

  color: #244535;
  text-shadow: none;

  background:
    radial-gradient(
      ellipse at 10% -10%,
      rgba(255, 255, 255, 0.55),
      transparent 65%
    ),
    linear-gradient(
      145deg,
      rgba(255, 255, 255, 0.52),
      rgba(229, 240, 227, 0.42)
    );

  -webkit-backdrop-filter: blur(30px) saturate(135%);
  backdrop-filter: blur(30px) saturate(135%);

  border: 1px solid rgba(255, 255, 255, 0.65);

  box-shadow:
    0 16px 45px rgba(22, 48, 33, 0.16),
    inset 0 1px 0 rgba(255, 255, 255, 0.65);

  animation: ${reveal} 0.22s cubic-bezier(0.2, 0.8, 0.2, 1) both;

  /* 추가: 반투명 밝기 보정 레이어 */
  &::before {
    content: "";
    position: absolute;
    inset: 0;
    z-index: 0;
    pointer-events: none;

    background: rgba(245, 250, 245, 0.22);
  }

  /* 글자와 메뉴를 보정 레이어 위에 배치 */
  & > div,
  & > button {
    position: relative;
    z-index: 1;
  }

  /* 기존 모바일 스타일도 유지 */
  ${({ $mobile }) =>
    $mobile &&
    css`
      position: relative;
      top: auto;
      right: auto;
      width: min(100%, 360px);
      margin-top: 10px;
    `}

  @supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
    background: #f3f8f0;
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

export const GlassShine = styled.span`
  position: absolute;
  top: 0;
  left: 12%;
  right: 12%;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.95),
    transparent
  );
  pointer-events: none;
`;

export const ProfileSection = styled.div`
  padding: 21px 22px 19px;
`;
export const ProfileEyebrow = styled.span`
  display: block;
  margin-bottom: 8px;
  color: #48654f;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.16em;
`;
export const ProfileName = styled.p`
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  color: #244535;
  line-height: 1.5;
  letter-spacing: -0.04em;
  overflow-wrap: anywhere;
`;
export const ProfileCaption = styled.span`
  display: block;
  margin-top: 5px;
  font-size: 10px;
  letter-spacing: 0.075em;
  color: #4f6c56;
`;

export const MenuDivider = styled.div`
  height: 1px;
  margin: 0 16px;
  background: rgba(77, 109, 83, 0.13);
`;
export const MenuItems = styled.div`
  padding: 9px 9px;
  display: flex;
  flex-direction: column;
  gap: 2px;
`;
const menuRow = css`
  display: flex;
  align-items: center;
  width: 100%;
  min-height: 42px;
  padding: 0 11px;
  border: 0;
  border-radius: 12px;
  background: transparent;
  text-decoration: none;
  text-align: left;
  color: #385844;
  font-family: inherit;
  font-size: 12px;
  font-weight: 520;
  letter-spacing: -0.02em;
  gap: 11px;
  box-sizing: border-box;
`;
export const MenuIcon = styled.span`
  display: inline-flex;
  flex: none;
  align-items: center;
  justify-content: center;
  color: #365b40;
`;
export const MenuLabel = styled.span`
  flex: 1;
  min-width: 0;
`;
export const MenuArrow = styled.span`
  font-size: 14px;
  opacity: 0.53;
`;
export const MenuLink = styled.a`
  ${menuRow}
  cursor: pointer;
  transition:
    background 0.16s ease,
    color 0.16s ease;
  &:hover {
    background: rgba(88, 134, 96, 0.11);
    color: #21462e;
  }
  &:focus-visible {
    outline: 2px solid #628c69;
    outline-offset: -2px;
  }
`;
export const MenuUnavailable = styled.div`
  ${menuRow}
  opacity: 1;
  color: #244535;
  cursor: default;
`;
export const ComingSoon = styled.span`
  flex: none;
  padding: 4px 6px;
  border: 1px solid rgba(100, 131, 103, 0.15);
  border-radius: 6px;
  color: #68866b;
  font-size: 9px;
`;
export const LogoutButton = styled.button`
  ${menuRow}
  height: 46px;
  width: calc(100% - 18px);
  margin: 9px;
  color: #884b47;
  cursor: pointer;
  ${MenuIcon} {
    color: #884b47;
  }
  &:hover {
    background: rgba(160, 93, 81, 0.09);
  }
  &:focus-visible {
    outline: 2px solid #a67f77;
    outline-offset: -2px;
  }
`;
export const GlassBottom = styled.span`
  position: absolute;
  bottom: 0;
  left: 16%;
  right: 16%;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.9),
    transparent
  );
  pointer-events: none;
`;
