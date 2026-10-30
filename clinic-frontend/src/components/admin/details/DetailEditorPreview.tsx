"use client";

import { FiEye, FiInfo } from "react-icons/fi";

import DetailImage from "@/components/procedures/DetailImage";
import * as D from "@/components/procedures/DetailPage.styles";
import DetailSectionRenderer from "@/components/procedures/DetailSectionRenderer";
import * as P from "@/components/admin/details/DetailEditorPreview.styles";

import type { PagePayload } from "@/types/adminDetail";
import type { DetailSectionData } from "@/types/detail";
type Props =
  | {
      mode: "hero";
      page: PagePayload;
      section?: never;
      index?: never;
      isLast?: never;
      hidden?: never;
    }
  | {
      mode: "section";
      section: DetailSectionData;
      index: number;
      isLast?: boolean;
      hidden?: boolean;
      page?: never;
    };

/** 현재 편집 중인 상태만 렌더링합니다. API 요청이나 DB 저장은 하지 않습니다. */
export default function DetailEditorPreview(props: Props) {
  return (
    <P.Wrapper>
      <P.Notice>
        <FiEye aria-hidden="true" />
        <span>
          입력 중인 값이 즉시 반영됩니다. <strong>저장 전 미리보기</strong>이며
          실제 사이트에는 아직 적용되지 않습니다.
        </span>
      </P.Notice>
      {props.mode === "section" && props.hidden && (
        <P.HiddenNotice>
          <FiInfo aria-hidden="true" /> 현재 숨김 상태인 섹션입니다. 편집을 위해
          미리보기에는 표시합니다.
        </P.HiddenNotice>
      )}
      <P.Canvas
        aria-label="상세페이지 편집 실시간 미리보기"
        onClickCapture={(event) => {
          // 미리보기의 CTA 링크를 눌러도 관리자 편집 페이지를 벗어나지 않습니다.
          if ((event.target as HTMLElement).closest("a"))
            event.preventDefault();
        }}
      >
        {props.mode === "hero" ? (
          <D.Hero>
            <D.HeroVisual>
              {props.page.heroImageUrl ? (
                <DetailImage
                  src={props.page.heroImageUrl}
                  alt={props.page.heroImageAlt || "Hero 이미지 미리보기"}
                  fill
                  sizes="(max-width: 1200px) 100vw, 1200px"
                  style={{
                    objectPosition:
                      props.page.heroImagePosition || "center center",
                  }}
                />
              ) : (
                <P.EmptyImage>HERO IMAGE</P.EmptyImage>
              )}
            </D.HeroVisual>
            <D.HeroShade />
            <D.HeroInner>
              <D.HeroEyebrow>
                {props.page.heroEyebrow || "AHN'S PLASTIC SURGERY"}
              </D.HeroEyebrow>
              <D.HeroTitle>
                {props.page.heroTitle || "Hero 제목을 입력해 주세요"}
              </D.HeroTitle>
              <D.HeroLine />
              <D.HeroDesc>
                {props.page.heroDescription ||
                  "Hero 설명을 입력하면 여기에 표시됩니다."}
              </D.HeroDesc>
            </D.HeroInner>
          </D.Hero>
        ) : (
          <DetailSectionRenderer
            section={props.section}
            index={props.index}
            isLast={props.isLast}
          />
        )}
      </P.Canvas>
      <P.Footnote>
        실제 노출 위치·화면 폭·애니메이션에 따라 일부 간격이 달라질 수 있습니다.
        저장 이후 방문자 화면에서도 확인해 주세요.
      </P.Footnote>
    </P.Wrapper>
  );
}
