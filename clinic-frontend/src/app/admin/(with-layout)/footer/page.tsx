"use client";
import React, { useState } from "react";
import { FiPlus, FiSave, FiTrash2 } from "react-icons/fi";

import * as S from "@/assets/css/admin/Admin.style";
import { Popup } from "@/components/modal/Popup";

interface ScheduleData {
  id: number;
  department: string;
  weekday: string;
  night: string;
  weekend: string;
}

interface FamilySiteData {
  id: number;
  name: string;
  url: string;
}

export default function FooterPage() {
  const [companyInfo, setCompanyInfo] = useState({
    name: "",
    address: "",
    clinicName: "",
    phone: "",
    email: "",
    locationUrl: "",
  });

  const [schedules, setSchedules] = useState<ScheduleData[]>([
    {
      id: 1,
      department: "성형외과",
      weekday: "AM 09:00 - PM 06:00",
      night: "",
      weekend: "PM 09:00 - PM 03:00",
    },
    {
      id: 2,
      department: "스킨케어",
      weekday: "AM 09:00 - PM 06:00",
      night: "",
      weekend: "PM 09:00 - PM 03:00",
    },
  ]);

  const [familySites, setFamilySites] = useState<FamilySiteData[]>([
    { id: 1, name: "Breast Surgery Center", url: "#" },
    { id: 2, name: "Derm", url: "#" },
    { id: 3, name: "Lifting Center", url: "#" },
  ]);

  const [isSavePopupOpen, setIsSavePopupOpen] = useState(false);
  const [isChangePopupOpen, setIsChangePopupOpen] = useState(false);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);

  const [selectedDeleteId, setSelectedDeleteId] = useState<number | null>(null);

  const handleAddFamilySite = () => {
    setFamilySites([...familySites, { id: Date.now(), name: "", url: "" }]);
  };

  const handleScheduleChange = (
    id: number,
    field: keyof ScheduleData,
    value: string,
  ) => {
    setSchedules(
      schedules.map((s) => (s.id === id ? { ...s, [field]: value } : s)),
    );
    setIsChangePopupOpen(true);
  };

  const handleRemoveFamilySite = (id: number) => {
    setFamilySites(familySites.filter((s) => s.id !== id));
    setSelectedDeleteId(id);
    setIsDeletePopupOpen(true);
  };

  const handleFamilySiteChange = (
    id: number,
    field: keyof FamilySiteData,
    value: string,
  ) => {
    setFamilySites(
      familySites.map((f) => (f.id === id ? { ...f, [field]: value } : f)),
    );
    setIsChangePopupOpen(true);
  };

  const handleSave = () => {
    const payload = {
      companyInfo,
      schedules,
      familySites,
    };
    console.log("DB에 저장될 Footer 데이터: ", payload);
    setIsSavePopupOpen(true);
  };

  const handleAddSchedule = () => {};

  return (
    <>
      <S.FooterAdminContainer>
        <S.FooterPageHeader>
          <S.FooterPageTitle>푸터(하단 영역) 관리</S.FooterPageTitle>
          <S.FooterSaveButton onClick={handleSave}>
            <FiSave size={18} /> 설정 저장하기
          </S.FooterSaveButton>
        </S.FooterPageHeader>

        <S.FooterGrid>
          {/* 🏢 1. 병원 기본 정보 카드 */}
          <S.FooterCard>
            <S.FooterCardHeader>
              <S.FooterCardTitle>병원 기본 정보</S.FooterCardTitle>
            </S.FooterCardHeader>
            <S.FooterCardBody>
              <S.FooterFormGroup>
                <S.FooterLabel>병원명 (타이틀)</S.FooterLabel>
                <S.FooterInput
                  type="text"
                  value={companyInfo.name}
                  onChange={(e) =>
                    setCompanyInfo({ ...companyInfo, name: e.target.value })
                  }
                />
              </S.FooterFormGroup>
              <S.FooterFormGroup>
                <S.FooterLabel>상세 주소</S.FooterLabel>
                <S.FooterInput
                  type="text"
                  value={companyInfo.address}
                  onChange={(e) =>
                    setCompanyInfo({ ...companyInfo, address: e.target.value })
                  }
                />
              </S.FooterFormGroup>
              <S.FooterFlexRow>
                <S.FooterFormGroup>
                  <S.FooterLabel>의료기관 명칭</S.FooterLabel>
                  <S.FooterInput
                    type="text"
                    value={companyInfo.clinicName}
                    onChange={(e) =>
                      setCompanyInfo({
                        ...companyInfo,
                        clinicName: e.target.value,
                      })
                    }
                  />
                </S.FooterFormGroup>
                <S.FooterFormGroup>
                  <S.FooterLabel>대표번호</S.FooterLabel>
                  <S.FooterInput
                    type="text"
                    value={companyInfo.phone}
                    onChange={(e) =>
                      setCompanyInfo({ ...companyInfo, phone: e.target.value })
                    }
                  />
                </S.FooterFormGroup>
                <S.FooterFormGroup>
                  <S.FooterLabel>이메일</S.FooterLabel>
                  <S.FooterInput
                    type="text"
                    value={companyInfo.email}
                    onChange={(e) =>
                      setCompanyInfo({ ...companyInfo, email: e.target.value })
                    }
                  />
                </S.FooterFormGroup>
              </S.FooterFlexRow>
              <S.FooterFormGroup style={{ marginBottom: 0 }}>
                <S.FooterLabel>'오시는길 바로가기' 버튼 링크 URL</S.FooterLabel>
                <S.FooterInput
                  type="text"
                  value={companyInfo.locationUrl}
                  onChange={(e) =>
                    setCompanyInfo({
                      ...companyInfo,
                      locationUrl: e.target.value,
                    })
                  }
                />
              </S.FooterFormGroup>
            </S.FooterCardBody>
          </S.FooterCard>

          <div
            style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
          >
            {/* ⏰ 2. 진료 시간 안내 카드 */}
            <S.FooterCard>
              <S.FooterCardHeader>
                <S.FooterCardTitle>
                  진료 시간 안내 (CS CENTER)
                </S.FooterCardTitle>
              </S.FooterCardHeader>
              <S.FooterCardBody>
                {schedules.map((sch, index) => (
                  <div
                    key={sch.id}
                    style={{
                      marginBottom:
                        index === schedules.length - 1 ? 0 : "1.5rem",
                      paddingBottom:
                        index === schedules.length - 1 ? 0 : "1.5rem",
                      borderBottom:
                        index === schedules.length - 1
                          ? "none"
                          : "1px dashed #e3e6f0",
                    }}
                  >
                    <S.FooterFormGroup>
                      <S.FooterLabel>
                        구분명 (예: 성형외과, 스킨케어)
                      </S.FooterLabel>
                      <S.FooterInput
                        type="text"
                        value={sch.department}
                        onChange={(e) =>
                          handleScheduleChange(
                            sch.id,
                            "department",
                            e.target.value,
                          )
                        }
                      />
                    </S.FooterFormGroup>
                    <S.FooterFlexRow>
                      <S.FooterFormGroup>
                        <S.FooterLabel>평일 시간</S.FooterLabel>
                        <S.FooterInput
                          type="text"
                          value={sch.weekday}
                          onChange={(e) =>
                            handleScheduleChange(
                              sch.id,
                              "weekday",
                              e.target.value,
                            )
                          }
                        />
                      </S.FooterFormGroup>
                      <S.FooterFormGroup>
                        <S.FooterLabel>
                          야간 진료 (없으면 비워두기)
                        </S.FooterLabel>
                        <S.FooterInput
                          type="text"
                          value={sch.night}
                          onChange={(e) =>
                            handleScheduleChange(
                              sch.id,
                              "night",
                              e.target.value,
                            )
                          }
                        />
                      </S.FooterFormGroup>
                      <S.FooterFormGroup>
                        <S.FooterLabel>토요일 시간</S.FooterLabel>
                        <S.FooterInput
                          type="text"
                          value={sch.weekend}
                          onChange={(e) =>
                            handleScheduleChange(
                              sch.id,
                              "weekend",
                              e.target.value,
                            )
                          }
                        />
                      </S.FooterFormGroup>
                    </S.FooterFlexRow>
                  </div>
                ))}
              </S.FooterCardBody>
            </S.FooterCard>

            {/* 🔗 3. 패밀리 사이트 카드 */}
            <S.FooterCard>
              <S.FooterCardHeader>
                <S.FooterCardTitle>패밀리 사이트 설정</S.FooterCardTitle>
              </S.FooterCardHeader>
              <S.FooterCardBody>
                {familySites.map((site) => (
                  <S.FooterFamilyRow key={site.id}>
                    <S.FooterInput
                      type="text"
                      placeholder="사이트명 (예: Derm)"
                      value={site.name}
                      onChange={(e) =>
                        handleFamilySiteChange(site.id, "name", e.target.value)
                      }
                    />
                    <S.FooterInput
                      type="text"
                      placeholder="연결 URL (예: https://...)"
                      value={site.url}
                      onChange={(e) =>
                        handleFamilySiteChange(site.id, "url", e.target.value)
                      }
                    />
                    <S.FooterDeleteBtn
                      onClick={() => handleRemoveFamilySite(site.id)}
                    >
                      <FiTrash2 size={18} />
                    </S.FooterDeleteBtn>
                  </S.FooterFamilyRow>
                ))}
                <S.FooterAddButton onClick={handleAddFamilySite}>
                  <FiPlus size={18} /> 패밀리 사이트 추가
                </S.FooterAddButton>
              </S.FooterCardBody>
            </S.FooterCard>
          </div>
        </S.FooterGrid>
      </S.FooterAdminContainer>
    </>
  );
}
