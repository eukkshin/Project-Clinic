import Link from "next/link";
import styled, { css, keyframes } from "styled-components";

import * as A from "@/styles/auth/Auth.styles";

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;
const fadeOut = keyframes`
  from { opacity: 1; }
  to { opacity: 0; }
`;
const slideUp = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
`;
const slideDown = keyframes`
  from { opacity: 1; transform: translateY(0); }
  to { opacity: 0; transform: translateY(8px); }
`;

export const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 100200;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: clamp(12px, 2.7vw, 30px);
  overflow-y: auto;
  background: rgba(18, 24, 20, 0.63);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  animation: ${fadeIn} 210ms ease both;

  &[data-closing="true"] {
    animation: ${fadeOut} 220ms ease both;
  }
  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

export const Dialog = styled.section`
  position: relative;
  flex-shrink: 0;
  width: min(100%, 970px);
  max-height: calc(100dvh - 30px);
  overflow-x: clip;
  overflow-y: auto;
  border: 1px solid rgba(255, 255, 255, 0.83);
  border-radius: 22px;
  background: #faf6ef;
  box-shadow: 0 35px 120px rgba(9, 19, 13, 0.36);
  animation: ${slideUp} 360ms cubic-bezier(0.16, 1, 0.3, 1) both;
  &[data-closing="true"] {
    animation: ${slideDown} 220ms ease both;
  }
  &:focus {
    outline: none;
  }
  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
  @media (max-width: 700px) {
    border-radius: 18px;
  }
`;

export const SplitLayout = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 41%) minmax(0, 59%);
  width: 100%;
  min-height: min(620px, calc(100dvh - 40px));
  color: #254331;
  box-sizing: border-box;

  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  @media (max-width: 700px) {
    display: block;
    min-height: auto;
  }
`;

export const VisualPanel = styled.div`
  position: relative;
  min-width: 0;
  min-height: 100%;
  overflow: hidden;
  isolation: isolate;
  background: #c9bba9;

  &::after {
    content: "";
    position: absolute;
    inset: 50% 0 0;
    z-index: 1;
    background: linear-gradient(0deg, rgba(43, 39, 32, 0.42), transparent 80%);
    pointer-events: none;
  }
  @media (max-width: 700px) {
    display: none;
  }
`;

export const VisualImage = styled.div`
  position: absolute;
  inset: 0;
  img {
    object-fit: cover;
    object-position: center 48%;
    transform: scale(1.035);
  }
`;

export const VisualCaption = styled.div`
  position: absolute;
  z-index: 2;
  left: clamp(26px, 3.7vw, 50px);
  bottom: clamp(30px, 4vw, 52px);
  color: #fffaf0;
  text-shadow: 0 1px 12px rgba(36, 35, 24, 0.26);
  p {
    margin: 0;
    font-family: var(--font-cormorant), Georgia, serif;
    font-style: italic;
    font-size: clamp(24px, 2.6vw, 34px);
    line-height: 1.15;
    letter-spacing: -0.025em;
  }
  &::before {
    content: "";
    display: block;
    width: 42px;
    height: 1px;
    background: currentColor;
    margin-bottom: 18px;
    opacity: 0.8;
  }
`;

export const FormPanel = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
  min-height: 100%;
  padding: clamp(28px, 3.6vw, 52px) clamp(28px, 4.15vw, 58px);
  background: linear-gradient(125deg, #fffdfa 0%, #faf6ef 65%, #f8f3ea 100%);

  @media (max-width: 700px) {
    padding: clamp(23px, 6vw, 40px);
    min-height: 510px;
  }
`;

export const PanelHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 18px;
`;

export const BrandLink = styled(Link)`
  display: inline-flex;
  flex-direction: column;
  align-items: flex-start;
  color: #193e2c;
  text-decoration: none;
  font-family: var(--font-cormorant), Georgia, serif;
  font-size: clamp(34px, 3vw, 42px);
  line-height: 0.82;
  letter-spacing: 0.05em;
  &:hover {
    color: #24583c;
  }
  span {
    margin-top: 11px;
    font-family: var(--ahns-body), sans-serif;
    font-size: 9px;
    font-weight: 500;
    letter-spacing: 0.35em;
  }
`;

export const HeaderTools = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: flex-end;
  gap: 9px;
  color: #2d3d32;
  flex-shrink: 0;
`;

const closeStyle = css`
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  padding: 0;
  color: #233b2a;
  border: 0;
  background: transparent;
  border-radius: 50%;
  text-decoration: none;
  cursor: pointer;
  font-size: 29px;
  line-height: 1;
  font-weight: 300;

  transition:
    background 160ms ease,
    color 160ms ease,
    transform 0.3s ease-out;

  &:hover {
    background: rgba(38, 67, 46, 0.09);
    transform: rotate(90deg);
  }
  &:focus-visible {
    outline: 2px solid #426b4c;
    outline-offset: 2px;
  }
`;
export const Close = styled.button`
  ${closeStyle}
`;
export const CloseLink = styled(Link)`
  ${closeStyle}
`;

export const FormBody = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;
  padding: 30px 0 7px;
  min-width: 0;
`;

export const Heading = styled.h2`
  margin: 0;
  color: #123b27;
  font-family: var(--ahns-body), sans-serif;
  font-size: clamp(30px, 3.2vw, 42px);
  font-weight: 550;
  letter-spacing: -0.06em;
  line-height: 1.22;
  overflow-wrap: anywhere;
`;

export const Lead = styled.p`
  color: #645f55;
  margin: 15px 0 28px;
  font-size: clamp(13px, 1.15vw, 15px);
  line-height: 1.7;
  word-break: keep-all;
`;

export const LoginFormScope = styled.div`
  ${A.Form} {
    gap: 14px;
  }
  ${A.Field} {
    gap: 0;
    position: relative;
  }
  ${A.Label} {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
  ${A.TextInput}, ${A.InputWithButton} {
    height: 56px;
    background: transparent;
    border: 1px solid rgba(84, 89, 76, 0.22);
    border-radius: 9px;
    padding-left: 19px;
    font-size: 14px;
    &::placeholder {
      color: #85837d;
    }
    &:focus {
      background: rgba(255, 255, 255, 0.83);
      border-color: #698870;
    }
  }
  ${A.FormLinks} {
    justify-content: flex-end;
    margin: 0 0 3px;
  }
  ${A.TextLink} {
    color: #31523e;
    font-size: 13px;
  }
  ${A.Button} {
    margin-top: 7px;
    min-height: 57px;
    border-radius: 9px;
    font-size: 15px;
    background: #143d28;
    border-color: #143d28;
    &:hover:not(:disabled) {
      background: #24543a;
    }
  }
  ${A.FormFooter} {
    margin-top: 26px;
    padding-top: 24px;
    border-color: #e5ded4;
    color: #676258;
    font-size: 13px;
  }
  @media (max-width: 700px) {
    ${A.TextInput}, ${A.InputWithButton} {
      height: 52px;
    }
    ${A.Button} {
      min-height: 53px;
    }
  }
`;

export const PageShell = styled.main`
  min-height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: clamp(16px, 4vw, 54px);
  background:
    radial-gradient(ellipse at 10% 20%, #d8d0c0 0%, transparent 49%),
    radial-gradient(ellipse at 85% 83%, #a3aea0 0%, transparent 45%), #e8e5dc;
  box-sizing: border-box;
`;

export const PageCard = styled.div`
  width: min(100%, 1020px);
  border-radius: 22px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.87);
  box-shadow: 0 30px 105px rgba(29, 40, 29, 0.19);
  background: #faf6ef;
  @media (max-width: 700px) {
    border-radius: 18px;
  }
`;
