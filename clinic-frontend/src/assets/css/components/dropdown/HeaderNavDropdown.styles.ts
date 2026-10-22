import styled from "styled-components";

/** Header와 같은 높이를 차지해 패널이 Header 하단에서 시작하도록 한다. */
export const NavRoot = styled.div`
  position: relative;
  display: flex;
  height: 100%;
  align-self: stretch;
  align-items: center;
  z-index: 1;

  &:hover,
  &:focus-within {
    z-index: 3;
  }
`;

export const Chevron = styled.span<{ $open: boolean }>`
  display: inline-block;
  margin-left: 7px;
  font-size: 14px;
  line-height: 1;
  opacity: 0.65;
  transform: translateY(-2px)
    rotate(${({ $open }) => ($open ? "180deg" : "0deg")});
  transition: transform 0.3s ease;
`;

export const NavTrigger = styled.button<{ $active: boolean; $open: boolean }>`
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 1px;
  padding: 12px 0;
  border: 0;
  background: none;
  color: inherit;
  font: inherit;
  font-size: 13px;
  font-weight: 400;
  letter-spacing: -0.015em;
  white-space: nowrap;
  cursor: pointer;
  transition: opacity 0.2s ease;

  &::after {
    content: "";
    position: absolute;
    left: 0;
    bottom: 5px;
    width: 100%;
    height: 1px;
    background: currentColor;
    transform-origin: left;
    transform: scaleX(${({ $active, $open }) => ($active || $open ? 1 : 0)});
    transition: transform 0.28s ease;
  }

  &:hover {
    opacity: 0.8;
  }
  &:focus-visible {
    outline: 2px solid currentColor;
    outline-offset: 5px;
  }
`;

/**
 * Header의 투명/스크롤 상태와 동일한 배경 톤을 사용한다.
 * clip-path만 위에서 아래로 해제해 헤더 안쪽으로 걸치는 현상을 방지한다.
 */
export const NavPanel = styled.div<{
  $open: boolean;
  $transparent: boolean;
  $dark: boolean;
}>`
  position: absolute;
  top: 100%;
  left: 50%;
  z-index: 20;
  box-sizing: border-box;
  width: 140px;
  padding: 6px 0;
  overflow: hidden;
  border: 1px solid
    ${({ $transparent, $dark }) =>
      $transparent
        ? "rgba(241,248,235,0.5)"
        : $dark
          ? "rgba(255,255,255,0.16)"
          : "rgba(40,75,53,0.12)"};
  border-top: 0;
  border-radius: 0;

  background: ${({ $transparent, $dark }) =>
    $transparent
      ? "rgba(219,233,216,0.70)"
      : $dark
        ? "rgba(23,53,43,0.94)"
        : "rgba(247,247,240,0.94)"};
  color: ${({ $dark, $transparent }) =>
    $dark && !$transparent ? "#f7f6f1" : "#244535"};
  text-shadow: none;
  -webkit-backdrop-filter: blur(20px) saturate(120%);
  backdrop-filter: blur(20px) saturate(120%);
  box-shadow: 0 11px 20px rgba(20, 48, 31, 0.08);

  opacity: ${({ $open }) => ($open ? 1 : 0)};
  transform: translateX(-50%);
  clip-path: inset(${({ $open }) => ($open ? "0 0 0 0" : "0 0 100% 0")});
  visibility: ${({ $open }) => ($open ? "visible" : "hidden")};
  pointer-events: ${({ $open }) => ($open ? "auto" : "none")};
  transition:
    clip-path 0.34s cubic-bezier(0.22, 1, 0.36, 1),
    opacity 0.25s ease,
    visibility 0.34s,
    background 0.35s ease,
    border-color 0.35s ease,
    color 0.35s ease;

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

export const NavPanelInner = styled.div`
  display: flex;
  flex-direction: column;
`;

export const DropdownLink = styled.a<{ $active: boolean }>`
  display: flex;
  align-items: center;
  min-height: 38px;
  padding: 10px 13px;
  border-radius: 0;
  color: inherit;
  background: ${({ $active }) =>
    $active ? "rgba(111,147,113,0.16)" : "transparent"};
  text-decoration: none;
  text-shadow: none;
  font-size: 12px;
  font-weight: ${({ $active }) => ($active ? 600 : 400)};
  line-height: 1.4;
  white-space: normal;
  overflow-wrap: break-word;
  transition: background 0.2s ease;

  &:hover,
  &:focus-visible {
    background: rgba(111, 147, 113, 0.2);
  }

  &:focus-visible {
    outline: 2px solid currentColor;
    outline-offset: -2px;
  }
`;
