import styled, { css } from 'styled-components';

import * as S from '@/assets/css/components/detail/DetailPage.styles';

/** 기존 DetailPage.styles.ts(사용자 Hero 위치·애니메이션 수정 포함)는 수정하지 않습니다. */
export const IntroVariantGrid = styled(S.IntroGrid)<{ $imageLeft: boolean }>`
  ${({ $imageLeft }) =>
    $imageLeft &&
    css`
      ${S.IntroText} {
        order: 2;
      }
      ${S.IntroVisual} {
        order: 1;
        border-radius: 86px 2px 2px 2px;
      }
      @media (max-width: 768px) {
        ${S.IntroText} {
          order: 1;
        }
        ${S.IntroVisual} {
          order: 2;
          border-radius: 2px 52px 2px 2px;
        }
      }
    `}
`;

export const ComparisonGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: clamp(16px, 2.6vw, 32px);
  margin-top: clamp(32px, 4.5vw, 60px);
  @media (max-width: 760px) {
    grid-template-columns: 1fr;
  }
`;

export const ComparisonCard = styled.article<{ $light: boolean }>`
  min-width: 0;
  min-height: 240px;
  padding: clamp(28px, 4vw, 54px);
  border: 1px solid
    ${({ $light }) => ($light ? "rgba(220,237,222,.25)" : "rgba(39,75,54,.13)")};
  border-radius: 2px 48px 2px 2px;
  background: ${({ $light }) =>
    $light ? "rgba(255,255,255,.055)" : "rgba(255,255,255,.70)"};
  h3 {
    margin: 18px 0 16px;
    font-size: clamp(21px, 2.1vw, 32px);
    font-weight: 500;
    color: ${({ $light }) => ($light ? "#fff" : "#254432")};
    word-break: keep-all;
  }
  p {
    margin: 0;
    white-space: pre-line;
    font-size: 15px;
    line-height: 1.95;
    color: ${({ $light }) => ($light ? "rgba(255,255,255,.78)" : "#66776d")};
  }
`;

export const ComparisonIndex = styled.div<{ $light: boolean }>`
  font-size: 10px;
  letter-spacing: 0.14em;
  font-weight: 600;
  color: ${({ $light }) => ($light ? "#bdd2bd" : "#6d8972")};
`;

export const FeatureRows = styled.div`
  display: flex;
  flex-direction: column;
`;

export const FeatureRow = styled.article<{ $light: boolean }>`
  display: grid;
  grid-template-columns: 50px 42px minmax(0, 1fr);
  align-items: center;
  gap: clamp(12px, 2.5vw, 32px);
  padding: clamp(22px, 3vw, 36px) 8px;
  border-top: 1px solid
    ${({ $light }) => ($light ? "rgba(255,255,255,.22)" : "rgba(39,75,54,.18)")};
  &:last-child {
    border-bottom: 1px solid
      ${({ $light }) =>
        $light ? "rgba(255,255,255,.22)" : "rgba(39,75,54,.18)"};
  }
  .number {
    font:
      italic 20px Georgia,
      serif;
    color: ${({ $light }) => ($light ? "#bdd2bd" : "#75917b")};
  }
  svg {
    width: 31px;
    height: 31px;
    stroke-width: 1.25;
    color: ${({ $light }) => ($light ? "#bdd2bd" : "#355e47")};
  }
  h3 {
    margin: 0;
    font-weight: 500;
    font-size: clamp(17px, 1.7vw, 24px);
    line-height: 1.6;
    color: ${({ $light }) => ($light ? "#fff" : "#283c2d")};
    word-break: keep-all;
  }
  @media (max-width: 520px) {
    grid-template-columns: 32px 30px minmax(0, 1fr);
    gap: 12px;
  }
`;

export const ProcessTimeline = styled.ol`
  list-style: none;
  margin: 0;
  padding: 0 0 0 36px;
  border-left: 1px solid rgba(210, 231, 211, 0.32);
`;

export const TimelineItem = styled.li`
  position: relative;
  min-height: 105px;
  padding: 0 0 clamp(28px, 4vw, 50px) clamp(18px, 2.5vw, 36px);
  &::before {
    content: "";
    position: absolute;
    left: -43px;
    top: 4px;
    width: 13px;
    height: 13px;
    background: #a5bfaa;
    border: 3px solid #1b3528;
    border-radius: 50%;
    box-shadow: 0 0 0 1px rgba(210, 231, 211, 0.35);
  }
  &:last-child {
    padding-bottom: 0;
  }
  .step {
    color: #b3ccb7;
    font-size: 11px;
    letter-spacing: 0.18em;
  }
  h3 {
    margin: 15px 0 0;
    font-size: clamp(18px, 2vw, 27px);
    font-weight: 400;
    line-height: 1.5;
    color: #fff;
    word-break: keep-all;
  }
`;
