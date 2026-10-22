import styled from "styled-components";

export const QnAContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  padding: 40px 20px;
  background-color: #fbfcf9;
  color: #283c2d;
`;

export const QnAPageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

export const QnAPageTitle = styled.h1`
  margin: 0;
  font-size: 1.5rem;
  color: #284b37;
  font-weight: 700;
  letter-spacing: -0.02em;
`;

export const QnASaveButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background-color: #284b37;
  color: #fffefa;
  border-radius: 10px;
  outline: none;
  border: none;
  padding: 0.6rem 1.2rem;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  box-shadow: 0 4px 12px rgba(40, 75, 55, 0.15);
  transition: all 0.2s ease;

  &:hover {
    background-color: #1f3729;
  }

  @media (max-width: 768px){
    span {
        display: none;
    }
  }
`;

export const QnAGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 3fr;
  gap: 20px;

  @media (max-width: 1200px){
    grid-template-columns: 1fr;
  }
`;

export const QnALeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-width: 0;
`;

export const QnARightColumn = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-width: 0;
`;

export const QnACard = styled.div`
  border-radius: 12px;
  background-color: #fffefa;
  border: 1px solid #e1e8de;
  box-shadow: 0 10px 30px rgba(40, 75, 55, 0.04);
  overflow: hidden;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

export const QnACardHeader = styled.div`
  background-color: #edf2eb;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid #e1e8de;
`;

export const QnACardTitle = styled.h2`
  margin: 0;
  font-weight: 700;
  font-size: 1rem;
  color: #284b37;
`;

export const QnACardBody = styled.div`
  flex: 1;
  color: #283c2d;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const QnAFormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const QnALabel = styled.label`
  color: #283c2d;
  font-weight: 600;
  font-size: 0.95rem;
`;

export const QnAInput = styled.input`
  border-radius: 10px;
  outline: none;
  border: 1px solid #e1e8de;
  padding: 14px;
  width: 100%;
  background-color: #fffefa;
  color: #283c2d;
  font-size: 0.95rem;
  transition: border-color 0.2s;

  &:focus {
    border-color: #6d896f;
  }
`;

export const QnASelect = styled.select`
  border-radius: 10px;
  outline: none;
  border: 1px solid #e1e8de;
  padding: 14px;
  width: 100%;
  background-color: #fffefa;
  color: #283c2d;
  font-size: 0.95rem;
  cursor: pointer;
  transition: border-color 0.2s;

  &:focus {
    border-color: #6d896f;
  }
`;

export const QnATextarea = styled.textarea`
  border-radius: 10px;
  outline: none;
  border: 1px solid #e1e8de;
  padding: 14px;
  width: 100%;
  height: 130px;
  resize: vertical;
  font-family: inherit;
  font-size: 0.95rem;
  background-color: #fffefa;
  color: #283c2d;
  transition: border-color 0.2s;

  &:focus {
    border-color: #6d896f;
  }

  &::placeholder {
    color: #8daa91;
  }
`;

export const QnAAddButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 0.9rem;
  width: 100%;
  margin-top: auto;
  border: 1px solid #8daa91;
  background-color: #edf2eb;
  border-radius: 10px;
  color: #284b37;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: #284b37;
    color: #fffefa;
    border-color: #284b37;
  }
`;

export const QnATableWrapper = styled.div`
  width: 100%;
  max-height: 600px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-track {
    background: transparent; 
  }
  &::-webkit-scrollbar-thumb {
    background-color: #e1e8de; 
    border-radius: 50px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background-color: #8daa91; 
  }
`;

export const QnATable = styled.table`
  table-layout: fixed;
  border-collapse: collapse;
  width: 100%;
  text-align: center;
  font-size: 0.9rem;
  color: #283c2d;

  th, td {
    padding: 1rem 0.8rem;
    vertical-align: middle;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  th {
    position: sticky;
    top: 0;
    z-index: 1;
    background-color: #edf2eb;
    color: #284b37;
    border-bottom: 1px solid #e1e8de;
    font-weight: 600;
  }

  td {
    color: #283c2d;
    border-bottom: 1px solid #e1e8de;
  }

  tr:nth-child(even) {
    background-color: #fbfcf9;
  }

  tr:hover {
    background-color: #edf2eb;
  }
`;

export const QnAActionBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  background-color: #fffefa;
  border: 1px solid #e1e8de;
  color: #284b37;
  cursor: pointer;
  transition: all 0.2s;

  &:not(:disabled):hover {
    background-color: #284b37;
    color: #fffefa;
    border-color: #284b37;
  }

  &:disabled {
    opacity: 0.3;         
    background-color: #edf2eb;
    cursor: default;
  }
`;

export const QnADeleteBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  margin: 0 auto;
  border-radius: 6px;
  background-color: transparent;
  border: 1px solid transparent;
  color: #b33939;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: #fdeaea;
    border-color: #f5c6c6;
  }
`;


// 추가된 컴포넌트 스타일들
export const QnAButtonWrapper = styled.div`
  display: flex;
  gap: 8px;
  width: 100%;
`;

export const QnAActionGroup = styled.div`
  display: flex;
  gap: 0.4rem;
  justify-content: center;
  align-items: center;
`;

export const QnATableHeaderSelect = styled.select`
  width: 160px;
  padding: 6px 12px;
  border-radius: 4px;
  border: 1px solid #e1e8de;
  font-size: 13px;
  background-color: #fffefa;
  color: #283c2d;
  outline: none;
  cursor: pointer;
`;

export const QnACellSummary = styled.div`
  font-size: 0.8rem;
  color: #858796;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
  
  display: -webkit-box;
  -webkit-line-clamp: 2; // 최대 2줄까지만 표시
  -webkit-box-orient: vertical;
`;

export const QnACellQuestion = styled.strong`
  display: block;
  margin-bottom: 4px;
  color: #283c2d;
`;

export const QnACardHeaderRow = styled(QnACardHeader)`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

// 캔슬 버튼 스타일 (수정 모드 취소 시 사용)
export const QnACancelButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 0.9rem;
  width: 100%;
  margin-top: 8px;
  border: 1px solid #d1d3e2;
  background-color: #f8f9fc;
  border-radius: 10px;
  color: #6c757d;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: #e2e6ea;
    color: #343a40;
  }
`;

// 카테고리 직접 입력 영역 레이아웃
export const QnACustomCategoryWrapper = styled.div`
  display: flex;
  gap: 8px;
  width: 100%;
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

// 테이블 내부의 수정 아이콘 버튼
export const QnAEditBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  margin: 0 auto;
  border-radius: 6px;
  background-color: transparent;
  border: 1px solid transparent;
  color: #4e73df;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: #eaecf4;
    border-color: #bac8f3;
  }
`;

// 카테고리 태그 뱃지 스타일
export const QnACategoryBadge = styled.span`
  background: #edf2eb;
  color: #284b37;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  display: inline-block;
`;


