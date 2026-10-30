import styled, { css } from 'styled-components';

/**
 * AHNS / Admin Reservations
 * Q&A · VLOG 관리자 페이지의 카드/폼/표 디자인 시스템을 따릅니다.
 * 기존 예약 기능과 예약자/차단 데이터 계약은 변경하지 않습니다.
 */
const forest = "#1b4d3e";
const ink = "#34453c";
const muted = "#738079";
const line = "#e4eae5";
const soft = "#f7f9f7";

export const Page = styled.div`
  width: 100%;
  min-width: 0;
  color: ${ink};
  font-family: "Pretendard", Arial, sans-serif;
`;

export const Top = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.5rem;

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: flex-start;
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
  white-space: nowrap;
  transition:
    background 0.2s ease,
    border-color 0.2s ease;

  &:hover {
    background: #e8eeea;
    border-color: ${forest};
  }
  &:focus-visible {
    outline: 2px solid #69826b;
    outline-offset: 3px;
  }
`;

export const Layout = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.5fr);
  align-items: start;
  gap: 1.5rem;

  @media (max-width: 1200px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

export const Column = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
  gap: 1.5rem;
`;

export const Panel = styled.section`
  width: 100%;
  min-width: 0;
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
  flex-wrap: wrap;
  gap: 0.75rem;
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
  line-height: 1.45;
`;

export const PanelBody = styled.div`
  padding: 1.5rem;
  color: ${muted};

  @media (max-width: 600px) {
    padding: 1rem;
  }
`;

export const Description = styled.p`
  margin: 0 0 1rem;
  color: ${muted};
  font-size: 0.8rem;
  line-height: 1.75;
`;

export const SectionTitle = styled.h3`
  margin: 0 0 0.9rem;
  color: ${ink};
  font-size: 0.89rem;
  font-weight: 700;
`;

export const MonthControl = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.7rem;
  margin-bottom: 1.2rem;
`;

export const MonthLabel = styled.strong`
  color: ${ink};
  font-size: 1rem;
  font-weight: 700;
  white-space: nowrap;
`;

export const ControlRow = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.55rem;
  margin: 0.8rem 0 0;
`;

export const Button = styled.button<{
  $primary?: boolean;
  $danger?: boolean;
  $compact?: boolean;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  min-height: ${({ $compact }) => ($compact ? "34px" : "39px")};
  padding: ${({ $compact }) =>
    $compact ? "0.42rem 0.65rem" : "0.55rem 0.9rem"};
  border: 1px solid
    ${({ $primary, $danger }) =>
      $primary ? forest : $danger ? "#e7ceca" : "#d6e0d8"};
  border-radius: ${({ $compact }) => ($compact ? "9px" : "11px")};
  background: ${({ $primary, $danger }) =>
    $primary ? forest : $danger ? "#fffafa" : "#fff"};
  color: ${({ $primary, $danger }) =>
    $primary ? "#fff" : $danger ? "#b45e58" : ink};
  font:
    600 0.8rem "Pretendard",
    Arial,
    sans-serif;
  line-height: 1.25;
  text-decoration: none;
  white-space: nowrap;
  cursor: pointer;
  transition:
    background 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease;

  &:hover:not(:disabled) {
    background: ${({ $primary, $danger }) =>
      $primary ? "#246652" : $danger ? "#fff0ee" : "#e8eeea"};
    border-color: ${({ $danger }) => ($danger ? "#cf9b95" : forest)};
  }
  &:focus-visible {
    outline: 2px solid #69826b;
    outline-offset: 3px;
  }
  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
`;

export const WeekGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 0.32rem;
  margin-bottom: 0.32rem;
`;

export const WeekName = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 0;
  padding: 0.36rem 0;
  color: #88988d;
  font-size: 0.69rem;
  font-weight: 600;
`;

export const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 0.32rem;
`;

export const CalendarDay = styled.button<{
  $active: boolean;
  $unavailable: boolean;
}>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.26rem;
  min-width: 0;
  min-height: 65px;
  padding: 0.35rem 0.1rem;
  border: 1px solid ${({ $active }) => ($active ? forest : "#e4eae5")};
  border-radius: 10px;
  background: ${({ $active, $unavailable }) =>
    $active ? forest : $unavailable ? "#fafbfa" : "#fff"};
  color: ${({ $active, $unavailable }) =>
    $active ? "#fff" : $unavailable ? "#9aa69d" : ink};
  font:
    700 0.84rem "Pretendard",
    Arial,
    sans-serif;
  cursor: pointer;
  transition:
    border-color 0.2s ease,
    background 0.2s ease;

  small {
    display: block;
    max-width: 100%;
    color: ${({ $active, $unavailable }) =>
      $active ? "#dbede3" : $unavailable ? "#a9b3ab" : "#638974"};
    font-size: 0.56rem;
    font-weight: 500;
    white-space: nowrap;
  }

  &:hover {
    border-color: ${forest};
  }
  &:focus-visible {
    outline: 2px solid #69826b;
    outline-offset: 2px;
  }
  @media (max-width: 450px) {
    min-height: 56px;
    small {
      font-size: 0.5rem;
    }
  }
`;

export const TimeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.5rem;

  @media (max-width: 450px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
`;

export const TimeButton = styled.button<{
  $active: boolean;
  $available: boolean;
  $reason: "booked" | "blocked" | "closed" | null;
}>`
  min-width: 0;
  min-height: 55px;
  padding: 0.48rem 0.3rem;
  border: 1px solid ${({ $active }) => ($active ? forest : "#d6e0d8")};
  border-radius: 10px;
  background: ${({ $active, $reason }) =>
    $active
      ? forest
      : $reason === "blocked"
        ? "#fff1ef"
        : $reason === "booked"
          ? "#f4f6f4"
          : "#fff"};
  color: ${({ $active, $available, $reason }) =>
    $active
      ? "#fff"
      : $reason === "blocked"
        ? "#ad635d"
        : $available
          ? ink
          : "#8c998f"};
  font:
    700 0.78rem "Pretendard",
    Arial,
    sans-serif;
  cursor: pointer;
  transition:
    background 0.2s ease,
    border-color 0.2s ease;

  small {
    display: block;
    margin-top: 0.22rem;
    color: ${({ $active, $available }) =>
      $active ? "#d9eae0" : $available ? "#638974" : "#9b9d96"};
    font-size: 0.62rem;
    font-weight: 500;
  }

  &:hover {
    border-color: ${forest};
  }
  &:focus-visible {
    outline: 2px solid #69826b;
    outline-offset: 2px;
  }
`;

export const Legend = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem 1rem;
  margin-top: 1rem;
  color: ${muted};
  font-size: 0.7rem;
`;

export const LegendItem = styled.span<{ $color: string }>`
  display: inline-flex;
  align-items: center;
  gap: 0.36rem;
  &::before {
    content: "";
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${({ $color }) => $color};
  }
`;

export const Divider = styled.hr`
  height: 0;
  margin: 1.5rem 0;
  border: 0;
  border-top: 1px solid #e8eeea;
`;

const fieldCss = css`
  width: 100%;
  min-width: 0;
  box-sizing: border-box;
  padding: 0.65rem 1rem;
  border: 1px solid #d6e0d8;
  border-radius: 12px;
  outline: none;
  background: #fff;
  color: ${ink};
  font:
    400 0.9rem "Pretendard",
    Arial,
    sans-serif;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;

  &:focus {
    border-color: ${forest};
    box-shadow: 0 0 0 3px rgba(27, 77, 62, 0.08);
  }
  &::placeholder {
    color: #98a79d;
  }
  &:read-only {
    background: ${soft};
    color: ${muted};
  }
`;

export const Fields = styled.form`
  display: grid;
  gap: 1rem;
`;

export const FieldRow = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;

  @media (max-width: 650px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

export const Label = styled.label`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-width: 0;
  color: ${ink};
  font-size: 0.85rem;
  font-weight: 700;
`;

export const Input = styled.input`
  ${fieldCss}
`;
export const Select = styled.select`
  ${fieldCss}
  cursor: pointer;
`;
export const Textarea = styled.textarea`
  ${fieldCss}
  min-height: 115px;
  resize: vertical;
  line-height: 1.65;
`;

export const FormActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 0.7rem;
  margin-top: 0.25rem;
`;

export const TableWrapper = styled.div`
  width: 100%;
  max-height: 540px;
  overflow: auto;
  padding: 1rem;
  box-sizing: border-box;
`;

export const Table = styled.table`
  width: 100%;
  min-width: 660px;
  border-collapse: collapse;
  color: ${muted};
  text-align: center;
  font-size: 0.82rem;

  th {
    position: sticky;
    top: 0;
    z-index: 1;
    padding: 0.85rem 0.65rem;
    border-bottom: 1px solid #eaecf0;
    background: #fff;
    color: ${ink};
    font-weight: 700;
    white-space: nowrap;
    box-shadow: 0 2px 10px rgba(21, 54, 37, 0.055);
  }
  td {
    padding: 1rem 0.6rem;
    border-bottom: 1px solid #e8eeea;
    vertical-align: middle;
  }
  tbody tr:hover {
    background: #fafcfb;
  }
`;

export const PersonCell = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  text-align: left;
  min-width: 0;

  strong {
    color: ${ink};
    font-size: 0.82rem;
    overflow-wrap: anywhere;
  }
  small {
    color: ${muted};
    line-height: 1.5;
    overflow-wrap: anywhere;
  }
`;

export const StatusBadge = styled.span<{ $status: string }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.32rem 0.55rem;
  border-radius: 999px;
  background: ${({ $status }) =>
    $status === "예약확정"
      ? "#e8eeea"
      : $status === "예약취소"
        ? "#fff0ee"
        : "#f1f4ef"};
  color: ${({ $status }) =>
    $status === "예약확정"
      ? forest
      : $status === "예약취소"
        ? "#b65a54"
        : "#788577"};
  font-size: 0.72rem;
  font-weight: 700;
  white-space: nowrap;
`;

export const SourceText = styled.small`
  display: block;
  margin-top: 0.3rem;
  color: #8c9a90;
  font-size: 0.68rem;
`;

export const EmptyState = styled.div`
  padding: 2.8rem 1rem;
  color: ${muted};
  font-size: 0.85rem;
  text-align: center;
  line-height: 1.7;
`;

export const BlockList = styled.div`
  display: grid;
  gap: 0.6rem;
  margin-top: 1rem;
`;

export const BlockItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.65rem;
  padding: 0.8rem 0.95rem;
  border: 1px solid #e8eeea;
  border-radius: 10px;
  background: ${soft};

  strong {
    display: block;
    margin-bottom: 0.25rem;
    color: ${ink};
    font-size: 0.8rem;
  }
  small {
    display: block;
    color: ${muted};
    font-size: 0.72rem;
  }
`;

export const Banner = styled.div<{ $error?: boolean }>`
  padding: 0.85rem 1rem;
  margin-bottom: 1rem;
  border: 1px solid ${({ $error }) => ($error ? "#e9c4c2" : "#cddfd1")};
  border-radius: 10px;
  background: ${({ $error }) => ($error ? "#fff3f1" : "#f1f8f2")};
  color: ${({ $error }) => ($error ? "#a04e49" : forest)};
  font-size: 0.82rem;
  line-height: 1.7;
`;
