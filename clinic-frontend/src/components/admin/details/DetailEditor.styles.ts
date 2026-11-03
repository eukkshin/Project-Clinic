"use client";
import styled from "styled-components";

/* 기존 AdminWorkspaceTheme의 admin-* 클래스를 그대로 활용하는 추가 전용 스타일입니다. */
export const Root = styled.div`
  width: 100%;
  min-width: 0;
  color: #334c3b;
`;
export const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
`;
export const HeaderActions = styled.div`
  display: flex;
  gap: 9px;
  flex-wrap: wrap;
  align-items: center;
`;
export const Heading = styled.h1`
  margin: 0;
  font-size: 27px;
  letter-spacing: -0.05em;
  font-weight: 800;
  color: #1d392a;
`;
export const Button = styled.button<{
  $variant?: "primary" | "danger" | "quiet";
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  min-height: 38px;
  padding: 9px 14px;
  border: 1px solid
    ${({ $variant }) =>
      $variant === "primary"
        ? "#28593f"
        : $variant === "danger"
          ? "#ebcbc5"
          : "#dce5dc"};
  background: ${({ $variant }) =>
    $variant === "primary"
      ? "#28593f"
      : $variant === "danger"
        ? "#fff6f4"
        : "#fff"};
  color: ${({ $variant }) =>
    $variant === "primary"
      ? "#fff"
      : $variant === "danger"
        ? "#aa514b"
        : "#345843"};
  border-radius: 10px;
  font-size: 12px;
  font-weight: 720;
  cursor: pointer;
  white-space: nowrap;
  transition:
    background 0.16s ease,
    border-color 0.16s ease;
  &:hover:not(:disabled) {
    filter: brightness(0.96);
    border-color: #a1bca5;
  }
  &:disabled {
    opacity: 0.48;
    cursor: not-allowed;
  }
  &:focus-visible {
    outline: 2px solid #689a77;
    outline-offset: 2px;
  }
  svg {
    width: 15px;
    height: 15px;
  }
`;
export const TabsShell = styled.div`
  margin: 0 0 19px;
  padding: 10px 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`;
export const Tabs = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  gap: 7px;
  flex-wrap: wrap;
`;
export const CategoryTab = styled.button<{ $active: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  min-height: 41px;
  border: 1px solid ${({ $active }) => ($active ? "#2b6344" : "#e5ebe3")};
  border-radius: 10px;
  background: ${({ $active }) => ($active ? "#28593f" : "#f8faf7")};
  color: ${({ $active }) => ($active ? "white" : "#546d59")};
  font-size: 12px;
  font-weight: 730;
  cursor: pointer;
  transition: all 0.16s ease;
  &:hover {
    border-color: #7fa68a;
  }
  &:focus-visible {
    outline: 2px solid #7fa68a;
    outline-offset: 2px;
  }
  small {
    font-size: 10px;
    opacity: 0.78;
    font-variant-numeric: tabular-nums;
  }
`;
export const WorkGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(320px, 0.8fr) minmax(0, 1.4fr);
  gap: 19px;
  align-items: start;
  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
`;
export const Panel = styled.section`
  min-width: 0;
`;
export const PanelTitle = styled.h2`
  margin: 0;
  font-size: 14px;
  font-weight: 760;
  color: #254633;
`;
export const PanelHeadRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
`;
export const PanelBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;
export const FieldGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;
export const Field = styled.label`
  display: flex;
  flex-direction: column;
  gap: 7px;
  min-width: 0;
  font-size: 11.5px;
  color: #5a735f;
  font-weight: 680;
`;
export const Input = styled.input`
  width: 100%;
  min-width: 0;
  min-height: 41px;
  padding: 9px 12px;
  border: 1px solid #dbe5da;
  border-radius: 9px;
  background: #fff;
  color: #213e2b;
  font: inherit;
  font-size: 12.5px;
  outline: 0;
  &:focus {
    border-color: #6e9f78;
    box-shadow: 0 0 0 3px rgba(74, 125, 87, 0.09);
  }
  ::placeholder {
    color: #a0afa0;
  }
`;
export const Select = styled.select`
  width: 100%;
  min-height: 41px;
  padding: 9px 12px;
  border: 1px solid #dbe5da;
  border-radius: 9px;
  background: #fff;
  color: #2b4634;
  font: inherit;
  font-size: 12.5px;
  outline: none;
  &:focus {
    border-color: #6e9f78;
    box-shadow: 0 0 0 3px rgba(74, 125, 87, 0.09);
  }
`;
export const Textarea = styled.textarea`
  width: 100%;
  min-height: 94px;
  padding: 11px 12px;
  border: 1px solid #dbe5da;
  border-radius: 9px;
  background: #fff;
  color: #213e2b;
  font: inherit;
  font-size: 12.5px;
  line-height: 1.65;
  resize: vertical;
  outline: 0;
  &:focus {
    border-color: #6e9f78;
    box-shadow: 0 0 0 3px rgba(74, 125, 87, 0.09);
  }
`;
export const Hint = styled.p`
  font-size: 11px;
  color: #819080;
  line-height: 1.65;
  margin: 1px 0 0;
`;
export const Divider = styled.hr`
  width: 100%;
  border: 0;
  border-top: 1px solid #e8eee6;
  margin: 3px 0;
`;
export const FormActions = styled.div`
  display: flex;
  gap: 9px;
  flex-wrap: wrap;
  margin-top: 5px;
`;
export const TableWrap = styled.div`
  overflow: auto;
  max-height: 670px;
  min-width: 0;
`;
export const Table = styled.table`
  width: 100%;
  min-width: 570px;
  border-collapse: collapse;
  color: #4a5e4d;
  font-size: 12px;
  text-align: left;
  th {
    position: sticky;
    top: 0;
    background: #fafcf9;
    z-index: 1;
    color: #5e7964;
    letter-spacing: 0.01em;
    font-weight: 750;
    padding: 13px 12px;
    border-bottom: 1px solid #e3ebe1;
    white-space: nowrap;
  }
  td {
    padding: 14px 12px;
    border-bottom: 1px solid #e9eee6;
    vertical-align: middle;
  }
  tbody tr:hover {
    background: #f8fbf8;
  }
`;
export const NameCell = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  min-width: 0;
  strong {
    color: #284932;
    font-weight: 740;
    font-size: 12px;
  }
  small {
    color: #91a093;
    word-break: break-all;
    font-size: 10.5px;
  }
`;
export const Status = styled.span<{
  $status: "DRAFT" | "PUBLISHED" | "HIDDEN";
}>`
  display: inline-flex;
  padding: 6px 9px;
  border-radius: 999px;
  font-size: 10px;
  font-weight: 760;
  background: ${({ $status }) =>
    $status === "PUBLISHED"
      ? "#e5f2e6"
      : $status === "DRAFT"
        ? "#f6edda"
        : "#f1f2f1"};
  color: ${({ $status }) =>
    $status === "PUBLISHED"
      ? "#267046"
      : $status === "DRAFT"
        ? "#977238"
        : "#7b8680"};
`;
export const InlineActions = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  flex-wrap: wrap;
`;
export const IconButton = styled.button<{ $danger?: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 31px;
  height: 31px;
  border: 1px solid transparent;
  border-radius: 8px;
  background: transparent;
  color: ${({ $danger }) => ($danger ? "#b76058" : "#3f6950")};
  cursor: pointer;
  &:hover:not(:disabled) {
    background: ${({ $danger }) => ($danger ? "#fdf0ed" : "#edf4ed")};
  }
  &:disabled {
    opacity: 0.32;
    cursor: not-allowed;
  }
  &:focus-visible {
    outline: 2px solid #7fa68a;
  }
`;
export const Empty = styled.div`
  padding: 50px 18px;
  text-align: center;
  color: #819584;
  font-size: 12px;
  line-height: 1.8;
`;
export const InfoRow = styled.div`
  display: flex;
  gap: 9px;
  align-items: center;
  flex-wrap: wrap;
  margin: 2px 0;
  color: #849588;
  font-size: 11px;
`;
export const ImagePreview = styled.div<{ $url?: string }>`
  height: 128px;
  border-radius: 11px;
  border: 1px solid #e0e8df;
  background-color: #e8eee7;
  background-image: ${({ $url }) =>
    $url ? `url("${$url.replace(/"/g, "%22")}")` : "none"};
  background-position: center;
  background-size: cover;
  position: relative;
  &:after {
    content: "HERO IMAGE PREVIEW";
    position: absolute;
    bottom: 8px;
    left: 10px;
    color: #fff;
    text-shadow: 0 1px 6px #244535;
    font-size: 9px;
    font-weight: 760;
    letter-spacing: 0.1em;
  }
`;
export const Subheading = styled.div`
  font-size: 12px;
  font-weight: 800;
  color: #395741;
  margin: 4px 0 0;
`;
export const CategoryManager = styled.div`
  margin: 0 0 20px;
`;
export const CatGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 16px;
  @media (max-width: 750px) {
    grid-template-columns: 1fr;
  }
`;
export const Breadcrumb = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  margin: 0 0 14px;
  color: #778a7b;
  font-size: 11px;
`;
