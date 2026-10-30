import type { DetailPageData } from "@/types/detail";

/** 실제 환자 사진이나 시술 결과가 아닌 연출용 이미지·예시 문구입니다. 개발 미리보기에서만 사용하세요. */
const naturalAdhesion: DetailPageData = {
  category: "eyes",
  slug: "natural-adhesion",
  title: "자연유착 쌍꺼풀",
  hero: {
    eyebrow: "NATURAL ADHESION · EYE SURGERY",
    title: "자연유착 쌍꺼풀",
    description: "자연스러운 눈매의 시작,\n당신의 분위기와 조화를 생각합니다.",
    imageUrl: "/images/detail-design/hero-natural-adhesion.webp",
    imageAlt: "연출된 뷰티 모델 이미지",
    imagePosition: "center center",
  },
  seo: {
    title: "자연유착 쌍꺼풀 | AHN'S",
    description: "AHN'S 자연유착 쌍꺼풀 상세페이지 개발 미리보기",
  },
  sections: [
    {
      id: "intro",
      type: "INTRO",
      title: "자연스럽게, 나답게",
      eyebrow: "01 · INTRODUCTION",
      content: {
        description:
          "자연유착 쌍꺼풀은 개인의 눈꺼풀 상태와 얼굴의 조화를 고려해 상담하는 시술입니다.\n\n나에게 맞는 방법은 눈꺼풀의 두께, 피부 상태, 원하는 눈매를 종합해 의료진과 함께 결정합니다.",
        imageUrl: "/images/detail-design/editorial-eye.webp",
        imageAlt: "연출된 눈매 클로즈업 이미지",
      },
    },
    {
      id: "features",
      type: "FEATURES",
      title: "섬세하게 살피는 네 가지",
      eyebrow: "02 · KEY POINTS",
      content: {
        description:
          "정해진 답보다, 한 사람의 조화를 먼저 생각하는 상담 과정을 지향합니다.",
        items: [
          "개인별 눈 상태 확인",
          "얼굴과 눈매의 조화",
          "충분한 상담과 설명",
          "수술 후 경과 안내",
        ],
      },
    },
    {
      id: "process",
      type: "PROCESS",
      title: "진료 진행 과정",
      eyebrow: "03 · TREATMENT PROCESS",
      content: {
        description:
          "안전과 이해를 바탕으로, 상담부터 경과 확인까지 각 단계를 안내합니다.",
        items: [
          "상담 및 상태 확인",
          "개인별 계획 안내",
          "시술 전 설명 및 동의",
          "사후 경과 확인",
        ],
      },
    },
    {
      id: "gallery",
      type: "GALLERY",
      title: "Natural Beauty",
      eyebrow: "04 · EDITORIAL GALLERY",
      content: {
        description:
          "AHN'S가 지향하는 차분하고 자연스러운 아름다움의 이미지입니다.",
        images: [
          {
            src: "/images/detail-design/editorial-eye.webp",
            alt: "연출 이미지 · 눈매 디테일 (실제 시술 결과 아님)",
          },
          {
            src: "/images/detail-design/editorial-portrait.webp",
            alt: "연출 이미지 · 인물 초상 (실제 시술 결과 아님)",
          },
          {
            src: "/images/detail-design/editorial-profile.webp",
            alt: "연출 이미지 · 측면 프로필 (실제 시술 결과 아님)",
          },
        ],
      },
    },
    {
      id: "faq",
      type: "FAQ",
      title: "자주 묻는 질문",
      eyebrow: "05 · QUESTIONS & ANSWERS",
      content: {
        description:
          "궁금한 부분은 상담을 통해 더 자세히 확인하실 수 있습니다.",
        faqs: [
          {
            question: "어떤 경우에 상담을 받아야 하나요?",
            answer:
              "원하는 눈매나 적합한 수술 방법이 궁금하다면 진료 및 상담을 통해 현재 눈 상태를 확인하는 것이 좋습니다.",
          },
          {
            question: "회복 기간은 얼마나 걸리나요?",
            answer:
              "회복 과정과 기간은 개인 상태 및 시술 방법에 따라 다릅니다. 예상 경과는 의료진에게 확인해 주세요.",
          },
          {
            question: "방법은 어떻게 결정되나요?",
            answer:
              "눈꺼풀 피부 상태, 근육, 원하는 변화 등을 종합적으로 확인한 뒤 의료진과 함께 결정합니다.",
          },
        ],
      },
    },
    {
      id: "consultation",
      type: "CTA",
      title: "당신의 아름다움을 위한 첫 상담",
      eyebrow: "06 · CONSULTATION",
      content: {
        description:
          "편안한 마음으로 궁금한 점을 문의해 주세요.\n충분한 이야기를 나누는 것에서 시작합니다.",
        buttonHref: "/#site-footer-contact",
        buttonLabel: "상담 문의하기",
      },
    },
  ],
};

/** preview 전용으로 명시된 slug만 보여줍니다. 다른 slug는 404입니다. */
export function getPreviewDetailPage(
  category: string,
  slug: string,
): DetailPageData | null {
  return category === "eyes" && slug === "natural-adhesion"
    ? naturalAdhesion
    : null;
}
