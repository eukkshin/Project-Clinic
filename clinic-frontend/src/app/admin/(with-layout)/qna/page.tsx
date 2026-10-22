"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
// 스타일 파일은 프로젝트 경로에 맞게 수정해 주세요 (예: QnA.style 또는 별도 style 파일)
import { FiSave, FiPlus, FiTrash2, FiArrowUp, FiArrowDown, FiEdit2 } from "react-icons/fi";
import * as S from './QnA.style'
interface QnAData {
    id: number;
    category: string;       
    categoryName: string;  
    question: string;
    answer: string;
}

export default function AdminQnA() {
    
    const [qnaList, setQnaList] = useState<QnAData[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>("all");

    const [isCustomCategory, setIsCustomCategory] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);

    const [newQnA, setNewQnA] = useState({
        category: "",
        categoryName: "",
        question: "",
        answer: "",
    });

    // 생명주기: 마운트 시 Q&A 목록 로드
    useEffect(() => {
        fetchQnAs();
    }, []);

    const fetchQnAs = async () => {
        try {
            const res = await axios.get('http://localhost:4000/api/admin/qnas');
            if (res.data.success) {
                const formatted = res.data.data.map((q: any) => ({
                    id: q.QNA_IDX,               
                    category: q.CATEGORY,         
                    categoryName: q.CATEGORY_NAME,
                    question: q.QUESTION,
                    answer: q.ANSWER,
                }));
                setQnaList(formatted);
            }
        } catch (err) {
            console.error("Q&A 목록 로드 실패:", err);
            alert('Q&A 목록을 불러오는 중 문제가 발생했습니다.');
        }
    };

     //reduce를 이용해 카테고리별 그룹화
    const groupedData = qnaList.reduce((acc:any, item:any)=>{
        const catName = item.categoryName;
        if(!acc[catName]){
            acc[catName] = [];
        }
        acc[catName].push({
            id : String(item.id),
            question: item.question,
            answer: item.answer,
        })
        return acc;
    },{})

    const categories = [...new Set(qnaList.map(item=>
        JSON.stringify({key:item.category, name:item.categoryName})
    ))].map(item=> JSON.parse(item))
  
    
    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const val = e.target.value;
        if (val === "ADD_NEW") {
                setIsCustomCategory(true);
                setNewQnA(prev => ({ ...prev, category: "", categoryName: "" }));
        } else {
            setIsCustomCategory(false);
            const found = categories.find(c => c.key === val);
            if (found) {
                setNewQnA(prev => ({ ...prev, category: found.key, categoryName: found.name }));
            }
        }
    };
   
    const handleSaveQnA = async () => {
        if (!newQnA.category || !newQnA.categoryName || !newQnA.question || !newQnA.answer) {
            alert('카테고리, 질문, 답변 내용을 모두 입력해주세요.');
            return;
        }
        try {
            if (editingId !== null) {
                const res = await axios.put(`http://localhost:4000/api/admin/qnas/${editingId}`, {
                    category: newQnA.category,
                    categoryName: newQnA.categoryName,
                    question: newQnA.question,
                    answer: newQnA.answer,
                });
                if (res.data.success) {
                    alert('Q&A가 수정되었습니다.');
                    setEditingId(null);
                }
            } else {
                const res = await axios.post('http://localhost:4000/api/admin/qnas', {
                    category: newQnA.category,
                    categoryNname: newQnA.categoryName,
                    question: newQnA.question,
                    answer: newQnA.answer,
                });
                if (res.data.success) {
                    alert('새 Q&A가 등록되었습니다.');
                }
            }
            setNewQnA({ category: categories[0]?.key || "", categoryName: categories[0]?.name || "", question: "", answer: "" });
            setIsCustomCategory(false);
            fetchQnAs();
        } catch (err) {
            console.error("Q&A 저장 실패:", err);
            alert('Q&A 저장 중 문제가 발생했습니다.');
        }
    };

    const handleEditClick = (item: QnAData) => {
        setEditingId(item.id);
        setNewQnA({
            category: item.category,
            categoryName: item.categoryName,
            question: item.question,
            answer: item.answer,
        });
        setIsCustomCategory(false);
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setNewQnA({
            category: categories[0]?.key || "",
            categoryName: categories[0]?.name || "",
            question: "",
            answer: "",
        });
        setIsCustomCategory(false);
    };

    const handleDelete = async (id: number) => {
        if (confirm("해당 Q&A 항목을 삭제하시겠습니까?")) {
            try {
                const res = await axios.delete(`http://localhost:4000/api/admin/qnas/${id}`);
                if (res.data.success) {
                    fetchQnAs();
                }
            } catch (err) {
                console.error("Q&A 삭제 실패:", err);
                alert( 'Q&A 삭제 중 문제가 발생했습니다.');
            }
        }
    };

    // 목록 내 순서 변경 (위/아래)
    const moveQnA = (index: number, direction: 'UP' | 'DOWN') => {
        const updatedList = [...qnaList];
        if (direction === 'UP' && index > 0) {
            [updatedList[index - 1], updatedList[index]] = [updatedList[index], updatedList[index - 1]];
        } else if (direction === 'DOWN' && index < updatedList.length - 1) {
            [updatedList[index + 1], updatedList[index]] = [updatedList[index], updatedList[index + 1]];
        }
        setQnaList(updatedList);
    };

    // 최종 순서 저장
    const handleSave = async () => {
        const orderedIds = qnaList.map(item => item.id);
        try {
            const res = await axios.put('http://localhost:4000/api/admin/qnas/order', { orderedIds });
            if (res.data.success) {
                alert( 'Q&A 순서 변경이 저장되었습니다.');
            }
        } catch (err) {
            console.error("Q&A 순서 저장 실패:", err);
            alert('순서 저장 중 문제가 발생했습니다.');
        }
    };

    // 화면에 보여줄 필터링된 목록
    const filteredList = selectedCategory === "all" 
        ? qnaList 
        : qnaList.filter(item => item.category === selectedCategory);

    return (
    <S.QnAContainer>
            <S.QnAPageHeader>
                <S.QnAPageTitle>Q&A 관리</S.QnAPageTitle>
                <S.QnASaveButton onClick={handleSave}>
                    <FiSave size={18} />
                    <span>순서 변경 저장하기</span>
                </S.QnASaveButton>
            </S.QnAPageHeader>

            <S.QnAGrid>
                {/* 1. 새 Q&A 등록 / 수정 폼 */}
                <S.QnALeftColumn>
                    <S.QnACard>
                        <S.QnACardHeader>
                            <S.QnACardTitle>{editingId !== null ? "Q&A 수정" : "새 Q&A 등록"}</S.QnACardTitle>
                        </S.QnACardHeader>
                        <S.QnACardBody>
                            <S.QnAFormGroup>
                                <S.QnALabel>카테고리 선택 / 추가</S.QnALabel>
                                {!isCustomCategory ? (
                                    <S.QnASelect
                                        value={newQnA.category}
                                        onChange={handleCategoryChange}
                                    >
                                        {categories.map((cat) => (
                                            <option key={cat.key} value={cat.key}>
                                                {cat.name} ({cat.key})
                                            </option>
                                        ))}
                                        <option value="ADD_NEW">+ 새 카테고리 추가하기</option>
                                    </S.QnASelect>
                                ) : (
                                    <S.QnACustomCategoryWrapper>
                                        <S.QnAInput
                                            type="text"
                                            placeholder="키워드 (예: pricing)"
                                            value={newQnA.category}
                                            onChange={(e) => setNewQnA({ ...newQnA, category: e.target.value })}
                                        />
                                        <S.QnAInput
                                            type="text"
                                            placeholder="이름 (예: 비용/가격)"
                                            value={newQnA.categoryName}
                                            onChange={(e) => setNewQnA({ ...newQnA, categoryName: e.target.value })}
                                        />
                                        <S.QnACancelButton onClick={() => setIsCustomCategory(false)}>
                                            취소
                                        </S.QnACancelButton>
                                    </S.QnACustomCategoryWrapper>
                                )}
                            </S.QnAFormGroup>

                            <S.QnAFormGroup>
                                <S.QnALabel>질문 (Question)</S.QnALabel>
                                <S.QnAInput
                                    type="text"
                                    placeholder="예: 비용은 어떻게 되나요?"
                                    value={newQnA.question}
                                    onChange={(e) => setNewQnA({ ...newQnA, question: e.target.value })}
                                />
                            </S.QnAFormGroup>

                            <S.QnAFormGroup>
                                <S.QnALabel>답변 (Answer)</S.QnALabel>
                                <S.QnATextarea
                                    placeholder="답변 내용을 입력하세요. (줄바꿈 가능)"
                                    value={newQnA.answer}
                                    onChange={(e) => setNewQnA({ ...newQnA, answer: e.target.value })}
                                />
                            </S.QnAFormGroup>

                            <S.QnAButtonWrapper>
                                <S.QnAAddButton onClick={handleSaveQnA}>
                                    <FiPlus size={18} /> {editingId !== null ? "Q&A 수정 완료" : "Q&A 등록하기"}
                                </S.QnAAddButton>
                                {editingId !== null && (
                                    <S.QnACancelButton onClick={handleCancelEdit}>
                                        수정 취소
                                    </S.QnACancelButton>
                                )}
                            </S.QnAButtonWrapper>
                        </S.QnACardBody>
                    </S.QnACard>
                </S.QnALeftColumn>

                {/* 2. 등록된 Q&A 목록 */}
                <S.QnARightColumn>
                    <S.QnACard>
                        <S.QnACardHeaderRow>
                            <S.QnACardTitle>등록된 Q&A 목록 (총 {filteredList.length}개)</S.QnACardTitle>
                            <S.QnATableHeaderSelect
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                            >
                                <option value="all">전체보기</option>
                                {categories.map(cat => (
                                    <option key={cat.key} value={cat.key}>{cat.name}</option>
                                ))}
                            </S.QnATableHeaderSelect>
                        </S.QnACardHeaderRow>

                        <S.QnATableWrapper>
                            <S.QnATable>
                                <thead>
                                    <tr>
                                        <th style={{ width: '15%' }}>순서</th>
                                        <th style={{ width: '20%' }}>카테고리</th>
                                        <th style={{ width: '50%' }}>질문 / 답변 요약</th>
                                        <th style={{ width: '15%' }}>관리</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredList.map((item, index) => (
                                        <tr key={item.id}>
                                            <td>
                                                <S.QnAActionGroup>
                                                    <S.QnAActionBtn onClick={() => moveQnA(index, 'UP')} disabled={index === 0}>
                                                        <FiArrowUp size={16} />
                                                    </S.QnAActionBtn>
                                                    <S.QnAActionBtn onClick={() => moveQnA(index, 'DOWN')} disabled={index === filteredList.length - 1}>
                                                        <FiArrowDown size={16} />
                                                    </S.QnAActionBtn>
                                                </S.QnAActionGroup>
                                            </td>
                                            <td>
                                                <S.QnACategoryBadge>
                                                    {item.categoryName}
                                                </S.QnACategoryBadge>
                                            </td>
                                            <td style={{ textAlign: 'left' }}>
                                                <S.QnACellQuestion>
                                                    {item.question}
                                                </S.QnACellQuestion>
                                                <S.QnACellSummary>
                                                    {item.answer}
                                                </S.QnACellSummary>
                                            </td>
                                            <td>
                                                <S.QnAActionGroup>
                                                    <S.QnAEditBtn onClick={() => handleEditClick(item)}>
                                                        <FiEdit2 size={16} />
                                                    </S.QnAEditBtn>
                                                    <S.QnADeleteBtn onClick={() => handleDelete(item.id)}>
                                                        <FiTrash2 size={16} />
                                                    </S.QnADeleteBtn>
                                                </S.QnAActionGroup>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredList.length === 0 && (
                                        <tr><td colSpan={4} style={{ padding: '3rem 0', textAlign: 'center' }}>등록된 Q&A가 없습니다.</td></tr>
                                    )}
                                </tbody>
                            </S.QnATable>
                        </S.QnATableWrapper>
                    </S.QnACard>
                </S.QnARightColumn>
            </S.QnAGrid>
        </S.QnAContainer>
    );
}