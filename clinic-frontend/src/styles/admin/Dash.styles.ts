"use client";
import styled from "styled-components";
import {
  adminCardHeaderCss,
  adminPageHeaderCss,
  adminPageTitleCss,
} from "./shared";

import { FlexBetween } from "@/styles/mixins";

export const DashContainer = styled.div`
  width: 100%;
`;

export const DashHeader = styled.div`
  ${adminPageHeaderCss}
`;

export const DashTitle = styled.h1`
  ${adminPageTitleCss}
`;

// --- 상단 4개 요약 카드 ---
export const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  margin-bottom: 1.5rem;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const SummaryCard = styled.div<{ $color: string }>`
  background-color: #fff;
  border-radius: 0.35rem;
  box-shadow: 0 0.15rem 1.75rem 0 rgba(58, 59, 69, 0.15);
  border-left: 0.25rem solid ${(props) => props.$color};
  padding: 1.5rem;
`;

export const SummaryCardBody = styled.div`
  ${FlexBetween}
`;

export const SummaryTitle = styled.div<{ $color: string }>`
  font-size: 0.75rem;
  font-weight: 700;
  color: ${(props) => props.$color};
  text-transform: uppercase;
  margin-bottom: 0.25rem;
`;

export const SummaryValue = styled.div`
  font-size: 1.2rem;
  font-weight: 700;
  color: #5a5c69;
`;

export const SummaryIcon = styled.div`
  color: #dddfeb;
`;

// --- 중간 그래프 영역 ---
export const ChartGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1.5rem;
  margin-bottom: 1.5rem;

  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`;

export const ChartCard = styled.div`
  background-color: #fff;
  border-radius: 0.35rem;
  box-shadow: 0 0.15rem 1.75rem 0 rgba(58, 59, 69, 0.15);
  border: 1px solid #e3e6f0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

export const ChartHeader = styled.div`
  ${adminCardHeaderCss}
`;

export const ChartTitle = styled.h6`
  margin: 0;
  font-weight: 700;
  color: #1b4d3e;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const ChartBody = styled.div`
  padding: 1.5rem;
  flex: 1;
`;

// CSS 막대 차트
export const BarChartContainer = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
  height: 250px;
  padding-top: 1rem;
  border-bottom: 1px solid #eaecf4;
  border-left: 1px solid #eaecf4;
`;

export const BarWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  height: 100%;
  width: 10%;
`;

export const BarValue = styled.div`
  font-size: 0.75rem;
  color: #858796;
  margin-bottom: 0.5rem;
`;

export const Bar = styled.div<{ $height: string }>`
  width: 100%;
  height: ${(props) => props.$height};
  background-color: #427856;
  border-radius: 0.2rem 0.2rem 0 0;
  transition: none;

  &:hover {
    background-color: #336247;
  }
`;

export const BarLabel = styled.div`
  font-size: 0.8rem;
  color: #858796;
  margin-top: 0.5rem;
`;

// CSS 도넛 차트
export const DonutChart = styled.div`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background: conic-gradient(#295c3e 0% 45%, #85aa8b 45% 75%, #cfb890 75% 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1.5rem;

  .inner-circle {
    width: 110px;
    height: 110px;
    background-color: #fff;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    color: #5a5c69;
  }
`;

export const LegendContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
`;

export const LegendItem = styled.div`
  display: flex;
  align-items: center;
  font-size: 0.85rem;
  color: #858796;

  .dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    margin-right: 0.5rem;
  }
`;

// --- 하단 시스템 현황 (나머지 메뉴 모음) ---
export const SystemGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;

  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`;

export const SystemCard = styled(ChartCard)``;

export const StatusList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const StatusItem = styled.div`
  ${FlexBetween}
  padding-bottom: 0.8rem;
  border-bottom: 1px dashed #eaecf4;

  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }

  .label {
    font-size: 0.9rem;
    color: #5a5c69;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
`;

export const Badge = styled.span<{ $active: boolean }>`
  padding: 0.3rem 0.6rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 700;
  background-color: ${(props) => (props.$active ? "#e6f2e8" : "#fdece9")};
  color: #315441;
  user-select: none;
`;
