import styled from 'styled-components';

// AdminReservation.styles.ts (기존 Q&A / 방문예약 관리)와 같은 디자인 토큰
const forest = "#1b4d3e";
const ink = "#34453c";
const muted = "#738079";
const line = "#e4eae5";
const soft = "#f7f9f7";
const sans = "'Pretendard', Arial, sans-serif";

export const Page = styled.div`
  width: 100%;
  min-width: 0;
  color: ${ink};
  font-family: ${sans};
`;
export const Top = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.5rem;
  @media (max-width: 600px) {
    align-items: flex-start;
    flex-direction: column;
  }
`;
export const Eyebrow = styled.span`
  display: block;
  margin-bottom: 0.42rem;
  color: #819a89;
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.16em;
`;
export const PageTitle = styled.h1`
  margin: 0;
  color: ${ink};
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1.4;
`;
export const PageDescription = styled.p`
  margin: 0.45rem 0 0;
  color: ${muted};
  font-size: 0.82rem;
  line-height: 1.7;
`;
export const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.65rem;
`;
export const Counter = styled.span`
  padding: 0.56rem 0.85rem;
  border-radius: 999px;
  background: #e8eeea;
  color: ${forest};
  font-size: 0.76rem;
  font-weight: 700;
  white-space: nowrap;
`;
export const BackLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.55rem 0.85rem;
  border: 1px solid #d6e0d8;
  border-radius: 10px;
  background: #fff;
  color: ${ink};
  font-size: 0.8rem;
  font-weight: 600;
  text-decoration: none;
  &:hover {
    background: #e8eeea;
    border-color: ${forest};
  }
  &:focus-visible {
    outline: 2px solid #69826b;
    outline-offset: 3px;
  }
`;
export const Banner = styled.div<{ $error?: boolean }>`
  margin-bottom: 1rem;
  padding: 0.85rem 1rem;
  border-radius: 10px;
  font-size: 0.82rem;
  border: 1px solid ${({ $error }) => ($error ? "#e9c4c2" : "#cddfd1")};
  background: ${({ $error }) => ($error ? "#fff3f1" : "#f1f8f2")};
  color: ${({ $error }) => ($error ? "#a04e49" : forest)};
`;
export const Toolbar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.85rem;
  margin-bottom: 1.15rem;
`;
export const FilterGroup = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.45rem;
`;
export const FilterButton = styled.button<{ $active: boolean }>`
  display: inline-flex;
  gap: 0.43rem;
  align-items: center;
  min-height: 37px;
  padding: 0.48rem 0.85rem;
  cursor: pointer;
  background: ${({ $active }) => ($active ? forest : "#fff")};
  color: ${({ $active }) => ($active ? "#fff" : ink)};
  border: 1px solid ${({ $active }) => ($active ? forest : "#d6e0d8")};
  border-radius: 10px;
  font: 600 0.76rem ${sans};
  span {
    opacity: 0.7;
    font-size: 0.72rem;
  }
  &:hover {
    border-color: ${forest};
  }
  &:focus-visible {
    outline: 2px solid #69826b;
    outline-offset: 2px;
  }
`;
export const ToolbarRight = styled.div`
  display: flex;
  align-items: center;
  //flex-wrap: wrap;
  gap: 0.6rem;
  @media (max-width: 680px) {
    width: 100%;
    flex-wrap: wrap;
  }
`;
export const Search = styled.input`
  height: 39px;
  min-width: 200px;
  width: min(100%, 265px);
  padding: 0 0.9rem;
  box-sizing: border-box;
  background: #fff;
  border: 1px solid #d6e0d8;
  border-radius: 10px;
  color: ${ink};
  font: 400 0.8rem ${sans};
  outline: none;
  &::placeholder {
    color: #93a397;
  }
  &:focus-visible {
    border-color: ${forest};
    box-shadow: 0 0 0 3px rgba(27, 77, 62, 0.08);
  }
  @media (max-width: 680px) {
    flex: 1;
    min-width: 120px;
  }
`;
export const Button = styled.button<{ $primary?: boolean }>`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  gap: 0.4rem;
  min-height: 39px;
  padding: 0.55rem 0.9rem;
  cursor: pointer;
  white-space: nowrap;
  border: 1px solid ${({ $primary }) => ($primary ? forest : "#d6e0d8")};
  border-radius: 11px;
  background: ${({ $primary }) => ($primary ? forest : "#fff")};
  color: ${({ $primary }) => ($primary ? "#fff" : ink)};
  font: 600 0.8rem ${sans};
  transition:
    background 0.2s ease,
    border-color 0.2s ease;
  &:hover:not(:disabled) {
    background: ${({ $primary }) => ($primary ? "#246652" : "#e8eeea")};
    border-color: ${forest};
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  &:focus-visible {
    outline: 2px solid #69826b;
    outline-offset: 3px;
  }
`;
export const Layout = styled.section`
  display: grid !important;
  grid-template-columns: repeat(2, minmax(0, 1fr)) !important;

  width: 100% !important;
  max-width: none !important;

  gap: 24px;
  margin: 0 !important;
  padding: 0 !important;
  align-items: start;

  @media (max-width: 900px) {
    grid-template-columns: minmax(0, 1fr) !important;
  }
`;
export const Panel = styled.section`
  min-width: 0;
  width: 100%;
  overflow: hidden;
  border: 1px solid ${line};
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 3px 18px rgba(21, 54, 37, 0.055);
`;
export const PanelHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.65rem;
  min-height: 54px;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid ${line};
  background: ${soft};
`;
export const PanelTitle = styled.h2`
  margin: 0;
  color: ${forest};
  font-size: 0.95rem;
  font-weight: 700;
  line-height: 1.4;
`;
export const PanelCount = styled.span`
  color: ${muted};
  font-size: 0.74rem;
  white-space: nowrap;
`;
export const PanelBody = styled.div`
  padding: 1.5rem;
  @media (max-width: 600px) {
    padding: 1rem;
  }
`;
export const TableWrapper = styled.div`
  overflow: auto;
  width: 100%;
  max-height: 600px;
  padding: 0.65rem;
  box-sizing: border-box;
`;
export const Table = styled.table`
  width: 100%;
  min-width: 540px;
  border-collapse: collapse;
  color: ${muted};
  font-size: 0.8rem;
  text-align: center;
  th {
    padding: 0.85rem 0.6rem;
    position: sticky;
    top: 0;
    z-index: 1;
    background: #fff;
    color: ${ink};
    font-weight: 700;
    border-bottom: 1px solid ${line};
    white-space: nowrap;
  }
  td {
    padding: 0.8rem 0.6rem;
    border-bottom: 1px solid #e8eeea;
    vertical-align: middle;
  }
`;
export const TableRow = styled.tr<{ $active: boolean }>`
  background: ${({ $active }) => ($active ? "#f1f6f2" : "#fff")};
  &:hover {
    background: #f5f9f5;
  }
`;
export const SelectRecord = styled.button`
  width: 100%;
  min-width: 175px;
  padding: 0.2rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.36rem;
  background: none;
  border: 0;
  color: ${ink};
  cursor: pointer;
  text-align: left;
  font-family: ${sans};
  strong {
    font-size: 0.8rem;
    font-weight: 700;
    line-height: 1.5;
  }
  small {
    color: ${muted};
    font-size: 0.7rem;
    line-height: 1.4;
  }
  &:focus-visible {
    outline: 2px solid #69826b;
    outline-offset: 2px;
  }
`;
export const Person = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.32rem;
  strong {
    color: ${ink};
    font-size: 0.76rem;
  }
  small {
    color: ${muted};
    font-size: 0.7rem;
    white-space: nowrap;
  }
`;
export const DateText = styled.time`
  font-size: 0.72rem;
  color: ${muted};
  white-space: nowrap;
`;
export const StatusBadge = styled.span<{ $status: string }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.35rem 0.6rem;
  border-radius: 999px;
  white-space: nowrap;
  font-size: 0.71rem;
  font-weight: 700;
  background: ${({ $status }) =>
    $status === "대기중"
      ? "#fff3dc"
      : $status === "상담중"
        ? "#e7f1e9"
        : "#e8eeea"};
  color: ${({ $status }) =>
    $status === "대기중"
      ? "#996f2d"
      : $status === "상담중"
        ? "#467052"
        : forest};
`;
export const Empty = styled.p`
  margin: 0;
  padding: 3rem 1rem;
  color: ${muted};
  text-align: center;
  font-size: 0.85rem;
  line-height: 1.7;
`;
export const DetailHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.9rem;
  padding-bottom: 1.15rem;
  border-bottom: 1px solid ${line};
`;
export const DetailTitle = styled.h3`
  margin: 0;
  color: ${ink};
  font-size: 1.1rem;
  font-weight: 700;
  letter-spacing: -0.03em;
  line-height: 1.55;
  overflow-wrap: anywhere;
`;
export const DetailList = styled.dl`
  margin: 1rem 0 1.3rem;
  > div {
    display: grid;
    grid-template-columns: 90px minmax(0, 1fr);
    gap: 0.8rem;
    padding: 0.8rem 0;
    border-bottom: 1px solid ${line};
  }
  dt {
    color: ${muted};
    font-size: 0.79rem;
  }
  dd {
    margin: 0;
    color: ${ink};
    font-size: 0.8rem;
    overflow-wrap: anywhere;
  }
  a {
    color: ${forest};
  }
`;
export const Description = styled.div`
  background: ${soft};
  border: 1px solid ${line};
  border-radius: 10px;
  padding: 1.15rem 1.2rem;
  strong {
    color: ${ink};
    font-size: 0.83rem;
  }
  p {
    margin: 0.85rem 0 0;
    color: ${muted};
    white-space: pre-wrap;
    overflow-wrap: anywhere;
    font-size: 0.79rem;
    line-height: 1.85;
  }
`;
export const ActionLabel = styled.h4`
  margin: 1.4rem 0 0.8rem;
  font-size: 0.84rem;
  font-weight: 700;
  color: ${ink};
`;
export const ActionRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.6rem;
`;
export const Danger = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  margin-top: 1.45rem;
  padding: 0.6rem 0.9rem;
  background: #fffafa;
  border: 1px solid #e7ceca;
  border-radius: 10px;
  color: #b45e58;
  font: 600 0.8rem ${sans};
  cursor: pointer;
  &:hover:not(:disabled) {
    background: #fff0ee;
  }
  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
  &:focus-visible {
    outline: 2px solid #b45e58;
    outline-offset: 3px;
  }
`;
