"use client";

import styled from 'styled-components';

import * as D from '@/assets/css/components/detail/DetailPage.styles';
import * as V from '@/assets/css/components/detail/DetailSectionLayouts.styles';

export const Wrapper = styled.div`
  width: 100%;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  color: #2a4935;
`;

export const Notice = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 9px;
  padding: 11px 13px;
  border-radius: 9px;
  background: #edf5ed;
  border: 1px solid #d6e8d8;
  color: #3e6647;
  font-size: 11.5px;
  line-height: 1.7;
  svg {
    flex: 0 0 16px;
    margin-top: 2px;
  }
  strong {
    font-weight: 750;
  }
`;

export const HiddenNotice = styled(Notice)`
  background: #faf4e9;
  border-color: #ead9b8;
  color: #7a622e;
`;

export const Canvas = styled.div`
  width: 100%;
  min-width: 0;
  overflow: hidden;
  border-radius: 12px;
  border: 1px solid #dae4d9;
  background: #f7f6f2;
  box-shadow: 0 9px 25px rgba(29, 61, 39, 0.06);
  container-name: detail-preview;
  container-type: inline-size;

  /* 원본 방문자 렌더러를 사용하지만 관리자 화면에서는 SideNav 공간이 없으므로 왼쪽 여백 제거 */
  ${D.EditorialSection} {
    padding: 58px 0;
    scroll-margin-top: 0;
  }
  ${D.Content} {
    width: calc(100% - 72px);
    max-width: 1240px;
    padding-left: 0;
  }

  /* Hero는 기존 컴포넌트 스타일을 사용하며, 미리보기 높이만 조정 */
  ${D.Hero} {
    min-height: 530px;
    height: 56vw;
    max-height: 650px;
    align-items: flex-end;
  }
  ${D.HeroInner} {
    width: calc(100% - 72px);
    padding: 0 0 55px;
  }
  ${D.HeroTitle} {
    font-size: clamp(34px, 4vw, 60px);
  }
  ${D.HeroDesc} {
    font-size: 14px;
    max-width: 480px;
  }

  /* 화면 전체가 아닌 관리자 패널 안의 폭에 맞게 그리드 배치 */
  @container detail-preview (max-width: 850px) {
    ${D.Content} {
      width: calc(100% - 44px);
    }
    ${D.IntroGrid} {
      grid-template-columns: 1fr;
      gap: 28px;
    }
    ${V.ComparisonGrid} {
      grid-template-columns: 1fr;
    }
    ${D.FaqGrid} {
      grid-template-columns: 1fr;
      gap: 26px;
    }
    ${D.FeatureGrid} {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
    ${D.ProcessGrid} {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
    ${D.HeroInner} {
      width: calc(100% - 44px);
    }
  }
  @container detail-preview (max-width: 530px) {
    ${D.Content} {
      width: calc(100% - 32px);
    }
    ${D.FeatureGrid}, ${D.ProcessGrid} {
      grid-template-columns: 1fr;
    }
    ${D.EditorialSection} {
      padding: 42px 0;
    }
    ${D.Hero} {
      min-height: 420px;
      height: 480px;
    }
    ${D.HeroInner} {
      width: calc(100% - 32px);
      padding-bottom: 40px;
    }
    ${D.HeroTitle} {
      font-size: 36px;
    }
  }
`;

export const EmptyImage = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #2d4b37, #1b3528 55%, #6f8b74);
  color: rgba(255, 255, 255, 0.22);
  font:
    400 22px Georgia,
    serif;
  letter-spacing: 0.25em;
`;

export const Footnote = styled.p`
  margin: 0;
  color: #88988a;
  font-size: 10.5px;
  line-height: 1.7;
`;
