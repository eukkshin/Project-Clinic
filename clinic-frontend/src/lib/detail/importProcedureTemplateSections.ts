import { detailApi } from '@/lib/adminDetailApi';
import { getProcedureSectionTemplate } from '@/lib/detail/procedureSectionTemplates';

import type {
  DetailPage,
  DetailSection,
  SectionPayload,
} from "@/types/adminDetail";
type PageIdentity = Pick<DetailPage, "pageId" | "category" | "slug" | "title">;
export interface ImportResult {
  created: number;
  skipped: number;
  total: number;
}

/**
 * 기존 섹션은 수정·삭제·재정렬하지 않습니다.
 * 같은 sectionKey가 존재하면 그대로 보존합니다.
 * 타입이 다른 동일 키는 덮어쓰지 않고 등록 전에 오류로 알려줍니다.
 * 각 섹션은 별도 API 요청이므로 실패 후 재실행 시 누락분만 추가합니다.
 */
export async function importProcedureTemplateSections(
  page: PageIdentity,
): Promise<ImportResult> {
  if (!Number.isInteger(page.pageId) || page.pageId < 1) {
    throw new Error("저장된 시술 상세페이지를 먼저 선택해 주세요.");
  }
  const template = getProcedureSectionTemplate(page);
  const keyed = new Map(
    template.sections.map((section) => [section.id, section]),
  );
  if (keyed.size !== template.sections.length)
    throw new Error("시안의 섹션 키가 중복되었습니다.");

  const ensureNoTypeConflicts = (existing: DetailSection[]) => {
    const collision = existing.find((current) => {
      const candidate = keyed.get(current.id);
      return candidate && candidate.type !== current.type;
    });
    if (collision) {
      throw new Error(
        `기존 「${collision.title}」 섹션의 타입이 시안과 달라 자동 등록을 중단했습니다. 관리자에서 섹션 키와 종류를 확인해 주세요.`,
      );
    }
  };

  let existing = await detailApi.sections(page.pageId);
  ensureNoTypeConflicts(existing);
  let created = 0;
  let skipped = 0;

  for (const templateSection of template.sections) {
    // 새 섹션 생성 전 최신 목록을 확인하여 버튼 연속 클릭 및 일부 등록 후 재실행에 대응합니다.
    existing = await detailApi.sections(page.pageId);
    ensureNoTypeConflicts(existing);
    if (existing.some((section) => section.id === templateSection.id)) {
      skipped += 1;
      continue;
    }

    // 사용자 섹션 순서를 건드리지 않고 새로 추가하는 섹션만 뒤에 붙입니다.
    const nextSortOrder =
      Math.max(0, ...existing.map((section) => section.sortOrder)) + 10;
    const payload: SectionPayload = {
      id: templateSection.id,
      type: templateSection.type,
      title: templateSection.title,
      eyebrow: templateSection.eyebrow ?? "",
      content: { ...templateSection.content },
      sortOrder: nextSortOrder,
      isVisible: "Y",
    };
    await detailApi.addSection(page.pageId, payload);
    created += 1;
  }
  return { created, skipped, total: template.sections.length };
}
