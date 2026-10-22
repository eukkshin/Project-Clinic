import React, { createContext, useContext, useState } from "react";
import * as S from './Accordion.style'
import {  FiChevronDown } from "react-icons/fi";


interface AccordionProps {
    defaultOpenId?: string | null; // 처음에 열릴 id 지정
    children: React.ReactNode;
}

interface ContextProps {
    openId: string | null;
    toggleItem: (id: string) => void;
}

const AccordionContext = createContext<ContextProps | null>(null);

export const useAccordionContext = () => {
    const ctx = useContext(AccordionContext);
    if (!ctx) {
        throw new Error('아코디언 컴포넌트 안에서 사용되어야 합니다.');
    }
    return ctx;
};

export const Accordion = ({ defaultOpenId = null, children }: AccordionProps) => {
    const [openId, setOpenId] = useState<string | null>(defaultOpenId);

    const toggleItem = (id: string) => {
        setOpenId(prev => (prev === id ? null : id));
    };

    const ctxValue = {
        openId,
        toggleItem,
    };

    return (
        <AccordionContext.Provider value={ctxValue}>
            <S.AccordionContainer>{children}</S.AccordionContainer>
        </AccordionContext.Provider>
    );
};

interface ItemProps {
    id: string;
    children: React.ReactNode;
}

const AccordionItemContext = createContext<string | null>(null);

export const useAccordionItemContext = () => {
    const id = useContext(AccordionItemContext);
    if (!id) throw new Error('아코디언 Item 안에서 사용되어야 합니다.');
    return id;
};

// 아이템 = props로 id 받음
export function Item({ id, children }: ItemProps) {
    return (
        <AccordionItemContext.Provider value={id}>
            <S.ItemContainer>{children}</S.ItemContainer>
        </AccordionItemContext.Provider>
    );
}

interface TitleProps {
    children: React.ReactNode;
}

// 제목
export function Title({ children }: TitleProps) {
    const id = useAccordionItemContext();
    const { openId, toggleItem } = useAccordionContext();
    const isOpen = openId === id;

    return (
        <S.Header $isOpen={isOpen} onClick={() => toggleItem(id)}>
            <S.QuestionText>
                <span className="q-mark">Q.</span> <span>{children}</span>
            </S.QuestionText>
            <S.ArrowIcon $isOpen={isOpen}><FiChevronDown size={15}/></S.ArrowIcon>
        </S.Header>
    );
}

// 내용
interface ContentProps {
    children: React.ReactNode;
}

export function Content({ children }: ContentProps) {
    const id = useAccordionItemContext();
    const { openId } = useAccordionContext();
    const isOpen = openId === id;

    if (!isOpen) return null;

    return (
        <S.Body>
            <S.AnswerText>
                <span className="a-mark">A.</span>
                <span>{children}</span>
            </S.AnswerText>
        </S.Body>
    )
}

Accordion.Item = Item;
Accordion.Title = Title;
Accordion.Content = Content;


