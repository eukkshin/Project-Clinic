import * as S from './Feedback.style'

interface LoadingSpinnerProps{
    message?: string;
}

export default function LoadingState({
    message= '불러오는 중입니다...'
}: LoadingSpinnerProps){
    return(
        <S.LoadingContainer>
            <S.LoadingSpinner role='status' aria-label={message}>
                <span />
                <span />
                <span />
            </S.LoadingSpinner>
            <S.LoadingText> {message} </S.LoadingText>
        </S.LoadingContainer>
    )
}