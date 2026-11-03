import styled, { css, keyframes } from "styled-components";

const reveal = keyframes`
  from {
    opacity: 0;
    transform: translateY(-6px) scale(0.97);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`;

export const Root = styled.div<{ $mobile: boolean }>`
  position: relative;
  display: inline-flex;
  align-items: center;

  ${({ $mobile }) =>
    $mobile &&
    css`
      width: 100%;
    `}
`;

export const Trigger = styled.button<{ $mobile: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  min-height: 36px;
  padding: 7px 11px;
  width: 74px;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 999px;
  white-space: nowrap;
  overflow: hidden;
  flex-shrink: 0;

  color: inherit;
  font: inherit;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.02em;

  cursor: pointer;

  transition:
    background 0.25s ease,
    border-color 0.25s ease,
    box-shadow 0.25s ease;

  &:hover,
  &[aria-expanded="true"] {
    background: rgba(255, 255, 255, 0.16);
    border-color: rgba(255, 255, 255, 0.35);

    backdrop-filter: blur(14px) saturate(160%);
    -webkit-backdrop-filter: blur(14px) saturate(160%);

    box-shadow:
      0 4px 20px rgba(36, 69, 53, 0.08),
      inset 0 1px 0 rgba(255, 255, 255, 0.4);
  }

  &:focus-visible {
    outline: 2px solid #69826b;
    outline-offset: 3px;
  }

  ${({ $mobile }) =>
    $mobile &&
    css`
      width: 100%;
      justify-content: space-between;
    `}
`;

export const Chevron = styled.span<{ $open: boolean }>`
  display: inline-flex;
  align-items: center;
  opacity: 0.7;

  transform: rotate(${({ $open }) => ($open ? "180deg" : "0deg")});
  transition: transform 0.2s ease;
`;

export const GlassPanel = styled.div<{
  $mobile: boolean;
  $transparent: boolean;
}>`
  position: absolute;
  top: ${({ $transparent }) =>
    $transparent ? "calc(100% + 13px)" : "calc(100% + 32px)"};
  right: 0;
  z-index: 100;

  width: 132px;
  padding: 6px;
  box-sizing: border-box;

  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.65);

  overflow: hidden;
  isolation: isolate;

  color: #244535;
  transition: top 0.25s ease;

  background:
    radial-gradient(
      ellipse at 10% -10%,
      rgba(255, 255, 255, 0.65),
      transparent 70%
    ),
    linear-gradient(
      145deg,
      rgba(255, 255, 255, 0.62),
      rgba(229, 240, 227, 0.48)
    );

  backdrop-filter: blur(26px) saturate(145%);
  -webkit-backdrop-filter: blur(26px) saturate(145%);

  box-shadow:
    0 12px 30px rgba(22, 48, 33, 0.14),
    inset 0 1px 0 rgba(255, 255, 255, 0.7);

  animation: ${reveal} 0.22s cubic-bezier(0.2, 0.8, 0.2, 1) both;

  ${({ $mobile }) =>
    $mobile &&
    css`
      position: static;
      width: 100%;
      margin-top: 8px;
    `}

  @supports not (backdrop-filter: blur(1px)) {
    background: #f3f8f0;
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

export const LanguageItem = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;

  width: 100%;
  height: 37px;
  padding: 0 11px;

  background: ${({ $active }) =>
    $active ? "rgba(95, 142, 104, 0.13)" : "transparent"};

  border: 0;
  border-radius: 9px;

  color: ${({ $active }) => ($active ? "#214c32" : "#4c6653")};

  font-family: inherit;
  font-size: 11px;
  font-weight: ${({ $active }) => ($active ? 650 : 500)};

  cursor: pointer;

  transition:
    background 0.2s ease,
    color 0.2s ease;

  &:hover {
    background: rgba(95, 142, 104, 0.16);
    color: #214c32;
  }

  &:focus-visible {
    outline: 2px solid #69826b;
    outline-offset: -2px;
  }

  em {
    font-style: normal;
    font-weight: 500;
    color: #69826b;
    text-transform: uppercase;
    letter-spacing: 0.02em;
    font-size: 9px;
  }
`;

export const Check = styled.span`
  display: inline-flex;
  color: #426d4c;
  font-size: 11px;
`;
