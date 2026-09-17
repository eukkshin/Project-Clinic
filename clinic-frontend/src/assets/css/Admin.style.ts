import styled from "styled-components";

// 🎯 SB Admin 시그니처: 블루 그라데이션 전체 화면 배경
export const LoginWrapper = styled.div`
  background-color: #4e73df;
  background-image: linear-gradient(180deg, #4e73df 10%, #224abe 100%);
  background-size: cover;
  min-height: 100vh;
  display: flex;

  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
  }
`;

export const LeftSection = styled.div`
  flex: 0.7; /* 부모 너비의 정확히 절반을 차지 */
  background-image: linear-gradient(135deg, #1b4d3e 0%, #3b7a57 100%);
  display: flex;
  justify-content: center;
  align-items: center;
`;

// 3. 오른쪽 구역 (예: 로그인 폼)
export const RightSection = styled.div`
  flex: 1.3; /* 부모 너비의 정확히 절반을 차지 */
  background-color: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
`;

// 🎯 부드러운 그림자가 들어간 화이트 카드
export const LoginCard = styled.div`
  background-color: #fff;
  border: none;
  border-radius: 0.35rem;
  box-shadow: 0 4px 30px -4px rgba(59, 122, 87, 0.25);

  width: 100%;
  max-width: 450px;
  padding: 3rem;
`;

export const LoginHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

export const LoginTitle = styled.h1`
  font-family: "Times New Roman", serif;
  font-size: 34px;
  font-weight: 900;
  color: #f4fbf7;
  text-shadow: 0 1px 2px rgba(255, 255, 255, 0.1);
  margin: 0;
`;

export const LoginDescription = styled.p`
  font-size: 16px;
  color: #a3c6b8;
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
  border: 1px solid #d3d8d2;
  border-radius: 10rem;
  outline: none;
  background-color: #fff;
  transition: all 0.15s ease-in-out;

  &:focus {
    border-color: #246652;
    box-shadow: 0 0 0 0.2rem rgba(59, 122, 87, 0.25);
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
    color: #1b4d3e;
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
  accent-color: #1b4d3e;
  cursor: pointer;
`;

export const CheckboxLabel = styled.label`
  font-size: 0.8rem;
  color: #1b4d3e;
  cursor: pointer;

  &:hover {
    color: #246652;
  }
`;

// 🎯 알약(Pill) 형태의 메인 블루 버튼
export const LoginButton = styled.button`
  width: 100%;
  padding: 0.75rem 1rem;
  font-size: 0.8rem;
  border-radius: 10rem;
  background-color: #1b4d3e;
  border: 1px solid #1b4d3e;
  color: #fff;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.15s ease-in-out;
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
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const StyledLink = styled.a`
  display: block;
  width: fit-content;
  margin: 0 auto;
  font-size: 0.8rem;
  color: #1b4d3e;
  text-decoration: none;

  cursor: pointer;

  &:hover {
    text-decoration: underline;
    color: #246652;
  }
`;
