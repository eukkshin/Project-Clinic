
import type { ToastMessage } from "./useToast";

import * as S from './Toast.style'
import { FaCircleCheck, FaCircleExclamation, FaCircleInfo } from "react-icons/fa6";

interface ToastProps{
    toast: ToastMessage | null;
}

export default function Toast ({toast}:ToastProps){

    if(!toast) return null;

    const icon = {
        success: <FaCircleCheck/>,
        error: <FaCircleExclamation/>,
        info: <FaCircleInfo/>
    }

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
