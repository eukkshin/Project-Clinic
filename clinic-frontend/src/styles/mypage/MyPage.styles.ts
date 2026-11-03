import Link from 'next/link';
import styled, { keyframes } from 'styled-components';

/**
 * AHNS My Page — premium editorial shell + minimal personal details
 * Brand: forest #294737 / ivory #F5F3ED / champagne #B09F77
 * The shared fixed header is rendered by the existing app layout.
 */
const forest = "#294737";
const forestDeep = "#203C2F";
const gold = "#B09F77";
const ivory = "#F5F3ED";
const soft = "#E9EDE5";
const line = "#E0E5DC";
const muted = "#748477";
const serif = 'var(--ahns-korean-display, "Pretendard Variable", sans-serif)';

const sans = '"Pretendard", Arial, sans-serif';

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(14px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const Root = styled.main`
  min-height: 100vh;
  padding-top: 88px;
  background: ${ivory};
  color: ${forest};
  font-family: ${sans};
  @media (max-width: 768px) {
    padding-top: 68px;
  }
`;
export const Hero = styled.header`
  border-bottom: 1px solid #e7e7de;
  background: linear-gradient(116deg, #f7f5f0 8%, #edefe7 100%);
`;
export const HeroInner = styled.div`
  width: min(1220px, calc(100% - 64px));
  margin: 0 auto;
  padding: 74px 0 60px;
  @media (max-width: 768px) {
    width: calc(100% - 40px);
    padding: 50px 0 42px;
  }
`;
export const Eyebrow = styled.p`
  margin: 0 0 11px;
  color: #8d937b;
  letter-spacing: 0.22em;
  font-size: 10px;
  font-weight: 600;
`;
export const HeroTitle = styled.h1`
  margin: 0;
  font: 400 clamp(52px, 6vw, 78px)/1 ${serif};
  letter-spacing: -0.04em;
  em {
    color: #7c9b83;
    font-weight: 400;
  }
`;
export const HeroDescription = styled.p`
  margin: 16px 0 0;
  color: ${muted};
  font-size: 13px;
  line-height: 1.85;
`;
export const MainGrid = styled.div`
  width: min(1220px, calc(100% - 64px));
  margin: 0 auto;
  padding: 52px 0 120px;
  display: grid;
  grid-template-columns: minmax(208px, 248px) minmax(0, 1fr);
  gap: clamp(30px, 4vw, 64px);
  align-items: start;
  @media (max-width: 900px) {
    display: block;
    padding: 30px 0 90px;
  }
  @media (max-width: 768px) {
    width: calc(100% - 40px);
  }
`;
export const Sidebar = styled.aside`
  position: sticky;
  top: 114px;
  padding: 28px 20px 22px;
  border: 1px solid #dee6d9;
  border-radius: 12px;
  background: ${soft};
  @media (max-width: 900px) {
    position: static;
    padding: 17px;
    margin-bottom: 26px;
  }
`;
export const SidebarEyebrow = styled.p`
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 0.16em;
  color: #809383;
  margin: 0 0 8px;
  @media (max-width: 900px) {
    display: none;
  }
`;
export const SidebarHeading = styled.h2`
  font: 400 34px/1.2 ${serif};
  letter-spacing: -0.02em;
  margin: 0 0 9px;
  @media (max-width: 900px) {
    display: none;
  }
`;
export const SidebarDescription = styled.p`
  color: ${muted};
  font-size: 11px;
  line-height: 1.85;
  margin: 0 0 22px;
  @media (max-width: 900px) {
    display: none;
  }
`;
export const SideNav = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 6px;
  @media (max-width: 900px) {
    flex-direction: row;
    overflow-x: auto;
    scrollbar-width: thin;
    padding-bottom: 3px;
  }
`;
export const SideLink = styled(Link)<{ $active?: boolean }>`
  display: inline-flex;
  justify-content: space-between;
  align-items: center;
  gap: 13px;
  padding: 13px 14px;
  color: ${({ $active }) => ($active ? forestDeep : "#687D6C")};
  background: ${({ $active }) => ($active ? "#D8E4D5" : "transparent")};
  border-radius: 7px;
  font-size: 12px;
  font-weight: ${({ $active }) => ($active ? 700 : 500)};
  white-space: nowrap;
  text-decoration: none;
  transition:
    background 0.22s ease,
    color 0.22s ease,
    transform 0.22s ease;
  &::after {
    content: "↗";
    font-size: 13px;
    opacity: ${({ $active }) => ($active ? 1 : 0.55)};
  }
  &:hover {
    color: ${forestDeep};
    background: #d8e4d5;
  }
  &:focus-visible {
    outline: 2px solid ${gold};
    outline-offset: 3px;
  }
  @media (max-width: 900px) {
    flex: 0 0 auto;
  }
`;
export const Content = styled.div`
  min-width: 0;
  animation: ${fadeUp} 0.65s cubic-bezier(0.22, 1, 0.36, 1) both;
  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;
export const WelcomePanel = styled.section`
  padding: clamp(24px, 4vw, 36px);
  margin-bottom: 16px;
  border: 1px solid ${line};
  border-radius: 12px;
  background: #ffffff;
`;
export const WelcomeEyebrow = styled.p`
  margin: 0 0 13px;
  color: #829787;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.14em;
`;
export const WelcomeHeading = styled.h2`
  margin: 0 0 10px;
  font-size: clamp(21px, 2.6vw, 29px);
  font-weight: 500;
  letter-spacing: -0.045em;
  overflow-wrap: anywhere;
`;
export const WelcomeDescription = styled.p`
  margin: 0;
  color: ${muted};
  font-size: 12px;
  line-height: 1.8;
`;
export const SummaryCard = styled.section`
  position: relative;
  overflow: hidden;
  margin-bottom: 36px;
  padding: clamp(25px, 4vw, 38px);
  border-radius: 12px;
  background: ${forest};
  color: #f8f7f0;
  &::after {
    content: "";
    position: absolute;
    pointer-events: none;
    right: -64px;
    bottom: -110px;
    width: 280px;
    height: 280px;
    border: 1px solid rgba(255, 255, 255, 0.09);
    border-radius: 50%;
    box-shadow:
      0 0 0 47px rgba(255, 255, 255, 0.022),
      0 0 0 94px rgba(255, 255, 255, 0.016);
  }
`;
export const SummaryEyebrow = styled.p`
  color: #bfd1c1;
  margin: 0 0 15px;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.19em;
`;
export const SummaryDate = styled.h3`
  position: relative;
  z-index: 1;
  margin: 0;
  font-size: clamp(18px, 2.6vw, 27px);
  font-weight: 500;
  letter-spacing: -0.03em;
  line-height: 1.5;
`;
export const SummaryMeta = styled.p`
  position: relative;
  z-index: 1;
  margin: 9px 0 26px;
  color: #d5e1d5;
  font-size: 12px;
  line-height: 1.75;
`;
export const SummaryLink = styled(Link)`
  position: relative;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.6);
  padding-bottom: 5px;
  text-decoration: none;
  color: #ffffff;
  font-size: 12px;
  transition: gap 0.2s ease;
  &:hover {
    gap: 15px;
  }
  &:focus-visible {
    outline: 2px solid ${gold};
    outline-offset: 4px;
  }
`;
export const SectionHeading = styled.div`
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 20px;
  padding-bottom: 20px;
  margin-bottom: 20px;
  border-bottom: 1px solid ${line};
  @media (max-width: 560px) {
    align-items: flex-start;
    flex-direction: column;
  }
`;
export const SmallLabel = styled.p`
  margin: 0 0 8px;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.14em;
  color: ${gold};
`;
export const Heading = styled.h2`
  margin: 0;
  font-size: clamp(22px, 3vw, 27px);
  font-weight: 600;
  letter-spacing: -0.045em;
`;
export const BodyText = styled.p`
  margin: 9px 0 0;
  color: ${muted};
  font-size: 12px;
  line-height: 1.85;
`;
export const PrimaryLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  min-height: 42px;
  padding: 10px 17px;
  border: 1px solid ${forest};
  border-radius: 5px;
  background: ${forest};
  text-decoration: none;
  white-space: nowrap;
  color: #fff;
  font-size: 12px;
  font-weight: 500;
  transition:
    background 0.2s ease,
    color 0.2s ease,
    transform 0.2s ease;
  &:hover {
    background: #41624d;
    transform: translateY(-2px);
  }
  &:focus-visible {
    outline: 2px solid ${gold};
    outline-offset: 3px;
  }
`;
export const PlainButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 38px;
  padding: 9px 13px;
  border: 1px solid #d6e0d5;
  border-radius: 6px;
  background: #fff;
  color: ${forest};
  font: 500 12px ${sans};
  cursor: pointer;
  transition:
    border-color 0.2s ease,
    background 0.2s ease;
  &:hover {
    border-color: ${forest};
    background: #f6f8f3;
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  &:focus-visible {
    outline: 2px solid ${gold};
    outline-offset: 3px;
  }
`;
export const PersonalPanel = styled.section`
  overflow: hidden;
  border: 1px solid ${line};
  border-radius: 12px;
  background: #fff;
`;
export const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
`;
export const InfoCell = styled.div`
  display: grid;
  grid-template-columns: minmax(90px, 148px) minmax(0, 1fr);
  align-items: center;
  gap: 14px;
  min-height: 59px;
  padding: 14px clamp(20px, 3vw, 30px);
  &:not(:last-child) {
    border-bottom: 1px solid #eef0e9;
  }
  @media (max-width: 530px) {
    grid-template-columns: 100px minmax(0, 1fr);
    gap: 10px;
    padding: 15px 17px;
  }
`;
export const InfoLabel = styled.p`
  margin: 0;
  color: #8c988b;
  font-size: 12px;
`;
export const InfoValue = styled.p`
  margin: 0;
  color: ${forest};
  font-size: 13px;
  font-weight: 500;
  line-height: 1.65;
  overflow-wrap: anywhere;
`;
export const Cards = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 15px;
  margin-top: 22px;
  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }
`;
export const CardLink = styled(Link)`
  display: flex;
  flex-direction: column;
  min-height: 157px;
  padding: 25px;
  border: 1px solid ${line};
  border-radius: 12px;
  background: #fff;
  color: ${forest};
  text-decoration: none;
  transition:
    transform 0.25s ease,
    border-color 0.25s ease,
    box-shadow 0.25s ease;
  &:hover {
    border-color: #b2c9b3;
    transform: translateY(-4px);
    box-shadow: 0 12px 26px rgba(20, 54, 37, 0.07);
  }
  &:focus-visible {
    outline: 2px solid ${gold};
    outline-offset: 3px;
  }
`;
export const CardNumber = styled.span`
  flex: 1;
  color: #8eaa91;
  font: italic 27px ${serif};
`;
export const CardTitle = styled.strong`
  display: block;
  margin-top: 6px;
  font-size: 16px;
  font-weight: 600;
`;
export const CardDescription = styled.span`
  display: block;
  margin-top: 8px;
  font-size: 12px;
  line-height: 1.7;
  color: ${muted};
`;
export const EmptyPanel = styled.div`
  padding: clamp(48px, 8vw, 74px) 18px;
  background: #fff;
  border: 1px solid ${line};
  border-radius: 12px;
  text-align: center;
`;
export const EmptyMark = styled.span`
  display: block;
  margin-bottom: 12px;
  font: italic 44px ${serif};
  color: ${gold};
`;
export const EmptyHeading = styled.h3`
  margin: 0;
  font-size: 17px;
  font-weight: 600;
`;
export const EmptyDescription = styled.p`
  margin: 13px 0 25px;
  color: ${muted};
  font-size: 12px;
  line-height: 1.85;
  white-space: pre-line;
`;
export const ButtonRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 9px;
`;
export const FilterRow = styled.div`
  display: flex;
  gap: 7px;
  flex-wrap: wrap;
  margin-bottom: 23px;
`;
export const FilterButton = styled.button<{ $active: boolean }>`
  padding: 9px 15px;
  border: 1px solid ${({ $active }) => ($active ? forest : "#DDE5DA")};
  border-radius: 999px;
  background: ${({ $active }) => ($active ? forest : "#FFFFFF")};
  color: ${({ $active }) => ($active ? "#FFFFFF" : forest)};
  font: 500 12px ${sans};
  cursor: pointer;
  transition:
    background 0.2s ease,
    border-color 0.2s ease;
  &:hover {
    border-color: ${forest};
  }
  &:focus-visible {
    outline: 2px solid ${gold};
    outline-offset: 3px;
  }
`;
export const ItemList = styled.div`
  display: grid;
  gap: 13px;
`;
export const ItemCard = styled.article`
  padding: clamp(22px, 3vw, 30px);
  border: 1px solid ${line};
  border-radius: 12px;
  background: #fff;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
  &:hover {
    border-color: #c6d6c6;
    box-shadow: 0 8px 26px rgba(27, 77, 62, 0.045);
  }
`;
export const ItemTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  margin-bottom: 16px;
`;
export const ItemIndex = styled.span`
  color: #8a9b8a;
  font-size: 10px;
  letter-spacing: 0.09em;
  overflow-wrap: anywhere;
`;
export const Status = styled.span<{ $done?: boolean }>`
  flex: 0 0 auto;
  padding: 6px 11px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
  background: ${({ $done }) => ($done ? "#F0F1ED" : "#EDF4EA")};
  color: ${({ $done }) => ($done ? "#818D81" : "#476C50")};
  border: 1px solid ${({ $done }) => ($done ? "#E1E5DE" : "#D5E4D4")};
`;
export const ItemTitle = styled.h3`
  margin: 0 0 15px;
  color: ${forest};
  font-size: 18px;
  font-weight: 600;
  line-height: 1.5;
  overflow-wrap: anywhere;
`;
export const ItemMeta = styled.p`
  display: flex;
  gap: 8px 23px;
  flex-wrap: wrap;
  margin: 0;
  color: ${muted};
  font-size: 12px;
  line-height: 1.8;
`;
export const Toggle = styled.button`
  display: block;
  width: 100%;
  margin-top: 21px;
  padding: 15px 0 0;
  border: 0;
  border-top: 1px solid #e5ebe2;
  background: transparent;
  color: ${forest};
  text-align: left;
  font: 600 12px ${sans};
  cursor: pointer;
  &:focus-visible {
    outline: 2px solid ${gold};
    outline-offset: 3px;
  }
`;
export const Detail = styled.div`
  margin-top: 16px;
  padding: 10px 0 10px 17px;
  border-left: 2px solid #bacbba;
  color: #5b7061;
  font-size: 12px;
  line-height: 1.9;
  overflow-wrap: anywhere;
  white-space: pre-wrap;
`;
export const Reply = styled.div`
  margin-top: 16px;
  padding: 19px 20px;
  border: 1px solid #e1e8d9;
  border-radius: 8px;
  background: #f7f8f3;
  color: #54675a;
  font-size: 12px;
  line-height: 1.85;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  b {
    display: block;
    margin-bottom: 8px;
    color: ${forest};
  }
`;
export const Search = styled.input`
  width: min(100%, 290px);
  min-height: 43px;
  padding: 10px 14px;
  border: 1px solid #dde5da;
  border-radius: 7px;
  outline: 0;
  background: #fff;
  color: ${forest};
  font: 12px ${sans};
  &::placeholder {
    color: #a3afa3;
  }
  &:focus {
    border-color: #6b9270;
    box-shadow: 0 0 0 3px rgba(50, 90, 57, 0.08);
  }
`;
export const SearchRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 19px;
`;
export const Notice = styled.p`
  margin: 18px 0 0;
  color: ${muted};
  font-size: 11px;
  line-height: 1.85;
`;
export const DemoMessage = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 22px;
  padding: 13px 16px;
  border: 1px solid #e9dec9;
  border-radius: 8px;
  background: #f8f3e8;
  color: #796748;
  font-size: 12px;
  line-height: 1.75;
  @media (max-width: 560px) {
    flex-wrap: wrap;
  }
`;
