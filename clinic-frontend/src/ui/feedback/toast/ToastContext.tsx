'use client';

import { useToast } from "./useToast";
import Toast from "./Toast";
import React, { useCallback, useContext, createContext } from "react";

interface ToastContextType{
    showToast: (message:string, type?:'success' | 'error' | 'info')=>void;
}

const ToastContext = createContext<ToastContextType|null>(null);

export const ToastProvider = ({children}:{children:React.ReactNode})=>{

    const { toast , showToast: showToastMessage} = useToast();

      // showToast 함수의 참조를 유지
      const showToast = useCallback((
        message:string,
        type: 'success' | 'error' | 'info' = 'success'
         )=>{
        showToastMessage(message, type);
      },[showToastMessage])
    
    return(
        <ToastContext.Provider value={{showToast}}>
            {children}
            <Toast toast={toast}/>
        </ToastContext.Provider>
    )
}

export const useToastContext = ()=>{
    const context = useContext(ToastContext);

    if(!context){
        throw new Error('useAppToast는 ToastProvider 안에서 사용해야 합니다.');
    }
    return context;
}