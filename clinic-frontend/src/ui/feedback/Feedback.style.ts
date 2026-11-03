
import styled, {keyframes} from 'styled-components';

const dotPulse = keyframes`
0%, 60%, 100%{
  transform: translateY(0);
  opacity: 0.4;
}

30%{
  transform: translateY(-5px);
  opacity: 1;
}
`;

export const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  width: 100%;
  min-height: 320px;
  padding: 40px 24px;
  background: #f1f5ef;
  border: 1px solid #dce6d9;
  border-radius: 18px;
  text-align: center;
`;

export const ErrorIconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  color: #52765c;
  background: #e2ecdf;
  border: 1px solid #d3e1d0;
  border-radius: 50%;

  svg {
    width: 27px;
    height: 27px;
    stroke-width: 1.8;
  }
`;

export const ErrorTitle = styled.h2`
  margin: 0;
  color: #244f39;
  font-size: 18px;
  font-weight: 700;
`;

export const ErrorDescription = styled.p`
  margin: 0 0 8px;
  color: #718074;
  font-size: 14px;
  line-height: 1.8;
`;

export const RetryButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 42px;
  padding: 0 20px;
  color: #fff;
  background: #244f39;
  border: 1px solid #244f39;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover:not(:disabled) {
    background: #173c2a;
    border-color: #173c2a;
  }

  &:focus-visible {
    outline: 3px solid #b7d1b5;
    outline-offset: 3px;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  svg {
    width: 15px;
    height: 15px;
  }
`;

// -------------------------------

export const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 12px 0;
  gap: 12px;
  color: #557259; 
  width: 100%;
`;

export const LoadingSpinner = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  span{
    width:8px;
    height: 8px;
    border-radius: 50%;
    background: #244f39;
    animation: ${dotPulse} 1.2s ease-in-out infinite;
  }

  span:nth-child(2){
    animation-delay: 0.15s;
  }

  span:nth-child(3){
    animation-delay: 0.3s;
  }

  //애니메이션이나 화면 움직임을 줄이는 설정이면?
  @media (prefers-reduced-motion:reduce){
    span{
      animation: none;
      opacity: 1;
    }
  }
`;

export const LoadingText = styled.p`
  margin: 0;
  font-size: 13px;
  font-weight: 500;
  color: #718074;
  letter-spacing: -0.02em;
`;