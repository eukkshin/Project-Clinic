
'use client';

import { FiAlertTriangle, FiRefreshCcw } from 'react-icons/fi';
import * as S from './Feedback.style';

interface ErrorStateProps {
  message?: string;
  description?: string;
  onRetry?: () => void;
  isRetrying?: boolean;
}

export default function ErrorState({
  message = '데이터를 불러오지 못했습니다.',
  description = '일시적인 오류가 발생했어요. 잠시 후 다시 시도해 주세요.',
  onRetry,
  isRetrying = false,
}: ErrorStateProps) {
  return (
    <S.ErrorContainer>
      <S.ErrorIconWrapper>
        <FiAlertTriangle />
      </S.ErrorIconWrapper>

      <S.ErrorTitle>{message}</S.ErrorTitle>

      <S.ErrorDescription>
        {description}
      </S.ErrorDescription>

      {onRetry && (
        <S.RetryButton
          type="button"
          onClick={onRetry}
          disabled={isRetrying}
        >
          <FiRefreshCcw />
          {isRetrying ? '다시 불러오는 중...' : '다시 시도'}
        </S.RetryButton>
      )}
    </S.ErrorContainer>
  );
}
