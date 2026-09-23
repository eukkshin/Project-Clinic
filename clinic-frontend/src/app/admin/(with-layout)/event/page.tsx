"use client";
import React, { useState } from "react";
import {
  FiArrowDown,
  FiArrowUp,
  FiImage,
  FiPlus,
  FiSave,
  FiTrash2,
} from "react-icons/fi";

import * as S from "@/assets/css/admin/Admin.style";
import { Popup } from "@/components/modal/Popup";

interface EventRankingData {
  id: number;
  title: string;
  price: string;
  imageUrl: string;
}

export default function EventPage() {
  const [events, setEvents] = useState<EventRankingData[]>([
    { id: 1, title: "다다고성형", price: "149만원", imageUrl: "" },
    { id: 2, title: "다다고성형", price: "149만원", imageUrl: "" },
    { id: 3, title: "다다고성형", price: "149만원", imageUrl: "" },
    { id: 4, title: "다다고성형", price: "149만원", imageUrl: "" },
  ]);

  const [newEvent, setNewEvent] = useState({
    title: "",
    price: "",
  });

  const [fileName, setFileName] = useState("");

  const [previewUrl, setPreviewUrl] = useState<string>("");

  const [isSavePopupOpen, setIsSavePopupOpen] = useState(false);
  const [isAlertPopupOpen, setIsAlertPopupOpen] = useState(false);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState<number | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleAddEvent = () => {
    if (!newEvent.title || !newEvent.price || !previewUrl) {
      setIsAlertPopupOpen(true);
      return;
    }

    setEvents([
      ...events,
      { id: Date.now(), ...newEvent, imageUrl: previewUrl } as EventRankingData,
    ]);

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setNewEvent({
      title: "",
      price: "",
    });
    setFileName("");
    setPreviewUrl("");
  };

  const handleDelete = (id: number) => {
    setSelectedDeleteId(id);
    setIsDeletePopupOpen(true);
  };

  const confirmDelete = () => {
    if (selectedDeleteId !== null) {
      setEvents(events.filter((e) => e.id !== selectedDeleteId));
      setIsDeletePopupOpen(false);
      setSelectedDeleteId(null);
    }
  };

  const moveEvent = (index: number, direction: "UP" | "DOWN") => {
    const newEvents = [...events];
    if (direction === "UP" && index > 0) {
      [newEvents[index - 1], newEvents[index]] = [
        newEvents[index],
        newEvents[index - 1],
      ];
    } else if (direction === "DOWN" && index < newEvents.length - 1) {
      [newEvents[index + 1], newEvents[index]] = [
        newEvents[index],
        newEvents[index + 1],
      ];
    }
    setEvents(newEvents);
  };

  const handleSave = () => {
    console.log("DB에 저장될 데이터:", events);
    setIsSavePopupOpen(true);
  };

  return (
    <>
      <S.EventAdminContainer>
        <S.EventPageHeader>
          <S.EventPageTitle>이벤트 랭킹 관리</S.EventPageTitle>
          <S.EventSaveButton onClick={handleSave}>
            <FiSave size={18} /> 설정 저장하기
          </S.EventSaveButton>
        </S.EventPageHeader>

        <S.EventGrid>
          {/* ⚙️ 1. 새 이벤트 랭킹 등록 폼 */}
          <S.EventLeftColumn>
            <S.RankEventCard>
              <S.EventCardHeader>
                <S.EventCardTitle>새 이벤트 등록</S.EventCardTitle>
              </S.EventCardHeader>
              <S.EventCardBody>
                <S.EventFormGroup>
                  <S.EventLabel>
                    대표 이미지 (정방형 또는 4:5 비율 권장)
                  </S.EventLabel>
                  <S.EventFileInputWrapper>
                    <S.EventFileInput
                      type="file"
                      id="event-img"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                    <S.EventFileLabel htmlFor="event-img">
                      <FiImage /> 이미지 선택
                    </S.EventFileLabel>
                    <span className="file-name">
                      {fileName || "선택된 파일 없음"}
                    </span>
                  </S.EventFileInputWrapper>

                  {previewUrl && (
                    <S.EventPreviewRect>
                      <img src={previewUrl} alt="미리보기" />
                    </S.EventPreviewRect>
                  )}
                </S.EventFormGroup>

                <div style={{ display: "flex", gap: "1rem" }}>
                  <S.EventFormGroup style={{ flex: 1 }}>
                    <S.EventLabel>타이틀</S.EventLabel>
                    <S.EventInput
                      type="text"
                      value={newEvent.title}
                      placeholder="예: 다다고성형"
                      onChange={(e) =>
                        setNewEvent({ ...newEvent, title: e.target.value })
                      }
                    />
                  </S.EventFormGroup>

                  <S.EventFormGroup style={{ flex: 1 }}>
                    <S.EventLabel>가격 텍스트</S.EventLabel>
                    <S.EventInput
                      type="text"
                      value={newEvent.price}
                      placeholder="예: 149만원"
                      onChange={(e) =>
                        setNewEvent({ ...newEvent, price: e.target.value })
                      }
                    />
                  </S.EventFormGroup>
                </div>

                <S.EventAddButton onClick={handleAddEvent}>
                  <FiPlus size={18} /> 랭킹 리스트에 추가
                </S.EventAddButton>
              </S.EventCardBody>
            </S.RankEventCard>
          </S.EventLeftColumn>

          {/* 📋 2. 등록된 이벤트 랭킹 리스트 */}
          <S.EventRightColumn>
            <S.RankEventCard style={{ height: "100%" }}>
              <S.EventCardHeader>
                <S.EventCardTitle>
                  현재 랭킹 순위 (총 {events.length}개)
                </S.EventCardTitle>
              </S.EventCardHeader>
              <S.EventTableWrapper>
                <S.EventTable>
                  <thead>
                    <tr>
                      <th>순위/이동</th>
                      <th>이미지</th>
                      <th>타이틀 / 가격</th>
                      <th>관리</th>
                    </tr>
                  </thead>
                  <tbody>
                    {events.map((evt, index) => (
                      <tr key={evt.id}>
                        <td>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: "0.8rem",
                            }}
                          >
                            <S.EventRankBadge>{index + 1}</S.EventRankBadge>
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "0.2rem",
                              }}
                            >
                              <S.EventActionBtn
                                onClick={() => moveEvent(index, "UP")}
                                disabled={index === 0}
                              >
                                <FiArrowUp size={14} />
                              </S.EventActionBtn>
                              <S.EventActionBtn
                                onClick={() => moveEvent(index, "DOWN")}
                                disabled={index === events.length - 1}
                              >
                                <FiArrowDown size={14} />
                              </S.EventActionBtn>
                            </div>
                          </div>
                        </td>
                        <td>
                          <S.EventThumbnail>
                            {evt.imageUrl ? (
                              <img src={evt.imageUrl} alt={evt.title} />
                            ) : (
                              <span>No Img</span>
                            )}
                          </S.EventThumbnail>
                        </td>
                        <td style={{ textAlign: "left" }}>
                          <strong>{evt.title}</strong>
                          <div
                            style={{
                              fontSize: "0.9rem",
                              color: "#e74a3b",
                              fontWeight: "bold",
                              marginTop: "0.2rem",
                            }}
                          >
                            {evt.price}
                          </div>
                        </td>
                        <td>
                          <S.EventDeleteBtn
                            onClick={() => handleDelete(evt.id)}
                          >
                            <FiTrash2 size={16} />
                          </S.EventDeleteBtn>
                        </td>
                      </tr>
                    ))}
                    {events.length === 0 && (
                      <tr>
                        <td colSpan={4} style={{ padding: "3rem 0" }}>
                          등록된 랭킹 이벤트가 없습니다.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </S.EventTable>
              </S.EventTableWrapper>
            </S.RankEventCard>
          </S.EventRightColumn>
        </S.EventGrid>
      </S.EventAdminContainer>
      <Popup
        isOpen={isAlertPopupOpen}
        title="입력오류"
        onClose={() => setIsAlertPopupOpen(false)}
        onConfirm={() => setIsAlertPopupOpen(false)}
      >
        이미지를 첨부하고 제목과 가격을 모두 입력해주세요.
      </Popup>
      <Popup
        isOpen={isSavePopupOpen}
        title="저장완료"
        onClose={() => setIsSavePopupOpen(false)}
        onConfirm={() => setIsSavePopupOpen(false)}
      >
        이벤트 랭킹 설정이 성공적으로 저장되었습니다.
      </Popup>
      <Popup
        isOpen={isDeletePopupOpen}
        title="알림"
        onClose={() => setIsDeletePopupOpen(false)}
        onConfirm={() => confirmDelete()}
      >
        정말 이 이벤트를 삭제하시겠습니까?
      </Popup>
    </>
  );
}
