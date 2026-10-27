import type { DetailPageData } from "@/types/detail";

/** 화면 테스트 전용 샘플. 운영 시 Express GET /api/details/:category/:slug로 교체합니다. */
const pages: DetailPageData[] = [
  {
    category: "eyes",
    slug: "natural-adhesion",
    title: "자연유착 쌍꺼풀",
    hero: {
      eyebrow: "AHN'S · EYE SURGERY",
      title: "자연스럽게, 당신답게",
      description: "섬세한 상담에서 시작하는 나만의 아름다움",
      imageUrl: "/images/detail/demo-eyes-hero.png",
      imageAlt: "뷰티 모델 이미지",
      imagePosition: "center 50%",
    },
    sections: [
      {
        id: "intro",
        type: "INTRO",
        title: "시술 소개",
        eyebrow: "01 · INTRODUCTION",
        content: {
          description:
            "눈의 형태와 전체적인 얼굴의 조화를 고려해 상담합니다. 구체적인 방법과 적합성은 전문의 진료 후 결정합니다.",
        },
      },
      {
        id: "features",
        type: "FEATURES",
        title: "맞춤형 상담 포인트",
        eyebrow: "02 · KEY POINTS",
        content: {
          items: [
            "개인의 눈 형태와 대칭 평가",
            "원하는 이미지와 기대치 확인",
            "수술 방법 및 회복 과정 상담",
          ],
        },
      },
      {
        id: "process",
        type: "PROCESS",
        title: "진료 진행 과정",
        eyebrow: "03 · PROCESS",
        content: {
          items: [
            "진료 및 상담",
            "개인별 계획 수립",
            "시술 전 설명과 동의",
            "사후 경과 확인",
          ],
        },
      },
      {
        id: "faq",
        type: "FAQ",
        title: "자주 묻는 질문",
        eyebrow: "04 · FAQ",
        content: {
          faqs: [
            {
              question: "시술 방법은 어떻게 결정되나요?",
              answer:
                "진료를 통해 개인 상태와 희망 사항을 확인하고 의료진과 상담해 결정합니다.",
            },
            {
              question: "회복 기간은 얼마나 걸리나요?",
              answer:
                "개인별 상태와 시술 방법에 따라 달라지므로 의료진에게 구체적으로 확인해 주세요.",
            },
          ],
        },
      },
      {
        id: "consultation",
        type: "CTA",
        title: "상담 문의",
        eyebrow: "05 · CONSULTATION",
        content: {
          description: "궁금한 내용을 편하게 문의해 주세요.",
          buttonLabel: "상담문의 ↗",
          buttonHref: "/#site-footer-contact",
        },
      },
    ],
  },
  {
    category: "nose",
    slug: "bridge-tip",
    title: "콧대 / 코끝 성형",
    hero: {
      eyebrow: "AHN'S · NOSE SURGERY",
      title: "균형으로 완성하는 인상",
      description: "자연스러운 조화를 위한 맞춤형 상담",
      imageUrl: "/images/detail/demo-eyes-hero.png",
      imageAlt: "뷰티 모델 이미지 - 임시 샘플",
    },
    sections: [
      {
        id: "intro",
        type: "INTRO",
        title: "시술 소개",
        content: {
          description:
            "얼굴 전체의 균형을 고려하여 상담합니다. 구체적인 진료 정보는 병원 관리자에서 수정해 주세요.",
        },
      },
      {
        id: "features",
        type: "FEATURES",
        title: "상담 시 고려 사항",
        content: {
          items: [
            "코의 전체적인 비율",
            "개인별 해부학적 특성",
            "수술 방법과 유의사항",
          ],
        },
      },
      {
        id: "faq",
        type: "FAQ",
        title: "자주 묻는 질문",
        content: {
          faqs: [
            {
              question: "상담이 필요한가요?",
              answer:
                "적합한 방법은 의료진의 진료 및 상담을 통해 확인해야 합니다.",
            },
          ],
        },
      },
    ],
  },
];

export function getDemoDetailPage(
  category: string,
  slug: string,
): DetailPageData | undefined {
  return pages.find((page) => page.category === category && page.slug === slug);
}

export function getDemoPaths() {
  return pages.map(({ category, slug }) => ({ category, slug }));
}
