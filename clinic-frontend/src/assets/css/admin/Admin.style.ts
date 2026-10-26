"use client";
import styled from "styled-components";

export const LoginWrapper = styled.div`
  min-height: 100dvh;
  display: grid;
  grid-template-columns: minmax(380px, 0.93fr) minmax(470px, 1.07fr);
  background: #f7f8f4;
  font-family: var(--ahns-body);
  @media (max-width: 850px) {
    grid-template-columns: 1fr;
  }
`;
export const LeftSection = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 80px clamp(30px, 7vw, 110px);
  min-height: 100dvh;
  background:
    radial-gradient(
      ellipse at 98% 0,
      rgba(161, 190, 153, 0.21),
      transparent 40%
    ),
    radial-gradient(
      ellipse at 0% 100%,
      rgba(111, 154, 113, 0.19),
      transparent 48%
    ),
    linear-gradient(145deg, #1b3c2e, #102b20);
  color: #f7f7ef;
  overflow: hidden;
  &:after {
    content: "";
    position: absolute;
    inset: 23px;
    pointer-events: none;
    border: 1px solid rgba(230, 242, 225, 0.09);
    border-radius: 22px;
  }
  @media (max-width: 850px) {
    min-height: 230px;
    padding: 48px 30px;
  }
`;
export const RightSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 65px clamp(22px, 6vw, 92px);
  background: #f7f8f4;
  @media (max-width: 850px) {
    padding: 34px 18px 70px;
  }
`;
export const LoginCard = styled.div`
  width: 100%;
  max-width: 450px;
  padding: clamp(30px, 3.6vw, 48px);
  background: #fff;
  border: 1px solid #e1e9e0;
  border-radius: 19px;
  box-shadow: 0 18px 55px rgba(27, 65, 40, 0.065);
`;
export const LoginHeader = styled.div`
  text-align: left;
  margin-bottom: 34px;
  position: relative;
  z-index: 1;
`;
export const LeftTitle = styled.h1`
  margin: 0 0 26px;
  font-family: var(--ahns-display);
  font-size: clamp(54px, 6.2vw, 88px);
  font-weight: 500;
  letter-spacing: -0.055em;
  line-height: 1.05;
  color: #f7f7ef;
`;
export const LoginTitle = styled.h1`
  margin: 0 0 12px;
  color: #1f402e;
  font-size: clamp(26px, 2.4vw, 32px);
  letter-spacing: -0.055em;
  font-weight: 770;
`;
export const LoginDescription = styled.p`
  margin: 0;
  color: #e2eae0;
  font-size: 15px;
  line-height: 1.8;
  max-width: 420px;
  small {
    display: inline-block;
    margin-top: 12px;
    color: #a8c2ad;
    font-size: 12px;
    line-height: 1.9;
  }
`;
export const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 21px;
`;
export const LoginCol = styled.div`
  position: relative;
  display: flex;
  flex-direction: column-reverse;
  gap: 9px;
  label {
    color: #506451;
    font-size: 12px;
    font-weight: 710;
    letter-spacing: -0.025em;
  }
`;
export const LoginInput = styled.input`
  width: 100%;
  min-height: 48px;
  padding: 12px 15px;
  background: #fafcf9;
  border: 1px solid #d9e4d8;
  border-radius: 10px;
  font-size: 14px;
  color: #213f30;
  outline: none;
  transition:
    border-color 0.12s ease,
    box-shadow 0.12s ease;
  &:focus {
    border-color: #5d9070;
    box-shadow: 0 0 0 3px rgba(61, 127, 79, 0.105);
    background: #fff;
  }
  &::placeholder {
    color: #9cae9d;
  }
`;
export const CheckboxGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 9px;
`;
export const CheckboxInput = styled.input`
  width: 15px;
  height: 15px;
  accent-color: #2b6344;
`;
export const CheckboxLabel = styled.label`
  color: #657b69;
  font-size: 12px;
  cursor: pointer;
`;
export const LoginButton = styled.button`
  width: 100%;
  height: 50px;
  border-radius: 10px;
  background: #28553b;
  border: 1px solid #28553b;
  color: #fff;
  font-size: 13px;
  font-weight: 760;
  cursor: pointer;
  transition: background-color 0.12s ease;
  &:hover {
    background: #1c402d;
  }
`;
export const Divider = styled.hr`
  width: 100%;
  margin: 22px 0;
  border: 0;
  border-top: 1px solid rgba(170, 202, 172, 0.25);
`;
export const LinkGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: 18px;
`;
export const StyledLink = styled.a`
  color: #647d6b;
  font-size: 12px;
  text-decoration: none;
  cursor: pointer;
  &:hover {
    color: #235838;
    text-decoration: underline;
  }
`;

export * from "./Dash.styles";
export * from "../AdminCommon.styles";
export * from "./Tone.styles";
export * from "./NavSetting.styles";
export * from "./Consult.styles";
export * from "./Pop.styles";
export * from "./News.styles";
export * from "./Self.styles";
export * from "./Event.styles";
export * from "./Footer.styles";
export * from "./User.styles";
export * from "./Vlog.styles";
export * from "./Safety.styles";
export * from "./Board.styles";
export * from "../common/LayoutStyle";
