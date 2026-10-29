import React, { createContext, useContext, useState } from "react";
import * as S from './Accordion.style';
import { FiChevronDown } from "react-icons/fi";

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

export function Item({ id, children }: ItemProps) {
    const { openId } = useAccordionContext();
    const isOpen = openId === id;
    
    return (
        <AccordionItemContext.Provider value={id}>
            <S.ItemContainer $isOpen={isOpen}>{children}</S.ItemContainer>
        </AccordionItemContext.Provider>
    );
}

interface TitleProps {
    children: React.ReactNode;
}

export function Title({ children }: TitleProps) {
    const id = useAccordionItemContext();
    const { openId, toggleItem } = useAccordionContext();
    const isOpen = openId === id;

    return (
        <S.AccordionHeader $isOpen={isOpen} onClick={() => toggleItem(id)}>
            <S.QuestionTitleWrapper>
                <S.QPrefix>Q.</S.QPrefix>
                <S.QuestionText>{children}</S.QuestionText>
            </S.QuestionTitleWrapper>
            <S.ToggleIcon $isOpen={isOpen}>
                {/* <FiChevronDown size={15} /> */}
                {isOpen? "-" : "+"}
            </S.ToggleIcon>
        </S.AccordionHeader>
    );
}

interface ContentProps {
    children: React.ReactNode;
}

export function Content({ children }: ContentProps) {
    const id = useAccordionItemContext();
    const { openId } = useAccordionContext();
    const isOpen = openId === id;

    return (
        <S.AccordionBody $isOpen={isOpen}>
            <S.AccordionBodyInner>
                <S.AnswerContent>
                    <S.APrefix>A.</S.APrefix>
                    <S.AnswerText>
                        {children}
                    </S.AnswerText>
                </S.AnswerContent>
            </S.AccordionBodyInner>
        </S.AccordionBody>
    );
}

Accordion.Item = Item;
Accordion.Title = Title;
Accordion.Content = Content;