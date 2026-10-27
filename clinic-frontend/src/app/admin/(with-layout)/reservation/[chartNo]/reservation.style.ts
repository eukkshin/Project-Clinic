import styled, { keyframes } from 'styled-components';
import { FiLoader } from 'react-icons/fi'; // 또는 선호하시는 아이콘

// 부드럽게 회전하는 애니메이션
const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

export const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100px 0;
  gap: 12px;
  color: #557259; 
  width: 100%;
`;

export const LoadingSpinner = styled.div`
  width: 28px;
  height: 28px;
  border: 3px solid #e1e8de;
  border-top-color: #3b7a57; 
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
`;

export const LoadingText = styled.p`
  font-size: 13.5px;
  font-weight: 500;
  color: #6b7570;
  letter-spacing: -0.01em;
  margin: 0;
`;

///=================================================

export const BookingContainer = styled.section`
  max-width: 1200px;
  margin: 0 auto;
  padding: clamp(40px, 6vw, 80px) clamp(20px, 4vw, 40px);
  color: #283c2d;
  font-family: var(--ahns-body);
`;

export const BookingHeader = styled.div`
  margin-bottom: 40px;
  text-align: center;
`;

export const BookingKicker = styled.p`
  font-family: var(--ahns-display);
  font-size: 11px;
  color: #6d896f;
  letter-spacing: 0.22em;
  font-weight: 600;
  margin: 0 0 12px;
  text-transform: uppercase;
`;

export const BookingTitle = styled.h2`
  font-family: var(--ahns-body);
  font-weight: 700;
  font-size: clamp(26px, 3.2vw, 38px);
  line-height: 1.3;
  letter-spacing: -0.03em;
  color: #284b37;
  margin: 0;

  em {
    font-style: normal;
    font-weight: 500;  
    color: #5d7a60;    
    margin-left: 6px;   
  }
`;

export const TreatAddButton = styled.button`
display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px 16px;
  background-color: #edf2eb;
  color: #284b37;
  border: 1px solid #8daa91;
  border-radius: 8px; 
  font-family: inherit;
  font-size: 13.5px;
  font-weight: 600;
  margin-left: auto;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: #284b37;
    color: #fffefa;
    border-color: #284b37;
    box-shadow: 0 4px 12px rgba(40, 75, 55, 0.15);
  }

  &:active {
    transform: translateY(1px);
  }
`;
export const BookingContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;

  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
`;

export const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  min-width: 0;
`;

export const RightColumn = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-width: 0;
`;

export const ProfileCard = styled.div`
  border: 1px solid #e1e8de;
  border-radius: 12px;
  background: #fffefa;
  padding: 24px;
  box-shadow: 0 10px 30px rgba(40, 75, 55, 0.04);
`;

export const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 20px;
`;

export const Avatar = styled.div`
  width: 52px;
  height: 52px;
  background-color: #edf2eb;
  color: #284b37;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--ahns-display);
  font-weight: 600;
  font-size: 1.2rem;
`;

export const PatientName = styled.h3`
  font-size: 16px;
  font-weight: 700;
  color: #284b37;
  margin: 0 0 4px 0;
  letter-spacing: -0.02em;
`;

export const PatientPhone = styled.p`
  font-size: 13.5px;
  color: #526555;
  margin: 0;
`;

export const ProfileFooter = styled.div`
  padding-top: 16px;
  border-top: 1px solid rgba(225, 232, 222, 0.6);
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13.5px;
  color: #283c2d;
`;

export const GradeBadge = styled.span<{ $isActive: boolean }>`
  background: ${({ $isActive }) => ($isActive ? '#edf2eb' : '#fdeaea')};
  color: ${({ $isActive }) => ($isActive ? '#284b37' : '#b33939')};
  padding: 4px 10px;
  border-radius: 21px;
  font-size: 12px;
  font-weight: 600;
  display: inline-block;
  border: 1px solid ${({ $isActive }) => ($isActive ? '#e1e8de' : '#f5c6c6')};
`;

export const ProcedureCard = styled.div`
  border: 1px solid #e1e8de;
  border-radius: 12px;
  background: #fffefa;
  padding: 24px;
  box-shadow: 0 10px 30px rgba(40, 75, 55, 0.04);
`;

export const CardHeader = styled.div`
display: flex;
justify-content: space-between;
align-items: center;
overflow: hidden;
margin-bottom: 16px;
padding-bottom: 12px;

@media (max-width: 600px) {
   flex-direction: column;
    align-items: flex-start;
    gap: 20px;
    margin-bottom: 10px;
  }
`;

export const TitleWrapper = styled.div`
display: flex;
align-items: center; 
gap: 8px;


svg {
  font-size: 18px;
  color: #3b7a57;
}

`;

export const SectionTitle = styled.h3`
  font-size: 15px;
  font-weight: 700;
  color: #284b37;
  margin:0;
  letter-spacing: -0.02em;
`;
export const HighlightRound = styled.span`
  color: #284b37; 
  font-weight: 800;
  font-size: 17px;
  border-bottom: 2px solid #8daa91; 
  padding-bottom: 1px;
  margin-left: 6px;
  margin-right: 4px;
`;
export const ProcedureRoundBadge = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: #284b37;
  background-color: #edf2eb;
  padding: 2px 8px;
  border-radius: 6px;
  border: 1px solid #dfe7dd;
  margin-left: 10px;
`;

export const FormNotice = styled.small`
  font-size: 12px;
  font-weight: 400;
  color: #8daa91;
  margin-top: 4px;
  letter-spacing: -0.01em;
`;

export const EmptyMessage = styled.p`
  font-size: 13px;
  color: #6d896f;
  text-align: center;
  padding: 20px 0;
  letter-spacing: -0.01em;
`;

export const ProcedureList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-top: 20px;
  border-top: 1px solid rgba(225, 232, 222, 0.6);
`;

export const ProcedureItem = styled.div<{ $isOpen?: boolean; $disabled?: boolean}>`
  padding: 16px;
  border: 1px solid ${({ $isOpen }) => ($isOpen ? "#8daa91" : "#e1e8de")};
  border-radius: 10px;
  background: ${({ $isOpen }) => ($isOpen ? "#edf2eb" : "#fbfcf9")};
  cursor: pointer;
  transition: all 0.25s ease;
  box-shadow: ${({ $isOpen }) => ($isOpen ? "0 4px 12px rgba(40, 75, 55, 0.04)" : "none")};

  &:hover {
    border-color: #8daa91;
    background: #fffefa;
  }

  ${({$disabled})=> $disabled && `
    opacity: 0.5;
    background-color: #f9f9f9;
    cursor: not-allowed;
    pointer-events: none; /* 클릭 원천 차단 */
  `}
`;

export const ProcedureInfoTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
`;

export const ProcedureName = styled.span`
  font-weight: 600;
  color: #283c2d;
  font-size: 14px;
  letter-spacing: -0.01em;
`;

export const StatusBadge = styled.span<{$status:'ACTIVE' | 'COMPLETED' | 'EXPIRED' }>`
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-size: 11.5px;
  padding: 3px 10px;
  border-radius: 12px;
  border: 1px solid;
  font-weight: 500;
  margin-left: auto;

  ${({ $status }) => {
    switch ($status) {
      case 'ACTIVE':
        return `
          background-color: #f2f7f0;
          color: #284b37;
          border-color: #c8dcbe;
          &::before { 
            background-color: #2ecc71; 
            box-shadow: 0 0 3px 1px rgba(46, 204, 113, 0.75); 
          }
          
        `;
      case 'COMPLETED':
      default:
        return `
          background-color: #f4f5f4;
          color: #6b7570;
          border-color: #dbe0dc;
          &::before { 
            background-color: #9ca3af; 
            box-shadow: 0 0 3px 1px rgba(156, 163, 175, 0.25);
          }
        `;
      // case 'COMPLETED':
      //   return `
      //     background-color: #fcf4f4;
      //     color: #a85757;
      //     border-color: #ebd3d3;
      //     &::before { 
      //       background-color: #e74c3c; 
      //       box-shadow: 0 0 6px 1px rgba(231, 76, 60, 0.4); 
      //     }
      //   `;
    }
  }}

  &::before {
    content: '';
    width: 6px;
    height: 6px;
    border-radius: 50%;
    display: inline-block;
  }
`;

export const ProcedureDetails = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 4px;
`;

export const ProcedureDate = styled.span`
  font-size: 12.5px;
  color: #526555;
`;

export const CountBadge = styled.span`
  font-size: 12.5px;
  font-weight: 600;
  color: #284b37;
`;

export const BookingFormCard = styled.div`
  border: 1px solid #e1e8de;
  border-radius: 12px;
  background: #fffefa;
  padding: 24px;
  box-shadow: 0 10px 30px rgba(40, 75, 55, 0.04);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
`;

export const HeaderTitleWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin: 10px auto;
  color: #284b37;
  font-size: 1.1rem;
  font-weight: 700;
  padding-bottom: 20px; 
`;

export const InputGroup = styled.div`
  margin-bottom: 24px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const Label = styled.label`
  display: block;
  font-size: 13.5px;
  font-weight: 600;
  color: #283c2d;
  letter-spacing: -0.01em;
`;

export const DateInput = styled.input`
  width: 100%;
  min-height: 42px;
  padding: 0 16px;
  border: 1px solid #e1e8de;
  border-radius: 10px;
  font-size: 13.5px;
  font-family: inherit;
  background-color: #fbfcf9;
  color: #283c2d;
  outline: none;
  box-sizing: border-box;
  transition: border-color 0.2s;

  &:focus {
    border-color: #6d896f;
    background-color: #fffefa;
  }
`;

export const MemoInput = styled.textarea`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #e1e8de;
  border-radius: 10px;
  font-size: 13.5px;
  background-color: #fbfcf9;
  color: #283c2d;
  outline: none;
  box-sizing: border-box;
  resize: vertical;
  transition: border-color 0.2s;

  &:focus {
    border-color: #6d896f;
    background-color: #fffefa;
  }

  &::placeholder {
    color: #8daa91;
  }
`;

export const TimeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;

  @media (max-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

export const TimeButton = styled.button<{ $active: boolean }>`
  min-height: 42px;
  padding: 0 12px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
  
  border: 1px solid ${({ $active }) => ($active ? "#284b37" : "#e1e8de")};
  background: ${({ $active }) => ($active ? "#284b37" : "#fbfcf9")};
  color: ${({ $active }) => ($active ? "#fffefa" : "#283c2d")};

  &:hover {
    border-color: #284b37;
    background: ${({ $active }) => ($active ? "#1f3729" : "#edf2eb")};
  }

  &:focus-visible {
    outline: 2px solid #6d896f;
    outline-offset: 2px;
  }
`;

export const SubmitButton = styled.button`
  width: 100%;
  min-height: 48px;
  padding: 0 24px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  background: #284b37;
  color: #fffefa;
  box-shadow: 0 4px 12px rgba(40, 75, 55, 0.15);
  margin-top: 12px;
  font-family: inherit;

  &:hover {
    background: #1f3729;
  }

  &:focus-visible {
    outline: 2px solid #6d896f;
    outline-offset: 2px;
  }
`;


//------------------------------------

export const FilterTabWrapper = styled.div`
  display: flex;
  gap: 8px;

`;

export const FilterTab = styled.button<{ $isActive: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 10px;
  font-size: 12px;
  font-weight: 500;
  border-radius: 8px;
  white-space: nowrap;
  border: 1px solid ${({ $isActive }) => ($isActive ? '#3b7a57' : '#e1e8de')};
  background-color: ${({ $isActive }) => ($isActive ? '#284b37' : '#f8faf7')};
  color: ${({ $isActive }) => ($isActive ? '#ffffff' : '#6b7570')};
  cursor: pointer;
  transition: all 0.2s ease;

  span {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0 5px;
    height: 16px;
    font-size: 10.5px;
    border-radius: 10px;
    background-color: ${({ $isActive }) => ($isActive ? 'rgba(255, 255, 255, 0.2)' : '#e8ede6')};
    color: ${({ $isActive }) => ($isActive ? '#ffffff' : '#556658')};
  }

  &:hover {
    border-color: #3b7a57;
    background-color: ${({ $isActive }) => ($isActive ? '#284b37' : '#f0f5ee')};
  }
`;