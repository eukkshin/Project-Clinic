import styled from "styled-components";

export const MAIN_COLOR = "#f2f4f6";
export const TEXT_MAIN = "#191f28"; 
export const TEXT_SUB = "#8b95a1";  
export const BORDER_COLOR = "#e5e8eb";


export const PageWrapper = styled.div`
  width: 100%;
  max-width: 640px;
  margin: 60px auto;
  padding: 0 20px;
`;

export const TabGroup = styled.div`
  display: flex;
  justify-content: center; 
  align-items: center;
  gap: 6px;
  margin-bottom: 40px;
  overflow-x: auto;
  padding-bottom: 8px;

  &::-webkit-scrollbar {
    display: none;
  }
`;

export const TabButton = styled.button<{ $active: boolean }>`
  padding: 10px 18px;
  border-radius: 20px;
  font-size: 15px;
  font-weight: ${({ $active }) => ($active ? '700' : '500')};
  cursor: pointer;
  white-space: nowrap;
  border: none;
  transition: background-color 0.2s ease, color 0.2s ease;
  
  background-color: ${({ $active }) => ($active ? TEXT_MAIN : 'transparent')};
  color: ${({ $active }) => ($active ? '#fff' : TEXT_SUB)};

  &:hover {
    background-color: ${({ $active }) => ($active ? TEXT_MAIN : MAIN_COLOR)};
    color: ${({ $active }) => ($active ? '#fff' : TEXT_MAIN)};
  }
`;