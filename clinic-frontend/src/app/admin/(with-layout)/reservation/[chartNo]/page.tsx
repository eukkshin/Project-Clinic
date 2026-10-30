'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'next/navigation'
import { FaCheckCircle,FaRegCalendarCheck } from 'react-icons/fa';
import * as S from './reservation.style'
import { AddTreatmentModal } from '../components/AddTreatmentModal';
import * as A from "@/assets/css/admin/DetailCMS.styles";
import { FaRegClock, FaRegCommentDots } from 'react-icons/fa6';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import ErrorState  from '@/ui/feedback/ErrorState';
import LoadingState from '@/ui/feedback/LoadingState';
import { useToastContext } from '@/ui/feedback/toast/ToastContext';

type ReservationStatus =
  | 'RESERVED'
  | 'WAITING'
  | 'TREATING'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'CONSULTING';

interface ReservationItem {
reservationIdx: number;
chartNo: string; 
treatmentIdx: number;          
reservationDate: string; 
reservationTime: string;   
status: ReservationStatus
memo?: string;         
}

type CreateReservationItem = Omit<ReservationItem, 'reservationIdx'>

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
  reservations: ReservationItem[];
}
export default function PatientBookingPage (){

  const { showToast } = useToastContext();
  const params = useParams();
  const chartNo = params?.chartNo as string;
    
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedTreatment, setSelectedTreatment] = useState<TreatmentItem | null>(null);
  const [memo, setMemo] = useState<string>('');
  const [editingReservationIdx, setEditingReservationIdx] =useState<number | null>(null);

  const [showAddTreatModal,setShowAddTreatModal ]=useState(false);
  const [showMemoTooltip, setShowMemoTooltip] = useState(false);

  const [filter, setFilter] = useState<TreatmentStatus|'ALL'>('ALL');

  const [errorMessage, setErrorMessage]=useState({
    treatment:'',
    date: '',
    time: '',
  })

  const queryClient = useQueryClient();
  
  const { data, isLoading, isError, refetch, isFetching} = useQuery({
    queryKey:  ['patientReservation', chartNo],
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

  const reservations = data?.reservations ?? [];

  const getNextReservation = (treatmentId: number)=>{
    return reservations.filter(r =>
        Number(r.treatmentIdx) === treatmentId &&
        ['RESERVED', 'WAITING', 'TREATING', 'CONSULTING'].includes(
          r.status
        )
    )
    .sort((a, b) => {
      const dateA = a.reservationDate.slice(0, 10);
      const dateB = b.reservationDate.slice(0, 10);

      return (
        dateA.localeCompare(dateB) ||
        a.reservationTime.localeCompare(b.reservationTime)
      );
    })[0];
  }
  const fetchPatientData = async (chartNo:string) : Promise<PatientData>=> {
        
    //chartNo로 환자 정보 및 시술권 조회 API 호출
    const response = await axios.get(`http://localhost:4000/api/reservation/patient/${chartNo}`);

    const userData = response?.data?.user;
    const treatData = response?.data?.treatments;
    const bookingData = response?.data?.reservations;
    
    return{ 
      patient: {
      chartNo: userData.CHART_NO,
      name: userData.USER_NAME || userData.NAME || '고객',
      phone: userData.PHONE || '연락처 없음',
      status: userData.STATUS || '정상',
      memo: userData.MEMO || 'test',
      },
      treatments :  (treatData ?? []).map((t:any)=>({
        id: t.TREATMENT_IDX,
        name: t.TREATMENT_NAME || '일반 시술권',
        remainingCount: t.REMAINING_COUNT ?? 0,
        totalCount: t.TOTAL_COUNT ?? 0,
        status: t.STATUS || 'ACTIVE',
        date:t.UPDATED_AT ? t.UPDATED_AT.substring(0,10) :'날짜 미상',
        expire:t.EXPIRE_DATE,
      })),

      reservations: (bookingData ?? []).map((r:any)=>({
        reservationIdx: r.RESERVATION_IDX,
        chartNo: r.CHART_NO,
        treatmentIdx: r.TREATMENT_IDX,
        reservationDate: r.RESERVATION_DATE,
        reservationTime: r.RESERVATION_TIME,
        status: r.STATUS,
        memo: r.MEMO ?? '',
      }))
    }
    };
    
    const { mutate, isPending } = useMutation({
      mutationFn: async(data: CreateReservationItem)=>{
        if(editingReservationIdx !== null){
          const response = await axios.patch( `http://localhost:4000/api/admin/reservation/${editingReservationIdx}`,{
            reservationDate: data.reservationDate,
            reservationTime: data.reservationTime,
            memo: data.memo,
          })
          if(!response.data.success){
            throw new Error(response.data.message || '예약수정에 실패했습니다')
          }
          return response.data;
        }
        const response = await axios.post('http://localhost:4000/api/admin/reservation',data)
        if(!response.data.success){
          throw new Error(response.data.message || '예약등록에 실패했습니다')
        }
        return response.data;
        
      },
      onSuccess:()=>{
        showToast('예약이 성공적으로 처리되었습니다.', 'success')
        setSelectedDate('');
        setSelectedTime('');
        setSelectedTreatment(null);
        setEditingReservationIdx(null);
        setMemo('');
        queryClient.invalidateQueries({queryKey: ['patientReservation', chartNo]});
      },
      onError:(error: Error)=>{
        showToast('서버 통신 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.', 'error')
      }
    })
  
  const handleBookingSubmit = async()=>{

    //시술권
    if (!selectedTreatment) {
      setErrorMessage(prev=>({...prev, treatment:'시술권을 먼저 선택해 주세요.'}));
    return;
    }
    //날짜
    if(!selectedDate){
      setErrorMessage(prev=>({...prev, date:'예약 날짜를 선택해 주세요.'}));
      return;
    }

    const now = new Date();
    const today =
    `${now.getFullYear()}-`+
    `${String(now.getMonth()+1).padStart(2,'0')}-`+
    `${String(now.getDate()).padStart(2,'0')}`

    if(selectedDate < today){
      setErrorMessage(prev=>({...prev, date:'오늘 이전 날짜는 예약할 수 없습니다.'}));
      return;
    }

    if (!selectedTime) {
      setErrorMessage(prev=>({...prev, time:'예약 시간을 선택해 주세요.'}));
      return;
    }

    //중복제출방지
    if(isPending) return;

    const data:CreateReservationItem = {
      chartNo: patient.chartNo,
      treatmentIdx:selectedTreatment.id,
      reservationDate: selectedDate,
      reservationTime: selectedTime,
      status: 'RESERVED',
      memo: memo || '',
    }
    mutate(data); //전송
  }

  const filteredTreatmentList = treatments.filter(item=>{
    if(filter === 'ALL') return true;
    return item.status === filter;
  })

  const count = (tab:'ACTIVE' | 'COMPLETED' | 'EXPIRED')=>{
    return treatments.filter(item=>item.status === tab).length;
  }

  const clearError = (field: 'treatment'|'date'|'time')=>{
    setErrorMessage(prev=>({
      ...prev,
      [field]:'',
    }))
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
            <S.ProcedureSection className="admin-panel-body reservation-body">
              <S.ProcedureErrorArea>
              {errorMessage.treatment && 
                <S.ErrorText>{errorMessage.treatment}</S.ErrorText>}
              </S.ProcedureErrorArea>
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
                          clearError('treatment');

                          const existingReservation = getNextReservation(item.id);
                          if(existingReservation){
                              setEditingReservationIdx(existingReservation.reservationIdx);

                              // 기존 예약 날짜와 시간을 입력창에 표시
                              setSelectedDate(
                                existingReservation.reservationDate.slice(0, 10)
                              );
                              setSelectedTime(existingReservation.reservationTime);

                              // 기존 예약 메모 표시
                              setMemo(existingReservation.memo ?? '');
                            } else {
                              // 예약이 없으면 신규 예약 모드
                              setEditingReservationIdx(null);
                              setSelectedDate('');
                              setSelectedTime('');
                              setMemo('');
                            }
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
                          {(()=>{
                            const nextReservation= getNextReservation(item.id);
                            return(
                                  <S.IconWrapper>
                                    <FaRegClock/>
                                    <S.ProcedureDate>
                                      다음 예약일:{" "}
                                      {nextReservation 
                                      ? `${nextReservation.reservationDate.slice(0,10)} > ${nextReservation.reservationTime}` 
                                      : "예약 없음"}
                                    </S.ProcedureDate> 
                                  </S.IconWrapper>
                            )
                          })()}
                          {item.expire && <S.ProcedureDate>만료일: {item.expire}</S.ProcedureDate> }
                          </div>
                          {item.totalCount > 1 && (
                            <S.CountBadge>잔여 {item.remainingCount} / {item.totalCount}회</S.CountBadge>
                          )}
                          {item.totalCount ===1 && (
                            <S.CountBadge> {item.totalCount}회</S.CountBadge>
                          )}
                      </S.ProcedureDetails>
                    </S.ProcedureItem>
                  )))
                )
                }
              </S.ProcedureList>
            </S.ProcedureSection>
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
                
                <S.Label className="reservation-label">
                  <span>날짜 선택</span>
                  {errorMessage.date && <S.ErrorText>{errorMessage.date}</S.ErrorText>}
                </S.Label>

                <S.DateInput 
                  type="date" 
                  value={selectedDate}
                  onChange={(e) => {setSelectedDate(e.target.value); clearError('date')}}
                />
              </S.InputGroup>

              {/* 시간대별 버튼 영역 */}
              <S.InputGroup className="admin-form-field">
                 <S.Label className="reservation-label">
                  <span>예약 가능 시간</span>
                  {errorMessage.time && <S.ErrorText>{errorMessage.time}</S.ErrorText>}
                </S.Label>
                <S.TimeGrid>
                  {TIME_SLOTS.map((time) => (
                    <S.TimeButton
                      key={time}
                      onClick={() => {
                        setSelectedTime(time);
                        clearError('time');
                      }}
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
              disabled={isPending}
              onClick={handleBookingSubmit}
            >
              {isPending
              ? (editingReservationIdx !==null)
                ? '예약 수정중...'
                : '예약 등록중...'
              : (editingReservationIdx !== null)
                ? '예약 수정하기'
                : '예약 등록하기'
              }
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



