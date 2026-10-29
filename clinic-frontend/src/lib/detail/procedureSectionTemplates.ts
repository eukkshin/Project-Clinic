import { getAntiAgingPreviewPage } from "@/data/detail/antiAgingPreview";
import { getNosePreviewPage } from "@/data/detail/nosePreview";
import { getPetitPreviewPage } from "@/data/detail/petitPreview";
import { getPreviewDetailPage } from "@/data/detail/preview";

import type { DetailPage } from "@/types/adminDetail";
import type { DetailSectionData } from "@/types/detail";
export interface ProcedureSectionTemplate {
  name: string;
  source: "designed" | "starter";
  sections: DetailSectionData[];
}

type PageIdentity = Pick<DetailPage, "category" | "slug" | "title">;

/**
 * 이미 디자인한 페이지는 기존 시안 원본을 그대로 사용합니다.
 * 앞으로 전용 시안을 만들면 이 함수에 분기 한 곳만 추가하세요.
 * 미리보기 데이터는 샘플이므로 운영 공개 전 실제 진료 내용 검토가 필요합니다.
 */
export function getProcedureSectionTemplate(
  page: PageIdentity,
): ProcedureSectionTemplate {
  const eye = getPreviewDetailPage(page.category, page.slug);
  if (eye) {
    return {
      name: `눈성형 · ${eye.title} 전용 시안`,
      source: "designed",
      sections: eye.sections,
    };
  }
  const nose = getNosePreviewPage(page.category, page.slug);
  if (nose) {
    return {
      name: `코성형 · ${nose.title} 전용 시안`,
      source: "designed",
      sections: nose.sections,
    };
  }

  const antiAging = getAntiAgingPreviewPage(page.category, page.slug);
  if (antiAging) {
    return {
      name: `동안성형 · ${antiAging.title} 전용 시안`,
      source: "designed",
      sections: antiAging.sections,
    };
  }

  const petit = getPetitPreviewPage(page.category, page.slug);
  if (petit) {
    return {
      name: `쁘띠시술 · ${petit.title} 전용 시안`,
      source: "designed",
      sections: petit.sections,
    };
  }

  // 아직 전용 시안이 없는 슬러그도 누구나 시작할 수 있는 섹션 구성을 제공합니다.
  // 환자 사진이나 의학적 효과를 만들어 내지 않으며, 이미지는 관리자에서 별도로 등록합니다.
  const categoryNames: Record<string, string> = {
    eyes: "눈성형",
    nose: "코성형",
    "anti-aging": "동안성형",
    petit: "쁘띠시술",
  };
  const categoryName = categoryNames[page.category] ?? "시술";
  const title = page.title.trim() || "시술";
  const sections: DetailSectionData[] = [
    {
      id: "intro",
      type: "INTRO",
      eyebrow: "01 · INTRODUCTION",
      title: `${title}, 충분히 이해하고 선택하세요`,
      content: {
        layout: "image-left",
        description: `${categoryName} 관련 상담에서는 개인의 상태와 원하는 변화를 먼저 살펴보는 것이 중요합니다.\n\n이 영역은 기본 시안 문구입니다. 의료진 검토 후 실제 시술에 맞는 소개와 이미지를 등록해 주세요.`,
      },
    },
    {
      id: "balance",
      type: "TEXT",
      eyebrow: "02 · PERSONALIZED APPROACH",
      title: "한 사람의 조건과 조화를 함께",
      content: {
        layout: "comparison",
        description: "개인별 진료와 상담을 통해 필요한 정보를 확인합니다.",
        compareLeftTitle: "현재 상태 확인",
        compareLeftBody:
          "현재 상태와 고민, 원하는 방향을 충분히 듣고 확인합니다.",
        compareRightTitle: "선택지와 주의사항 안내",
        compareRightBody: "가능한 방법과 한계, 유의할 점을 진료 시 안내합니다.",
      },
    },
    {
      id: "features",
      type: "FEATURES",
      eyebrow: "03 · KEY POINTS",
      title: "상담에서 중요하게 살펴볼 기준",
      content: {
        layout: "rows",
        description: "개인 상태에 따라 적용 여부나 방법은 달라집니다.",
        items: [
          "현재 상태에 대한 정확한 확인",
          "원하는 변화와 얼굴 전체의 조화",
          "가능한 선택지 및 한계 설명",
          "사후 경과 및 주의사항 안내",
        ],
      },
    },
    {
      id: "process",
      type: "PROCESS",
      eyebrow: "04 · CARE JOURNEY",
      title: "상담부터 경과 확인까지",
      content: {
        layout: "timeline",
        description:
          "실제 절차는 시술 종류 및 개인별 진료 결과에 따라 달라질 수 있습니다.",
        items: [
          "초기 상담",
          "상태 확인과 계획 상담",
          "시술 전 안내 및 동의",
          "회복과 경과 안내",
        ],
      },
    },
    {
      id: "faq",
      type: "FAQ",
      eyebrow: "05 · FAQ",
      title: "자주 묻는 질문",
      content: {
        description: "구체적인 판단은 개인별 진료를 통해 확인해야 합니다.",
        faqs: [
          {
            question: "상담 전 어떤 것을 준비하면 좋나요?",
            answer:
              "현재 고민과 궁금한 점, 복용 중인 약이나 관련 병력 등을 미리 정리해 오시면 도움이 될 수 있습니다.",
          },
          {
            question: "시술 방법은 어떻게 결정되나요?",
            answer:
              "개인의 상태와 진료 결과, 원하는 방향 등을 고려해 의료진과 상의하여 결정합니다.",
          },
          {
            question: "회복 기간은 얼마나 걸리나요?",
            answer:
              "개인 상태와 시술 종류에 따라 다릅니다. 구체적인 안내는 진료 시 확인해 주세요.",
          },
        ],
      },
    },
    {
      id: "consultation",
      type: "CTA",
      eyebrow: "06 · CONSULTATION",
      title: "충분히 알아보는 첫 상담",
      content: {
        description: "궁금한 점을 편안하게 문의해 주세요.",
        buttonHref: "/#site-footer-contact",
        buttonLabel: "상담 문의하기",
      },
    },
  ];
  return {
    name: `${categoryName} · ${title} 기본 시안`,
    source: "starter",
    sections,
  };
}
