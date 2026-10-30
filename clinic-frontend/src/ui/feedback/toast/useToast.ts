
import { useState, useEffect,useCallback } from "react";

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage{
    message: string;
    type: ToastType;
}

export const useToast = ()=>{
    const [toast, setToast] = useState<ToastMessage |null>(null);

     const showToast = useCallback((message: string, type: ToastType = 'success') => {

        setToast({ message, type });

    },[]);
    
    useEffect(()=>{
        if(!toast) return;

        const timer = setTimeout(()=>{
            setToast(null);
        },3000)

        return ()=> clearTimeout(timer);
    },[toast])

    return { toast, showToast }
}