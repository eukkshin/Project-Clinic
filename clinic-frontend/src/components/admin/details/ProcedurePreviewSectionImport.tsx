"use client";

import { useState } from "react";
import { FiDownload } from "react-icons/fi";

import { detailErrorMessage } from "@/lib/admin/detailApi";
import { importProcedureTemplateSections } from "@/lib/detail/importProcedureTemplateSections";
import { getProcedureSectionTemplate } from "@/lib/detail/procedureSectionTemplates";
import * as S from "@/components/admin/details/DetailEditor.styles";

import type { DetailPage } from "@/types/adminDetail";

interface Props {
  page: DetailPage;
  disabled?: boolean;
  onComplete: () => Promise<void>;
  notify: (message: string, title?: string) => void;
}

/** 코성형 전용 UI를 대체하는 모든 시술용 섹션 시안 불러오기 버튼 */
export default function ProcedurePreviewSectionImport({
  page,
  disabled = false,
  onComplete,
  notify,
}: Props) {
  const [importing, setImporting] = useState(false);
  const template = getProcedureSectionTemplate(page);
  const count = template.sections.length;

  async function handleImport() {
    if (disabled || importing) return;
    const warning =
      template.source === "starter"
        ? "전용 디자인 시안이 아직 없는 페이지라 기본 문구와 섹션 구성을 추가합니다. 이미지와 의료 정보를 검토한 뒤 공개해 주세요."
        : "기존에 제작한 디자인 시안에서 섹션 내용을 가져옵니다. 연출 이미지는 실제 시술 결과가 아닙니다.";
    if (
      !window.confirm(
        `「${page.title}」에 ${count}개 섹션 시안을 불러올까요?\n` +
          `${warning}\n` +
          "기존 섹션은 덮어쓰지 않고, 없는 섹션만 뒤에 추가합니다.",
      )
    )
      return;

    setImporting(true);
    try {
      const result = await importProcedureTemplateSections(page);
      notify(
        result.created
          ? `${result.created}개 섹션을 추가했습니다. 기존 ${result.skipped}개는 유지했습니다.`
          : "이미 해당 시안의 모든 섹션 키가 등록되어 있습니다. 기존 내용을 유지했습니다.",
        "시안 불러오기 완료",
      );
    } catch (error) {
      notify(
        `${detailErrorMessage(error)}\n일부만 등록됐다면 다시 실행하면 누락된 섹션만 추가됩니다.`,
        "시안 불러오기 실패",
      );
    } finally {
      try {
        await onComplete();
      } catch (error) {
        notify(detailErrorMessage(error), "섹션 목록 새로고침 실패");
      }
      setImporting(false);
    }
  }

  return (
    <S.Button
      type="button"
      disabled={disabled || importing}
      onClick={() => void handleImport()}
    >
      <FiDownload />{" "}
      {importing ? "시안 등록 중..." : `섹션 시안 ${count}개 불러오기`}
    </S.Button>
  );
}
