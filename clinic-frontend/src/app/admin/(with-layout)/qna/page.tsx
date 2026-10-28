"use client";

import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import {
  FiArrowDown,
  FiArrowUp,
  FiEdit2,
  FiPlus,
  FiSave,
  FiTrash2,
  FiX,
} from "react-icons/fi";

import * as S from "@/assets/css/admin/Admin.style";
import { Popup } from "@/ui/modal/Popup";

interface QnAData {
  id: number;
  category: string;
  categoryName: string;
  question: string;
  answer: string;
}

interface QnAApiRow {
  QNA_IDX: number;
  CATEGORY: string;
  CATEGORY_NAME: string;
  QUESTION: string;
  ANSWER: string;
}

type QnAForm = Omit<QnAData, "id">;

interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
}

const INITIAL_STATE: QnAForm = {
  category: "",
  categoryName: "",
  question: "",
  answer: "",
};

const API_URL = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/api/admin/qnas`;

export default function AdminQnA() {
  const [qnaList, setQnaList] = useState<QnAData[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [newQnA, setNewQnA] = useState<QnAForm>({ ...INITIAL_STATE });
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  // VLOG 관리자와 동일한 Popup 패턴
  const [isSavePopupOpen, setIsSavePopupOpen] = useState(false);
  const [savePopupMessage, setSavePopupMessage] = useState("");
  const [isAlertPopupOpen, setIsAlertPopupOpen] = useState(false);
  const [alertPopupMessage, setAlertPopupMessage] = useState("");
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState<number | null>(null);

  const showAlert = (message: string) => {
    setAlertPopupMessage(message);
    setIsAlertPopupOpen(true);
  };

  const showSuccess = (message: string) => {
    setSavePopupMessage(message);
    setIsSavePopupOpen(true);
  };

  const fetchQnAs = useCallback(async () => {
    try {
      const response = await axios.get<ApiResponse<QnAApiRow[]>>(API_URL);
      if (!response.data.success || !Array.isArray(response.data.data)) {
        throw new Error("올바르지 않은 Q&A 응답");
      }

      const formatted: QnAData[] = response.data.data.map((item) => ({
        id: item.QNA_IDX,
        category: item.CATEGORY,
        categoryName: item.CATEGORY_NAME,
        question: item.QUESTION,
        answer: item.ANSWER,
      }));
      setQnaList(formatted);
    } catch (error) {
      console.error("Q&A 목록 로드 실패:", error);
      setAlertPopupMessage("Q&A 목록을 불러오는 중 문제가 발생했습니다.");
      setIsAlertPopupOpen(true);
    }
  }, []);

  useEffect(() => {
    void fetchQnAs();
  }, [fetchQnAs]);

  const categories = Array.from(
    new Map(
      qnaList.map(
        (item) =>
          [
            item.category,
            { key: item.category, name: item.categoryName },
          ] as const,
      ),
    ).values(),
  );

  const filteredList =
    selectedCategory === "all"
      ? qnaList
      : qnaList.filter((item) => item.category === selectedCategory);

  const handleCategoryChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const value = event.target.value;
    if (value === "ADD_NEW") {
      setIsCustomCategory(true);
      setNewQnA((prev) => ({ ...prev, category: "", categoryName: "" }));
      return;
    }

    setIsCustomCategory(false);
    const selected = categories.find((item) => item.key === value);
    setNewQnA((prev) => ({
      ...prev,
      category: selected?.key ?? "",
      categoryName: selected?.name ?? "",
    }));
  };

  const resetEditor = () => {
    setEditingId(null);
    setIsCustomCategory(false);
    setNewQnA({ ...INITIAL_STATE });
  };

  const handleSaveQnA = async () => {
    const payload: QnAForm = {
      category: newQnA.category.trim(),
      categoryName: newQnA.categoryName.trim(),
      question: newQnA.question.trim(),
      answer: newQnA.answer.trim(),
    };

    if (
      !payload.category ||
      !payload.categoryName ||
      !payload.question ||
      !payload.answer
    ) {
      showAlert("카테고리, 질문, 답변 내용을 모두 입력해주세요.");
      return;
    }

    try {
      const isEditing = editingId !== null;
      const response = isEditing
        ? await axios.put<ApiResponse>(`${API_URL}/${editingId}`, payload)
        : await axios.post<ApiResponse>(API_URL, payload);

      if (!response.data.success) throw new Error("Q&A 저장 응답 실패");

      resetEditor();
      await fetchQnAs();
      showSuccess(
        isEditing ? "Q&A가 수정되었습니다." : "새 Q&A가 등록되었습니다.",
      );
    } catch (error) {
      console.error("Q&A 저장 실패:", error);
      showAlert("Q&A 저장 중 문제가 발생했습니다.");
    }
  };

  const handleEditClick = (item: QnAData) => {
    setEditingId(item.id);
    setNewQnA({
      category: item.category,
      categoryName: item.categoryName,
      question: item.question,
      answer: item.answer,
    });
    setIsCustomCategory(false);
  };

  const handleDeleteClick = (id: number) => {
    setSelectedDeleteId(id);
    setIsDeletePopupOpen(true);
  };

  const closeDeletePopup = () => {
    setIsDeletePopupOpen(false);
    setSelectedDeleteId(null);
  };

  const confirmDelete = async () => {
    if (selectedDeleteId === null) return;

    const id = selectedDeleteId;
    closeDeletePopup();

    try {
      const response = await axios.delete<ApiResponse>(`${API_URL}/${id}`);
      if (!response.data.success) throw new Error("Q&A 삭제 응답 실패");

      if (editingId === id) resetEditor();
      await fetchQnAs();
      showSuccess("Q&A가 삭제되었습니다.");
    } catch (error) {
      console.error("Q&A 삭제 실패:", error);
      showAlert("Q&A 삭제 중 문제가 발생했습니다.");
    }
  };

  // 전체 목록 / 카테고리 필터 상태 모두에서 기존 Q&A 노출 순서 변경 유지
  const moveQnA = (index: number, direction: "UP" | "DOWN") => {
    const nextIndex = direction === "UP" ? index - 1 : index + 1;
    if (nextIndex < 0 || nextIndex >= filteredList.length) return;

    setQnaList((prev) => {
      if (selectedCategory === "all") {
        const updated = [...prev];
        [updated[index], updated[nextIndex]] = [
          updated[nextIndex],
          updated[index],
        ];
        return updated;
      }

      const inCategory = prev.filter(
        (item) => item.category === selectedCategory,
      );
      [inCategory[index], inCategory[nextIndex]] = [
        inCategory[nextIndex],
        inCategory[index],
      ];
      let cursor = 0;
      return prev.map((item) =>
        item.category === selectedCategory ? inCategory[cursor++] : item,
      );
    });
  };

  const handleSave = async () => {
    const orderedIds = qnaList.map((item) => item.id);
    try {
      const response = await axios.put<ApiResponse>(`${API_URL}/order`, {
        orderedIds,
      });
      if (!response.data.success) throw new Error("Q&A 순서 저장 응답 실패");
      showSuccess("Q&A 노출 순서가 저장되었습니다.");
    } catch (error) {
      console.error("Q&A 순서 저장 실패:", error);
      showAlert("순서 저장 중 문제가 발생했습니다.");
    }
  };

  return (
    <>
      <S.AdminQnAContainer>
        <S.AdminQnAPageHeader className="admin-page-header">
          <div className="admin-page-title-block">
            <span className="admin-page-eyebrow">CONTENT / Q&A</span>
            <S.AdminQnAPageTitle>Q&A 관리</S.AdminQnAPageTitle>
            <p className="admin-page-description">
              카테고리별 질문과 답변, 노출 순서를 관리합니다.
            </p>
          </div>
          <S.AdminQnASaveButton
            className="admin-primary-action"
            type="button"
            onClick={handleSave}
          >
            <FiSave size={18} /> 설정 저장하기
          </S.AdminQnASaveButton>
        </S.AdminQnAPageHeader>

        <S.AdminQnAGrid className="admin-page-grid">
          {/* 1. Q&A 등록 / 수정 (좌측): VLOG 에디터 구조 */}
          <S.AdminQnALeftColumn className="admin-editor-column">
            <S.AdminQnACard className="admin-panel">
              <S.AdminQnACardHeader className="admin-panel-head">
                <S.AdminQnACardTitle>
                  {editingId !== null ? "Q&A 수정" : "새 Q&A 등록"}
                </S.AdminQnACardTitle>
                <S.AdminQnACategoryAddButton
                  type="button"
                  onClick={() => {
                    setIsCustomCategory(true);
                    setNewQnA((prev) => ({
                      ...prev,
                      category: "",
                      categoryName: "",
                    }));
                  }}
                >
                  <FiPlus size={14} /> 새 카테고리 추가
                </S.AdminQnACategoryAddButton>
              </S.AdminQnACardHeader>

              <S.AdminQnACardBody className="admin-panel-body">
                <S.AdminQnAFormGroup className="admin-form-field">
                  <S.AdminQnALabel htmlFor="qna-category">
                    카테고리 선택 / 추가
                  </S.AdminQnALabel>
                  {isCustomCategory ? (
                    <S.AdminQnACustomCategoryWrapper>
                      <S.AdminQnAInput
                        id="qna-category"
                        type="text"
                        placeholder="키워드 (예: pricing)"
                        value={newQnA.category}
                        onChange={(event) =>
                          setNewQnA((prev) => ({
                            ...prev,
                            category: event.target.value,
                          }))
                        }
                      />
                      <S.AdminQnAInput
                        type="text"
                        aria-label="새 카테고리 이름"
                        placeholder="이름 (예: 비용/가격)"
                        value={newQnA.categoryName}
                        onChange={(event) =>
                          setNewQnA((prev) => ({
                            ...prev,
                            categoryName: event.target.value,
                          }))
                        }
                      />
                      <S.AdminQnACancelButton
                        type="button"
                        onClick={() => {
                          setIsCustomCategory(false);
                          setNewQnA((prev) => ({
                            ...prev,
                            category: "",
                            categoryName: "",
                          }));
                        }}
                      >
                        <FiX size={14} /> 취소
                      </S.AdminQnACancelButton>
                    </S.AdminQnACustomCategoryWrapper>
                  ) : (
                    <S.AdminQnASelect
                      id="qna-category"
                      value={newQnA.category}
                      onChange={handleCategoryChange}
                    >
                      <option value="" disabled>
                        카테고리를 선택하세요
                      </option>
                      {categories.map((category) => (
                        <option key={category.key} value={category.key}>
                          {category.name} ({category.key})
                        </option>
                      ))}
                      <option value="ADD_NEW">+ 새 카테고리 추가하기</option>
                    </S.AdminQnASelect>
                  )}
                </S.AdminQnAFormGroup>

                <S.AdminQnAFormGroup className="admin-form-field">
                  <S.AdminQnALabel htmlFor="qna-question">
                    질문 (Question)
                  </S.AdminQnALabel>
                  <S.AdminQnAInput
                    id="qna-question"
                    type="text"
                    placeholder="예: 비용은 어떻게 되나요?"
                    value={newQnA.question}
                    onChange={(event) =>
                      setNewQnA((prev) => ({
                        ...prev,
                        question: event.target.value,
                      }))
                    }
                  />
                </S.AdminQnAFormGroup>

                <S.AdminQnAFormGroup className="admin-form-field">
                  <S.AdminQnALabel htmlFor="qna-answer">
                    답변 (Answer)
                  </S.AdminQnALabel>
                  <S.AdminQnATextarea
                    id="qna-answer"
                    placeholder="답변 내용을 입력하세요. (줄바꿈 가능)"
                    value={newQnA.answer}
                    onChange={(event) =>
                      setNewQnA((prev) => ({
                        ...prev,
                        answer: event.target.value,
                      }))
                    }
                  />
                </S.AdminQnAFormGroup>

                <S.AdminQnAButtonWrapper>
                  <S.AdminQnAAddButton
                    className="admin-outline-action"
                    type="button"
                    onClick={handleSaveQnA}
                  >
                    {editingId !== null ? (
                      <FiSave size={18} />
                    ) : (
                      <FiPlus size={18} />
                    )}
                    {editingId !== null ? "Q&A 수정 완료" : "리스트에 추가"}
                  </S.AdminQnAAddButton>
                  {editingId !== null && (
                    <S.AdminQnACancelButton type="button" onClick={resetEditor}>
                      <FiX size={16} /> 수정 취소
                    </S.AdminQnACancelButton>
                  )}
                </S.AdminQnAButtonWrapper>
              </S.AdminQnACardBody>
            </S.AdminQnACard>
          </S.AdminQnALeftColumn>

          {/* 2. 등록된 Q&A 목록 (우측): VLOG 테이블 구조 */}
          <S.AdminQnARightColumn className="admin-record-column">
            <S.AdminQnACard className="admin-panel">
              <S.AdminQnACardHeader className="admin-panel-head">
                <S.AdminQnACardTitle>
                  현재 노출 순서 (총 {filteredList.length}개)
                </S.AdminQnACardTitle>
                <S.AdminQnATableHeaderSelect
                  value={selectedCategory}
                  onChange={(event) => setSelectedCategory(event.target.value)}
                  aria-label="카테고리별 Q&A 필터"
                >
                  <option value="all">전체보기</option>
                  {categories.map((category) => (
                    <option key={category.key} value={category.key}>
                      {category.name}
                    </option>
                  ))}
                </S.AdminQnATableHeaderSelect>
              </S.AdminQnACardHeader>

              <S.AdminQnATableWrapper className="admin-table-scroll">
                <S.AdminQnATable className="admin-data-table">
                  <thead>
                    <tr>
                      <th style={{ width: "16%" }}>순위/이동</th>
                      <th style={{ width: "19%" }}>카테고리</th>
                      <th style={{ width: "48%" }}>질문 / 답변 요약</th>
                      <th style={{ width: "17%" }}>관리</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredList.map((item, index) => (
                      <tr key={item.id}>
                        <td>
                          <S.AdminQnARankRow>
                            <S.AdminQnARankBadge>
                              {index + 1}
                            </S.AdminQnARankBadge>
                            <S.AdminQnARankControls>
                              <S.AdminQnAActionBtn
                                className="admin-icon-action"
                                type="button"
                                aria-label={`${item.question} 위로 이동`}
                                title="위로 이동"
                                onClick={() => moveQnA(index, "UP")}
                                disabled={index === 0}
                              >
                                <FiArrowUp size={14} />
                              </S.AdminQnAActionBtn>
                              <S.AdminQnAActionBtn
                                className="admin-icon-action"
                                type="button"
                                aria-label={`${item.question} 아래로 이동`}
                                title="아래로 이동"
                                onClick={() => moveQnA(index, "DOWN")}
                                disabled={index === filteredList.length - 1}
                              >
                                <FiArrowDown size={14} />
                              </S.AdminQnAActionBtn>
                            </S.AdminQnARankControls>
                          </S.AdminQnARankRow>
                        </td>
                        <td>
                          <S.AdminQnACategoryBadge>
                            {item.categoryName}
                          </S.AdminQnACategoryBadge>
                        </td>
                        <td style={{ textAlign: "left" }}>
                          <S.AdminQnACellQuestion>
                            {item.question}
                          </S.AdminQnACellQuestion>
                          <S.AdminQnACellSummary>
                            {item.answer}
                          </S.AdminQnACellSummary>
                        </td>
                        <td>
                          <S.AdminQnAActionGroup>
                            <S.AdminQnAEditBtn
                              className="admin-icon-action"
                              type="button"
                              aria-label={`${item.question} 수정`}
                              title="수정"
                              onClick={() => handleEditClick(item)}
                            >
                              <FiEdit2 size={16} />
                            </S.AdminQnAEditBtn>
                            <S.AdminQnADeleteBtn
                              className="admin-delete-action"
                              type="button"
                              aria-label={`${item.question} 삭제`}
                              title="삭제"
                              onClick={() => handleDeleteClick(item.id)}
                            >
                              <FiTrash2 size={16} />
                            </S.AdminQnADeleteBtn>
                          </S.AdminQnAActionGroup>
                        </td>
                      </tr>
                    ))}
                    {filteredList.length === 0 && (
                      <tr>
                        <td
                          colSpan={4}
                          style={{ padding: "3rem 0", textAlign: "center" }}
                        >
                          등록된 Q&A가 없습니다.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </S.AdminQnATable>
              </S.AdminQnATableWrapper>
            </S.AdminQnACard>
          </S.AdminQnARightColumn>
        </S.AdminQnAGrid>
      </S.AdminQnAContainer>

      <Popup
        isOpen={isSavePopupOpen}
        title="처리 완료"
        onClose={() => setIsSavePopupOpen(false)}
        onConfirm={() => setIsSavePopupOpen(false)}
      >
        {savePopupMessage}
      </Popup>
      <Popup
        isOpen={isAlertPopupOpen}
        title="안내"
        onClose={() => setIsAlertPopupOpen(false)}
        onConfirm={() => setIsAlertPopupOpen(false)}
      >
        {alertPopupMessage}
      </Popup>
      <Popup
        isOpen={isDeletePopupOpen}
        title="삭제 확인"
        onClose={closeDeletePopup}
        onConfirm={() => void confirmDelete()}
      >
        해당 Q&A 항목을 삭제하시겠습니까?
      </Popup>
    </>
  );
}
