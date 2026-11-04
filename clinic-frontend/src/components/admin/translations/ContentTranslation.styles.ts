import styled from "styled-components";

export const Root = styled.section`
  color: #254134;
  font-family: "Pretendard", "Noto Sans KR", "Malgun Gothic", sans-serif;
  padding: clamp(8px, 1.5vw, 20px);
  .eyebrow {
    color: #8d9f8b;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.18em;
  }
  h1 {
    margin: 12px 0 8px;
    font-size: clamp(26px, 2.3vw, 36px);
    font-weight: 680;
    letter-spacing: -0.04em;
  }
  .description {
    margin: 0 0 24px;
    color: #718376;
    line-height: 1.7;
    font-size: 13px;
  }
`;
export const Panel = styled.div`
  background: #fff;
  border: 1px solid #e2e9e0;
  box-shadow: 0 18px 50px rgba(29, 55, 37, 0.045);
  border-radius: 18px;
  padding: clamp(16px, 2.5vw, 30px);
  margin-bottom: 16px;
`;
export const Controls = styled.div`
  display: grid;
  grid-template-columns: minmax(170px, 1fr) minmax(220px, 2fr) minmax(
      140px,
      1fr
    );
  align-items: end;
  gap: 14px;
  @media (max-width: 780px) {
    grid-template-columns: 1fr;
  }
`;
export const Field = styled.label`
  display: flex;
  flex-direction: column;
  gap: 9px;
  color: #506959;
  font-size: 12px;
  font-weight: 650;
  select,
  input,
  textarea {
    width: 100%;
    min-width: 0;
    box-sizing: border-box;
    border: 1px solid #d6e0d4;
    border-radius: 9px;
    outline: none;
    padding: 11px 12px;
    background: #fdfefa;
    color: #263e31;
    font-family: inherit;
    font-size: 13px;
    font-weight: 450;
    line-height: 1.6;
  }
  textarea {
    min-height: 100px;
    resize: vertical;
  }
  textarea.code {
    min-height: 260px;
    font-family: ui-monospace, Consolas, monospace;
    font-size: 12px;
  }
  :focus-within select,
  :focus-within input,
  :focus-within textarea {
    border-color: #799988;
  }
`;
export const Tabs = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 20px;
`;
export const Tab = styled.button<{ $active: boolean }>`
  cursor: pointer;
  padding: 10px 18px;
  border-radius: 8px;
  font-family: inherit;
  font-size: 12px;
  font-weight: 650;
  border: 1px solid ${({ $active }) => ($active ? "#294c3a" : "#dce5da")};
  background: ${({ $active }) => ($active ? "#294c3a" : "#f7faf6")};
  color: ${({ $active }) => ($active ? "#fff" : "#506a56")};
`;
export const Grid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.2fr);
  gap: 18px;
  @media (max-width: 850px) {
    grid-template-columns: 1fr;
  }
`;
export const Source = styled.div`
  border: 1px solid #e3eae0;
  border-radius: 10px;
  background: #f7f9f5;
  padding: 15px;
  color: #576e5a;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  font-weight: 450;
  font-size: 12px;
  line-height: 1.8;
  max-height: 300px;
  overflow: auto;
`;
export const Buttons = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 9px;
  justify-content: flex-end;
  margin-top: 22px;
`;
export const Action = styled.button<{ $primary?: boolean; $danger?: boolean }>`
  padding: 11px 19px;
  border: 1px solid
    ${({ $primary, $danger }) =>
      $danger ? "#c89b9b" : $primary ? "#254b35" : "#cedccf"};
  background: ${({ $primary, $danger }) =>
    $danger ? "#fff7f7" : $primary ? "#254b35" : "#fff"};
  color: ${({ $primary, $danger }) =>
    $danger ? "#a04242" : $primary ? "#fff" : "#38533d"};
  border-radius: 9px;
  cursor: pointer;
  font-family: inherit;
  font-size: 13px;
  font-weight: 650;
  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
`;
export const Message = styled.div<{ $error?: boolean }>`
  border-radius: 9px;
  padding: 12px 15px;
  margin: 16px 0;
  background: ${({ $error }) => ($error ? "#fff1f1" : "#eff8ef")};
  color: ${({ $error }) => ($error ? "#a34141" : "#315e39")};
  font-size: 13px;
  line-height: 1.7;
`;
export const Status = styled.span<{ $published?: boolean }>`
  display: inline-flex;
  align-items: center;
  border-radius: 99px;
  padding: 6px 11px;
  font-size: 11px;
  font-weight: 700;
  background: ${({ $published }) => ($published ? "#e9f5e6" : "#f3f1e8")};
  color: ${({ $published }) => ($published ? "#417d3f" : "#8d815f")};
`;
