import type { DetailPageData } from "@/types/detail";

/**
 * 디자인 확인을 위한 개발 전용 연출 데이터입니다.
 * 실제 환자·시술 전후 사진이 아니며, 의료적 효과를 보증하지 않습니다.
 * 운영 페이지는 Express + Oracle DB에서 가져오는 데이터만 사용합니다.
 */
const bridgeTip: DetailPageData = {
  category: "nose",
  slug: "bridge-tip",
  title: "콧대·코끝 성형",
  hero: {
    eyebrow: "NOSE SURGERY  ·  PROFILE & BALANCE",
    title: "콧대·코끝 성형",
    description:
      "얼굴의 흐름과 자연스럽게 이어지는 라인.\n섬세한 상담에서 나만의 균형을 찾아갑니다.",
    imageUrl: "/images/detail-nose/hero-bridge-tip.webp",
    imageAlt: "측면 얼굴 라인을 표현한 연출용 뷰티 이미지",
    imagePosition: "center center",
  },
  seo: {
    title: "콧대·코끝 성형 | AHN'S",
    description:
      "AHN'S 코성형 상세페이지 디자인 미리보기. 실제 진료 내용은 의료진 상담을 통해 확인해 주세요.",
  },
  sections: [
    {
      id: "intro",
      type: "INTRO",
      eyebrow: "01  ·  THE SILHOUETTE",
      title: "조화로운 라인을 생각하다",
      content: {
        layout: "image-left",
        description:
          "코는 정면과 측면의 인상에 함께 영향을 줍니다.\n단순히 높이를 바꾸는 것보다 얼굴 전체의 비율, 피부와 조직 상태, 원하는 변화를 함께 살펴보는 과정이 중요합니다.\n\nAHN'S는 개인별 상태에 대한 충분한 상담을 바탕으로 적절한 방법을 논의합니다.",
        imageUrl: "/images/detail-nose/profile-detail.webp",
        imageAlt: "얼굴 측면의 윤곽을 보여주는 연출 이미지",
      },
    },
    {
      id: "balance",
      type: "TEXT",
      eyebrow: "02  ·  BALANCE & PROPORTION",
      title: "한 방향이 아닌, 전체의 균형",
      content: {
        layout: "comparison",
        description:
          "정면과 측면에서 보이는 인상을 함께 고려하며 개인별 상태와 원하는 변화를 확인합니다.",
        compareLeftTitle: "정면에서 보는 조화",
        compareLeftBody:
          "얼굴의 좌우 균형, 코의 폭과 주변 부위의 비율을 함께 고려합니다.\n실제 계획은 개인의 해부학적 상태에 따라 달라집니다.",
        compareRightTitle: "측면에서 이어지는 라인",
        compareRightBody:
          "이마부터 코끝과 턱으로 이어지는 인상을 종합적으로 살펴봅니다.\n원하는 형태와 의학적으로 가능한 범위는 상담을 통해 확인합니다.",
      },
    },
    {
      id: "features",
      type: "FEATURES",
      eyebrow: "03  ·  OUR APPROACH",
      title: "섬세하게 살피는 네 가지 기준",
      content: {
        layout: "rows",
        description: "정해진 모양보다 개인의 조건과 조화에 집중하는 상담.",
        items: [
          "얼굴 전체 비율과 조화 확인",
          "피부·조직 상태를 고려한 상담",
          "가능한 방법과 한계에 대한 설명",
          "시술 후 경과와 주의사항 안내",
        ],
      },
    },
    {
      id: "process",
      type: "PROCESS",
      eyebrow: "04  ·  CARE JOURNEY",
      title: "상담부터 경과 확인까지",
      content: {
        layout: "timeline",
        description:
          "개인 상태에 따라 과정은 달라질 수 있으며, 실제 진료 시 의료진이 안내합니다.",
        items: [
          "상담 및 상태 확인",
          "진료 결과에 따른 계획 설명",
          "시술 전 확인과 동의",
          "개인별 회복·경과 안내",
        ],
      },
    },
    {
      id: "gallery",
      type: "GALLERY",
      eyebrow: "05  ·  EDITORIAL MOMENTS",
      title: "Harmony in Every Angle",
      content: {
        description:
          "아래 이미지는 미적 방향을 보여주는 연출 사진이며 실제 환자나 시술 결과가 아닙니다.",
        images: [
          {
            src: "/images/detail-nose/profile-detail.webp",
            alt: "연출 이미지 · 측면 프로필 (실제 시술 결과 아님)",
          },
          {
            src: "/images/detail-nose/portrait-detail.webp",
            alt: "연출 이미지 · 정면 인물 (실제 시술 결과 아님)",
          },
          {
            src: "/images/detail-nose/hero-bridge-tip.webp",
            alt: "연출 이미지 · 코성형 디자인 무드 (실제 시술 결과 아님)",
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
          "진료와 시술에 관한 궁금증은 개인별 상담에서 자세히 안내합니다.",
        faqs: [
          {
            question: "콧대와 코끝을 반드시 함께 시술해야 하나요?",
            answer:
              "반드시 함께 진행하는 것은 아닙니다. 현재 코의 상태와 원하는 변화에 따라 적절한 계획은 달라지므로 의료진과 상담해 주세요.",
          },
          {
            question: "회복 기간은 어느 정도인가요?",
            answer:
              "수술 방법과 개인의 건강 상태 등에 따라 회복 경과는 다를 수 있습니다. 구체적인 안내는 진료 시 확인해야 합니다.",
          },
          {
            question: "어떤 디자인이 적합한지 어떻게 결정하나요?",
            answer:
              "얼굴의 비율과 코의 구조, 피부·조직 상태, 개인의 선호도를 함께 확인한 뒤 가능한 범위와 선택지를 설명합니다.",
          },
        ],
      },
    },
    {
      id: "consultation",
      type: "CTA",
      eyebrow: "07  ·  CONSULTATION",
      title: "나에게 어울리는 라인을 위한 첫 상담",
      content: {
        description: "충분히 이야기하고, 신중하게 결정할 수 있도록 안내합니다.",
        buttonHref: "/#site-footer-contact",
        buttonLabel: "상담 문의하기",
      },
    },
  ],
};

export function getNosePreviewPage(
  category: string,
  slug: string,
): DetailPageData | null {
  return category === "nose" && slug === "bridge-tip" ? bridgeTip : null;
}
