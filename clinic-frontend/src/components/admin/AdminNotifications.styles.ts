import { FiBell } from "react-icons/fi";
import styled, { keyframes } from "styled-components";

const ringBell = keyframes`
  0% { transform: rotate(0deg); }
  20% { transform: rotate(15deg); }  /* 오른쪽으로 회전 */
  40% { transform: rotate(-15deg); } /* 왼쪽으로 회전 */
  60% { transform: rotate(10deg); }  /* 조금 덜 오른쪽으로 */
  80% { transform: rotate(-10deg); } /* 조금 덜 왼쪽으로 */
  100% { transform: rotate(0deg); }  /* 제자리로 */
`;

const floatIn = keyframes`
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const Anchor = styled.aside`
  position: fixed;
  right: max(22px, env(safe-area-inset-right));
  bottom: max(22px, env(safe-area-inset-bottom));
  z-index: 1100;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  font-family: var(--ahns-body, Pretendard, sans-serif);
  @media (max-width: 680px) {
    right: 14px;
    bottom: 14px;
  }
`;

export const StyledFiIcon = styled(FiBell)`
  font-size: 23px;
  color: #fff;
  transition:
    transform 0.2s ease,
    color 0.2s;
  transform-origin: 50% 0%;
`;

export const BellButton = styled.button`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 58px;
  height: 58px;
  border: 1px solid #416c54;
  border-radius: 19px;
  background: #1b4d3e;
  color: #fff;
  box-shadow: 0 12px 32px rgba(17, 47, 33, 0.28);
  cursor: pointer;
  transition:
    transform 0.18s ease,
    background 0.18s ease;

  &:hover {
    background: #2a644f;
    transform: translateY(-3px);

    ${StyledFiIcon} {
      animation: ${ringBell} 0.5s ease-in-out;
    }
  }

  &:focus-visible {
    outline: 3px solid #afceae;
    outline-offset: 3px;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;

    &:hover ${StyledFiIcon} {
      animation: none;
    }
  }
`;

export const Counter = styled.span`
  position: absolute;
  right: -7px;
  top: -7px;
  min-width: 23px;
  height: 23px;
  padding: 0 5px;
  border-radius: 50px;
  background: #b74e48;
  color: white;
  text-align: center;
  font:
    750 11px/23px Pretendard,
    sans-serif;
  box-shadow: 0 2px 7px rgba(90, 34, 24, 0.22);
`;
export const Panel = styled.section`
  width: min(385px, calc(100vw - 28px));
  max-height: min(65dvh, 540px);
  margin-bottom: 13px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: #fff;
  color: #294334;
  border: 1px solid #e3eae2;
  border-radius: 17px;
  box-shadow: 0 20px 60px rgba(17, 44, 33, 0.22);
  animation: ${floatIn} 0.18s ease both;
  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;
export const Head = styled.div`
  display: flex;
  align-items: start;
  justify-content: space-between;
  padding: 18px 19px 9px;
  strong {
    display: block;
    font-size: 16px;
    letter-spacing: -0.03em;
  }
  small {
    display: block;
    margin-top: 5px;
    color: #819489;
    font-size: 9px;
    letter-spacing: 0.12em;
  }
  button {
    border: 0;
    background: transparent;
    color: #6b7e70;
    cursor: pointer;
    padding: 3px;
  }
`;
export const Status = styled.div<{ $connected: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 0 19px 14px;
  font-size: 11px;
  color: #718476;
  border-bottom: 1px solid #eef1ed;
  span {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: ${(p) => (p.$connected ? "#3ba16a" : "#c49b4e")};
  }
`;
export const List = styled.div`
  overflow-y: auto;
  min-height: 54px;
  scrollbar-width: thin;
`;
export const Alert = styled.article<{ $read: boolean }>`
  padding: 14px 19px;
  border-bottom: 1px solid #eff1ed;
  background: ${(p) => (p.$read ? "#fff" : "#f1f7f2")};
  > div {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 7px;
    color: #819286;
    font-size: 10.5px;
  }
  > a {
    display: block;
    margin: 8px 0 7px;
    color: #1d503d;
    font-size: 13px;
    line-height: 1.5;
    font-weight: 700;
    text-decoration: none;
  }
  > a:hover {
    text-decoration: underline;
  }
  > button {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 0;
    border: 0;
    background: none;
    color: #4f7c60;
    cursor: pointer;
    font-size: 11px;
  }
`;
export const AlertLabel = styled.strong`
  color: #52715c;
`;
export const Empty = styled.p`
  margin: 0;
  padding: 32px;
  text-align: center;
  color: #819487;
  font-size: 13px;
`;
export const Foot = styled.footer`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 19px;
  gap: 8px;
  border-top: 1px solid #edf1eb;
  font-size: 11px;
  a {
    font-weight: 700;
    color: #275e44;
    text-decoration: none;
  }
  a:hover {
    text-decoration: underline;
  }
  span {
    color: #87978a;
  }
`;
export const Toast = styled.div`
  width: min(365px, calc(100vw - 28px));
  margin-bottom: 13px;
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 15px;
  border-radius: 14px;
  border: 1px solid #d5e4d9;
  background: #fff;
  box-shadow: 0 12px 32px rgba(17, 44, 33, 0.17);
  color: #2b523c;
  animation: ${floatIn} 0.2s ease both;
  > div:nth-child(2) {
    flex: 1;
    min-width: 0;
  }
  strong {
    font-size: 12px;
  }
  p {
    margin: 5px 0 7px;
    font-size: 12px;
    line-height: 1.5;
    font-weight: 500;
  }
  a {
    font-size: 11px;
    color: #246747;
    font-weight: 700;
  }
  > button {
    padding: 0;
    border: none;
    background: transparent;
    cursor: pointer;
    color: #708474;
  }
  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;
export const ToastIcon = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 9px;
  background: #e9f1e9;
  color: #2c6048;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;
