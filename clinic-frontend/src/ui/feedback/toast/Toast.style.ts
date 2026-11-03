
import styled, { keyframes } from 'styled-components';

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-12px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
`;
export const CheckSvg = styled.svg`
  display: block;
  width: 36px;
  height: 36px;
  flex-shrink: 0;
  overflow: visible;

  circle {
    stroke-dasharray: 151;
    stroke-dashoffset: 151;
    animation: circleDraw 0.6s ease forwards;
  }

  path {
    stroke-dasharray: 46;
    stroke-dashoffset: 46;
    animation: checkDraw 0.4s 0.5s ease forwards;
  }

  @keyframes circleDraw {
    to {
      stroke-dashoffset: 0;
    }
  }

`;
export const ToastContainer = styled.div<{
  $type: 'success' | 'error' | 'info';
}>`
  position: fixed;
  top: 24px;
  right: 24px;
  z-index: 99999;

  display: flex;
  align-items: center;
  gap: 14px;

  min-width: 300px;
  max-width: 420px;
  padding: 18px 20px;

  border-radius: 16px;

  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);

  border: 1px solid rgba(255, 255, 255, 0.9);

  box-shadow:
    0 12px 36px rgba(23, 60, 42, 0.2),
    0 3px 10px rgba(23, 60, 42, 0.08),
    inset 0 1px 1px rgba(255, 255, 255, 0.95);

  animation: ${slideIn} 0.3s ease;

  ${({ $type }) => {
    switch ($type) {
      case 'success':
        return `
          color: #173c2a;
          background: rgba(216, 235, 218, 0.98);
          border: 1px solid #a5c6aa;
          box-shadow:
            0 12px 36px rgba(23, 60, 42, 0.18),
            0 3px 10px rgba(23, 60, 42, 0.08),
            inset 0 1px 1px rgba(255, 255, 255, 0.85);
        `;

      case 'error':
        return `
          color: #8c332d;
          background: rgba(255, 242, 239, 0.97);
        `;

      case 'info':
        return `
          color: #244f39;
          background: rgba(242, 247, 242, 0.97);
        `;
    }
  }}

  @media (max-width: 480px) {
    top: 16px;
    right: 16px;
    left: 16px;
    min-width: auto;
    max-width: none;
  }
`;


export const ToastIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  font-size: 22px;
  line-height: 1;

  svg {
    display: block;
    width: 24px;
    height: 24px;
  }
`;

export const ToastMessageText = styled.p`
  flex: 1;
  min-width: 0;
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  line-height: 1.5;
  word-break: keep-all;
`;







// export const ToastContainer = styled.div<{
//   $type: 'success' | 'error' | 'info';
// }>`
//   position: fixed;
//   top: 24px;
//   right: 24px;
//   z-index: 9999;

//   display: flex;
//   align-items: center;
//   gap: 12px;

//   min-width: 280px;
//   max-width: 420px;
//   padding: 16px 18px;

//   border-radius: 12px;
//   box-shadow: 0 8px 24px rgba(23, 60, 42, 0.16);

//   animation: ${slideIn} 0.25s ease;

//   ${({ $type }) => {
//     switch ($type) {
//       case 'success':
//         return css`
//           color: #ffffff;
//           background: #244f39;
//         `;

//       case 'error':
//         return css`
//           color: #8c332d;
//           background: #fff1ef;
//           border: 1px solid #f2d0ca;
//         `;

//       case 'info':
//         return css`
//           color: #244f39;
//           background: #edf4ed;
//           border: 1px solid #d6e4d6;
//         `;
//     }
//   }}

//   @media (max-width: 480px) {
//     top: 16px;
//     right: 16px;
//     left: 16px;
//     min-width: auto;
//     max-width: none;
//   }
// `;