"use client";
import Link from 'next/link';
import React, { useRef, useState } from 'react';
import styled from 'styled-components';

import * as S from '@/assets/css/Style.style';

export default function Footer() {
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 마우스가 들어올 때: 대기 중인 타이머를 취소하고 즉시 오픈
  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsOpen(true);
  };

  // 마우스가 나갈 때: 220ms(0.22초) 동안 기다렸다가 부드럽게 닫기
  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 220); // 딜레이 시간 조절 가능 (밀리초 단위)
  };

  return (
    <S.SiteFooterWrapper>
      <S.SiteFooterInner>
        {/* cs번호 진료시간 오시는길 */}
        <S.SiteFooterTop>
          <S.SiteFooterCs>
            <S.SiteFooterPhone>02. 932. 2222</S.SiteFooterPhone>
            <S.SiteFooterCsTitle>CS CENTER</S.SiteFooterCsTitle>
          </S.SiteFooterCs>

          <S.SiteFooterScheduleWrap>
            <S.SiteFooterScheduleBlock>
              <S.SiteFooterScheduleTitle>성형외과</S.SiteFooterScheduleTitle>
              <S.SiteFooterScheduleText>
                평일 : AM 09:00 - PM 06:00
              </S.SiteFooterScheduleText>
              <S.SiteFooterScheduleText>야간 : </S.SiteFooterScheduleText>
              <S.SiteFooterScheduleText>
                토요일 : PM 09:00 - PM 03:00
              </S.SiteFooterScheduleText>
            </S.SiteFooterScheduleBlock>

            <S.SiteFooterScheduleBlock>
              <S.SiteFooterScheduleTitle>스킨케어</S.SiteFooterScheduleTitle>
              <S.SiteFooterScheduleText>
                평일 : AM 09:00 - PM 06:00
              </S.SiteFooterScheduleText>
              <S.SiteFooterScheduleText>
                토요일 : PM 09:00 - PM 03:00
              </S.SiteFooterScheduleText>
            </S.SiteFooterScheduleBlock>
          </S.SiteFooterScheduleWrap>

          {/* 💡 호버 이벤트 핸들러 교체 */}
          <S.DropdownContainer
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <S.SiteFooterLocationBtn as="button" type="button">
              <span>오시는길 바로가기</span>
              <S.ArrowIcon $isOpen={isOpen}>▼</S.ArrowIcon>
            </S.SiteFooterLocationBtn>

            <S.DropdownMenu $isOpen={isOpen}>
              <S.DropdownItem
                href="https://naver.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                네이버 지도
              </S.DropdownItem>
              <S.DropdownItem
                href="https://kakao.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                카카오 지도
              </S.DropdownItem>
              <S.DropdownItem
                href="https://google.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                구글 맵 (Google Maps)
              </S.DropdownItem>
            </S.DropdownMenu>
          </S.DropdownContainer>
        </S.SiteFooterTop>

        <S.SiteFooterBottom>
          <S.SiteFooterCompany>
            <S.SiteFooterCompanyName>
              안호범 안스성형외과
            </S.SiteFooterCompanyName>
            <S.SiteFooterInfoText>
              서울 노원구 노해로 460 (상계동) 2층 201호
              <br />
              (안호범안스성형외과 건물 주차장 이용)
            </S.SiteFooterInfoText>

            <S.SiteFooterInfoText>
              의료기관 명칭 : 안호범안스성형외과
              <br />
              대표번호 02. 932. 2222
              <br />
              E-mail : test@test.com
              <br />
              &copy; {new Date().getFullYear()} YOUSHIN.
            </S.SiteFooterInfoText>
          </S.SiteFooterCompany>

          <S.SiteFooterBottomRight>
            <S.SiteFooterPolicyWrap>
              <S.SiteFooterPolicyBtn>실비보험 안내</S.SiteFooterPolicyBtn>
              <S.SiteFooterPolicyBtn>
                비급여 진료비용 안내
              </S.SiteFooterPolicyBtn>
            </S.SiteFooterPolicyWrap>

            <div>
              <S.SiteFooterFamilyTitle>Family</S.SiteFooterFamilyTitle>
              <S.SiteFooterFamilyLogos>
                <div className="logo-placeholder">Breast Surgery Center</div>
                <div className="logo-placeholder">Derm</div>
                <div className="logo-placeholder">Lifting Center</div>
              </S.SiteFooterFamilyLogos>
            </div>
          </S.SiteFooterBottomRight>
        </S.SiteFooterBottom>
      </S.SiteFooterInner>

      {/* 우측 하단 플로팅 퀵 메뉴 */}
      <S.FloatingMenuWrapper>
        <S.FloatingMenuItem>
          <S.FloatingMenuIcon $bgColor="#FEE500">TALK</S.FloatingMenuIcon>
          <S.FloatingMenuText>빠른 상담</S.FloatingMenuText>
        </S.FloatingMenuItem>

        <S.FloatingMenuItem>
          <S.FloatingMenuIcon $bgColor="#3b82f6">
            <svg
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-2.896-1.596-5.25-3.95-6.847-6.847l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
              ></path>
            </svg>
          </S.FloatingMenuIcon>
          <S.FloatingMenuText>전화상담</S.FloatingMenuText>
        </S.FloatingMenuItem>
      </S.FloatingMenuWrapper>
    </S.SiteFooterWrapper>
  );
}
