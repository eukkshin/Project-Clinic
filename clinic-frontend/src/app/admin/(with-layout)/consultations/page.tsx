"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { FiCheck, FiSearch, FiTrash2 } from "react-icons/fi";

import * as S from "@/assets/css/admin/Admin.style";
import { Popup } from "@/ui/modal/Popup";
import { Temporal } from "@js-temporal/polyfill";

//임시데이터 인터페이스
interface ConsultData {
  ID: number;
  NAME: string;
  PHONE: string;
  DEPARTMENT: string;
  CREATED_AT: string;
  STATUS: "대기중" | "상담완료";
}

export default function ConsultationsPage() {
  const [consultList, setConsultList] = useState<ConsultData[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(0);

  const fetchConsults = async () => {
    try {
      const response = await axios.get(
        "http://localhost:4000/api/admin/consult",
      );
      if (response.data.success) {
        setConsultList(response.data.data);
      }
    } catch (error) {
      console.error("상담 내역 불러오기 에러: ", error);
    }
  };

  useEffect(() => {
    fetchConsults();
  }, []);

  const filteredList = consultList.filter((item) => {
    if (!searchTerm) return true;
    return item.NAME.includes(searchTerm) || item.PHONE.includes(searchTerm);
  });

  const totalPage = Math.ceil(filteredList.length / ITEMS_PER_PAGE);
  const paginatedList = filteredList.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const toggleStatus = async (id: number) => {
    try {
      const response = await axios.put(
        `http://localhost:4000/api/admin/consult/${id}/status`,
      );
      fetchConsults();
    } catch (error) {
      console.error("상담 상태 변경 에러: ", error);
      alert("상담 상태 변경 중 에러가 발생했습니다.");
    }
  };

  const handleDeleteClick = (id: number) => {
    if (confirm("정말 삭제하시겠습니까?")) {
      setDeleteTargetId(id);
      setIsPopupOpen(true);
    }
  };

  //삭제 버튼
  const confirmDelete = async () => {
    if (!deleteTargetId) return;
    try {
      const response = await axios.delete(
        `http://localhost:4000/api/admin/consult/${deleteTargetId}`,
      );
      setIsPopupOpen(false);
      fetchConsults();
    } catch (error) {
      console.error("상담 내역 삭제 에러: ", error);
      alert("상담 내역 삭제 중 에러가 발생했습니다.");
    }
  };

  // 💡 최신 Temporal API를 활용한 날짜 포맷 함수
  const formatDate = (dateString: string) => {
    let dateTime;

    try {
      // 1. UTC 기준 ISO 문자열일 경우 (예: 2026-09-21T05:30:00Z) -> 한국 시간으로 변환
      //@ts-ignore
      dateTime =
        Temporal.Instant.from(dateString).toZonedDateTimeISO("Asia/Seoul");
    } catch (error) {
      // 2. 타임존 정보가 없는 일반 문자열일 경우 (예: 2026-09-21 14:30:00) 공백을 T로 치환 후 파싱
      const safeString = dateString.replace(" ", "T");
      //@ts-ignore
      dateTime = Temporal.PlainDateTime.from(safeString);
    }

    // Temporal 객체에서 직관적으로 년/월/일/시/분 추출 (달이 0부터 시작하지 않고 1부터 시작함!)
    const year = dateTime.year;
    const month = String(dateTime.month).padStart(2, "0");
    const day = String(dateTime.day).padStart(2, "0");
    const hour = String(dateTime.hour).padStart(2, "0");
    const minute = String(dateTime.minute).padStart(2, "0");

    return `${year}-${month}-${day} ${hour}:${minute}`;
  };

  return (
    <>
      <S.ConsultContainer>
        <S.ConsultPageHeader className="admin-page-header">
          <div className="admin-page-title-block">
            <span className="admin-page-eyebrow">
              CUSTOMERS / CONSULTATIONS
            </span>
            <S.ConsultPageTitle>상담신청 관리</S.ConsultPageTitle>
            <p className="admin-page-description">
              접수 내역을 검색하고 상담 진행 상태를 확인합니다.
            </p>
          </div>
        </S.ConsultPageHeader>

        <S.ConsultFilterCard className="admin-filter-panel">
          <S.ConsultInputGroup className="admin-search-row">
            <S.ConsultInput
              type="text"
              placeholder="이름 또는 연락처 검색"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <S.ConsultSearchButton className="admin-primary-action">
              <FiSearch size={16} /> 검색
            </S.ConsultSearchButton>
          </S.ConsultInputGroup>
        </S.ConsultFilterCard>

        <S.ConsultTableCard className="admin-panel">
          <S.ConsultCardHeader className="admin-panel-head">
            <S.ConsultCardTitle>빠른 상담신청 접수 내역</S.ConsultCardTitle>
          </S.ConsultCardHeader>

          <S.ConsultTableWrapper className="admin-table-scroll">
            <S.ConsultTable className="admin-data-table">
              <thead>
                <tr>
                  <th>No.</th>
                  <th>이름</th>
                  <th>연락처</th>
                  <th>상담분야</th>
                  <th>신청일시</th>
                  <th>상태</th>
                  <th>관리</th>
                </tr>
              </thead>
              <tbody>
                {paginatedList.map((item, index) => {
                  const displayIndex =
                    filteredList.length -
                    ((currentPage - 1) * ITEMS_PER_PAGE + index);
                  return (
                    <tr key={item.ID}>
                      <td>{displayIndex}</td>
                      <td>
                        <strong>{item.NAME}</strong>
                      </td>
                      <td>{item.PHONE}</td>
                      <td>{item.DEPARTMENT}</td>
                      {/* 💡 Temporal이 적용된 포맷 함수로 렌더링 */}
                      <td>{formatDate(item.CREATED_AT)}</td>
                      <td>
                        <S.ConsultStatusBadge
                          $status={item.STATUS}
                          onClick={() => toggleStatus(item.ID)}
                          style={{ cursor: "pointer" }}
                        >
                          {item.STATUS === "상담완료" && <FiCheck size={12} />}
                          {item.STATUS}
                        </S.ConsultStatusBadge>
                      </td>
                      <td>
                        <S.ConsultDeleteActionBtn
                          className="admin-delete-action"
                          onClick={() => handleDeleteClick(item.ID)}
                        >
                          <FiTrash2 size={16} />
                        </S.ConsultDeleteActionBtn>
                      </td>
                    </tr>
                  );
                })}
                {paginatedList.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      style={{ textAlign: "center", padding: "3rem" }}
                    >
                      {searchTerm
                        ? "검색 결과가 없습니다 "
                        : "접수된 상담 내역이 없습니다"}
                    </td>
                  </tr>
                )}
              </tbody>
            </S.ConsultTable>
          </S.ConsultTableWrapper>
          {totalPage >= 1 && (
            <S.Pagenation>
              {Array.from({ length: totalPage }, (_, i) => i + 1).map(
                (page) => (
                  <S.PagenationBtn
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    $active={currentPage === page}
                  >
                    {page}
                  </S.PagenationBtn>
                ),
              )}
            </S.Pagenation>
          )}
        </S.ConsultTableCard>
      </S.ConsultContainer>
      <Popup
        isOpen={isPopupOpen}
        title="상담 내역 삭제"
        onClose={() => setIsPopupOpen(false)}
        onConfirm={confirmDelete}
      >
        정말 이 상담 내역을 삭제하시겠습니까?
        <br />
        삭제된 데이터는 복구할 수 없습니다.
      </Popup>
    </>
  );
}
