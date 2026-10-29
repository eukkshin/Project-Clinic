"use client";
import axios from "axios";
import { useEffect, useState } from "react";

import { Accordion } from "@/components/QuaAccordion/Accordion";
import * as S from "@/components/QuaAccordion/Accordion.style";

interface QnAItem {
  id: string;
  question: string;
  answer: string;
}

type QnAGroup = Record<string, QnAItem[]>;

export default function QuaPage() {
  const [qnaData, setQnaData] = useState<QnAGroup>({});
  const [categories, setCategories] = useState<string[]>([]);
  const [tab, setTab] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchPublicQnAs();
  }, []);

  const fetchPublicQnAs = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/admin/qnas");

      if (res.data.success) {
        const rawData = res.data.data;

        // 1. 카테고리별로 데이터 그룹화하기
        const grouped: QnAGroup = {};
        rawData.forEach((item: any) => {
          const catName = item.CATEGORY_NAME || item.categoryName || "기타";

          if (!grouped[catName]) {
            grouped[catName] = [];
          }

          grouped[catName].push({
            id: String(item.QNA_IDX || item.id),
            question: item.QUESTION || item.question,
            answer: item.ANSWER || item.answer,
          });
        });

        setQnaData(grouped);

        const catKeys = Object.keys(grouped);
        setCategories(catKeys);

        // 첫 번째 카테고리를 기본 탭으로 설정
        if (catKeys.length > 0) {
          setTab(catKeys[0]);
        }
      }
    } catch (err) {
      console.error("Q&A 로드 실패:", err);
    } finally {
      setIsLoading(false);
    }
  };
  if (isLoading) {
    return (
      <S.QnAShell style={{ textAlign: "center", padding: "5rem 0" }}>
        로딩 중...
      </S.QnAShell>
    );
  }

  const currentList = qnaData[tab] || [];

  return (
    <S.QnAShell>
      <S.QnAHeader>
        <S.QnAKicker>AHN'S CLINIC FAQ</S.QnAKicker>
        <S.QnATitle>
          Frequently Asked <em>Questions.</em>
        </S.QnATitle>
      </S.QnAHeader>

      <S.TabContainer>
        {categories.map((categoryKey) => (
          <S.TabButton
            key={categoryKey}
            $active={tab === categoryKey}
            onClick={() => setTab(categoryKey)}
          >
            {categoryKey}
          </S.TabButton>
        ))}
      </S.TabContainer>

      <Accordion key={tab}>
        {currentList.map((item) => (
          <Accordion.Item key={item.id} id={item.id}>
            <Accordion.Title>{item.question}</Accordion.Title>
            <Accordion.Content>{item.answer}</Accordion.Content>
          </Accordion.Item>
        ))}
      </Accordion>
    </S.QnAShell>
  );
}
