import styled from "styled-components";

export const List = styled.div`
  display: grid;
  gap: 10px;
  padding: 13px 0 0;
`;
export const Record = styled.div`
  padding: 12px 13px;
  border: 1px solid #e4ece2;
  border-radius: 11px;
  background: #fbfdfb;
  display: grid;
  gap: 7px;
  .headline {
    display: flex;
    justify-content: space-between;
    gap: 9px;
    align-items: center;
    flex-wrap: wrap;
  }
  strong {
    font-size: 12px;
    color: #304c38;
  }
  small {
    color: #718673;
    font-size: 11px;
    line-height: 1.5;
  }
  .meta {
    display: flex;
    gap: 9px;
    flex-wrap: wrap;
  }
  .warning {
    color: #ac5d35;
  }
`;
export const Status = styled.span<{ $state: string }>`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  white-space: nowrap;
  font-size: 10px;
  font-weight: 750;
  border-radius: 30px;
  padding: 4px 8px;
  color: ${(p) =>
    p.$state === "ACCEPTED"
      ? "#286c43"
      : p.$state === "FAILED" || p.$state === "UNKNOWN"
        ? "#a74430"
        : "#6e796f"};
  background: ${(p) =>
    p.$state === "ACCEPTED"
      ? "#e6f5e8"
      : p.$state === "FAILED" || p.$state === "UNKNOWN"
        ? "#fff0e9"
        : "#edf1ed"};
`;
export const Buttons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 9px;
  flex-wrap: wrap;
  padding: 13px 0;
`;
export const Feedback = styled.p<{ $error?: boolean }>`
  margin: 10px 0 0;
  color: ${(p) => (p.$error ? "#b7483e" : "#2b704b")};
  font-size: 12px;
  line-height: 1.6;
`;
export const Hour = styled.select`
  font: inherit;
  color: #345242;
  border: 1px solid #d8e2d8;
  background: #fff;
  border-radius: 9px;
  padding: 8px;
  font-size: 12px;
`;
