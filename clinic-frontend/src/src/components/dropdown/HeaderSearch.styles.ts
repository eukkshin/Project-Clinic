import styled, { css, keyframes } from "styled-components";

const dropIn = keyframes`
  from { opacity: 0; transform: translateY(-9px) scale(.985); }
  to { opacity: 1; transform: translateY(0) scale(1); }
`;

export const SearchRoot = styled.div<{ $open: boolean }>`
  position: relative;
  z-index: 15;
  flex: 0 0 auto;
  /* 검색은 오른쪽 빈 공간에서만 확장. NavGroup의 중앙 위치는 변경하지 않음. */
  width: ${({ $open }) =>
    $open ? "clamp(110px, calc((100vw - 1250px) * 0.44), 315px)" : "40px"};
  min-width: 0;
  transition: width 0.5s cubic-bezier(0.22, 1, 0.36, 1);

  @media (max-width: 1200px) {
    width: ${({ $open }) => ($open ? "min(44vw, 360px)" : "40px")};
  }
  @media (max-width: 768px) {
    ${({ $open }) =>
      $open &&
      css`
        position: absolute;
        left: clamp(14px, 4vw, 30px);
        right: 68px;
        top: 50%;
        transform: translateY(-50%);
        width: auto;
      `}
  }
  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

/* 기본/호버 상태를 AccountDropdown의 glass trigger와 동일하게 설정 */
export const SearchForm = styled.form<{ $open: boolean }>`
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  border: 1px solid transparent;
  background: transparent;
  border-radius: 999px;
  overflow: hidden;
  transition:
    background 0.3s ease,
    border-color 0.3s ease,
    box-shadow 0.3s ease,
    backdrop-filter 0.3s ease;
  ${({ $open }) =>
    $open &&
    css`
      background: rgba(255, 255, 255, 0.1);
      border-color: rgba(255, 255, 255, 0.2);
    `}
  &:hover, &:focus-within {
    background: rgba(255, 255, 255, 0.16);
    border-color: rgba(255, 255, 255, 0.35);
    -webkit-backdrop-filter: blur(14px) saturate(160%);
    backdrop-filter: blur(14px) saturate(160%);
    box-shadow:
      0 4px 20px rgba(36, 69, 53, 0.08),
      inset 0 1px 0 rgba(255, 255, 255, 0.45),
      inset 0 -1px 0 rgba(255, 255, 255, 0.12);
  }
  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

export const SearchInput = styled.input`
  flex: 1 1 auto;
  min-width: 0;
  height: 100%;
  padding: 0 7px 0 19px;
  border: 0;
  outline: none;
  background: transparent;
  color: inherit;
  font-family: inherit;
  font-size: 13px;
  letter-spacing: -0.025em;
  &::placeholder {
    color: currentColor;
    opacity: 0.65;
  }
`;

export const SearchToggle = styled.button`
  display: inline-grid;
  place-items: center;
  flex: 0 0 40px;
  width: 40px;
  height: 40px;
  padding: 0;
  border: 0;
  border-radius: 50%;
  color: inherit;
  background: transparent;
  cursor: pointer;
  transition:
    background 0.25s ease,
    transform 0.25s ease;
  &:hover {
    background: transparent;
    transform: none;
  }
  &:focus-visible {
    outline: 2px solid currentColor;
    outline-offset: -3px;
  }
`;

export const SearchPanel = styled.div<{ $transparent: boolean }>`
  position: absolute;
  top: ${({ $transparent }) =>
    $transparent ? "calc(100% + 13px)" : "calc(100% + 30px)"};
  right: 0;
  z-index: 30;
  width: min(430px, calc(100vw - 32px));
  max-height: min(70svh, 660px);
  overflow: auto;
  box-sizing: border-box;
  padding: 27px clamp(20px, 2.2vw, 35px) 20px;
  border-radius: 22px;
  border: 1px solid rgba(255, 255, 255, 0.65);
  color: #244535;
  text-shadow: none;
  transition: top 0.25s ease;
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
  box-shadow:
    0 16px 45px rgba(22, 48, 33, 0.16),
    inset 0 1px 0 rgba(255, 255, 255, 0.65);
  animation: ${dropIn} 0.22s cubic-bezier(0.2, 0.8, 0.2, 1) both;
  @media (max-width: 768px) {
    right: -54px;
    top: calc(100% + 24px);
    width: calc(100vw - 28px);
    padding: 22px 21px 17px;
  }
  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

export const PanelHeader = styled.div`
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(66, 105, 74, 0.18);
`;
export const PanelEyebrow = styled.p`
  margin: 0 0 8px;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.28em;
  color: #739178;
`;
export const PanelTitle = styled.h3`
  margin: 0;
  font-family: var(--ahns-body, Georgia, serif);
  font-size: clamp(24px, 2.2vw, 34px);
  font-weight: 500;
  letter-spacing: -0.04em;
`;
export const PanelNote = styled.p`
  margin: 7px 0 0;
  color: #6f8574;
  font-size: 10px;
`;
export const ResultList = styled.ul`
  list-style: none;
  padding: 12px 0 4px;
  margin: 0;
  li + li {
    border-top: 1px solid rgba(74, 110, 81, 0.1);
  }
`;
export const ResultLink = styled.a`
  display: flex;
  width: 100%;
  box-sizing: border-box;
  align-items: center;
  justify-content: space-between;
  padding: 14px 9px;
  gap: 10px;
  border-radius: 9px;
  color: #284b34;
  text-decoration: none;
  transition:
    background 0.2s ease,
    padding 0.2s ease;
  &:hover,
  &:focus-visible {
    background: rgba(109, 153, 112, 0.12);
    padding-left: 15px;
  }
`;
export const ResultDisabled = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  text-align: left;
  gap: 10px;
  width: 100%;
  padding: 14px 9px;
  border: 0;
  color: #476951;
  background: transparent;
  border-radius: 9px;
  cursor: pointer;
  &:hover {
    background: rgba(109, 153, 112, 0.08);
  }
`;
export const ResultTitle = styled.span`
  display: block;
  font-size: 13px;
  font-weight: 600;
`;
export const ResultParent = styled.span`
  display: block;
  margin-top: 4px;
  color: #7e9381;
  font-size: 10px;
`;
export const Preparing = styled.span`
  flex: none;
  font-size: 10px;
  color: #8a9e8b;
`;
export const EmptyState = styled.p`
  margin: 0;
  padding: 27px 7px;
  color: #6c826f;
  font-size: 12px;
`;
export const PopularList = styled.ul`
  margin: 0;
  padding: 12px 0 7px;
  list-style: none;
`;
export const PopularButton = styled.button`
  display: flex;
  align-items: center;
  gap: 16px;
  width: 100%;
  padding: 11px 9px;
  border: 0;
  border-radius: 9px;
  background: transparent;
  text-align: left;
  font: inherit;
  font-size: 13px;
  color: #34553c;
  cursor: pointer;
  > svg {
    margin-left: auto;
    opacity: 0.45;
  }
  &:hover,
  &:focus-visible {
    background: rgba(117, 157, 119, 0.12);
  }
`;
export const PopularIndex = styled.span`
  color: #849b88;
  font-size: 11px;
  font-variant-numeric: tabular-nums;
`;
export const PanelFooter = styled.p`
  margin: 11px 0 0;
  padding-top: 13px;
  border-top: 1px solid rgba(66, 105, 74, 0.16);
  color: #86988a;
  font-size: 10px;
  letter-spacing: 0.015em;
`;
