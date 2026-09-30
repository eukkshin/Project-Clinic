"use client";
import React from 'react';
import {
    FiAlertOctagon, FiImage, FiLayers, FiLayout, FiMessageSquare, FiPhoneCall, FiPieChart, FiSearch,
    FiSettings, FiShield, FiTrendingUp, FiUserPlus, FiVideo
} from 'react-icons/fi';

import * as S from '@/assets/css/admin/Admin.style';

export default function Root() {
  const monthlyData = [
    { month: "1월", value: 40 },
    { month: "2월", value: 65 },
    { month: "3월", value: 45 },
    { month: "4월", value: 80 },
    { month: "5월", value: 55 },
    { month: "6월", value: 90 },
    { month: "7월", value: 75 },
  ];
  return (
    <>
      <S.DashboardContainer>
        <S.DashboardPageTitle>대시보드 종합통계</S.DashboardPageTitle>
        <S.DashboardCardGrid>
          <S.DashboardSummaryCard $borderColor="#4e73df">
            <S.DashboardCardInfo>
              <S.DashboardCardLabel $textColor="#4e73df">
                회원가입 현황 (일일)
              </S.DashboardCardLabel>

              <S.DashboardCardMainValue>125명</S.DashboardCardMainValue>
              <S.DashboardCardSubGrid>
                <S.DashboardCardSubItem>
                  <span>주간:</span> <strong>840명</strong>
                </S.DashboardCardSubItem>
                <S.DashboardCardSubItem>
                  <span>월간:</span> <strong>3,210명</strong>
                </S.DashboardCardSubItem>
              </S.DashboardCardSubGrid>
            </S.DashboardCardInfo>

            <S.DashboardCardIconWrapper>
              <FiUserPlus size={36} color="#dddfeb" />
            </S.DashboardCardIconWrapper>
          </S.DashboardSummaryCard>

          {/* 2. 퀵 상담 및 매출 전환 카드 */}
          <S.DashboardSummaryCard $borderColor="#1cc88a">
            <S.DashboardCardInfo>
              <S.DashboardCardLabel $textColor="#1cc88a">
                일일 퀵상담률
              </S.DashboardCardLabel>
              <S.DashboardCardMainValue>45.2 %</S.DashboardCardMainValue>
              <S.DashboardCardSubGrid>
                <S.DashboardCardSubItem style={{ width: "100%" }}>
                  <span>상담 후 매출 전환율:</span> <strong>18.5 %</strong>
                </S.DashboardCardSubItem>
              </S.DashboardCardSubGrid>
            </S.DashboardCardInfo>
            <S.DashboardCardIconWrapper>
              <FiPhoneCall size={36} color="#dddfeb" />
            </S.DashboardCardIconWrapper>
          </S.DashboardSummaryCard>
          {/* 3. 유입 채널 통계 카드 */}
          <S.DashboardSummaryCard $borderColor="#36b9cc">
            <S.DashboardCardInfo>
              <S.DashboardCardLabel $textColor="#36b9cc">
                총 유입량 (일일)
              </S.DashboardCardLabel>
              <S.DashboardCardMainValue>8,420 건</S.DashboardCardMainValue>
              <S.DashboardCardSubGrid>
                <S.DashboardCardSubItem>
                  <span>네이버:</span> <strong>5,100 건</strong>
                </S.DashboardCardSubItem>
                <S.DashboardCardSubItem>
                  <span>기타(구글 등):</span> <strong>3,320 건</strong>
                </S.DashboardCardSubItem>
              </S.DashboardCardSubGrid>
            </S.DashboardCardInfo>
            <S.DashboardCardIconWrapper>
              <FiSearch size={36} color="#dddfeb" />
            </S.DashboardCardIconWrapper>
          </S.DashboardSummaryCard>

          {/* 4. 클레임률 통계 카드 (일/주/월) */}
          <S.DashboardSummaryCard $borderColor="#e74a3b">
            <S.DashboardCardInfo>
              <S.DashboardCardLabel $textColor="#e74a3b">
                클레임률 (일간)
              </S.DashboardCardLabel>
              <S.DashboardCardMainValue>1.2 %</S.DashboardCardMainValue>
              <S.DashboardCardSubGrid>
                <S.DashboardCardSubItem>
                  <span>주간:</span> <strong>1.5 %</strong>
                </S.DashboardCardSubItem>
                <S.DashboardCardSubItem>
                  <span>월간:</span> <strong>1.1 %</strong>
                </S.DashboardCardSubItem>
              </S.DashboardCardSubGrid>
            </S.DashboardCardInfo>
            <S.DashboardCardIconWrapper>
              <FiAlertOctagon size={36} color="#dddfeb" />
            </S.DashboardCardIconWrapper>
          </S.DashboardSummaryCard>
        </S.DashboardCardGrid>

        <S.DashContainer>
          <S.ChartGrid>
            <S.ChartCard>
              <S.ChartHeader>
                <S.ChartTitle>
                  <FiTrendingUp /> 월별 상담 신청 추이
                </S.ChartTitle>
              </S.ChartHeader>
              <S.ChartBody>
                <S.BarChartContainer>
                  {monthlyData.map((data, idx) => (
                    <S.BarWrapper key={idx}>
                      <S.BarValue>{data.value}</S.BarValue>
                      <S.Bar $height={`${data.value}%`} />
                      <S.BarLabel>{data.month}</S.BarLabel>
                    </S.BarWrapper>
                  ))}
                </S.BarChartContainer>
              </S.ChartBody>
            </S.ChartCard>

            <S.ChartCard>
              <S.ChartHeader>
                <S.ChartTitle>
                  <FiPieChart /> 시술 관심도 분포
                </S.ChartTitle>
              </S.ChartHeader>
              <S.ChartBody
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <S.DonutChart>
                  <div className="inner-circle">
                    <span>TOP 3</span>
                  </div>
                </S.DonutChart>
                <S.LegendContainer>
                  <S.LegendItem>
                    <span
                      className="dot"
                      style={{ background: "#4e73df" }}
                    ></span>
                    눈성형 (45%)
                  </S.LegendItem>
                  <S.LegendItem>
                    <span
                      className="dot"
                      style={{ background: "#1cc88a" }}
                    ></span>
                    코성형 (30%)
                  </S.LegendItem>
                  <S.LegendItem>
                    <span
                      className="dot"
                      style={{ background: "#36b9cc" }}
                    ></span>
                    안티에이징 (25%)
                  </S.LegendItem>
                </S.LegendContainer>
              </S.ChartBody>
            </S.ChartCard>
          </S.ChartGrid>

          {/* 🎯 3. 시스템 운영 현황 (나머지 메뉴들 요약) */}
          <S.SystemGrid>
            <S.SystemCard>
              <S.ChartHeader>
                <S.ChartTitle>
                  <FiSettings /> 프론트 UI / 설정 상태
                </S.ChartTitle>
              </S.ChartHeader>
              <S.ChartBody>
                <S.StatusList>
                  <S.StatusItem>
                    <div className="label">
                      <FiLayout /> 톤앤매너 관리
                    </div>
                    <S.Badge $active={true}>정상동작</S.Badge>
                  </S.StatusItem>
                  <S.StatusItem>
                    <div className="label">
                      <FiLayers /> 내비게이션 관리
                    </div>
                    <S.Badge $active={true}>업데이트 완료</S.Badge>
                  </S.StatusItem>
                  <S.StatusItem>
                    <div className="label">
                      <FiLayout /> 푸터 관리
                    </div>
                    <S.Badge $active={true}>설정됨</S.Badge>
                  </S.StatusItem>
                </S.StatusList>
              </S.ChartBody>
            </S.SystemCard>

            <S.SystemCard>
              <S.ChartHeader>
                <S.ChartTitle>
                  <FiImage /> 미디어 / 마케팅 모듈
                </S.ChartTitle>
              </S.ChartHeader>
              <S.ChartBody>
                <S.StatusList>
                  <S.StatusItem>
                    <div className="label">
                      <FiImage /> 팝업 관리
                    </div>
                    <S.Badge $active={true}>활성 2건</S.Badge>
                  </S.StatusItem>
                  <S.StatusItem>
                    <div className="label">
                      <FiMessageSquare /> 뉴스티커 관리
                    </div>
                    <S.Badge $active={false}>비활성</S.Badge>
                  </S.StatusItem>
                  <S.StatusItem>
                    <div className="label">
                      <FiImage /> 셀피 관리
                    </div>
                    <S.Badge $active={true}>신규 5건</S.Badge>
                  </S.StatusItem>
                </S.StatusList>
              </S.ChartBody>
            </S.SystemCard>

            <S.SystemCard>
              <S.ChartHeader>
                <S.ChartTitle>
                  <FiVideo /> 비디오 / 특수 모듈
                </S.ChartTitle>
              </S.ChartHeader>
              <S.ChartBody>
                <S.StatusList>
                  <S.StatusItem>
                    <div className="label">
                      <FiVideo /> VLOG 관리
                    </div>
                    <S.Badge $active={true}>영상 12개</S.Badge>
                  </S.StatusItem>
                  <S.StatusItem>
                    <div className="label">
                      <FiShield /> 안전마취 관리
                    </div>
                    <S.Badge $active={true}>시스템 정상</S.Badge>
                  </S.StatusItem>
                </S.StatusList>
              </S.ChartBody>
            </S.SystemCard>
          </S.SystemGrid>
        </S.DashContainer>
      </S.DashboardContainer>
    </>
  );
}
