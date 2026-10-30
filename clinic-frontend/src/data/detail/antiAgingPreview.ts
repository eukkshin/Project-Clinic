import type { DetailPageData } from "@/types/detail";

/**
 * 동안성형 안면거상 페이지의 디자인 미리보기 데이터.
 * 모든 이미지는 연출 이미지이며 실제 환자, 전후 결과 또는 효과 보증이 아닙니다.
 * 실제 방문자 페이지는 관리자에서 공개한 Express + Oracle DB 데이터를 우선 사용합니다.
 */
const faceliftPreview: DetailPageData = {
  category: "anti-aging",
  slug: "facelift",
  title: "안면거상",
  hero: {
    eyebrow: "ANTI-AGING  ·  TIMELESS HARMONY",
    title: "안면거상",
    description:
      "시간의 흐름을 바라보는 섬세한 시선.\n나에게 어울리는 변화를 충분한 상담에서 시작합니다.",
    imageUrl: "/images/detail-antiaging/hero-facelift.webp",
    imageAlt: "차분한 딥그린 배경과 인물 초상을 결합한 연출용 이미지",
    imagePosition: "center center",
  },
  seo: {
    title: "안면거상 | AHN'S",
    description:
      "AHN'S 동안성형 안면거상 소개. 진료와 시술 계획은 개인의 상태에 따라 달라질 수 있습니다.",
  },
  sections: [
    {
      id: "intro",
      type: "INTRO",
      eyebrow: "01  ·  THE ART OF TIME",
      title: "시간이 남긴 변화까지, 세심하게",
      content: {
        layout: "image-right",
        description:
          "시간에 따른 얼굴의 변화는 사람마다 다르게 나타납니다.\n피부 상태와 얼굴의 형태, 개인의 고민을 함께 이해하는 과정이 먼저입니다.\n\n안면거상에 관한 선택은 충분한 진료와 설명을 바탕으로 신중하게 결정해야 합니다.",
        imageUrl: "/images/detail-antiaging/portrait-facelift.webp",
        imageAlt: "차분한 분위기의 인물 연출 사진",
      },
    },
    {
      id: "balance",
      type: "TEXT",
      eyebrow: "02  ·  HARMONY & UNDERSTANDING",
      title: "한 부분이 아닌, 전체의 조화",
      content: {
        layout: "comparison",
        description:
          "정해진 기준보다 개인의 상태와 원하는 변화를 함께 살핍니다.",
        compareLeftTitle: "현재 얼굴 상태를 이해하기",
        compareLeftBody:
          "얼굴의 형태, 피부와 연부조직의 상태, 일상에서 느끼는 고민을 의료진과 함께 확인합니다.",
        compareRightTitle: "충분한 선택지와 설명",
        compareRightBody:
          "가능한 방법뿐 아니라 수술의 한계, 회복 과정과 주의사항도 충분히 듣고 결정합니다.",
      },
    },
    {
      id: "features",
      type: "FEATURES",
      eyebrow: "03  ·  CONSIDERED DETAILS",
      title: "섬세한 상담을 위한 네 가지 기준",
      content: {
        layout: "rows",
        description:
          "모든 진료 과정은 개인의 상태와 의료진의 판단에 따라 달라질 수 있습니다.",
        items: [
          "얼굴과 피부 상태에 대한 개별 평가",
          "조화로운 변화에 대한 충분한 상담",
          "수술 방법과 가능 범위·한계 안내",
          "회복 및 경과 관찰에 관한 설명",
        ],
      },
    },
    {
      id: "process",
      type: "PROCESS",
      eyebrow: "04  ·  CARE JOURNEY",
      title: "나에게 맞는 계획을 차근차근",
      content: {
        layout: "timeline",
        description:
          "아래 내용은 일반적인 상담 흐름의 예시이며, 실제 절차는 개인별로 다를 수 있습니다.",
        items: [
          "고민과 기대를 나누는 초기 상담",
          "의료진의 상태 확인과 방법 설명",
          "위험·주의사항 확인 후 신중한 결정",
          "개인별 회복 및 경과 확인 안내",
        ],
      },
    },
    {
      id: "gallery",
      type: "GALLERY",
      eyebrow: "05  ·  EDITORIAL GALLERY",
      title: "Timeless, In Your Own Way",
      content: {
        description:
          "다음 이미지는 브랜드 분위기를 표현한 연출 사진입니다. 실제 환자나 수술 전후 사진이 아닙니다.",
        images: [
          {
            src: "/images/detail-antiaging/portrait-facelift.webp",
            alt: "연출 사진 · 부드러운 인물 초상",
          },
          {
            src: "/images/detail-antiaging/editorial-facelift.webp",
            alt: "연출 사진 · 자연스러운 인물 표정",
          },
          {
            src: "/images/detail-antiaging/profile-facelift.webp",
            alt: "연출 사진 · 측면 인물 라인",
          },
        ],
      },
    },
    {
      id: "faq",
      type: "FAQ",
      eyebrow: "06  ·  QUESTIONS",
      title: "자주 묻는 질문",
      content: {
        description:
          "아래 내용은 일반적인 안내이며, 개별 의료적 판단을 대신하지 않습니다.",
        faqs: [
          {
            question: "안면거상이 모든 사람에게 적합한가요?",
            answer:
              "모든 사람에게 적합한 방법은 아닙니다. 건강 상태, 피부 및 조직 상태, 기대하는 변화 등에 따라 의료진의 진료와 상담이 필요합니다.",
          },
          {
            question: "회복 기간은 얼마나 필요한가요?",
            answer:
              "수술 범위와 개인의 상태에 따라 회복 경과가 달라질 수 있습니다. 예상 기간과 일상 복귀 계획은 의료진에게 확인해 주세요.",
          },
          {
            question: "상담 때 어떤 내용을 확인해야 하나요?",
            answer:
              "수술 방법과 가능한 범위, 위험과 부작용, 회복 및 사후관리 계획 등을 충분히 설명받고 결정하는 것이 중요합니다.",
          },
        ],
      },
    },
    {
      id: "consultation",
      type: "CTA",
      eyebrow: "07  ·  AHN'S CONSULTATION",
      title: "나를 위한 충분한 상담의 시작",
      content: {
        description:
          "궁금한 점을 편안하게 나누고, 충분히 이해한 뒤 결정할 수 있도록 안내합니다.",
        buttonHref: "/#site-footer-contact",
        buttonLabel: "상담 문의하기",
      },
    },
  ],
};

export function getAntiAgingPreviewPage(
  category: string,
  slug: string,
): DetailPageData | null {
  return category === "anti-aging" && slug === "facelift"
    ? faceliftPreview
    : null;
}
