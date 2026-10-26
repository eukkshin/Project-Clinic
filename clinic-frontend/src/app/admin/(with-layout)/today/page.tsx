'use client'

import React, { useState,useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import styled from 'styled-components';

import { FaSearch, FaUser, FaCalendarCheck, FaClock, FaArrowCircleRight } from 'react-icons/fa';
import { FiMail } from 'react-icons/fi';
import * as S from './today.style'

interface TodayPatient{
    chartNo: string;
    name: string;
    phone: string;
    birthDate: string;
    gender: 'M' | 'F'
    reservationTime: string;
    status: 'CONSULTING'|'RESERVED' | 'WAITING' | 'TREATING' | 'COMPLETED' | 'CANCELLED';
    memo?: string;
}

const DEMO_PATIENTS :TodayPatient[]= [
  {
    chartNo: "C1001",
    name: "김민준",
    phone: "010-1234-5678",
    birthDate: "900512",
    gender: "M",
    reservationTime: "09:30",
    status: "WAITING",
    memo: "초진, 정기 검진 요청"
  },
  {
    chartNo: "C1002",
    name: "이지은",
    phone: "010-2345-6789",
    birthDate: "950823",
    gender: "F",
    reservationTime: "10:00",
    status: "TREATING",
    memo: "스케일링 및 치주 치료"
  },
  {
    chartNo: "C1003",
    name: "박도윤",
    phone: "010-3456-7890",
    birthDate: "881204",
    gender: "M",
    reservationTime: "10:30",
    status: "WAITING",
    memo: "사랑니 통증 호소"
  },
  {
    chartNo: "C1004",
    name: "서지우",
    phone: "010-4567-8901",
    birthDate: "020315",
    gender: "F",
    reservationTime: "11:00",
    status: "COMPLETED",
    memo: "교정기 왁스 수령"
  },
  {
    chartNo: "C1005",
    name: "강서준",
    phone: "010-5678-9012",
    birthDate: "750918",
    gender: "M",
    reservationTime: "11:30",
    status: "RESERVED",
    memo: "보철 치료 상담"
  }
];

export default function ReservationDashboardComponent() {
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchedMemberList, setSearchedMemberList] = useState([]);

  const [todayPatientList, setTodayPatientList] = useState<TodayPatient[]>(DEMO_PATIENTS);
  const [filter, setFilter] = useState<TodayPatient['status']>('RESERVED');

  useEffect(()=>{
    const fetchSearchUser = async()=>{
        if(!searchTerm.trim()){
            setSearchedMemberList([]);
            return;
        }
        try {   
            const res = await axios.get('http://localhost:4000/api/admin/users',{
                params: { search: searchTerm }
            })
            const searchUsers = res.data.data || [];

            setSearchedMemberList(searchUsers)
        }catch(error){
            console.error('환자 검색 실패:', error)
        }
    }
    fetchSearchUser();
  }, [searchTerm])
  
  
  const handleRegisterToday = (patient: TodayPatient)=>{
    const isAlreadyAdded= todayPatientList.some(p=> p.chartNo === patient.chartNo);
    if(isAlreadyAdded){
      alert('이미 오늘 대기/접수 목록에 등록된 환자입니다.');
      return;
    }

    const newPatientEntry: TodayPatient={
      ...patient,
      reservationTime: new Date().toLocaleDateString([], {hour: '2-digit', minute: '2-digit' }),
      status: 'WAITING',
    }

    setTodayPatientList(prev=> [newPatientEntry, ...prev])
    alert(`${patient.name} 환자분이 대기 목록에 접수되었습니다.`);
    setSearchTerm('');
  }

  const filteredList = useMemo(()=>{
      const keyword = (searchTerm?? '').trim().toLowerCase();
      if(!keyword) return [];
  
      const matchedList= todayPatientList.filter(
        patient=> 
          patient.name.toLowerCase().includes(keyword) || 
          patient.chartNo.toLowerCase().includes(keyword) ||
          patient.birthDate.toLowerCase().includes(keyword)  
      )
      const statusPriority : Record<TodayPatient['status'], number> ={
        TREATING: 1,    
        WAITING: 2,    
        RESERVED: 3,    
        CONSULTING: 4,  
        COMPLETED: 5,   
        CANCELLED: 6,   
      };
      return matchedList.sort((a,b)=>statusPriority[a.status] - statusPriority[b.status])
  
    },[searchTerm,todayPatientList])

    const updatesNextStatus = (currentStatus: TodayPatient['status']) :TodayPatient['status']=>{
      switch (currentStatus) {
        case 'RESERVED':
          return 'WAITING';   
        case 'WAITING':
          return 'TREATING';    
        case 'TREATING':
          return 'COMPLETED';  
        case 'COMPLETED':
        default:
          return currentStatus;
     }
    }

    const handleNextStatus = (patient: TodayPatient, e:React.MouseEvent)=>{
      e.stopPropagation();

      if(patient.status === 'COMPLETED'){
         router.push(`/admin/reservation/${patient.chartNo}`);
         return;
      }
      setTodayPatientList(prev=>(
        prev.map(p=> {
          if(p.chartNo ===patient.chartNo){
            return({
              ...p,
              status: updatesNextStatus(p.status)
            })
          }
          return p;
        })
      ))
    }

    const displayedData={
      'WAITING': todayPatientList.filter(p => p.status === 'WAITING'),
      'TREATING': todayPatientList.filter(p => p.status === 'TREATING'),
      'COMPLETED': todayPatientList.filter(p => p.status === 'COMPLETED'),
      'RESERVED': todayPatientList.filter(p => p.status === 'RESERVED'),
    }
    

    const waitingList = todayPatientList.filter(p => p.status === 'WAITING');
    const treatingList = todayPatientList.filter(p => p.status === 'TREATING');
    const completedList = todayPatientList.filter(p => p.status === 'COMPLETED');
    const reservedList = todayPatientList.filter(p => p.status === 'RESERVED');

    const counts = {
    WAITING : waitingList.length || 0,
    TREATING: treatingList.length || 0,
    COMPLETED: completedList.length || 0,
    RESERVED: reservedList.length || 0,
    CONSULTING: 0,  
    CANCELLED: 0,
    }

    const displayList =(()=>{
      if (filter === 'RESERVED') return reservedList;
      if(filter === 'WAITING') return waitingList;
      if(filter === 'TREATING') return treatingList;
      if(filter === 'COMPLETED') return completedList;
    })();
  
  return (
    <Layout>
      <S.PageContainer>
        
        {/* 1. 상단 페이지 헤더 */}
        <S.PageHeader>
          <S.PageHeading>
            <S.Eyebrow>CLINIC RECEPTION & APPOINTMENT DASHBOARD</S.Eyebrow>
            <S.PageTitle>오늘의 예약 및 대기 현황</S.PageTitle>
            <S.PageDescription>
              실시간 병원 방문 접수 현황과 대기·시술 상태를 통합 관리합니다.
            </S.PageDescription>
          </S.PageHeading>

          <S.ButtonWrapper>
            <S.PrimaryButton>
              <FiMail /> 
              <span>예약하기</span>
            </S.PrimaryButton>
            <S.RefreshButton type="button">
              <FaArrowCircleRight />
              <span>새로고침</span>
            </S.RefreshButton>
          </S.ButtonWrapper>
        </S.PageHeader>

        {/* 2. 상단 요약 카드 그리드 (오늘 총 예약, 대기중, 치료중, 완료) */}
        <S.SummaryGrid>
          <S.SummaryCard>
            <S.SummaryIcon $variant='pink'><FaCalendarCheck /></S.SummaryIcon>
            <S.SummaryContent>
              <span>오늘 총 예약</span>
              <strong>{todayPatientList?.length || 0}명</strong>
              <small>확정된 예약 건수</small>
            </S.SummaryContent>
          </S.SummaryCard>

          <S.SummaryCard>
            <S.SummaryIcon $variant="yellow"><FaClock /></S.SummaryIcon>
            <S.SummaryContent>
              <span>현재 대기 중</span>
              <strong>{waitingList.length || 0}명</strong>
              <small>원장님 진료 대기</small>
            </S.SummaryContent>
          </S.SummaryCard>

          <S.SummaryCard>
            <S.SummaryIcon $variant="green"><FaUser /></S.SummaryIcon>
            <S.SummaryContent>
              <span>시술/진료 중</span>
              <strong>{treatingList.length || 0}명</strong>
              <small>현재 진행 중인 환자</small>
            </S.SummaryContent>
          </S.SummaryCard>
        </S.SummaryGrid>

        <S.ContentGrid>
          {/* [좌측 패널] 오늘의 대기/접수 현황판 */}
          <S.Panel>
            <S.PanelHeader>
              <S.PanelHeading>
                <S.PanelIcon><FaClock /></S.PanelIcon>
                  {/* 탭 버튼 그룹 */}
                <div>
                  <S.PanelTitle>실시간 대기 현황판</S.PanelTitle>
                  <S.PanelDescription>오늘 내원한 환자의 진료 단계를 관리합니다.</S.PanelDescription>
                </div>
              </S.PanelHeading>
              <S.RightWrapper>
                <S.TabGroup>
                  <S.TabButton $active={filter === 'RESERVED'} onClick={() => setFilter('RESERVED')}>예약</S.TabButton>
                  <S.TabButton $active={filter === 'WAITING'} onClick={() => setFilter('WAITING')}>대기</S.TabButton>
                  <S.TabButton $active={filter === 'TREATING'} onClick={() => setFilter('TREATING')}>치료</S.TabButton>
                  <S.TabButton $active={filter === 'COMPLETED'} onClick={() => setFilter('COMPLETED')}>완료</S.TabButton>
                </S.TabGroup>
              </S.RightWrapper>
            </S.PanelHeader>
            
            <S.ItemCount>
              {counts[filter] || 0}/{todayPatientList?.length || 0}
            </S.ItemCount>

            <S.RecordList>
            {displayList?.length === 0 ? (
              <S.EmptyState><strong>해당하는 환자 내역이 없습니다.</strong></S.EmptyState>
            ):(
              displayList?.map(patient=>(
              <S.RecordCard key={patient.chartNo}>
                <S.RecordTop>
                  <S.RecordIdentity $gender={patient.gender}>
                    <div className="avatar">{patient.name[0]}</div>
                    <div>
                      <S.RecordName>{patient.name} <small>{patient.birthDate}</small></S.RecordName>
                      <S.RecordSub>{patient.reservationTime}예약(차트: {patient.chartNo})</S.RecordSub>
                    </div>
                  </S.RecordIdentity>
                  <S.StatusBadge $status={patient.status} onClick={(e:any)=>handleNextStatus(patient, e)}>
                    <span className="dot" /> {patient.status}
                  </S.StatusBadge>
                </S.RecordTop>
              </S.RecordCard>
              ))
            )}
            </S.RecordList>
          </S.Panel>

          {/* [우측 패널] 기존 환자 검색 및 빠른 접수 도구 */}
          <S.Panel>
            <S.PanelHeader>
              <S.PanelHeading>
                <S.PanelIcon><FaSearch /></S.PanelIcon>
                <div>
                  <S.PanelTitle>환자 검색 및 빠른 접수</S.PanelTitle>
                  <S.PanelDescription>기존 환자를 검색하여 오늘의 예약으로 등록합니다.</S.PanelDescription>
                </div>
              </S.PanelHeading>
            </S.PanelHeader>

            <S.ListToolbar>
              <S.SearchWrapper>
                <FaSearch />
                <S.SearchInput
                  placeholder="환자 이름, 차트번호, 생년월일 검색"
                  value={searchTerm}
                  onChange={(e:any) => setSearchTerm(e.target.value)}
                />
              </S.SearchWrapper>

            </S.ListToolbar>

            <S.RecordList>
              {/* 검색 결과 영역 (여기에 아까 만든 검색 모달 내부 리스트 로직이 쏙 들어갑니다!) */}
              {!searchTerm ? (
                <S.EmptyState>
                  <FaSearch />
                  <strong>환자 이름을 검색해 주세요.</strong>
                  <span>개인정보 보호를 위해 검색 전에는 목록이 숨겨집니다.</span>
                </S.EmptyState>
              ) : (
                filteredList.length === 0 ? (
                  <S.EmptyState>
                    <strong>검색 결과가 없습니다.</strong>
                  </S.EmptyState>
                ):(
                  searchedMemberList.map(patient=>(
                    <S.RecordCard key={patient.chartNo} onClick={() => handleRegisterToday(patient)}>
                      <S.RecordTop>
                        <S.RecordIdentity $gender={patient.gender}>
                          <div className="avatar">{patient.name[0]}</div>
                          <div>
                            <S.RecordName>{patient.name} <small>{patient.birthDate}</small></S.RecordName>
                            <S.RecordSub>{patient.phone} (차트: {patient.chartNo})</S.RecordSub>
                          </div>
                        </S.RecordIdentity>
                        <S.ActionBadge>+ 오늘 접수</S.ActionBadge>
                      </S.RecordTop>
                    </S.RecordCard>
                  ))
                )
              )}
            </S.RecordList>
          </S.Panel>

        </S.ContentGrid>
      </S.PageContainer>
    </Layout>
  );
}

const Layout = styled.div`
  background-color: #f8fafc;
  min-height: 100vh;
  padding: 40px 20px;
`;


