import styled, { css } from "styled-components";
import * as H from "@/assets/css/components/Header.styles";

/** 검색 중 오른쪽 UtilGroup에만 간격 축소. 중앙 Nav 및 3열 Grid는 원본 그대로 유지. */
export const SearchUtilGroup = styled(H.UtilGroup)<{ $searchOpen: boolean }>`
  ${({ $searchOpen }) => $searchOpen && css`
    gap: 6px;
    > ${H.DesktopOnly} { gap: 6px; }
  `}
`;

/** AccountDropdown / LanguageDropdown과 동일한 기본·호버 Glass 표현. */
const glassAction = css`
  background: transparent;
  border: 1px solid transparent;
  border-radius: 999px;
  color: inherit;
  box-shadow: none;
  -webkit-backdrop-filter: none;
  backdrop-filter: none;
  transition:
    background 0.3s ease,
    border-color 0.3s ease,
    box-shadow 0.3s ease,
    backdrop-filter 0.3s ease;
  &:hover, &:focus-visible {
    opacity: 1;
    transform: none;
    background: rgba(255, 255, 255, 0.16);
    border-color: rgba(255, 255, 255, 0.35);
    -webkit-backdrop-filter: blur(14px) saturate(160%);
    backdrop-filter: blur(14px) saturate(160%);
    box-shadow:
      0 4px 20px rgba(36, 69, 53, 0.08),
      inset 0 1px 0 rgba(255, 255, 255, 0.45),
      inset 0 -1px 0 rgba(255, 255, 255, 0.12);
  }
  &:focus-visible { outline: 2px solid #69826b; outline-offset: 3px; }
`;

/** 닫힌 경우에는 원본 <PhoneButton>, <CtaButton>, <IconLink>의 스타일을 그대로 둔다. */
export const CompactAction = styled.span<{ $compact: boolean }>`
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  ${({ $compact }) => $compact && css`
    width: 40px;
    min-width: 40px;
    height: 40px;
    > a {
      box-sizing: border-box;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      min-width: 40px;
      height: 40px;
      padding: 0;
      gap: 0;
      ${glassAction}
    }
  `}
`;

/** 원본 AccountDropdown을 수정하지 않고 검색을 켰을 때 트리거 폭만 변경. */
export const CompactAccount = styled.span<{ $compact: boolean }>`
  display: inline-flex;
  flex: 0 0 auto;
  position: relative;
  align-items: center;
  ${({ $compact }) => $compact && css`
    width: 40px;
    min-width: 40px;
    height: 40px;
    > div > button {
      width: 40px;
      min-width: 40px;
      height: 40px;
      min-height: 40px;
      padding: 0;
      gap: 0;
    }
    > div > button > span { visibility: hidden; }
  `}
`;

/** 기존 LanguageDropdown Glass 효과 보존하고 버튼 크기만 아이콘 크기로 축소. */
export const CompactLanguage = styled.span<{ $compact: boolean }>`
  display: inline-flex;
  flex: 0 0 auto;
  position: relative;
  align-items: center;
  ${({ $compact }) => $compact && css`
    width: 40px;
    min-width: 40px;
    height: 40px;
    > div > button {
      width: 40px;
      min-width: 40px;
      height: 40px;
      min-height: 40px;
      padding: 0;
      font-size: 0;
      gap: 0;
    }
    > div > button > svg,
    > div > button > span { visibility: hidden; }
  `}
`;

/** 실제 원본 버튼이 클릭되게 하는 시각적 아이콘 (이벤트 통과). */
export const CoverIcon = styled.span`
  position: absolute;
  top: 50%;
  left: 20px;
  transform: translate(-50%, -50%);
  pointer-events: none;
  line-height: 0;
  color: inherit;
`;

export const MobileAction = styled.span<{ $searchOpen: boolean }>`
  display: contents;
  @media (max-width: 1200px) {
    ${({ $searchOpen }) => $searchOpen && css`display: none;`}
  }
`;
