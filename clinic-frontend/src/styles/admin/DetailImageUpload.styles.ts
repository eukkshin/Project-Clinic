import styled from 'styled-components';

export const UploadBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 7px;
  margin: 0 0 6px;
`;
export const UploadRow = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
`;
export const UploadButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 9px 14px;
  min-height: 40px;
  border-radius: 9px;
  border: 1px solid #bbd0bd;
  background: #eff7f0;
  color: #28593f;
  font-size: 12px;
  font-weight: 730;
  cursor: pointer;
  transition:
    background 150ms,
    border-color 150ms;
  &:hover:not(:disabled) {
    background: #e1f0e5;
    border-color: #78a286;
  }
  &:disabled {
    opacity: 0.58;
    cursor: not-allowed;
  }
  &:focus-visible {
    outline: 2px solid #4f8e64;
    outline-offset: 2px;
  }
`;
export const UploadInfo = styled.span`
  color: #8a9b8e;
  font-size: 10.5px;
`;
export const UploadFeedback = styled.span`
  color: #567462;
  font-size: 11px;
  line-height: 1.5;
`;
