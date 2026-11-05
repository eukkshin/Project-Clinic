import styled from "styled-components";

export const Page = styled.div`
  max-width: 1050px;
  margin: 0 auto;
  padding-bottom: 48px;
  color: #254333;
`;
export const Eyebrow = styled.p`
  margin: 0 0 9px;
  color: #648269;
  letter-spacing: 0.17em;
  font-size: 10px;
  font-weight: 750;
`;
export const Title = styled.h1`
  margin: 0;
  font-size: clamp(25px, 3vw, 34px);
  letter-spacing: -0.055em;
  font-weight: 750;
`;
export const Intro = styled.p`
  margin: 11px 0 26px;
  color: #7a8b7e;
  font-size: 13px;
  line-height: 1.75;
`;
export const Grid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1.4fr) minmax(260px, 1fr);
  gap: 20px;
  align-items: start;
  @media (max-width: 990px) {
    grid-template-columns: 1fr;
  }
`;
export const Column = styled.div`
  display: grid;
  gap: 20px;
  min-width: 0;
`;
export const Card = styled.section`
  border: 1px solid #e3eae1;
  border-radius: 17px;
  overflow: hidden;
  background: #fff;
  box-shadow: 0 8px 26px rgba(36, 70, 43, 0.035);
`;
export const CardHead = styled.div`
  display: flex;
  align-items: start;
  gap: 12px;
  padding: 24px 24px 17px;
  border-bottom: 1px solid #eef1ed;
  > svg {
    flex-shrink: 0;
    color: #37644a;
    margin-top: 3px;
  }
  h2 {
    margin: 0;
    font-size: 16px;
    letter-spacing: -0.025em;
  }
  p {
    margin: 6px 0 0;
    font-size: 11px;
    line-height: 1.55;
    color: #849589;
  }
  @media (max-width: 680px) {
    padding: 19px 18px 15px;
  }
`;
export const Body = styled.div`
  padding: 6px 24px 24px;
  @media (max-width: 680px) {
    padding: 6px 18px 19px;
  }
`;
export const SettingRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 14px;
  padding: 17px 0;
  border-bottom: 1px solid #f0f2ed;
  &:last-child {
    border-bottom: 0;
  }
`;
export const RowText = styled.div`
  min-width: 0;
  strong {
    display: block;
    font-size: 13px;
    font-weight: 700;
  }
  small {
    display: block;
    margin-top: 5px;
    color: #8c9b90;
    font-size: 11px;
    line-height: 1.6;
  }
`;
export const Toggle = styled.button<{ $on: boolean }>`
  position: relative;
  flex: 0 0 46px;
  width: 46px;
  height: 27px;
  border: none;
  border-radius: 22px;
  background: ${({ $on }) => ($on ? "#266449" : "#d2dad0")};
  cursor: pointer;
  transition: background 0.16s ease;
  &::after {
    content: "";
    position: absolute;
    top: 4px;
    left: 4px;
    width: 19px;
    height: 19px;
    border-radius: 50%;
    background: white;
    transform: translateX(${({ $on }) => ($on ? "19px" : "0")});
    transition: transform 0.16s ease;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.17);
  }
  &:focus-visible {
    outline: 3px solid #a6d3b7;
    outline-offset: 2px;
  }
  @media (prefers-reduced-motion: reduce) {
    transition: none;
    &::after {
      transition: none;
    }
  }
`;
export const Range = styled.input`
  width: 145px;
  max-width: 48%;
  accent-color: #2a674b;
  cursor: pointer;
`;
export const Select = styled.select`
  padding: 9px 11px;
  max-width: min(100%, 200px);
  border: 1px solid #d8e2d8;
  border-radius: 9px;
  background: #fff;
  color: #345242;
  font-size: 12px;
  font-family: inherit;
`;
export const TimeInput = styled.input`
  padding: 8px 9px;
  max-width: 124px;
  border: 1px solid #d8e2d8;
  border-radius: 9px;
  color: #345242;
  background: #fff;
  font-size: 12px;
`;
export const TimeGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  margin-top: 12px;
  label {
    display: grid;
    gap: 7px;
    color: #778979;
    font-size: 11px;
  }
`;
export const Action = styled.button`
  padding: 10px 14px;
  border: 1px solid #bfd2c1;
  border-radius: 9px;
  background: #f6faf5;
  color: #2d6044;
  cursor: pointer;
  font-size: 12px;
  font-weight: 700;
  &:hover {
    background: #eaf4ea;
  }
  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
`;
export const Notice = styled.p`
  margin: 10px 0 0;
  color: #657e6c;
  font-size: 11px;
  line-height: 1.65;
`;
export const Links = styled.div`
  display: grid;
  padding: 9px 23px 20px;
  a {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
    padding: 14px 2px;
    border-bottom: 1px solid #f0f2ed;
    text-decoration: none;
    font-size: 12px;
    font-weight: 670;
    color: #345843;
  }
  a:hover {
    color: #17804f;
  }
  a:last-child {
    border-bottom: 0;
  }
`;
