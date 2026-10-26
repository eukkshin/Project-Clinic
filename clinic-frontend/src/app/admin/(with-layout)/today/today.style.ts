import styled from "styled-components";
// --- 파스텔 연두, 핑크, 노랑 톤온톤 디자인 시스템 컬러 적용 (export 완료) ---

export const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
  background-color: #fafaf9; /* 전체 배경을 은은한 크림톤으로 */
  min-height: 100vh;
  padding: 24px;
`;

export const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
`;

export const PageHeading = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const Eyebrow = styled.span`
  font-size: 11px;
  font-weight: 700;
  color: #65a30d; /* 화사한 연두 포인트 */
  letter-spacing: 0.05em;
`;

export const PageTitle = styled.h1`
  font-size: 24px;
  font-weight: 800;
  color: #292524; /* 부드러운 다크 브라운 */
  margin: 0;
`;

export const PageDescription = styled.p`
  font-size: 14px;
  color: #78716c;
  margin: 0;
`;

export const RefreshButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 15px;
  background: #ffffff;
  border: 1px solid #e7e5e4;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 600;
  color: #57534e;
  cursor: pointer;
  &:hover { background: #f5f5f4; }

  @media (max-width: 765px){
    span{
      display: none;
    }
    svg{
      width: 16px;
      height: 16px;
    }
  }
`;

export const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;

  @media (max-width: 760px){
    grid-template-columns: 1fr;
  }
`;

export const SummaryCard = styled.div`
  background: #ffffff;
  padding: 20px;
  border-radius: 16px;
  border: 1px solid #f0ede8;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.02);
  display: flex;
  align-items: center;
  gap: 16px;
`;

export const SummaryIcon = styled.div<{ $variant: 'green' | 'pink' | 'yellow' }>`
  width: 48px;
  height: 48px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  background-color: ${({ $variant }) => 
    $variant === 'green' ? '#ecfccb' : $variant === 'pink' ? '#fce7f3' : '#fef9c3'};
  color: ${({ $variant }) => 
    $variant === 'green' ? '#4d7c0f' : $variant === 'pink' ? '#db2777' : '#ca8a04'};
`;

export const SummaryContent = styled.div`
  display: flex;
  flex-direction: column;
  span { font-size: 12px; color: #78716c; }
  strong { font-size: 20px; font-weight: 700; color: #292524; margin: 2px 0; }
  small { font-size: 11px; color: #a8a29e; }
`;

export const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px,1fr));
  gap: 24px;

   @media (max-width: 768px){
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

export const Panel = styled.div`
  background: #ffffff;
  border: 1px solid #f0ede8;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.02);
  border-radius: 16px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-height: 450px;
`;

export const PanelHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #f9f8f6;
  padding-bottom: 12px;
  gap: 12px;

  @media (max-width: 568px) {
    flex-direction: column;
    align-items: flex-start; 
  }
`;

export const PanelHeading = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  gap: 12px;
`;

export const PanelIcon = styled.div`
  width: 36px;
  height: 36px;
  background: #ecfccb; /* 파스텔 연두 배경 */
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #4d7c0f;
`;

export const PanelTitle = styled.h3`
  font-size: 16px;
  font-weight: 700;
  color: #292524;
  margin: 0;
`;

export const PanelDescription = styled.p`
  font-size: 12px;
  color: #78716c;
  margin: 0;

  @media (max-width: 1200px) {
    display: none;
  }
`;

export const ItemCount = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: #4d7c0f;
  margin-right:0 ;
  text-align: right;
`;

export const ListToolbar = styled.div`
  display: flex;
  gap: 8px;
`;

export const SearchWrapper = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  gap: 10px;
  background: #fafaf9;
  border: 1px solid #e7e5e4;
  border-radius: 12px;
  padding: 8px 14px;
  svg { color: #a8a29e; }
`;

export const SearchInput = styled.input`
  border: none;
  outline: none;
  background: transparent;
  font-size: 14px;
  width: 100%;
  color: #292524;
  &::placeholder { color: #a8a29e; }
`;

export const RecordList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
  overflow-y: auto;
`;

export const RecordCard = styled.div`
  background: #ffffff;
  border: 1px solid #e7e5e4;
  border-radius: 12px;
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  transition: all 0.2s;
  &:hover {
    border-color: #bef264; /* 호버 시 화사한 파스텔 연두빛 */
    background-color: #fcfdfa;
  }
`;

export const RecordTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const RecordIdentity = styled.div<{$gender: string;}>`
  display: flex;
  align-items: center;
  gap: 12px;

  .avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 13px;

    background: ${({ $gender }) => ($gender === 'M' ? '#eff6ff' : '#fce7f3')}; 
    color: ${({ $gender }) => ($gender === 'M' ? '#3b82f6' : '#db2777')};
  }
`;

export const RecordName = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #292524;
  small { color: #a8a29e; font-weight: 400; margin-left: 4px; }
`;

export const RecordSub = styled.div`
  font-size: 12px;
  color: #78716c;
`;

const getStatusTheme = (status: string) => {
  switch (status) {
    case 'WAITING':
      return { bg: '#fef9c3', color: '#854d0e', dot: '#eab308' };
    case 'TREATING':
      return { bg: '#ecfccb', color: '#3f6212', dot: '#84cc16' };
    case 'COMPLETED':
      return { bg: '#fce7f3', color: '#9d174d', dot: '#ec4899' };
    default:
      return { bg: '#f5f5f4', color: '#57534e', dot: '#a8a29e' };
  }
};

export const StatusBadge = styled.span<{ $status: string }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 20px;
  background: ${({ $status })=> getStatusTheme($status).bg} ;
  color: ${({$status})=> getStatusTheme($status).color };
  cursor: pointer;
  .dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: ${({ $status }) => getStatusTheme($status).dot};
  }
`;

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 100%;
  min-height: 200px;
  color: #a8a29e;
  svg { font-size: 24px; color: #d6d3d1; }
  strong { font-size: 13px; color: #57534e; }
  span { font-size: 12px; text-align: center; }
`;

export const RightWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  text-align: center;
`;

export const TabGroup = styled.div`
  display: flex;
  gap: 6px;
  background: #f5f5f4;
  padding: 4px;
  border-radius: 10px;
  flex-shrink: 0;
`;

export const TabButton = styled.button<{ $active: boolean }>`
  padding: 6px 12px;
  border: none;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  flex:1;
  min-width: 60px;

  background-color: ${({ $active }) => ($active ? '#ecfccb' : 'transparent')};
  color: ${({ $active }) => ($active ? '#3f6212' : '#78716c')};
  box-shadow: ${({ $active }) => ($active ? '0 1px 3px rgba(0, 0, 0, 0.05)' : 'none')};

  &:hover {
    color: ${({ $active }) => ($active ? '#3f6212' : '#292524')};
    background-color: ${({ $active }) => ($active ? '#ecfccb' : '#e7e5e4')};
  }
`;

export const ButtonWrapper = styled.div`
 display: flex;
 align-items: center;
 gap: 10px;
`;

export const PrimaryButton = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  background-color: #ecfccb; /* 파스텔 연두 포인트 배경 */
  color: #3f6212;
  border: 1px solid #d9f99d;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 12px rgba(101, 163, 13, 0.1);

  svg {
    font-size: 16px;
  }

  &:hover {
    background-color: #d9f99d;
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(101, 163, 13, 0.15);
  }
  &:active {
    transform: translateY(0);
  }

  @media (max-width: 765px){
  span{
    display: none;
  }
  svg{
    width: 16px;
    height: 16px;
  }
}
`;

export const ActionBadge = styled.span`
  display: inline-flex;
  align-items: center;
  font-size: 11px;
  font-weight: 700;
  padding: 6px 12px;
  border-radius: 8px;
  background: #ecfccb;
  color: #3f6212;
  transition: all 0.2s;
`;