'use client'
import { useState, useEffect} from "react"
import axios from "axios"

import { Accordion } from "@/components/QuaAccordion/Accordion"
import * as S from '@/components/QuaAccordion/Accordion.style'

// const QNA_DATA = {
//   소개: [
//     {
//       id: "intro-1",
//       question: "안스 성형외과란 어떤 곳인가요?",
//       answer: "안스성형외과는 풍부한 임상 경험을 가진 성형외과 전문의가 상담부터 수술, 사후 관리까지 1:1로 꼼꼼하게 케어해 드리는 안전 중심 성형외과입니다. 공장형 진료가 아닌, 고객 한 분 한 분에게 가장 잘 어울리는 자연스럽고 조화로운 아름다움을 찾아드립니다.",
//     },
//     {
//       id: "intro-2",
//       question: "진료시간과 휴진일은 어떻게 되나요?",
//       answer: "평일(월~금): 오전 10시 ~ 오후 7시 / 토요일: 오전 10시 ~ 오후 4시\n휴진 안내: 일요일 및 공휴일은 휴진입니다. (점심시간 등 세부 시간은 병원으로 사전 문의 부탁드립니다.)",
//     },
//     {
//       id: "intro-3",
//       question: "상담 예약은 어떻게 하나요?",
//       answer: "공식 홈페이지 및 네이버 예약을 통한 간편 접수 또는 카카오톡 플러스친구('안스성형외과') 검색 후 1:1 실시간 채팅 상담으로 예약이 가능합니다.",
//     },
//     {
//       id: "intro-4",
//       question: "주차와 대중교통 이용은 어떻게 되나요?",
//       answer: "대중교통: [가장 가까운 지하철역]역 [몇]번 출구에서 도보 [몇]분 거리에 위치해 있습니다.\n주차 안내: 건물 내 주차장(또는 주차 타워/발렛파킹)을 이용하실 수 있습니다.",
//     },
//   ],
//   시그니처: [
//     {
//       id: "sig-1",
//       question: "안스만의 시그니처 수술은 어떤 특징이 있나요?",
//       answer: "오랜 노하우를 바탕으로 개인의 체형과 골격에 맞춘 커스텀 디자인을 적용하여 회복 기간을 줄이고 만족도를 높인 안스만의 특화 수술 프로그램입니다.",
//     },
//     {
//       id: "sig-2",
//       question: "사후 관리는 어떻게 진행되나요?",
//       answer: "수술 후 붓기 관리와 흉터 케어를 위한 1:1 맞춤 레이저 및 에스테틱 케어 프로그램이 전 과정 포함되어 있습니다.",
//     },
//   ],
//   눈코: [
//     {
//       id: "eyeno-1",
//       question: "절개법과 비절개법의 차이가 무엇인가요?",
//       answer: "개인의 눈꺼풀 두께와 지방량에 따라 결정되며, 풀림 현상을 최소화하고 자연스러움을 살릴 수 있는 방향으로 전문의와 1:1 상담 후 결정됩니다.",
//     },
//     {
//       id: "eyeno-2",
//       question: "코 성형 시 실리콘 외에 어떤 재료를 쓰나요?",
//       answer: "자가늑연골, 비중격연골, 귀연골 등 본인에게 가장 안전하고 적합한 자가조직을 우선적으로 사용하여 부작용을 낮춥니다.",
//     },
//   ],
//   리프팅: [
//     {
//       id: "lifting-1",
//       question: "리프팅 시술은 유지 기간이 얼마나 되나요?",
//       answer: "시술 종류(실리프팅, 레이저 리프팅 등)와 개인의 피부 탄력 상태에 따라 다르지만 보통 6개월에서 1년 이상 지속됩니다.",
//     },
//   ],
//   레이저: [
//     {
//       id: "laser-1",
//       question: "레이저 시술 후 일상생활이 바로 가능한가요?",
//       answer: "대부분의 레이저 시술은 세안과 메이크업이 바로 가능하여 일상생활에 지장이 거의 없습니다.",
//     },
//   ],
// };

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
            const res = await axios.get('http://localhost:4000/api/admin/qnas');
            
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
    if(isLoading){
        return <S.QnAShell style={{ textAlign: 'center', padding: '5rem 0' }}>로딩 중...</S.QnAShell>;
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