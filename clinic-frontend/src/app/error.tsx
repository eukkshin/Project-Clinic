'use client';
import styled from "styled-components";
import { useEffect } from "react";
import { FiAlertTriangle, FiRefreshCcw } from "react-icons/fi";

interface ErrorProps{
    error: Error & { digest?: string}; //diget:서버 오류 식별자
    reset: ()=>{};
}

export default function Error({ error, reset }: ErrorProps){
    useEffect(()=>{
        console.log(error);
    } ,[error])

    return(
        <ErrorContainer>
          <ErrorIcon>
            <FiAlertTriangle/>
          </ErrorIcon>

          <ErrorTitle>문제가 발생했습니다</ErrorTitle>

          <ErrorDescription>
            페이지를 표시하는 중 오류가 발생했어요.
            <br />
            잠시 후 다시 시도해 주세요.
          </ErrorDescription>

          <RetryButton type="button" onClick={() => reset()}>
            <FiRefreshCcw />
            다시 시도
          </RetryButton>
        </ErrorContainer>
    )
}

const ErrorContainer = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;

  min-height: 70vh;
  padding: 40px 24px;

  background: #f1f5ef;
  color: #244f39;
  text-align: center;
`;

const ErrorIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  width: 64px;
  height: 64px;
  border-radius: 50%;

  color: #52765c;
  background: #e2ecdf;
  border: 1px solid #d3e1d0;

  svg {
    width: 28px;
    height: 28px;
  }
`;

const ErrorTitle = styled.h2`
  margin: 0;
  font-size: 22px;
  font-weight: 700;
  letter-spacing: -0.5px;
`;

const ErrorDescription = styled.p`
  margin: 0;
  color: #718074;
  font-size: 14px;
  line-height: 1.8;
`;

const RetryButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  min-height: 44px;
  padding: 0 22px;

  color: #fff;
  background: #244f39;
  border: 1px solid #244f39;
  border-radius: 10px;

  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: #173c2a;
  }

  &:focus-visible {
    outline: 3px solid #b7d1b5;
    outline-offset: 3px;
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;