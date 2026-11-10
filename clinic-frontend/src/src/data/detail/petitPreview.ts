import type { DetailPageData } from "@/types/detail";

/**
 * 쁘띠시술 필러 상세페이지 전용 에디토리얼 시안.
 * 사진은 브랜드 연출용이며 환자 사례 / 전후 사진 / 시술 효과를 뜻하지 않습니다.
 * 운영에서는 관리자 DB의 공개 데이터를 사용합니다.
 */
const fillerPreview: DetailPageData = {
  category: "petit",
  slug: "filler",
  title: "필러",
  hero: {
    eyebrow: "AHN'S PETIT CLINIC  /  PERSONAL BEAUTY",
    title: "필러",
    description:
      "조금 더 나다운 균형을 고민하는 시간.\n섬세한 상담에서 시작하는 나만의 선택.",
    imageUrl: "/images/detail-petit/hero-filler.webp",
    imageAlt: "딥그린 배경과 인물 초상을 활용한 필러 시술 소개용 연출 이미지",
    imagePosition: "center center",
  },
  seo: {
    title: "필러 | AHN'S 쁘띠시술",
    description:
      "AHN'S 필러 상세 안내. 시술 적합 여부, 제품, 위험 및 주의사항은 의료진과 상담해 확인합니다.",
  },
  sections: [
    {
      id: "intro",
      type: "INTRO",
      eyebrow: "01 · THE ART OF SUBTLETY",
      title: "아름다움은 작은 차이를 이해하는 것부터",
      content: {
        layout: "image-right",
        description:
          "필러는 사용 제품과 주입 부위, 개인의 피부 및 조직 상태에 따라 고려할 점이 달라지는 의료 시술입니다.\n\n단순한 변화를 제안하기보다 현재의 고민과 기대, 적합 여부를 충분한 상담을 통해 살펴보는 과정을 중요하게 생각합니다.",
        imageUrl: "/images/detail-petit/portrait-filler.webp",
        imageAlt: "쁘띠시술 브랜드 분위기를 표현한 인물 연출 이미지",
      },
    },
    {
      id: "balance",
      type: "TEXT",
      eyebrow: "02 · INDIVIDUAL HARMONY",
      title: "내 얼굴을 이해하는 두 가지 시선",
      content: {
        layout: "comparison",
        description:
          "시술 여부와 방법은 일률적으로 정할 수 없으며, 상담과 진찰을 거쳐 판단합니다.",
        compareLeftTitle: "나에게 어울리는 균형",
        compareLeftBody:
          "얼굴의 전체적인 비율과 피부·조직 상태, 원하는 변화의 방향을 함께 확인합니다.",
        compareRightTitle: "안전과 한계의 이해",
        compareRightBody:
          "제품 특성과 시술 부위별 위험, 기대할 수 있는 범위, 회복 및 주의사항을 충분히 설명받습니다.",
      },
    },
    {
      id: "features",
      type: "FEATURES",
      eyebrow: "03 · CONSIDERED CARE",
      title: "충분한 상담을 위한 네 가지 기준",
      content: {
        layout: "rows",
        description:
          "아래 내용은 일반적인 상담 기준이며 시술 결과를 보장하지 않습니다.",
        items: [
          "얼굴 구조와 피부·조직 상태의 개별 확인",
          "시술 목적과 기대 수준의 충분한 소통",
          "사용 제품과 주입 부위별 위험성 안내",
          "시술 후 주의사항과 경과 확인 계획",
        ],
      },
    },
    {
      id: "process",
      type: "PROCESS",
      eyebrow: "04 · THE CARE JOURNEY",
      title: "작은 선택도 충분히 신중하게",
      content: {
        layout: "timeline",
        description:
          "아래 흐름은 일반적인 예시이며, 실제 시술 절차는 개인 및 의료진의 판단에 따라 달라집니다.",
        items: [
          "고민과 병력, 복용 약물 등의 확인",
          "의료진 진찰과 적합성 평가",
          "제품·방법·부작용 설명 및 동의",
          "시술 후 주의사항과 경과 상담",
        ],
      },
    },
    {
      id: "gallery",
      type: "GALLERY",
      eyebrow: "05 · BEAUTY EDITORIAL",
      title: "Beauty in Every Detail",
      content: {
        description:
          "브랜드 이미지를 위한 연출 사진이며 실제 환자, 시술 부위의 변화 또는 전후 결과를 보여주지 않습니다.",
        images: [
          {
            src: "/images/detail-petit/detail-filler.webp",
            alt: "연출 사진 · 입술과 피부의 클로즈업",
          },
          {
            src: "/images/detail-petit/portrait-filler.webp",
            alt: "연출 사진 · 자연스러운 인물 초상",
          },
          {
            src: "/images/detail-petit/profile-filler.webp",
            alt: "연출 사진 · 인물 측면 초상",
          },
        ],
      },
    },
    {
      id: "faq",
      type: "FAQ",
      eyebrow: "06 · QUESTIONS & ANSWERS",
      title: "필러에 관해 자주 묻는 질문",
      content: {
        description:
          "일반적인 안내이며 개인별 진료 및 의료진의 판단을 대신하지 않습니다.",
        faqs: [
          {
            question: "필러 시술은 누구나 받을 수 있나요?",
            answer:
              "아닙니다. 건강 상태, 알레르기 및 과거 시술 이력, 사용 제품과 주입 부위 등을 고려해야 합니다. 시술 여부는 의료진의 진료를 통해 결정해야 합니다.",
          },
          {
            question: "시술 후 붓기나 멍이 발생할 수 있나요?",
            answer:
              "붓기, 멍, 압통 등이 나타날 수 있으며 정도와 경과는 개인마다 다릅니다. 예상되는 반응과 관리 방법은 담당 의료진에게 안내받으세요.",
          },
          {
            question: "필러 시술에서 반드시 알아야 할 위험은 무엇인가요?",
            answer:
              "감염, 결절, 알레르기 등의 가능성이 있고, 드물지만 혈관 폐색으로 피부 괴사나 시력 손상과 같은 심각한 합병증이 발생할 수 있습니다. 시술 후 심한 통증·피부색 변화·시야 이상이 나타나면 즉시 의료진의 평가를 받아야 합니다.",
          },
        ],
      },
    },
    {
      id: "consultation",
      type: "CTA",
      eyebrow: "07 · AHN'S CONSULTATION",
      title: "나에게 필요한 선택인지, 먼저 상담하세요",
      content: {
        description:
          "아름다움에 대한 기대와 궁금증을 충분히 나누고, 의료진과 함께 신중하게 결정할 수 있도록 안내합니다.",
        buttonHref: "/#site-footer-contact",
        buttonLabel: "상담 문의하기",
      },
    },
  ],
};

export function getPetitPreviewPage(
  category: string,
  slug: string,
): DetailPageData | null {
  return category === "petit" && slug === "filler" ? fillerPreview : null;
}
