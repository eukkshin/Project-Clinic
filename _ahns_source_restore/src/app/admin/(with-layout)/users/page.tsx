"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  FiCheck,
  FiChevronLeft,
  FiChevronRight,
  FiChevronsLeft,
  FiSearch,
  FiTrash2,
  FiUserX,
} from "react-icons/fi";

import * as S from "@/assets/css/admin/Admin.style";
import { Popup } from "@/components/modal/Popup";

// 임시 회원 데이터 인터페이스
interface UserData {
  idx: number;
  name: string;
  userId: string;
  phone: string;
  joinDate: string;
  status: "정상" | "정지";
}

interface RawUser {
  USER_IDX: number;
  USER_NAME: string;
  USER_ID: string;
  PHONE: string;
  REG_DATE: string;
  STATUS: string;
}

interface Pagination {
  totalCount: number;
  totalPages: number;
  currentPage: number;
  limit: number;
}

export default function Users() {
  // 🎯 상태 관리: 회원 목록
  const [userList, setUserList] = useState<UserData[]>([]);

  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");

  // 🎯 상태 관리: 삭제 팝업
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [selectedDeleteIdx, setSelectedDeleteIdx] = useState<number | null>(
    null,
  );

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get<{
          success: boolean;
          data: RawUser[];
          pagination: Pagination;
        }>("http://localhost:4000/api/admin/users", {
          params: { page: currentPage, limit: 10, search: searchKeyword },
        });
        if (response.data.success) {
          const formattedUsers = response.data.data.map((user) => ({
            idx: user.USER_IDX,
            name: user.USER_NAME,
            userId: user.USER_ID,
            phone: user.PHONE,
            status: user.STATUS as UserData["status"],
            joinDate: user.REG_DATE
              ? new Date(user.REG_DATE).toLocaleDateString("sv-SE")
              : "2026-09-01",
          }));
          setUserList(formattedUsers);
          setTotalCount(response.data.pagination.totalCount);
          setTotalPages(response.data.pagination.totalPages);
        } else {
        }
      } catch (error) {
        console.error("회원 목록 불러오기 실패: ", error);
      }
    };
    fetchUsers();
  }, [currentPage, searchKeyword]);

  //검색버튼클릭
  const handleSearch = () => {
    setSearchKeyword(searchInput);
    setCurrentPage(1); //검색시 무조건 1페이지로 이동
  };

  const [popupConfig, setPopupConfig] = useState({
    isOpen: false,
    title: "",
    message: "",
  });

  const openPopup = (title: string, message: string) => {
    setPopupConfig({
      isOpen: true,
      title,
      message,
    });
  };

  const closePopup = () => {
    setPopupConfig((prev) => ({
      ...prev,
      isOpen: false,
    }));
  };

  const toggleStatus = async (idx: number) => {
    try {
      const response = await axios.put(
        `http://localhost:4000/api/admin/users/${idx}/status`,
      );
      if (response.data.success) {
        setUserList(
          userList.map((item) =>
            item.idx === idx
              ? { ...item, status: item.status === "정상" ? "정지" : "정상" }
              : item,
          ),
        );
        openPopup("상태 변경 완료", "회원 상태가 정상적으로 변경되었습니다.");
      }
    } catch (error) {
      console.error("유저 상태 변경 실패: ", error);
      openPopup("상태 변경 실패", "회원 상태 변경 중 오류가 발생했습니다.");
    }
  };

  const handleDeleteClick = (idx: number) => {
    setSelectedDeleteIdx(idx);
    setIsDeletePopupOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedDeleteIdx !== null) {
      try {
        const response = await axios.delete(
          `http://localhost:4000/api/admin/users/${selectedDeleteIdx}`,
        );
        if (response.data.success) {
          setUserList(
            userList.filter((item) => item.idx !== selectedDeleteIdx),
          );
        }
      } catch (error) {
        console.error("회원 삭제 실패: ", error);
        alert("회원 삭제에 실패했습니다");
      }
    }
    setIsDeletePopupOpen(false);
    setSelectedDeleteIdx(null);
  };

  return (
    <>
      <S.UserContainer>
        <S.UserPageHeader className="admin-page-header">
          <div className="admin-page-title-block">
            <span className="admin-page-eyebrow">CUSTOMERS / MEMBERS</span>
            <S.UserPageTitle>회원 관리</S.UserPageTitle>
            <p className="admin-page-description">
              회원 검색, 계정 상태 변경 및 회원 정보를 관리합니다.
            </p>
          </div>
        </S.UserPageHeader>

        {/* 🎯 검색 및 필터 영역 */}
        <S.UserFilterCard className="admin-filter-panel">
          <S.UserInputGroup className="admin-search-row">
            <S.UserInput
              type="text"
              placeholder="이름, 아이디 또는 연락처 검색"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <S.UserSearchButton
              className="admin-primary-action"
              onClick={handleSearch}
            >
              <FiSearch size={16} /> 검색
            </S.UserSearchButton>
          </S.UserInputGroup>
        </S.UserFilterCard>

        {/* 🎯 회원 내역 데이터 테이블 */}
        <S.UserTableCard className="admin-panel">
          <S.UserCardHeader className="admin-panel-head">
            <S.UserCardTitle>
              가입 회원 목록 (총 {userList.length}명)
            </S.UserCardTitle>
          </S.UserCardHeader>

          <S.UserTableWrapper className="admin-table-scroll">
            <S.UserTable className="admin-data-table">
              <thead>
                <tr>
                  <th>No.</th>
                  <th>이름</th>
                  <th>아이디(이메일)</th>
                  <th>연락처</th>
                  <th>가입일자</th>
                  <th>상태</th>
                  <th>관리</th>
                </tr>
              </thead>
              <tbody>
                {userList.map((item, index) => (
                  <tr key={item.idx}>
                    <td>{totalCount - (currentPage - 1) * 10 - index}</td>
                    <td>
                      <strong>{item.name}</strong>
                    </td>
                    <td>{item.userId}</td>
                    <td>{item.phone}</td>
                    <td>{item.joinDate}</td>
                    <td>
                      <S.UserStatusBadge
                        $status={item.status}
                        onClick={() => toggleStatus(item.idx)}
                      >
                        {item.status === "정상" ? (
                          <FiCheck size={12} />
                        ) : (
                          <FiUserX size={12} />
                        )}
                        {item.status}
                      </S.UserStatusBadge>
                    </td>
                    <td>
                      <S.UserDeleteActionBtn
                        className="admin-delete-action"
                        onClick={() => handleDeleteClick(item.idx)}
                      >
                        <FiTrash2 size={16} />
                      </S.UserDeleteActionBtn>
                    </td>
                  </tr>
                ))}
                {userList.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      style={{ textAlign: "center", padding: "3rem" }}
                    >
                      가입된 회원 내역이 없습니다.
                    </td>
                  </tr>
                )}
              </tbody>
            </S.UserTable>
          </S.UserTableWrapper>
          {totalPages > 0 && (
            <S.Pagenation>
              <S.Prev
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage <= 1}
              >
                <FiChevronLeft size={16} />
              </S.Prev>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <S.PagenationBtn
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    $active={page === currentPage}
                  >
                    {page}
                  </S.PagenationBtn>
                ),
              )}

              <S.Next
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
                disabled={currentPage >= totalPages}
              >
                <FiChevronRight size={16} />
              </S.Next>
            </S.Pagenation>
          )}
        </S.UserTableCard>
      </S.UserContainer>
      <Popup
        isOpen={popupConfig.isOpen}
        title={popupConfig.title}
        onClose={closePopup}
        onConfirm={closePopup}
      >
        {popupConfig.message}
      </Popup>

      {/* ✅ 커스텀 삭제 팝업 */}
      <Popup
        isOpen={isDeletePopupOpen}
        title="회원 삭제 확인"
        onClose={() => {
          setIsDeletePopupOpen(false);
          setSelectedDeleteIdx(null);
        }}
        onConfirm={confirmDelete}
      >
        해당 회원 정보를 정말 삭제하시겠습니까? <br /> (이 작업은 되돌릴 수
        없습니다.)
      </Popup>
    </>
  );
}
