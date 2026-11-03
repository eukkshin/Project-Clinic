
import styled, { keyframes, css } from 'styled-components';

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

export const ToastContainer = styled.div<{
  $type: 'success' | 'error' | 'info';
}>`
  position: fixed;
  top: 24px;
  right: 24px;
  z-index: 9999;

  display: flex;
  align-items: center;
  gap: 12px;

  min-width: 280px;
  max-width: 420px;
  padding: 16px 18px;

  border-radius: 16px;

  backdrop-filter: blur(16px) saturate(160%);
  -webkit-backdrop-filter: blur(16px) saturate(160%);

  border: 1px solid rgba(255, 255, 255, 0.65);

  box-shadow:
    0 8px 32px rgba(23, 60, 42, 0.12),
    inset 0 1px 1px rgba(255, 255, 255, 0.8);

  animation: ${slideIn} 0.25s ease;

  ${({ $type }) => {
    switch ($type) {
      case 'success':
        return `
          color: #173c2a;
          background: rgba(224, 241, 228, 0.78);
        `;

      case 'error':
        return `
          color: #8c332d;
          background: rgba(255, 235, 231, 0.82);
          border-color: rgba(255, 255, 255, 0.8);
        `;

      case 'info':
        return `
          color: #244f39;
          background: rgba(235, 243, 235, 0.78);
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
  flex-shrink: 0;
  font-size: 19px;
`;

export const ToastMessageText = styled.p`
  flex: 1;
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