import styled from "styled-components";

// 🎯 SB Admin 시그니처: 블루 그라데이션 전체 화면 배경
export const LoginWrapper = styled.div`
  background-color: #4e73df;
  background-image: linear-gradient(180deg, #4e73df 10%, #224abe 100%);
  background-size: cover;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

// 🎯 부드러운 그림자가 들어간 화이트 카드
export const LoginCard = styled.div`
  background-color: #fff;
  border: none;
  border-radius: 0.35rem;
  box-shadow: 0 0.15rem 1.75rem 0 rgba(58, 59, 69, 0.15);
  width: 100%;
  max-width: 450px;
  padding: 3rem;
`;

export const LoginHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

export const LoginTitle = styled.h1`
  font-size: 1.5rem;
  font-weight: 400;
  color: #3a3b45;
  margin: 0;
`;

export const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const LoginCol = styled.div`
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

// 🎯 SB Admin 시그니처: 알약(Pill) 형태의 둥근 입력창
export const LoginInput = styled.input`
  width: 100%;
  padding: 0.8rem 1.2rem;
  border: 1px solid #d1d3e2;
  border-radius: 10rem;
  outline: none;
  background-color: #fff;
  transition: all 0.15s ease-in-out;

  &:focus {
    border-color: #bac8f3;
    box-shadow: 0 0 0 0.2rem rgba(78, 115, 223, 0.25);
  }

  &[readonly] {
    background-color: #eaecf4;
    cursor: default;
    user-select: none;
    &:focus {
      box-shadow: none;
    }
  }

  &:focus + label,
  &:not(:placeholder-shown) + label {
    top: -0.11rem;
    left: 1.5rem;
    font-size: 0.75rem;
    font-weight: 600;
    color: #4e73df;
  }

  &:not(:focus):not(:placeholder-shown) + label {
    color: #6e707e;
  }
`;

export const CheckboxGroup = styled.div`
  display: flex;
  align-items: center;
  padding-left: 0.5rem;
`;

export const CheckboxInput = styled.input`
  margin-right: 0.5rem;
  cursor: pointer;
`;

export const CheckboxLabel = styled.label`
  font-size: 0.8rem;
  color: #858796;
  cursor: pointer;
`;

// 🎯 알약(Pill) 형태의 메인 블루 버튼
export const LoginButton = styled.button`
  width: 100%;
  padding: 0.75rem 1rem;
  font-size: 0.8rem;
  border-radius: 10rem;
  background-color: #4e73df;
  border: 1px solid #4e73df;
  color: #fff;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.15s ease-in-out;
  margin-top: 10px;

  &:hover {
    background-color: #2e59d9;
    border-color: #2653d4;
  }
`;

export const Divider = styled.hr`
  margin: 1.5rem 0;
  border: 0;
  border-top: 1px solid #e3e6f0;
`;

export const LinkGroup = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
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
