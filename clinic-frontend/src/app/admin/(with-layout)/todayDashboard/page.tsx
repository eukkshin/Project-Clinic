"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  FaCalendarCheck,
  FaClock,
  FaPlus,
  FaSearch,
  FaTimes,
  FaUser,
} from "react-icons/fa";
import styled from "styled-components";
import { useDebounce } from "use-debounce";

import axios from "@/lib/admin/apiClient";
import { API_ORIGIN } from "@/lib/api/config";

import * as S from "./today.style";

type PatientStatus =
  | "RESERVED"
  | "WAITING"
  | "CONSULTING"
  | "TREATING"
  | "COMPLETED"
  | "CANCELLED";

interface TodayPatient {
  reservationIdx: number;
  chartNo: string;
  name: string;
  phone: string;
  birthDate: string;
  gender: "M" | "F";
  reservationDate: string;
  reservationTime: string;
  status: PatientStatus;
  memo?: string;
}

interface Member {
  chartNo: string;
  name: string;
  phone: string;
  birthDate: string;
  gender: "M" | "F";
}

interface ReservationForm {
  reservationDate: string;
  reservationTime: string;
  memo: string;
}

//상태 관련 설정

const STATUS_LABEL: Record<PatientStatus, string> = {
  RESERVED: "예약",
  WAITING: "대기",
  CONSULTING: "상담",
  TREATING: "치료",
  COMPLETED: "완료",
  CANCELLED: "취소",
};

// 현재 상태에서 변경할 수 있는 상태
const AVAILABLE_STATUSES: Record<PatientStatus, PatientStatus[]> = {
  RESERVED: ["WAITING", "CANCELLED"],
  WAITING: ["CONSULTING", "TREATING", "COMPLETED"],
  CONSULTING: ["TREATING", "COMPLETED"],
  TREATING: ["COMPLETED"],
  COMPLETED: [],
  CANCELLED: [],
};

//  날짜 유틸리티

const getToday = () => {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export default function TodayDashboard() {
  // 오늘 예약 환자 목록
  const [todayPatientList, setTodayPatientList] = useState<TodayPatient[]>([]);

  // 환자 검색
  const [searchTerm, setSearchTerm] = useState("");
  const [searchedMemberList, setSearchedMemberList] = useState<Member[]>([]);
  const [debouncedSearchTerm] = useDebounce(searchTerm, 300);

  // 예약 등록 모달
  const [isReservationModalOpen, setIsReservationModalOpen] = useState(false);

  const [selectedPatient, setSelectedPatient] = useState<Member | null>(null);

  const [reservationForm, setReservationForm] = useState<ReservationForm>({
    reservationDate: getToday(),
    reservationTime: "",
    memo: "",
  });

  // 로딩 및 저장 상태
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // 오늘 예약 목록 조회

  const fetchTodayReservations = async () => {
    try {
      setIsLoading(true);

      const response = await axios.get(
        `${API_ORIGIN}/api/admin/reservations/today`,
      );

      setTodayPatientList(response.data.data || []);
    } catch (error) {
      console.error("오늘 예약 목록 조회 실패:", error);
      alert("오늘 예약 목록을 불러오지 못했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTodayReservations();
  }, []);

  // 기존 환자 검색
  useEffect(() => {
    const fetchSearchUser = async () => {
      if (!debouncedSearchTerm.trim()) {
        setSearchedMemberList([]);
        return;
      }

      try {
        const response = await axios.get(`${API_ORIGIN}/api/admin/users`, {
          params: {
            search: debouncedSearchTerm,
          },
        });
        setSearchedMemberList(response.data.data || []);
      } catch (error) {
        console.error("환자 검색 실패:", error);
        setSearchedMemberList([]);
      }
    };

    fetchSearchUser();
  }, [debouncedSearchTerm]);

  // 요약 카드 숫자 계산
  const counts = useMemo(() => {
    return {
      RESERVED: todayPatientList.filter(
        (patient) => patient.status === "RESERVED",
      ).length,

      WAITING: todayPatientList.filter(
        (patient) => patient.status === "WAITING",
      ).length,

      CONSULTING: todayPatientList.filter(
        (patient) => patient.status === "CONSULTING",
      ).length,

      TREATING: todayPatientList.filter(
        (patient) => patient.status === "TREATING",
      ).length,
    };
  }, [todayPatientList]);

  // 예약 등록 모달 열기
  const handleOpenReservationModal = () => {
    setSelectedPatient(null);
    setSearchTerm("");
    setSearchedMemberList([]);

    setReservationForm({
      reservationDate: getToday(),
      reservationTime: "",
      memo: "",
    });

    setIsReservationModalOpen(true);
  };

  // 환자 검색 결과 선택
  const handleSelectPatient = (patient: Member) => {
    setSelectedPatient(patient);
    setSearchTerm("");
    setSearchedMemberList([]);
  };

  // 모달 닫기
  const handleCloseReservationModal = () => {
    if (isSaving) return;

    setIsReservationModalOpen(false);
    setSelectedPatient(null);
    setSearchTerm("");
    setSearchedMemberList([]);
  };

  //예약 정보 입력

  const handleReservationFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    setReservationForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 예약 등록

  const handleCreateReservation = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();

    if (!selectedPatient) {
      alert("예약할 환자를 선택해 주세요.");
      return;
    }

    if (!reservationForm.reservationDate || !reservationForm.reservationTime) {
      alert("예약 날짜와 시간을 입력해 주세요.");
      return;
    }

    try {
      setIsSaving(true);

      await axios.post(`${API_ORIGIN}/api/admin/reservations`, {
        chartNo: selectedPatient.chartNo,
        reservationDate: reservationForm.reservationDate,
        reservationTime: reservationForm.reservationTime,
        status: "RESERVED",
        visitType: "RESERVATION",
        arrivalTime: null,
        memo: reservationForm.memo,
      });

      alert("예약이 등록되었습니다.");

      setIsReservationModalOpen(false);
      setSelectedPatient(null);
      setSearchTerm("");

      await fetchTodayReservations();
    } catch (error) {
      console.error("예약 등록 실패:", error);
      alert("예약 등록에 실패했습니다.");
    } finally {
      setIsSaving(false);
    }
  };

  //  환자 상태 변경

  const handleChangeStatus = async (
    patient: TodayPatient,
    nextStatus: PatientStatus,
  ) => {
    if (nextStatus === patient.status) return;

    const availableStatuses = AVAILABLE_STATUSES[patient.status];

    if (!availableStatuses.includes(nextStatus)) {
      alert("변경할 수 없는 상태입니다.");
      return;
    }

    try {
      await axios.patch(
        `${API_ORIGIN}/api/admin/reservations/${patient.reservationIdx}/status`,
        {
          status: nextStatus,
        },
      );

      // 서버 변경 성공 후 화면 반영
      setTodayPatientList((prev) =>
        prev.map((item) =>
          item.reservationIdx === patient.reservationIdx
            ? { ...item, status: nextStatus }
            : item,
        ),
      );
    } catch (error) {
      console.error("환자 상태 변경 실패:", error);
      alert("환자 상태 변경에 실패했습니다.");
    }
  };

  //전체 환자 목록 정렬

  const sortedPatientList = useMemo(() => {
    const priority: Record<PatientStatus, number> = {
      WAITING: 1,
      CONSULTING: 2,
      RESERVED: 3,
      TREATING: 4,
      COMPLETED: 5,
      CANCELLED: 6,
    };

    return [...todayPatientList].sort((a, b) => {
      const statusOrder = priority[a.status] - priority[b.status];

      if (statusOrder !== 0) return statusOrder;

      return a.reservationTime.localeCompare(b.reservationTime);
    });
  }, [todayPatientList]);

  return (
    <Layout>
      <S.PageContainer>
        {/* 상단 헤더 */}
        <S.PageHeader>
          <S.PageHeading>
            <S.Eyebrow>CLINIC RECEPTION & APPOINTMENT DASHBOARD</S.Eyebrow>

            <S.PageTitle>오늘의 예약 및 내원 현황</S.PageTitle>

            <S.PageDescription>
              오늘 예약된 환자와 내원 진행 상황을 관리합니다.
            </S.PageDescription>
          </S.PageHeading>

          <S.ButtonWrapper>
            <S.PrimaryButton type="button" onClick={handleOpenReservationModal}>
              <FaPlus />
              <span>예약 등록</span>
            </S.PrimaryButton>

            <S.RefreshButton
              type="button"
              onClick={fetchTodayReservations}
              disabled={isLoading}
            >
              <FaClock />
              <span>새로고침</span>
            </S.RefreshButton>
          </S.ButtonWrapper>
        </S.PageHeader>

        {/* 요약 카드 */}
        <S.SummaryGrid>
          <S.SummaryCard>
            <S.SummaryIcon $variant="pink">
              <FaCalendarCheck />
            </S.SummaryIcon>

            <S.SummaryContent>
              <span>오늘 총 예약</span>
              <strong>
                {counts.RESERVED +
                  counts.WAITING +
                  counts.CONSULTING +
                  counts.TREATING +
                  todayPatientList.filter((p) => p.status === "COMPLETED")
                    .length}
                명
              </strong>
              <small>오늘 예약된 전체 환자</small>
            </S.SummaryContent>
          </S.SummaryCard>

          <S.SummaryCard>
            <S.SummaryIcon $variant="yellow">
              <FaClock />
            </S.SummaryIcon>

            <S.SummaryContent>
              <span>현재 대기</span>
              <strong>{counts.WAITING}명</strong>
              <small>내원 및 접수 완료</small>
            </S.SummaryContent>
          </S.SummaryCard>

          <S.SummaryCard>
            <S.SummaryIcon $variant="green">
              <FaUser />
            </S.SummaryIcon>

            <S.SummaryContent>
              <span>상담 중</span>
              <strong>{counts.CONSULTING}명</strong>
              <small>상담 진행 환자</small>
            </S.SummaryContent>
          </S.SummaryCard>

          <S.SummaryCard>
            <S.SummaryIcon $variant="green">
              <FaUser />
            </S.SummaryIcon>

            <S.SummaryContent>
              <span>치료 중</span>
              <strong>{counts.TREATING}명</strong>
              <small>시술 및 치료 진행 환자</small>
            </S.SummaryContent>
          </S.SummaryCard>
        </S.SummaryGrid>

        {/* 중앙 예약 목록 */}
        <S.Panel>
          <S.PanelHeader>
            <S.PanelHeading>
              <S.PanelIcon>
                <FaCalendarCheck />
              </S.PanelIcon>

              <div>
                <S.PanelTitle>오늘의 예약 및 내원 환자</S.PanelTitle>

                <S.PanelDescription>
                  환자별 현재 진행 상태를 직접 변경할 수 있습니다.
                </S.PanelDescription>
              </div>
            </S.PanelHeading>

            <S.ItemCount>총 {todayPatientList.length}명</S.ItemCount>
          </S.PanelHeader>

          <S.RecordList>
            {isLoading ? (
              <S.EmptyState>예약 목록을 불러오는 중입니다.</S.EmptyState>
            ) : sortedPatientList.length === 0 ? (
              <S.EmptyState>
                <FaCalendarCheck />
                <strong>오늘 등록된 예약이 없습니다.</strong>
                <span>예약 등록 버튼을 눌러 새로운 예약을 등록해 주세요.</span>
              </S.EmptyState>
            ) : (
              sortedPatientList.map((patient) => (
                <S.RecordCard key={patient.reservationIdx}>
                  <S.RecordTop>
                    <S.RecordIdentity $gender={patient.gender}>
                      <div className="avatar">{patient.name?.[0]}</div>

                      <div>
                        <S.RecordName>
                          {patient.name}
                          <small>{patient.birthDate}</small>
                        </S.RecordName>

                        <S.RecordSub>
                          {patient.reservationTime} 예약
                          {" · "}
                          차트: {patient.chartNo}
                        </S.RecordSub>
                      </div>
                    </S.RecordIdentity>

                    <StatusSelect
                      value={patient.status}
                      disabled={AVAILABLE_STATUSES[patient.status].length === 0}
                      $status={patient.status}
                      onChange={(e) =>
                        handleChangeStatus(
                          patient,
                          e.target.value as PatientStatus,
                        )
                      }
                    >
                      <option value={patient.status}>
                        {STATUS_LABEL[patient.status]}
                      </option>

                      {AVAILABLE_STATUSES[patient.status].map((status) => (
                        <option key={status} value={status}>
                          {STATUS_LABEL[status]}
                        </option>
                      ))}
                    </StatusSelect>
                  </S.RecordTop>

                  {patient.memo && <PatientMemo>{patient.memo}</PatientMemo>}
                </S.RecordCard>
              ))
            )}
          </S.RecordList>
        </S.Panel>
      </S.PageContainer>

      {/* --------------------------------
          예약 등록 모달
      -------------------------------- */}

      {isReservationModalOpen && (
        <ModalOverlay onClick={handleCloseReservationModal}>
          <ReservationModal onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <div>
                <h2>신규 예약 등록</h2>
                <p>환자를 검색하고 예약 정보를 입력해 주세요.</p>
              </div>

              <CloseButton type="button" onClick={handleCloseReservationModal}>
                <FaTimes />
              </CloseButton>
            </ModalHeader>

            <form onSubmit={handleCreateReservation}>
              {/* 환자 검색 */}
              <FormSection>
                <FormLabel>예약 환자 검색</FormLabel>

                {selectedPatient ? (
                  <SelectedPatient>
                    <div>
                      <strong>{selectedPatient.name}</strong>
                      <span>
                        {selectedPatient.chartNo}
                        {" · "}
                        {selectedPatient.phone}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedPatient(null)}
                    >
                      변경
                    </button>
                  </SelectedPatient>
                ) : (
                  <>
                    <SearchBox>
                      <FaSearch />

                      <input
                        type="text"
                        placeholder="이름 또는 차트번호 검색"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </SearchBox>

                    {searchTerm.trim() && (
                      <SearchResultList>
                        {searchedMemberList.length === 0 ? (
                          <p>검색 결과가 없습니다.</p>
                        ) : (
                          searchedMemberList.map((patient) => (
                            <SearchResultItem
                              type="button"
                              key={patient.chartNo}
                              onClick={() => handleSelectPatient(patient)}
                            >
                              <div>
                                <strong>{patient.name}</strong>
                                <span>
                                  {patient.chartNo}
                                  {" · "}
                                  {patient.phone}
                                </span>
                              </div>

                              <FaPlus />
                            </SearchResultItem>
                          ))
                        )}
                      </SearchResultList>
                    )}
                  </>
                )}
              </FormSection>

              {/* 예약 날짜 */}
              <FormSection>
                <FormLabel>예약 날짜</FormLabel>

                <FormInput
                  type="date"
                  name="reservationDate"
                  min={getToday()}
                  value={reservationForm.reservationDate}
                  onChange={handleReservationFormChange}
                  required
                />
              </FormSection>

              {/* 예약 시간 */}
              <FormSection>
                <FormLabel>예약 시간</FormLabel>

                <FormInput
                  type="time"
                  name="reservationTime"
                  value={reservationForm.reservationTime}
                  onChange={handleReservationFormChange}
                  required
                />
              </FormSection>

              {/* 메모 */}
              <FormSection>
                <FormLabel>예약 메모</FormLabel>

                <FormTextarea
                  name="memo"
                  placeholder="예약 관련 특이사항을 입력해 주세요."
                  value={reservationForm.memo}
                  onChange={handleReservationFormChange}
                />
              </FormSection>

              <ModalButtonGroup>
                <CancelButton
                  type="button"
                  onClick={handleCloseReservationModal}
                  disabled={isSaving}
                >
                  취소
                </CancelButton>

                <SubmitButton
                  type="submit"
                  disabled={!selectedPatient || isSaving}
                >
                  {isSaving ? "저장 중..." : "예약 등록"}
                </SubmitButton>
              </ModalButtonGroup>
            </form>
          </ReservationModal>
        </ModalOverlay>
      )}
    </Layout>
  );
}

// --------------------------------------
// 14. 레이아웃 및 모달 스타일
// --------------------------------------

const Layout = styled.div`
  background-color: #f8fafc;
  min-height: 100vh;
  padding: 40px 20px;
`;

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: rgba(15, 23, 42, 0.45);
  backdrop-filter: blur(4px);
`;

const ReservationModal = styled.div`
  width: 100%;
  max-width: 520px;
  max-height: 90vh;
  overflow-y: auto;
  padding: 28px;
  border-radius: 18px;
  background: #fff;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.18);
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 26px;

  h2 {
    margin: 0;
    color: #244f39;
    font-size: 21px;
    font-weight: 800;
  }

  p {
    margin: 7px 0 0;
    color: #829087;
    font-size: 13px;
  }
`;

const CloseButton = styled.button`
  border: 0;
  background: transparent;
  color: #829087;
  font-size: 18px;
  cursor: pointer;
`;

const FormSection = styled.div`
  position: relative;
  margin-bottom: 20px;
`;

const FormLabel = styled.label`
  display: block;
  margin-bottom: 9px;
  color: #244f39;
  font-size: 13px;
  font-weight: 700;
`;

const SearchBox = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 13px;
  height: 46px;
  border: 1px solid #d6e4d6;
  border-radius: 10px;
  color: #829087;

  input {
    flex: 1;
    min-width: 0;
    height: 100%;
    border: 0;
    outline: none;
    color: #244f39;
    font-size: 14px;
  }

  &:focus-within {
    border-color: #244f39;
  }
`;

const SearchResultList = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 10;
  max-height: 220px;
  overflow-y: auto;
  margin-top: 5px;
  padding: 6px;
  border: 1px solid #dce7dc;
  border-radius: 10px;
  background: white;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);

  > p {
    padding: 12px;
    color: #829087;
    font-size: 13px;
    text-align: center;
  }
`;

const SearchResultItem = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 12px;
  border: 0;
  border-radius: 7px;
  background: white;
  color: #244f39;
  text-align: left;
  cursor: pointer;

  &:hover {
    background: #f3f7f1;
  }

  div {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  strong {
    font-size: 14px;
  }

  span {
    color: #829087;
    font-size: 12px;
  }
`;

const SelectedPatient = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 13px;
  border: 1px solid #b9d4bf;
  border-radius: 10px;
  background: #f3f7f1;

  div {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  strong {
    color: #244f39;
    font-size: 14px;
  }

  span {
    color: #829087;
    font-size: 12px;
  }

  button {
    padding: 7px 11px;
    border: 1px solid #cbdacb;
    border-radius: 7px;
    background: white;
    color: #244f39;
    cursor: pointer;
  }
`;

const FormInput = styled.input`
  width: 100%;
  height: 46px;
  padding: 0 12px;
  border: 1px solid #d6e4d6;
  border-radius: 10px;
  outline: none;
  color: #244f39;

  &:focus {
    border-color: #244f39;
  }
`;

const FormTextarea = styled.textarea`
  width: 100%;
  min-height: 85px;
  resize: vertical;
  padding: 12px;
  border: 1px solid #d6e4d6;
  border-radius: 10px;
  outline: none;
  color: #244f39;
  font: inherit;

  &:focus {
    border-color: #244f39;
  }
`;

const ModalButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 28px;
`;

const CancelButton = styled.button`
  height: 44px;
  padding: 0 20px;
  border: 1px solid #d6e4d6;
  border-radius: 9px;
  background: white;
  color: #65756b;
  font-weight: 600;
  cursor: pointer;
`;

const SubmitButton = styled.button`
  height: 44px;
  padding: 0 22px;
  border: 0;
  border-radius: 9px;
  background: #244f39;
  color: white;
  font-weight: 700;
  cursor: pointer;

  &:disabled {
    background: #aab9ae;
    cursor: not-allowed;
  }
`;

const StatusSelect = styled.select<{ $status: PatientStatus }>`
  min-width: 105px;
  padding: 8px 28px 8px 11px;
  border: 1px solid #d6e4d6;
  border-radius: 8px;
  outline: none;
  background: #fff;
  color: #244f39;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;

  &:disabled {
    background: #f3f5f3;
    color: #829087;
    cursor: default;
  }
`;

const PatientMemo = styled.p`
  margin: 12px 0 0;
  padding: 10px 12px;
  border-radius: 8px;
  background: #f6f8f5;
  color: #829087;
  font-size: 12px;
`;
