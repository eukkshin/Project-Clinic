import styled from "styled-components";

import {
  BlueButtonTheme,
  BoxShadow,
  ButtonBasic,
  FlexBetween,
  FlexCenter,
  FlexColumn,
  LinearGradient,
  TextCenter,
  TextLeft,
  TextRight,
  TransitionAll,
} from "@/assets/css/Common.styles";

export const PwWrapper = styled.div`
  ${LinearGradient};
  background-image: url("/images/findetc/forest.jpg") !important;
  background-size: cover;
  height: 100vh;
  display: flex;
  width: 100%;
`;

export const LeftSection = styled.div`
  flex: 0.7; /* 부모 너비의 정확히 절반을 차지 */
  background-image: linear-gradient(
    135deg,
    rgba(27, 77, 62, 0.8) 0%,
    rgba(59, 122, 87, 0.8) 100%
  );
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  opacity: 0.8;
  display: flex;
  justify-content: center;
  align-items: center;
`;

// 3. 오른쪽 구역 (예: 로그인 폼)
export const RightSection = styled.div`
  flex: 1.3; /* 부모 너비의 정확히 절반을 차지 */
  background-color: rgba(27, 77, 62, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const Card = styled.div`
  background-color: rgba(255, 255, 255, 0.99);
  border: none;
  border-radius: 0.35rem;
  width: 100%;
  max-width: 500px;
  padding: 3rem;
  box-shadow: 0 4px 30px -4px rgba(59, 122, 87, 0.25);
`;

export const Header = styled.header`
  text-align: center;
  margin-bottom: 2rem;
`;

export const LeftTitle = styled.h1`
  font-family: "Times New Roman", serif;
  font-size: 34px;
  font-weight: 900;
  color: #f4fbf7;
  text-shadow: 0 1px 2px rgba(255, 255, 255, 0.1);
  margin: 0;
`;

export const PwTitle = styled.h1`
  font-size: 1.5rem;
  color: #1b4d3e;
  margin-bottom: 1.5rem;
`;

export const LeftDescription = styled.p`
  font-size: 16px;
  color: #a3c6b8;
  margin: 0;
`;

export const Description = styled.p`
  font-size: 0.875rem;
  color: #858796;
  margin-bottom: 0.5rem;
`;

export const Form = styled.form`
  ${FlexColumn};
  gap: 1.2rem;
`;

export const PwCol = styled.div`
  position: relative;
  flex: 1;

  label {
    position: absolute;
    left: 1.2rem;
    top: 50%;
    transform: translateY(-50%);
    background-color: #fff;
    padding: 0 6px;
    color: #6e707e;
    font-size: 0.85rem;
    font-weight: 400;
    font-family: Arial, Helvetica, sans-serif;
    font-style: normal;
    font-variant: normal;
    letter-spacing: normal;
    text-transform: none;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    letter-spacing: inherit;
    pointer-events: none;
    transition: all 0.2s ease-in-out;
    z-index: 1;
  }
`;

interface PwInputProps {
  $isError?: boolean;
  $isSuccess?: boolean;
}
export const PwInput = styled.input<PwInputProps>`
  width: 100%;
  padding: 1rem 1.5rem;
  font-size: 0.8rem;
  border-radius: 10rem;
  border: 1px solid
    ${(props) =>
      props.$isError ? "#ff4d4f" : props.$isSuccess ? "#27ae60" : "#d3d8d2"};
  color: #62707e;
  outline: none;

  ${TransitionAll};

  &:focus {
    border-color: ${(props) =>
      props.$isError ? "#ff4d4f" : props.$isSuccess ? "#27ae60" : "#246652"};
    box-shadow: 0 0 0 0.2rem rgba(59, 122, 87, 0.25);
  }
  &:focus + label,
  &:not(:placeholder-shown) + label {
    top: -0.01rem;
    left: 1.5rem;
    font-size: 0.75rem;
    font-weight: 600;
    color: #1b4d3e;
  }

  &:not(:focus):not(:placeholder-shown) + label {
    color: #6e707e;
  }
`;

export const PwMessage = styled.p<PwInputProps>`
  position: absolute;
  font-size: 0.8rem;
  color: ${(props) =>
    props.$isError ? "#ff4d4f" : props.$isSuccess ? "#27ae60" : "#d1d3e2"};
  margin-top: 0.15rem;
  ${TextLeft};
`;

export const PwButton = styled.button`
  ${ButtonBasic};
  background-color: #1b4d3e;
  border: 1px solid #1b4d3e;
  color: #fff;
  ${TransitionAll}
  margin-top: 10px;

  &:hover {
    background-color: #246652;
    border-color: #246652;
  }
`;

export const AuthButton = styled.button`
  ${ButtonBasic};
  background-color: #1b4d3e;
  border: 1px solid #1b4d3e;
  color: #fff;
  ${TransitionAll}
  margin-top: 10px;

  &:hover {
    background-color: #246652;
    border-color: #246652;
  }
`;

export const Divider = styled.hr`
  margin: 1.5rem 0;
  border: 0;
  border-top: 1px solid #e3e6f0;
`;

export const LinkGroup = styled.div`
  ${TextCenter};
  ${FlexColumn};
  gap: 0.5rem;
`;

export const StyledLink = styled.a`
  font-size: 0.8rem;
  color: #1b4d3e;
  text-decoration: none;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
    color: #246652;
  }
`;
