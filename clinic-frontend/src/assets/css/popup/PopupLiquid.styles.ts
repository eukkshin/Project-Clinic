import styled, { keyframes } from "styled-components";

/*
 * Ahn's Liquid Glass Popup
 * 1) 배경의 모양이 은은하게 비치는 반투명 유리
 * 2) 윗면 하이라이트 + 겹겹이 쌓인 얇은 테두리
 * 3) 아이보리 / 세이지 / 딥그린을 사용한 차분한 컬러
 * 4) backdrop-filter를 지원하지 않는 브라우저에서도 읽을 수 있는 fallback
 */
const overlayAppear = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const glassAppear = keyframes`
  from { opacity: 0; transform: translateY(14px) scale(.965); filter: blur(5px); }
  to { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
`;

export const PopupOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 2147483000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background:
    radial-gradient(
      ellipse at 46% 27%,
      rgba(212, 232, 208, 0.2),
      transparent 56%
    ),
    rgba(13, 33, 26, 0.4);
  -webkit-backdrop-filter: blur(13px) saturate(115%);
  backdrop-filter: blur(13px) saturate(115%);
  animation: ${overlayAppear} 300ms ease-out both;

  @media (max-width: 600px) {
    padding: 18px;
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

export const ModalPopupContainer = styled.div<{$maxWidth?: string}>`
  position: relative;
  isolation: isolate;
  width: min(100%, ${({$maxWidth})=> $maxWidth || '446px'});
  max-height: min(640px, calc(100dvh - 48px));
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-sizing: border-box;
  border-radius: 30px;
  color: #264536;

  /* 유리 내부의 미세한 그라데이션 + 뒤쪽 배경의 반사 */
  background:
    radial-gradient(
      ellipse at 6% -25%,
      rgba(255, 255, 255, 0.94),
      transparent 52%
    ),
    radial-gradient(
      ellipse at 105% 110%,
      rgba(157, 195, 167, 0.35),
      transparent 62%
    ),
    linear-gradient(
      148deg,
      rgba(255, 255, 255, 0.82) 0%,
      rgba(244, 250, 242, 0.7) 50%,
      rgba(230, 242, 230, 0.68) 100%
    );
  border: 1px solid rgba(255, 255, 255, 0.88);
  -webkit-backdrop-filter: blur(34px) saturate(168%);
  backdrop-filter: blur(34px) saturate(168%);
  box-shadow:
    0 32px 85px rgba(13, 41, 28, 0.24),
    0 12px 32px rgba(27, 67, 43, 0.08),
    inset 0 2px 0 rgba(255, 255, 255, 0.9),
    inset 0 -1px 0 rgba(255, 255, 255, 0.48);
  animation: ${glassAppear} 480ms cubic-bezier(0.16, 1, 0.3, 1) both;

  /* 유리 바깥쪽의 두 번째 얇은 가장자리 */
  &::before {
    content: "";
    position: absolute;
    inset: 5px;
    z-index: -1;
    border: 1px solid rgba(255, 255, 255, 0.26);
    border-radius: 25px;
    pointer-events: none;
  }

  @supports not (
    (backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))
  ) {
    background: rgba(247, 251, 245, 0.98);
  }

  @media (max-width: 600px) {
    border-radius: 25px;
    max-height: calc(100dvh - 36px);
    &::before {
      border-radius: 20px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

export const GlassShine = styled.div`
  pointer-events: none;
  position: absolute;
  top: 0;
  left: 12%;
  right: 12%;
  height: 2px;
  z-index: 2;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.95),
    transparent
  );
  filter: blur(0.2px);
`;

export const PopupHeader = styled.header`
  position: relative;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 18px;
  padding: 35px 35px 0;

  @media (max-width: 600px) {
    padding: 30px 26px 0;
  }
`;

export const HeaderCopy = styled.div`
  flex: 1;
  min-width: 0;
`;

export const Eyebrow = styled.span`
  display: block;
  margin-bottom: 10px;
  font-family: var(--ahns-body);
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.21em;
  color: #73927c;
`;

export const PopupTitle = styled.h2`
  margin: 0;
  color: #213f2e;
  font-size: clamp(23px, 4vw, 28px);
  font-weight: 600;
  letter-spacing: -0.045em;
  line-height: 1.35;
  word-break: keep-all;
`;

export const CloseIcon = styled.button`
  flex: 0 0 34px;
  width: 34px;
  height: 34px;
  display: grid;
  place-items: center;
  margin-top: -4px;
  padding: 0;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.88);
  background: rgba(255, 255, 255, 0.36);
  color: #526f59;
  cursor: pointer;
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.9),
    0 3px 8px rgba(35, 62, 41, 0.05);
  transition:
    background 0.22s ease,
    transform 0.22s ease,
    color 0.22s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.8);
    color: #254632;
    transform: rotate(90deg);
  }
  &:focus-visible {
    outline: 2px solid #547d5d;
    outline-offset: 3px;
  }
`;

export const PopupBody = styled.div`
  padding: 19px 35px 27px;
  color: #627465;
  font-size: 14px;
  line-height: 1.85;
  letter-spacing: -0.015em;
  overflow-y: auto;
  overflow-wrap: anywhere;
  white-space: pre-line;
  scrollbar-width: thin;
  scrollbar-color: rgba(100, 136, 104, 0.38) transparent;

  @media (max-width: 600px) {
    padding: 17px 26px 23px;
  }
`;

export const PopupFooter = styled.footer`
  display: flex;
  gap: 10px;
  padding: 20px 35px 32px;
  border-top: 1px solid rgba(255, 255, 255, 0.62);
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.06),
    rgba(255, 255, 255, 0.18)
  );

  @media (max-width: 600px) {
    padding: 17px 26px 26px;
  }
`;

const ButtonBase = styled.button`
  min-height: 48px;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  padding: 0 16px;
  border-radius: 15px;
  font: inherit;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: -0.01em;
  cursor: pointer;
  transition:
    background 0.22s ease,
    transform 0.22s ease,
    box-shadow 0.22s ease,
    border-color 0.22s ease;

  &:hover {
    transform: translateY(-1px);
  }
  &:active {
    transform: translateY(0) scale(0.985);
  }
  &:focus-visible {
    outline: 2px solid #47794e;
    outline-offset: 3px;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
    &:hover,
    &:active {
      transform: none;
    }
  }
`;

export const CancelButton = styled(ButtonBase)`
  border: 1px solid rgba(255, 255, 255, 0.86);
  background: rgba(255, 255, 255, 0.44);
  color: #496151;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.85);
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
  &:hover {
    background: rgba(255, 255, 255, 0.68);
  }
`;

export const ConfirmButton = styled(ButtonBase)`
  border: 1px solid rgba(42, 85, 55, 0.8);
  background: linear-gradient(145deg, #466a4c, #284934);
  color: #f9fcf7;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.18),
    0 7px 17px rgba(35, 78, 46, 0.17);

  span {
    font-size: 15px;
    opacity: 0.8;
    transition: transform 0.22s ease;
  }
  &:hover {
    background: linear-gradient(145deg, #517b59, #2b5538);
    box-shadow: 0 9px 20px rgba(35, 78, 46, 0.22);
    span {
      transform: translate(2px, -2px);
    }
  }
`;

export const BottomGleam = styled.div`
  position: absolute;
  left: 27%;
  right: 27%;
  bottom: 0;
  height: 1px;
  pointer-events: none;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.85),
    transparent
  );
`;
