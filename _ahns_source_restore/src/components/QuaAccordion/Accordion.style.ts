import styled from "styled-components";

export const QnAShell = styled.section`
  max-width: 1200px;
  margin: 0 auto;
  padding: clamp(60px, 8vw, 120px) clamp(20px, 4vw, 40px);
  color: #283c2d;
`;

// 상단 타이틀 영역
export const QnAHeader = styled.div`
  margin-bottom: 50px;
  text-align: center;
`;

export const QnAKicker = styled.p`
  font-size: 11px;
  color: #6d896f;
  letter-spacing: 0.22em;
  font-weight: 600;
  margin: 0 0 12px;
  text-transform: uppercase;
`;

export const QnATitle = styled.h2`
  font: 400 clamp(32px, 4vw, 48px)/1.15 Georgia, "Times New Roman", serif;
  letter-spacing: -0.04em;
  color: #284b37;
  margin: 0;

  em {
    font-style: italic;
    font-weight: 400;
    color: #6d896f;
  }
`;

export const TabContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-bottom: 48px;
  flex-wrap: wrap;
`;

export const TabButton = styled.button<{ $active: boolean }>`
  min-height: 42px;
  padding: 0 20px;
  border-radius: 21px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  border: 1px solid ${({ $active }) => ($active ? "#284b37" : "#dfe7dd")};
  background: ${({ $active }) => ($active ? "#284b37" : "#f9faf6")};
  color: ${({ $active }) => ($active ? "#f7f7ef" : "#566e5a")};

  &:hover {
    border-color: #284b37;
    background: ${({ $active }) => ($active ? "#284b37" : "#f0f4ee")};
  }

  &:focus-visible {
    outline: 2px solid #6d896f;
    outline-offset: 2px;
  }
`;

export const AccordionContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  border-top: 1px solid #dfe7dd;
  border-bottom: 1px solid #dfe7dd;
  padding: 24px 0;
`;

export const ItemContainer = styled.div<{ $isOpen: boolean }>`
  border: 1px solid ${({ $isOpen }) => ($isOpen ? "#8daa91" : "#e1e8de")};
  border-radius: 12px;
  background: ${({ $isOpen }) => ($isOpen ? "#fffefa" : "#fbfcf9")};
  transition: all 0.25s ease;
  overflow: hidden;
  box-shadow: ${({ $isOpen }) => 
    $isOpen ? "0 10px 30px rgba(40, 75, 55, 0.05)" : "none"};

  &:hover {
    border-color: #8daa91;
  }
`;

export const AccordionHeader = styled.button<{$isOpen: boolean}>`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 22px 24px;
  background: transparent;
  border: none;
  cursor: pointer;
  text-align: left;
  gap: 16px;

  &:focus-visible {
    outline: 2px solid #6d896f;
    outline-offset: -2px;
  }
`;

export const QuestionTitleWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 14px;
  min-width: 0;
`;

export const QPrefix = styled.span`
  font-family: Georgia, serif;
  font-size: 16px;
  font-style: italic;
  font-weight: 600;
  color: #6d896f;
  flex-shrink: 0;
  line-height: 1.4;
`;

export const QuestionText = styled.span`
  font-size: 15px;
  font-weight: 500;
  color: #283c2d;
  letter-spacing: -0.02em;
  line-height: 1.45;
  word-break: keep-all;
`;

export const ToggleIcon = styled.span<{ $isOpen: boolean }>`
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: ${({ $isOpen }) => ($isOpen ? "#284b37" : "#edf2eb")};
  color: ${({ $isOpen }) => ($isOpen ? "#f7f7ef" : "#566e5a")};
  font-size: 14px;
  flex-shrink: 0;
  transition: transform 0.3s ease, background 0.2s, color 0.2s;
  /* transform: rotate(${({ $isOpen }) => ($isOpen ? "180deg" : "0deg")}); */
`;

export const AccordionBody = styled.div<{ $isOpen: boolean }>`
  display: grid;
  grid-template-rows: ${({ $isOpen }) => ($isOpen ? "1fr" : "0fr")};
  transition: grid-template-rows 0.4s ease;
`;

export const AccordionBodyInner = styled.div`
  overflow: hidden;
`;

export const AnswerContent = styled.div`
  padding: 0 24px 26px 24px;
  display: flex;
  gap: 14px;
  border-top: 1px solid rgba(223, 231, 221, 0.6);
  padding-top: 20px;
  margin: 0 24px;
`;

export const APrefix = styled.span`
  font-family: Georgia, serif;
  font-size: 15px;
  font-style: italic;
  font-weight: 600;
  color: #284b37;
  flex-shrink: 0;
  line-height: 1.6;
`;

export const AnswerText = styled.div`
  font-size: 13.5px;
  line-height: 1.85;
  color: #526555;
  letter-spacing: -0.015em;
  word-break: keep-all;
  
  p {
    margin: 0 0 10px;
    &:last-child {
      margin-bottom: 0;
    }
  }
`;