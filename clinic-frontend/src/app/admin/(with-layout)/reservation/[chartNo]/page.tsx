'use client';

import React, {useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'next/navigation'
import { FaCheckCircle, FaRegCalendarCheck } from 'react-icons/fa';
import * as S from './reservation.style'
import { AddTreatmentModal } from '../components/AddTreatmentModal';
import * as A from "@/assets/css/admin/DetailCMS.styles";
import { FaRegCommentDots } from 'react-icons/fa6';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import ErrorState  from '@/ui/feedback/ErrorState';
import LoadingState from '@/ui/feedback/LoadingState';

interface Reservation {
id: number;              
chartNo: string;           
reservationDate: string; 
reservationTime: string;   
status: 'RESERVED' | 'WAITING' | 'TREATING' | 'COMPLETED' | 'CANCELLED' | 'CONSULTING';
memo?: string;         
}

const TIME_SLOTS = [
  '10:00', '10:30', '11:00', '11:30', 
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'
];

type TreatmentStatus = 'ACTIVE' | 'COMPLETED' | 'EXPIRED';

const STATUS_MAP: Record<TreatmentStatus, string> = {
  ACTIVE: '진행중',
  COMPLETED: '완료',
  EXPIRED: '만료',
}

interface TreatmentItem {
  id: number;
  name: string;    
  remainingCount :number;
  totalCount: number;
  status:'ACTIVE' | 'COMPLETED'|'EXPIRED';
  date: string;
  expire?: string;
}

interface Patient{
  chartNo:string;
  name: string;
  phone: string;
  status: string; //'정상'
  memo: string,
}
interface PatientData {
  patient: Patient;
  treatments: TreatmentItem[];
}
export default function PatientBookingPage (){
  const params = useParams();
  const chartNo = params?.chartNo as string;
    
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedTreatment, setSelectedTreatment] = useState<TreatmentItem | null>(null);
  const [memo, setMemo] = useState<string>('');
  const [showAddTreatModal,setShowAddTreatModal ]=useState(false);




  // const [treatments, setTreatments] = useState<TreatmentItem[]>([]);
  // const [isLoading, setIsLoading]= useState(true);
  const [showMemoTooltip, setShowMemoTooltip] = useState(false);

  const [filter, setFilter] = useState<TreatmentStatus|'ALL'>('ALL');

  const fetchPatientData = async (chartNo:string) : Promise<PatientData>=> {
        
    //chartNo로 환자 정보 및 시술권 조회 API 호출
        const response = await axios.get(`http://localhost:4000/api/reservation/patient/${chartNo}`);

        const userData = response.data.user;
        const treatData = response.data.treatments;
        
        return{ 
          patient: {
          chartNo: userData.CHART_NO,
          name: userData.USER_NAME || userData.NAME || '고객',
          phone: userData.PHONE || '연락처 없음',
          status: userData.STATUS || '정상',
          memo: userData.MEMO || '귀여움짱귀여움',
          },
          treatments :  treatData.map((t:any)=>({
            id: t.TREATMENT_IDX,
            name: t.TREATMENT_NAME || '일반 시술권',
            remainingCount: t.REMAINING_COUNT ?? 0,
            totalCount: t.TOTAL_COUNT ?? 0,
            status: t.STATUS || 'ACTIVE',
            date:t.UPDATED_AT ? t.UPDATED_AT.substring(0,10) :'날짜 미상',
            expire:t.EXPIRE_DATE,
          })),
        }
    };
    
    const queryClient = useQueryClient();
    
    const { data, isLoading, isError, error, refetch, isFetching} = useQuery({
      queryKey:  ['treatments', chartNo],
      queryFn: ()=> fetchPatientData(chartNo),
      enabled: !!chartNo,
    })

    const patient = data?.patient ?? {
      chartNo,
      name: '',
      phone: '',
      status: '정상',
      memo: '',
    };

    const treatments: TreatmentItem[] = data?.treatments ?? [];

  const handleBookingSubmit = async()=>{
    if(!selectedDate || !selectedTime){
      alert('예약 날짜와 시간을 모두 선택해 주세요.');
      return;
    }
    try{
        const response = await axios.post('http://localhost:4000/api/admin/reservation',{
            chartNo: patient.chartNo,
            treatmentIdx: selectedTreatment ? selectedTreatment.id : null,
            reservationDate: selectedDate,
            reservationTime: selectedTime,
            memo: memo || '',
        })

        if(response.data.success){
          alert('예약이 성공적으로 완료되었습니다!');
          setSelectedDate('');
          setSelectedTime('');
          setSelectedTreatment(null);
          setMemo('');
        }else{
            alert(`예약 실패: ${response.data.message ||"알 수 없는 오류가 발생했습니다." }`);
        }
    }catch(error:any){
        console.error('예약 요청 중 에러:', error);

        const serverMessage = error.response?.data?.message;
        if(serverMessage){
            alert(`예약실패: ${serverMessage}`)
        }else{
            alert("서버 통신 중 에러가 발생했습니다. 잠시 후 다시 시도해 주세요.");
        }
    }
  }

  const filteredTreatmentList = treatments.filter(item=>{
    if(filter === 'ALL') return true;
    return item.status === filter;
  })

  const count = (tab:'ACTIVE' | 'COMPLETED' | 'EXPIRED')=>{
    return treatments.filter(item=>item.status === tab).length;
  }

  if (isError) {
    return (
      <ErrorState
        message='환자 정보를 불러오지 못했습니다'
        onRetry={()=>refetch()}
        isRetrying={isFetching}
      />
    );
  }
  
  
  return (
    <>
    <S.BookingContainer>
      <S.BookingHeader>
        <div className="admin-page-title-block">
        <span className="admin-page-eyebrow">PATIENT / RESERVATION</span>
        <S.BookingTitle>시술 예약 관리</S.BookingTitle>
        <p className="admin-page-description">
          환자의 보유 시술권을 확인하고 새로운 예약을 관리합니다.
        </p>
      </div>
      </S.BookingHeader>

      <S.BookingContentGrid>
        {/* 왼쪽: 환자 프로필 및 보유 시술권 리스트 */}
        <S.LeftColumn>
          <S.ProfileCard className="admin-panel">
                <S.ProfileHeader className="admin-panel-head">
                  {isLoading ? (
                   <LoadingState message='환자 정보를 불러오는 중입니다...'/>
                  ): (
                    <>
                    <S.Avatar>{patient.name?.[0] || '환'}</S.Avatar>
                    <div>
                      <S.PatientName>{patient.name} 고객님</S.PatientName>
                      <S.PatientNo>{chartNo}</S.PatientNo>
                      
                    </div>
                    <A.Button $variant='primary'
                      style={{marginLeft: 'auto'}}
                      onClick={() => setShowAddTreatModal(true)}
                    >
                      + 시술권 추가
                    </A.Button>
                    </>
                  )}
                </S.ProfileHeader>
                
                <S.ProfileFooter >
                  <S.TitleWrapper>
                  {patient.memo && (
                    <S.MemoContainer>
                      <S.MemoIconButton type='button' onClick={()=> setShowMemoTooltip(prev=>!prev)}>
                        <FaRegCommentDots title='환자메모확인'/>
                      </S.MemoIconButton>

                      {showMemoTooltip && (
                        <S.MemoTooltipBox>
                          {patient.memo}
                        </S.MemoTooltipBox>
                      )}
                    </S.MemoContainer>
                  )}
                  <span>{patient.phone || '010-0000-0000'}</span>
                  </S.TitleWrapper>
                  <S.GradeBadge $isActive={patient.status === '정상'}>{patient.status}</S.GradeBadge>
                </S.ProfileFooter>
            </S.ProfileCard>

          {/* 남은 시술 리스트 카드 */}
          <S.ProcedureCard className="admin-panel">
            <S.CardHeader className="admin-panel-head">
              <S.TitleWrapper>
                <FaCheckCircle/>
                <S.SectionTitle>보유/예정 시술 내역</S.SectionTitle>
              </S.TitleWrapper>
              <S.FilterTabWrapper>
                <S.FilterTab
                $isActive={filter==='ALL'}
                onClick={()=>setFilter('ALL')}
                > 
                전체 <span>{treatments.length}</span>
                </S.FilterTab>

                <S.FilterTab
                $isActive={filter==='ACTIVE'}
                onClick={()=>setFilter('ACTIVE')}
                > 
                진행 <span>{count('ACTIVE')}</span>
                </S.FilterTab>

                <S.FilterTab
                $isActive={filter==='COMPLETED'}
                onClick={()=>setFilter('COMPLETED')}
                > 
                완료 <span>{count('COMPLETED')}</span>
                </S.FilterTab>

                <S.FilterTab
                $isActive={filter==='EXPIRED'}
                onClick={()=>setFilter('EXPIRED')}
                > 
                만료 <span>{count('EXPIRED')}</span>
                </S.FilterTab>

              </S.FilterTabWrapper>
            </S.CardHeader>
          <div className="admin-panel-body">
            <S.ProcedureList>
              {isLoading ? 
                <S.EmptyMessage>시술권을 불러오는 중입니다..</S.EmptyMessage>
              :(
                treatments.length === 0 ? (
                  <S.EmptyMessage>
                    보유 중인 시술권이 없습니다.
                  </S.EmptyMessage>
                ):( 
                  filteredTreatmentList.map((item) => (
                  <S.ProcedureItem 
                    key={item.id}
                    onClick={() => {
                      if(item.remainingCount === 0 || item.status === 'COMPLETED') return;
                        setSelectedTreatment(item)
                      }}
                    $isOpen={selectedTreatment?.id === item.id}
                    $disabled={item.remainingCount === 0 || item.status === 'COMPLETED'}
                  >
                    <S.ProcedureInfoTop>
                      <S.ProcedureName>{item.name ||'일반 시술권'}</S.ProcedureName>
                      {item.totalCount > 1 && (
                        <S.ProcedureRoundBadge>
                          {item.totalCount - item.remainingCount}회차
                        </S.ProcedureRoundBadge>
                      )}                    
                      <S.StatusBadge $status={item.status}>
                         { STATUS_MAP[item.status] }
                      </S.StatusBadge>
                    </S.ProcedureInfoTop>
                    <S.ProcedureDetails>
                        <div>
                        <S.ProcedureDate>마지막 이용일 : {item.date}</S.ProcedureDate> 
                        {item.expire && <S.ProcedureDate>만료일: {item.expire}</S.ProcedureDate> }
                        </div>
                        {item.totalCount > 1 && (
                          <S.CountBadge>잔여 {item.remainingCount} / {item.totalCount}회</S.CountBadge>
                        )}
                    </S.ProcedureDetails>
                  </S.ProcedureItem>
                )))
              )
              }
            </S.ProcedureList>
          </div>
          </S.ProcedureCard>
        </S.LeftColumn>

        {/* 오른쪽: 예약 캘린더 및 시간 및 메모 선택 */}
        <S.RightColumn>
          <S.BookingFormCard className="admin-panel">
            <div className="admin-panel-head">
              <S.HeaderTitleWrapper >
                <FaRegCalendarCheck /> 
                <S.SectionTitle>
                  {selectedTreatment ? (
                    <span>
                    {selectedTreatment.name} 
                    <S.HighlightRound>
                      {selectedTreatment.totalCount - selectedTreatment.remainingCount + 1}회차
                    </S.HighlightRound> 예약
                    </span>
                  )
                  :<span>시술 예약일시 선택 <S.FormNotice>시술권을 먼저 선택해주세요</S.FormNotice></span>}
                </S.SectionTitle>
              </S.HeaderTitleWrapper>
            </div>
            <div className="admin-panel-body">
              {/* 캘린더 영역 */}
              <S.InputGroup className="admin-form-field">
                <S.Label>날짜 선택</S.Label>
                <S.DateInput 
                  type="date" 
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </S.InputGroup>

              {/* 시간대별 버튼 영역 */}
              <S.InputGroup className="admin-form-field">
                <S.Label>예약 가능 시간</S.Label>
                <S.TimeGrid>
                  {TIME_SLOTS.map((time) => (
                    <S.TimeButton
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      $active={selectedTime === time}
                    >
                      {time}
                    </S.TimeButton>
                  ))}
                </S.TimeGrid>
              </S.InputGroup>
              <S.InputGroup className="admin-form-field">
                <S.Label>예약 메모 (특이사항)</S.Label>
                <S.MemoInput 
                  rows={2}
                  placeholder="고객 예약 요청사항을 입력해주세요."
                  value={memo}
                  onChange={(e:any) => setMemo(e.target.value)}
                />
              </S.InputGroup>
            </div>

            <S.SubmitButton 
              className="admin-primary-action"
              onClick={handleBookingSubmit}
            >
              예약 확정하기
            </S.SubmitButton>
          </S.BookingFormCard>
        </S.RightColumn>

      </S.BookingContentGrid>
    </S.BookingContainer>

    <AddTreatmentModal
    chartNo={chartNo}
    isOpen={showAddTreatModal}
    onClose={() => setShowAddTreatModal(false)}
    />
    
    </>
  );
};



