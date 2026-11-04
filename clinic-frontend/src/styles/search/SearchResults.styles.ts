"use client";

import styled from "styled-components";

const ink = "#234435";
const muted = "#718273";
const gold = "#a59572";
const line = "rgba(41, 76, 51, 0.14)";
// 한글은 영문 디스플레이 세리프 폰트를 상속하지 않도록 명시합니다.
const koreanFont = '"Pretendard", "Noto Sans KR", "Apple SD Gothic Neo", "Malgun Gothic", sans-serif';
const englishFont = '"Cormorant Garamond", Georgia, serif';

export const Page = styled.main`
  min-height: 100svh;
  background: #f8f7f2;
  color: ${ink};
  font-family: ${koreanFont};
  word-break: keep-all;
`;

/* 상단은 검색바 하나만 남깁니다. 헤더 높이(PC 88px / 모바일 68px)와 겹치지 않도록 여백 유지. */
export const SearchHero = styled.section`
  padding: clamp(125px, 10vw, 156px) 24px clamp(36px, 4.6vw, 62px);
  background:
    radial-gradient(ellipse at 82% 0%, rgba(218, 229, 211, 0.58), transparent 53%),
    #f5f5ee;
  border-bottom: 1px solid #dfe3d9;

  @media (max-width: 768px) {
    padding: 102px 18px 37px;
  }
`;

export const SearchForm = styled.form`
  display: flex;
  align-items: center;
  gap: 19px;
  width: min(800px, 100%);
  min-height: 64px;
  padding: 7px 8px 7px 20px;
  margin: 0 auto;
  background: #fff;
  border: 1px solid #bdcbbd;
  border-radius: 2px;
  box-shadow: 0 12px 32px rgba(32, 58, 37, 0.06);
  color: ${ink};
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  > svg {
    flex: 0 0 auto;
    color: #728b76;
  }

  &:focus-within {
    border-color: #6d9474;
    box-shadow: 0 12px 32px rgba(32, 58, 37, 0.1);
  }

  @media (max-width: 600px) {
    min-height: 58px;
    gap: 12px;
    padding: 6px 6px 6px 15px;
  }
`;

export const SearchInput = styled.input`
  flex: 1;
  min-width: 0;
  padding: 6px 0;
  background: transparent;
  border: 0;
  outline: 0;
  color: ${ink};
  font-family: ${koreanFont};
  font-size: 14px;
  line-height: 1.4;
  letter-spacing: -0.025em;

  &::placeholder { color: #93a194; }

  @media (max-width: 600px) { font-size: 12px; }
`;

export const SubmitButton = styled.button`
  align-self: stretch;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  min-width: 110px;
  padding: 0 17px;
  background: #234738;
  border: 1px solid #234738;
  border-radius: 1px;
  color: #fff;
  font: 500 12px ${koreanFont};
  cursor: pointer;
  transition: background 0.25s ease, border-color 0.25s ease;

  &:hover:not(:disabled) {
    background: #355f49;
    border-color: #355f49;
  }
  &:disabled { opacity: 0.48; cursor: not-allowed; }
  &:focus-visible { outline: 2px solid #9cae8f; outline-offset: 3px; }

  @media (max-width: 600px) {
    min-width: 44px;
    padding: 0 12px;
    gap: 0;
    span { display: none; }
  }
`;

export const Body = styled.section`
  width: min(1120px, calc(100% - 48px));
  margin: 0 auto;
  padding: clamp(42px, 5.2vw, 68px) 0 115px;

  @media (max-width: 600px) {
    width: calc(100% - 36px);
    padding: 38px 0 85px;
  }
`;

export const SmallLabel = styled.p`
  margin: 0 0 13px;
  color: ${gold};
  font: 700 10px ${koreanFont};
  letter-spacing: 0.23em;
`;

export const ResultHeading = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 20px;

  h1 {
    margin: 0;
    color: ${ink};
    font-family: ${koreanFont};
    font-size: clamp(23px, 3.1vw, 34px);
    font-weight: 500;
    line-height: 1.35;
    letter-spacing: -0.055em;
    overflow-wrap: anywhere;

    strong { font-weight: 700; }
  }
`;

export const ResultCount = styled.span`
  flex: 0 0 auto;
  padding-bottom: 5px;
  color: ${muted};
  font-size: 11px;
  letter-spacing: -0.02em;
`;

export const Filters = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
  padding-bottom: 22px;
  margin: 29px 0 34px;
  border-bottom: 1px solid #d9ded5;
`;

export const FilterButton = styled.button<{ $active: boolean }>`
  min-height: 35px;
  padding: 8px 16px;
  border: 1px solid ${({ $active }) => ($active ? "#234738" : "#d5dcd1")};
  border-radius: 1px;
  background: ${({ $active }) => ($active ? "#234738" : "transparent")};
  color: ${({ $active }) => ($active ? "#fff" : "#58705e")};
  font-family: ${koreanFont};
  font-size: 11px;
  font-weight: ${({ $active }) => ($active ? "600" : "500")};
  cursor: pointer;
  transition: background 0.2s ease, border-color 0.2s ease, color 0.2s ease;

  &:hover:not([aria-pressed="true"]) {
    background: #e9eee6;
    border-color: #aebfad;
  }
  &:focus-visible { outline: 2px solid ${gold}; outline-offset: 3px; }
`;

export const State = styled.div`
  padding: 70px 12px;
  color: ${muted};
  font-size: 13px;
  line-height: 1.8;
  text-align: center;
  border-top: 1px solid ${line};
`;

export const Warning = styled.p`
  margin: 0 0 22px;
  padding: 14px 18px;
  background: #f2eadb;
  color: #846f4e;
  font-size: 12px;
  line-height: 1.7;
`;

export const Group = styled.section`
  margin-top: 32px;
  & + & { margin-top: 48px; }
`;

export const GroupTitle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  margin-bottom: 17px;

  > div {
    display: inline-flex;
    align-items: baseline;
    gap: 13px;
    min-width: 0;
  }

  h2 {
    margin: 0;
    color: ${ink};
    font-family: ${koreanFont};
    font-size: 17px;
    font-weight: 650;
    letter-spacing: -0.055em;
  }

  > span {
    color: #8c9a8c;
    font-size: 10px;
    letter-spacing: 0.06em;
    white-space: nowrap;
  }
`;

export const GroupNumber = styled.span`
  color: ${gold};
  font-family: ${englishFont};
  font-style: italic;
  font-size: 22px;
  font-weight: 400;
  line-height: 1;
`;

export const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;

  @media (max-width: 680px) { grid-template-columns: 1fr; }
`;

export const Card = styled.article`
  position: relative;
  min-width: 0;
  min-height: 166px;
  padding: 25px 25px 23px;
  background: #fff;
  border: 1px solid #e0e5dd;
  box-shadow: 0 5px 23px rgba(35, 69, 43, 0.035);
  transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.25s ease;

  &:hover {
    border-color: #c6d2c3;
    box-shadow: 0 14px 30px rgba(35, 69, 43, 0.09);
    transform: translateY(-2px);
  }
  @media (prefers-reduced-motion: reduce) { transition: none; &:hover { transform: none; } }
`;

export const CardEyebrow = styled.p`
  margin: 0 36px 17px 0;
  color: #849385;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.1em;
`;

export const CardTitle = styled.a`
  display: inline-flex;
  align-items: flex-start;
  gap: 12px;
  width: 100%;
  color: ${ink};
  font-family: ${koreanFont};
  font-size: clamp(16px, 1.8vw, 19px);
  font-weight: 650;
  line-height: 1.45;
  letter-spacing: -0.055em;
  text-decoration: none;
  overflow-wrap: anywhere;

  &:focus-visible { outline: 2px solid #7b957d; outline-offset: 4px; }
  &:hover { color: #426b4b; }
`;

export const CardArrow = styled.span`
  position: absolute;
  top: 22px;
  right: 23px;
  display: inline-flex;
  color: #667f6c;
  transition: transform 0.2s ease;

  ${Card}:hover & { transform: translate(2px, -2px); }
`;

export const CardDescription = styled.p`
  margin: 10px 0 0;
  color: #778779;
  font-size: 12px;
  line-height: 1.8;
  letter-spacing: -0.025em;
  overflow-wrap: anywhere;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

export const UnlinkedNote = styled.span`
  display: inline-block;
  margin-top: 16px;
  color: #a5afa4;
  font-size: 10px;
`;

export const FaqList = styled.div`
  border-top: 1px solid #d9ded5;
`;

export const FaqItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 17px;
  min-width: 0;
  padding: 21px 4px;
  border-bottom: 1px solid #d9ded5;
`;

export const FaqInitial = styled.span`
  flex: 0 0 24px;
  color: ${gold};
  font: italic 25px/1.15 ${englishFont};
`;

export const FaqContent = styled.div`
  flex: 1 1 auto;
  min-width: 0;
`;

export const FaqTitle = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 9px;
  color: ${ink};
  font: 600 13px/1.6 ${koreanFont};
  letter-spacing: -0.025em;
  text-decoration: none;
  overflow-wrap: anywhere;
  &:hover { color: #496f4d; }
  &:focus-visible { outline: 2px solid #7b957d; outline-offset: 3px; }
`;

export const FaqDescription = styled.p`
  margin: 8px 0 0;
  color: #748477;
  font-size: 11px;
  line-height: 1.75;
  letter-spacing: -0.025em;
  overflow-wrap: anywhere;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;
