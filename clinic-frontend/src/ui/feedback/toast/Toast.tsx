
import type { ToastMessage } from "./useToast";

import * as S from './Toast.style'
import { FaCircleCheck, FaCircleExclamation, FaCircleInfo } from "react-icons/fa6";

interface ToastProps{
    toast: ToastMessage | null;
}

export default function Toast ({toast}:ToastProps){

    if(!toast) return null;

    const icon = {
        success: (
           <S.CheckSvg viewBox="0 0 56 56">
            <circle
                cx="28"
                cy="28"
                r="24"
                fill="none"
                stroke="#173c2a"
                strokeWidth="3"
            />
            <path
                d="M16 28.5l8 8 16-17"
                fill="none"
                stroke="#173c2a"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            </S.CheckSvg>
        ),
        error: <FaCircleExclamation />,
        info: <FaCircleInfo />,
        };

    return(
        <S.ToastContainer $type={toast.type}>   
          <S.ToastIcon>
              {icon[toast.type]}
          </S.ToastIcon>

          <S.ToastMessageText>
              {toast.message}
          </S.ToastMessageText>
      
        </S.ToastContainer>
    )
}
