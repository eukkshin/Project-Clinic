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
  background-color: #4e73df;
  ${LinearGradient};
  background-size: cover;
  height: 100vh;
  ${FlexCenter};
  padding: 1.4rem;
  width: 100%;
`;

export const Card = styled.div`
  background-color: #fff;
  border: none;
  border-radius: 0.35rem;
  width: 100%;
  max-width: 500px;
  padding: 3rem;
  ${BoxShadow};
`;

export const Header = styled.header`
  text-align: center;
  margin-bottom: 2rem;
`;

export const PwTitle = styled.h1`
  font-size: 1.5rem;

  color: #111;
  margin-bottom: 1.5rem;
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
      props.$isError ? "#ff4d4f" : props.$isSuccess ? "#27ae60" : "#d1d3e2"};
  color: #62707e;
  outline: none;

  ${TransitionAll};

  &:focus {
    ${(props) =>
      props.$isError ? "#ff4d4f" : props.$isSuccess ? "#27ae60" : "#bac8f3"};
    ${BoxShadow};
  }
  &:focus + label,
  &:not(:placeholder-shown) + label {
    top: -0.01rem;
    left: 1.5rem;
    font-size: 0.75rem;
    font-weight: 600;
    color: #4e73df;
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
  background-color: #4e73df;
  border: 1px solid #4e73df;
  color: #fff;
  ${TransitionAll}
  margin-top: 10px;

  &:hover {
    background-color: #2e59d9;
    border-color: #2653d4;
  }
`;

export const AuthButton = styled.button`
  ${ButtonBasic};
  background-color: #1cc88a;
  border: 1px solid #1cc88a;
  color: #fff;
  ${TransitionAll}
  margin-top: 10px;

  &:hover {
    background-color: #149b6d;
    border-color: #149b6d;
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
  color: #4e73df;
  text-decoration: none;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
    color: #224abe;
  }
`;
