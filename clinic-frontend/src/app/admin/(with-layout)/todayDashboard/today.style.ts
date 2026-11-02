
import styled from "styled-components";

/* =========================================================
   공통 디자인 기준
   ========================================================= */

const COLOR = {
  deepGreen: "#284b37",
  bodyText: "#283c2d",
  sage: "#6d896f",
  sageBorder: "#8daa91",
  lightBorder: "#dfe7dd",
  canvas: "#fbfcf9",
  warmWhite: "#fffefa",
  lightSage: "#edf2eb",
  mutedText: "#526555",

  // 예약 및 진료 상태
  reservedBg: "#edf2eb",
  reservedText: "#526f56",

  waitingBg: "#f5f0e5",
  waitingText: "#927b4c",

  consultingBg: "#f0edf5",
  consultingText: "#78668f",

  treatingBg: "#eaf2e9",
  treatingText: "#47734d",

  completedBg: "#f0f1ef",
  completedText: "#777e77",

  cancelledBg: "#f6eded",
  cancelledText: "#a47777",
};

const SHADOW = "0 10px 30px rgba(40, 75, 55, 0.05)";

const FONT = {
  sans: "'Pretendard', 'Noto Sans KR', sans-serif",
  serif: "Georgia, 'Times New Roman', serif",
};

/* =========================================================
   페이지 전체
   ========================================================= */

export const PageContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  padding: 32px;
  background: ${COLOR.canvas};
  color: ${COLOR.bodyText};
  font-family: ${FONT.sans};

  box-sizing: border-box;

  * {
    box-sizing: border-box;
  }

  @media (max-width: 768px) {
    padding: 20px 16px;
  }
`;

/* =========================================================
   페이지 헤더
   ========================================================= */

export const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 20px;
  margin-bottom: 30px;

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const HeaderContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 7px;
`;

export const Eyebrow = styled.span`
  color: ${COLOR.sage};
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
`;

export const PageHeading = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const PageTitle = styled.h1`
  margin: 0;
  color: ${COLOR.deepGreen};
  font-family: ${FONT.serif};
  font-size: 30px;
  font-weight: 500;
  letter-spacing: -0.8px;

  @media (max-width: 600px) {
    font-size: 26px;
  }
`;

export const PageDescription = styled.p`
  margin: 0;
  color: ${COLOR.mutedText};
  font-size: 13px;
  line-height: 1.6;
`;

/* =========================================================
   예약 등록 버튼
   ========================================================= */

export const PrimaryButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  min-height: 44px;
  padding: 0 20px;

  border: 1px solid ${COLOR.deepGreen};
  border-radius: 10px;

  background: ${COLOR.deepGreen};
  color: ${COLOR.warmWhite};

  font-family: ${FONT.sans};
  font-size: 13px;
  font-weight: 600;

  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #365d43;
    border-color: #365d43;
    box-shadow: 0 5px 14px rgba(40, 75, 55, 0.13);
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

/* =========================================================
   오늘의 요약 카드
   ========================================================= */

export const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
  margin-bottom: 28px;

  @media (max-width: 1100px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 480px) {
    gap: 10px;
  }
`;

export const SummaryCard = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;

  min-width: 0;
  padding: 21px 20px;

  border: 1px solid ${COLOR.lightBorder};
  border-radius: 14px;
  background: ${COLOR.warmWhite};
  box-shadow: ${SHADOW};

  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 13px 32px rgba(40, 75, 55, 0.08);
  }

  @media (max-width: 480px) {
    gap: 10px;
    padding: 15px 12px;
  }
`;

// export const SummaryIcon = styled.div`
//   display: flex;
//   align-items: center;
//   justify-content: center;

//   flex-shrink: 0;
//   width: 46px;
//   height: 46px;

//   border-radius: 12px;
//   background: ${COLOR.lightSage};
//   color: ${COLOR.sage};

//   svg {
//     width: 21px;
//     height: 21px;
//   }

//   @media (max-width: 480px) {
//     width: 38px;
//     height: 38px;
//   }
// `;

export const SummaryContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
`;

export const SummaryLabel = styled.span`
  color: ${COLOR.mutedText};
  font-size: 12px;
  font-weight: 500;
`;

export const SummaryValue = styled.strong`
  color: ${COLOR.deepGreen};
  font-family: ${FONT.serif};
  font-size: 27px;
  font-weight: 500;
  line-height: 1;

  small {
    margin-left: 4px;
    color: ${COLOR.mutedText};
    font-family: ${FONT.sans};
    font-size: 12px;
    font-weight: 400;
  }
`;

/* =========================================================
   메인 패널
   ========================================================= */

export const Panel = styled.section`
  min-width: 0;
  padding: 24px;

  border: 1px solid ${COLOR.lightBorder};
  border-radius: 16px;
  background: ${COLOR.warmWhite};
  box-shadow: ${SHADOW};

  @media (max-width: 600px) {
    padding: 17px;
  }
`;

export const PanelHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;

  @media (max-width: 480px) {
    align-items: flex-start;
    flex-direction: column;
  }
`;

export const PanelTitleGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const PanelTitle = styled.h2`
  margin: 0;
  color: ${COLOR.deepGreen};
  font-size: 17px;
  font-weight: 700;
  letter-spacing: -0.4px;
`;

export const PanelDescription = styled.p`
  margin: 0;
  color: ${COLOR.mutedText};
  font-size: 12px;
  line-height: 1.5;
`;

/* =========================================================
   예약 및 환자 목록
   ========================================================= */

export const RecordList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const RecordCard = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;

  min-width: 0;
  padding: 17px 18px;

  border: 1px solid ${COLOR.lightBorder};
  border-radius: 12px;
  background: ${COLOR.warmWhite};

  transition: all 0.2s ease;

  &:hover {
    border-color: ${COLOR.sageBorder};
    background: ${COLOR.canvas};
  }

  @media (max-width: 600px) {
    align-items: flex-start;
    flex-direction: column;
    gap: 12px;
  }
`;

export const RecordIdentity = styled.div<{ $gender?: string }>`
  display: flex;
  align-items: center;
  gap: 13px;
  min-width: 0;

  /* 성별에 따른 아바타 색상 */
  & > div:first-child {
    background: ${({ $gender }) =>
      $gender === "F" || $gender === "여성" || $gender === "여"
        ? "#f4edf0"
        : "#edf1f4"};

    color: ${({ $gender }) =>
      $gender === "F" || $gender === "여성" || $gender === "여"
        ? "#a47788"
        : "#647d91"};
  }
`;

export const RecordAvatar = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  flex-shrink: 0;
  width: 42px;
  height: 42px;

  border-radius: 50%;
  background: ${COLOR.lightSage};
  color: ${COLOR.deepGreen};

  font-size: 14px;
  font-weight: 700;
`;

export const RecordInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  min-width: 0;
`;

export const RecordName = styled.strong`
  overflow: hidden;
  color: ${COLOR.bodyText};
  font-size: 14px;
  font-weight: 700;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const RecordSub = styled.span`
  overflow: hidden;
  color: ${COLOR.mutedText};
  font-size: 12px;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const RecordTime = styled.span`
  flex-shrink: 0;
  color: ${COLOR.sage};
  font-size: 13px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
`;

/* =========================================================
   예약 상태 배지
   ========================================================= */

export const StatusBadge = styled.span<{ $status: string }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;

  flex-shrink: 0;
  min-width: 66px;
  padding: 6px 11px;

  border-radius: 20px;

  font-size: 11px;
  font-weight: 700;
  white-space: nowrap;

  background: ${({ $status }) => {
    switch ($status) {
      case "RESERVED":
        return COLOR.reservedBg;
      case "WAITING":
        return COLOR.waitingBg;
      case "CONSULTING":
        return COLOR.consultingBg;
      case "TREATING":
        return COLOR.treatingBg;
      case "COMPLETED":
        return COLOR.completedBg;
      case "CANCELLED":
        return COLOR.cancelledBg;
      default:
        return COLOR.lightSage;
    }
  }};

  color: ${({ $status }) => {
    switch ($status) {
      case "RESERVED":
        return COLOR.reservedText;
      case "WAITING":
        return COLOR.waitingText;
      case "CONSULTING":
        return COLOR.consultingText;
      case "TREATING":
        return COLOR.treatingText;
      case "COMPLETED":
        return COLOR.completedText;
      case "CANCELLED":
        return COLOR.cancelledText;
      default:
        return COLOR.deepGreen;
    }
  }};
`;

/* =========================================================
   상태 변경 Select
   ========================================================= */

export const StatusSelect = styled.select`
  min-width: 112px;
  min-height: 34px;
  padding: 0 27px 0 11px;

  border: 1px solid ${COLOR.sageBorder};
  border-radius: 8px;

  background-color: ${COLOR.warmWhite};
  color: ${COLOR.deepGreen};

  font-family: ${FONT.sans};
  font-size: 12px;
  font-weight: 600;

  cursor: pointer;
  outline: none;

  transition: border-color 0.2s ease;

  &:hover {
    border-color: ${COLOR.deepGreen};
  }

  &:focus {
    border-color: ${COLOR.deepGreen};
    box-shadow: 0 0 0 3px rgba(109, 137, 111, 0.13);
  }

  &:disabled {
    background: ${COLOR.lightSage};
    color: ${COLOR.mutedText};
    cursor: not-allowed;
  }

  option {
    background: ${COLOR.warmWhite};
    color: ${COLOR.bodyText};
  }
`;

/* =========================================================
   예약 등록 모달
   ========================================================= */

export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1000;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 20px;
  background: rgba(30, 48, 35, 0.38);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
`;

export const ReservationModal = styled.div`
  width: 100%;
  max-width: 620px;
  max-height: 90vh;
  overflow-y: auto;

  padding: 28px;

  border: 1px solid ${COLOR.lightBorder};
  border-radius: 18px;
  background: ${COLOR.warmWhite};
  box-shadow: 0 20px 60px rgba(30, 48, 35, 0.18);

  @media (max-width: 600px) {
    padding: 21px 17px;
  }
`;

export const ModalHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 15px;
  margin-bottom: 24px;
`;

export const ModalTitleGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 7px;
`;

export const ModalTitle = styled.h2`
  margin: 0;
  color: ${COLOR.deepGreen};
  font-family: ${FONT.serif};
  font-size: 24px;
  font-weight: 500;
`;

export const ModalDescription = styled.p`
  margin: 0;
  color: ${COLOR.mutedText};
  font-size: 12px;
  line-height: 1.6;
`;

export const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;

  flex-shrink: 0;
  width: 34px;
  height: 34px;

  border: 1px solid ${COLOR.lightBorder};
  border-radius: 9px;
  background: ${COLOR.warmWhite};
  color: ${COLOR.mutedText};

  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${COLOR.sageBorder};
    background: ${COLOR.lightSage};
    color: ${COLOR.deepGreen};
  }
`;

/* =========================================================
   모달 내부 폼
   ========================================================= */

export const FormSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 17px;
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
`;

export const FormLabel = styled.label`
  color: ${COLOR.bodyText};
  font-size: 12px;
  font-weight: 700;

  span {
    margin-left: 3px;
    color: #b47c72;
  }
`;

export const FormInput = styled.input`
  width: 100%;
  min-height: 43px;
  padding: 0 13px;

  border: 1px solid ${COLOR.lightBorder};
  border-radius: 9px;

  background: ${COLOR.warmWhite};
  color: ${COLOR.bodyText};

  font-family: ${FONT.sans};
  font-size: 13px;

  outline: none;
  transition: all 0.2s ease;

  &::placeholder {
    color: #a2ada1;
  }

  &:hover {
    border-color: ${COLOR.sageBorder};
  }

  &:focus {
    border-color: ${COLOR.sage};
    box-shadow: 0 0 0 3px rgba(109, 137, 111, 0.12);
  }

  &:disabled {
    background: ${COLOR.lightSage};
    cursor: not-allowed;
  }
`;

export const FormTextarea = styled.textarea`
  width: 100%;
  min-height: 100px;
  padding: 12px 13px;

  resize: vertical;

  border: 1px solid ${COLOR.lightBorder};
  border-radius: 9px;

  background: ${COLOR.warmWhite};
  color: ${COLOR.bodyText};

  font-family: ${FONT.sans};
  font-size: 13px;
  line-height: 1.6;

  outline: none;
  transition: all 0.2s ease;

  &::placeholder {
    color: #a2ada1;
  }

  &:hover {
    border-color: ${COLOR.sageBorder};
  }

  &:focus {
    border-color: ${COLOR.sage};
    box-shadow: 0 0 0 3px rgba(109, 137, 111, 0.12);
  }
`;

export const FormRow = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 13px;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

/* =========================================================
   환자 검색 결과
   ========================================================= */

export const SearchResultList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 7px;
  max-height: 220px;
  overflow-y: auto;

  padding: 3px;

  &::-webkit-scrollbar {
    width: 5px;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background: ${COLOR.sageBorder};
  }
`;

export const SearchResultItem = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;

  width: 100%;
  padding: 12px 13px;

  border: 1px solid ${COLOR.lightBorder};
  border-radius: 9px;

  background: ${COLOR.warmWhite};
  color: ${COLOR.bodyText};
  text-align: left;

  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${COLOR.sageBorder};
    background: ${COLOR.lightSage};
  }

  &:focus-visible {
    outline: 2px solid ${COLOR.sage};
    outline-offset: 2px;
  }
`;

export const SearchResultInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  min-width: 0;
`;

export const SearchResultName = styled.strong`
  color: ${COLOR.deepGreen};
  font-size: 13px;
  font-weight: 700;
`;

export const SearchResultDetail = styled.span`
  color: ${COLOR.mutedText};
  font-size: 11px;
`;

export const SelectedPatient = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;

  padding: 14px;

  border: 1px solid ${COLOR.sageBorder};
  border-radius: 10px;
  background: ${COLOR.lightSage};
`;

export const SelectedPatientInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  min-width: 0;

  strong {
    color: ${COLOR.deepGreen};
    font-size: 14px;
  }

  span {
    color: ${COLOR.mutedText};
    font-size: 11px;
  }
`;

export const RemovePatientButton = styled.button`
  flex-shrink: 0;
  padding: 6px 10px;

  border: 1px solid ${COLOR.sageBorder};
  border-radius: 7px;

  background: ${COLOR.warmWhite};
  color: ${COLOR.mutedText};

  font-size: 11px;
  cursor: pointer;

  &:hover {
    color: ${COLOR.deepGreen};
    background: ${COLOR.canvas};
  }
`;

/* =========================================================
   안내 및 빈 목록
   ========================================================= */

export const HelperText = styled.p`
  margin: 0;
  color: ${COLOR.mutedText};
  font-size: 11px;
  line-height: 1.6;
`;

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;

  min-height: 190px;
  padding: 30px 20px;

  border: 1px dashed ${COLOR.sageBorder};
  border-radius: 12px;
  background: ${COLOR.canvas};

  color: ${COLOR.mutedText};
  text-align: center;

  svg {
    width: 28px;
    height: 28px;
    color: ${COLOR.sage};
  }

  strong {
    color: ${COLOR.deepGreen};
    font-size: 14px;
  }

  span {
    font-size: 12px;
    line-height: 1.6;
  }
`;

/* =========================================================
   모달 하단 버튼 영역
   ========================================================= */

export const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 9px;

  margin-top: 25px;
  padding-top: 19px;

  border-top: 1px solid ${COLOR.lightBorder};

  @media (max-width: 480px) {
    flex-direction: column-reverse;

    button {
      width: 100%;
    }
  }
`;

export const SecondaryButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;

  min-height: 42px;
  padding: 0 18px;

  border: 1px solid ${COLOR.sageBorder};
  border-radius: 9px;

  background: ${COLOR.warmWhite};
  color: ${COLOR.deepGreen};

  font-family: ${FONT.sans};
  font-size: 12px;
  font-weight: 600;

  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${COLOR.lightSage};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

/* =========================================================
   오류 및 성공 메시지
   ========================================================= */

export const MessageText = styled.p<{ $type?: "success" | "error" }>`
  margin: 0;
  padding: 10px 12px;

  border-radius: 8px;

  background: ${({ $type }) =>
    $type === "error" ? "#f6eded" : COLOR.lightSage};

  color: ${({ $type }) =>
    $type === "error" ? "#a47777" : COLOR.deepGreen};

  font-size: 12px;
  line-height: 1.5;
`;



/* =========================================================
   기존 대시보드 호환 스타일
   ========================================================= */

// 목록 상단 영역
export const RecordTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 14px;
`;

// 목록 개수 표시
export const ItemCount = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;

  min-width: 26px;
  height: 24px;
  padding: 0 8px;

  border-radius: 20px;
  background: #edf2eb;
  color: #526555;

  font-size: 12px;
  font-weight: 700;
`;

// 패널 제목 영역
export const PanelHeading = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  color: #284b37;
  font-size: 16px;
  font-weight: 700;
`;

// 패널 아이콘
export const PanelIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  width: 34px;
  height: 34px;

  border-radius: 10px;
  background: #edf2eb;
  color: #6d896f;

  svg {
    width: 17px;
    height: 17px;
  }
`;

// 요약 카드 아이콘 - variant 지원
export const SummaryIcon = styled.div<{ $variant?: string }>`
  display: flex;
  align-items: center;
  justify-content: center;

  flex-shrink: 0;
  width: 46px;
  height: 46px;

  border-radius: 12px;

  background: ${({ $variant }) =>
    $variant === "green" ? "#edf2eb" :
    $variant === "yellow" ? "#f5f0e5" :
    $variant === "purple" ? "#f0edf5" :
    $variant === "gray" ? "#f0f1ef" : "#edf2eb"};

  color: ${({ $variant }) =>
    $variant === "green" ? "#6d896f" :
    $variant === "yellow" ? "#927b4c" :
    $variant === "purple" ? "#78668f" :
    $variant === "gray" ? "#777e77" : "#6d896f"};

  svg {
    width: 21px;
    height: 21px;
  }
`;

// 버튼 영역
export const ButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

// 새로고침 버튼
export const RefreshButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;

  min-height: 38px;
  padding: 0 13px;

  border: 1px solid #dfe7dd;
  border-radius: 9px;

  background: #fffefa;
  color: #526555;

  font-size: 12px;
  font-weight: 600;

  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #8daa91;
    background: #edf2eb;
    color: #284b37;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  svg {
    width: 15px;
    height: 15px;
  }
`;