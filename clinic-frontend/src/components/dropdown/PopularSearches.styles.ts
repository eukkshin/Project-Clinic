import styled from "styled-components";

// 기존 AHNS HeaderSearch 스타일의 그린 컬러/타이포/리스트 간격을 따라갑니다.
// 배경은 부모 SearchPanel이 담당하므로 별도 배경 패널을 추가하지 않습니다.
export const Root = styled.section`
  color: #244535;
`;

export const Heading = styled.div`
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(66, 105, 74, 0.18);
`;

export const Eyebrow = styled.p`
  margin: 0 0 8px;
  color: #739178;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.28em;
`;

export const Title = styled.h3`
  margin: 0;
  color: #244535;

  font-family: "Pretendard", "Noto Sans KR", "Malgun Gothic", sans-serif;

  font-size: 25px;
  font-weight: 600;
  letter-spacing: -0.04em;
  line-height: 1.35;
`;
export const Note = styled.p`
  margin: 7px 0 0;
  color: #6f8574;
  font-size: 10px;
`;

export const List = styled.ol`
  list-style: none;
  margin: 0;
  padding: 12px 0 7px;
`;

export const Item = styled.li`
  margin: 0;
  padding: 0;
`;

export const KeywordButton = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 11px 9px;
  border: 0;
  border-radius: 9px;
  background: transparent;
  color: #34553c;
  font: inherit;
  font-size: 13px;
  text-align: left;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover,
  &:focus-visible {
    background: rgba(117, 157, 119, 0.12);
  }

  &:focus-visible {
    outline: 2px solid rgba(74, 115, 81, 0.6);
    outline-offset: -2px;
  }
`;

export const Index = styled.span`
  flex: 0 0 20px;
  color: #849b88;
  font-size: 11px;
  font-variant-numeric: tabular-nums;
`;

export const Keyword = styled.span`
  min-width: 0;
  flex: 1;
  color: #34553c;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const Count = styled.span`
  font-size: 10px;
  color: #7d967f;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
`;

export const Footer = styled.p`
  margin: 11px 0 0;
  padding-top: 13px;
  border-top: 1px solid rgba(66, 105, 74, 0.16);
  color: #86988a;
  font-size: 10px;
  line-height: 1.6;
`;
