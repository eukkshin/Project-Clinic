import styled from "styled-components";

export const MAIN_COLOR = "#f2f4f6"; // 토스 특유의 연한 그레이시 배경 (클릭/활성 시)
export const POINT_COLOR = "#3182f6"; // 토스 블루 또는 원하시는 포인트 (여기는 차분한 핑크/로즈 계열로 살짝 변형하거나 토스 블루 선택 가능. 핑크를 유지하되 세련되게!)
export const BRAND_ROSE = "#ff4f8b"; // 촌스럽지 않은 쨍하고 트렌디한 비비드 핑크
export const TEXT_MAIN = "#191f28"; // 토스 메인 텍스트 (진한 차콜)
export const TEXT_SUB = "#8b95a1";  // 토스 서브 텍스트 (연한 그레이)
export const BORDER_COLOR = "#e5e8eb";

export const AccordionContainer = styled.div`
  width: 100%;
  background-color: #fff;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.03);
  border: 1px solid ${BORDER_COLOR};
`;

export const ItemContainer = styled.div`
  border-bottom: 1px solid ${BORDER_COLOR};
  &:last-child {
    border-bottom: none;
  }
`;

// 아코디언 타이틀
export const Header = styled.div<{ $isOpen: boolean }>`
  padding: 22px 24px;
  background-color: ${({$isOpen})=> $isOpen ? '#eee' : '#fff'};
  color: ${TEXT_MAIN};
  font-weight: 600;
  font-size: 16px;
  letter-spacing: -0.3px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #fafbfc;
  }
`;

export const QuestionText = styled.div`
  display: flex;
  align-items: center;
  gap: 30px;

  .q-mark {
    color: #ff4f8b;
    font-weight: 700;
  }
`;

export const ArrowIcon = styled.span<{ $isOpen: boolean }>`
  font-size: 12px;
  color: ${TEXT_SUB};
  transform: ${({ $isOpen }) => ($isOpen ? 'rotate(180deg)' : 'rotate(0deg)')};
  transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
`;

// 아코디언 내용 바디
export const Body = styled.div`
  padding: 0 24px 24px 24px;
  background-color: #fff;
  color: #4e5968;
  font-size: 15px;
  line-height: 1.65;
  letter-spacing: -0.2px;
  white-space: pre-line; // 줄바꿈 적용
`;

export const AnswerText = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 30px;

  .a-mark {
    color: ${TEXT_SUB};
    font-weight: 400;
  }
`;