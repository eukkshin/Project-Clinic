"use client";
import React, { useState } from "react"; // ⭐ useState 추가

import * as S from "../assets/old/QuickConsultBar.styles";

export default function QuickConsultBar() {
  // 1. 각 입력창과 체크박스의 상태(State) 정의
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [category, setCategory] = useState("");
  const [isAgreed, setIsAgreed] = useState(false);

  // 2. 모든 조건이 충족되었는지 검사 (공백 제거 후 판단)
  const isFormValid =
    name.trim() !== "" && phone.trim() !== "" && category !== "" && isAgreed;

  return (
    <>
      <S.BarWrapper>
        <S.BarInner>
          <S.Title>빠른 상담신청</S.Title>

          {/* 이름 인풋 연결 */}
          <S.Input
            type="text"
            placeholder="이름을 작성해주세요"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          {/* 연락처 인풋 연결 */}
          <S.Input
            type="tel"
            placeholder="연락처를 작성해주세요"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          {/* 상담분야 셀렉트 연결 */}
          <S.Select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="" disabled hidden>
              상담분야를 선택해 주세요
            </option>
            <option value="eye">눈 성형</option>
            <option value="nose">코 성형</option>
            <option value="antiaging">동안 성형</option>
            <option value="petit">쁘띠 시술</option>
          </S.Select>

          <S.CheckboxGroup>
            <S.CheckboxLabel>
              {/* 체크박스 체크 상태 연결 */}
              <S.Checkbox
                type="checkbox"
                checked={isAgreed}
                onChange={(e) => setIsAgreed(e.target.checked)}
              />
              <S.AgreeText>개인정보처리방침 동의</S.AgreeText>
            </S.CheckboxLabel>
            <S.DetailLink>자세히</S.DetailLink>
          </S.CheckboxGroup>

          {/* 3. 버튼에 조건 전달 및 비활성화 기능 추가 */}
          <S.SubmitBtn $isActive={isFormValid} disabled={!isFormValid}>
            빠른 상담신청하기
          </S.SubmitBtn>
        </S.BarInner>
      </S.BarWrapper>
    </>
  );
}
