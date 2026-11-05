"use client";

import { useLocale } from "next-intl";

import { AppLocale, defaultLocale, isAppLocale } from "@/i18n/config";
import { localizedPath } from "@/i18n/url";
import {
  legalContent,
  LegalKind,
  legalKinds,
  legalPaths,
  legalUi,
} from "@/lib/legal/content";

import * as S from "./LegalDocument.styles";

type EditorialKind = Exclude<LegalKind, "patient-rights">;

type SharedCopy = {
  eyebrow: string;
  overview: string;
  contents: string;
  sectionWord: string;
  closeHeading: string;
  closeDescription: string;
  feesLabel: string;
  feesNotice: string;
  feesColumns: [string, string, string];
  feesPending: string;
  policyMark: string;
  scrollAction: string;
};

const editorialCopy: Record<AppLocale, SharedCopy> = {
  ko: {
    eyebrow: "안스성형외과 · 고객 안내",
    overview: "명확한 안내, 더 깊은 신뢰.",
    contents: "이 페이지의 목차",
    sectionWord: "안내 조항",
    closeHeading: "Care begins with clarity.",
    closeDescription:
      "궁금한 점은 병원에 문의해 주세요. 안스성형외과는 이해하기 쉬운 정보를 제공하기 위해 노력합니다.",
    feesLabel: "비급여 진료비용 및 제증명수수료",
    feesNotice:
      "현재 실제 병원 가격표가 제공되지 않아 항목별 금액을 게시하지 않았습니다. 아래 표는 디자인 예시이며 공식 비용 고지가 아닙니다.",
    feesColumns: ["구분", "항목", "금액 (원)"],
    feesPending: "[확인 필요: 병원에서 승인한 실제 비급여·제증명 가격표]",
    policyMark: "AHN'S POLICY",
    scrollAction: "자세히 살펴보기",
  },
  en: {
    eyebrow: "AHN'S PLASTIC SURGERY · PATIENT INFORMATION",
    overview: "Clarity inspires confidence.",
    contents: "On this page",
    sectionWord: "Sections",
    closeHeading: "Care begins with clarity.",
    closeDescription:
      "For further details, please contact the clinic. We aim to make important information easier to understand.",
    feesLabel: "Non-covered medical fees and certificate charges",
    feesNotice:
      "The clinic's verified fee schedule has not yet been supplied. The table is a layout placeholder, not an official fee disclosure.",
    feesColumns: ["Category", "Item", "Fee (KRW)"],
    feesPending:
      "[VERIFY: Actual non-covered and certificate fees approved by the clinic]",
    policyMark: "AHN'S POLICY",
    scrollAction: "Explore the details",
  },
  ja: {
    eyebrow: "AHN'S PLASTIC SURGERY · 患者さまへのご案内",
    overview: "明確なご案内から、信頼へ。",
    contents: "このページの目次",
    sectionWord: "ご案内項目",
    closeHeading: "Care begins with clarity.",
    closeDescription:
      "ご不明点は医院までお問い合わせください。大切な情報をわかりやすくお伝えできるよう努めます。",
    feesLabel: "自由診療料金・証明書発行手数料",
    feesNotice:
      "正式な料金表が未提供のため、項目別の金額を掲載していません。以下はレイアウト例であり、正式な料金告知ではありません。",
    feesColumns: ["区分", "項目", "料金（KRW）"],
    feesPending: "［要確認：医院が承認した料金表］",
    policyMark: "AHN'S POLICY",
    scrollAction: "詳しく見る",
  },
  "zh-CN": {
    eyebrow: "AHN'S PLASTIC SURGERY · 患者须知",
    overview: "清晰的信息，值得信赖的关怀。",
    contents: "本页目录",
    sectionWord: "公告条款",
    closeHeading: "Care begins with clarity.",
    closeDescription:
      "如需进一步了解，请联系医院。我们致力于提供清晰易懂的信息。",
    feesLabel: "非医保诊疗费用及证明文件收费",
    feesNotice:
      "目前尚未提供经医院确认的实际价目表，以下表格仅用于展示布局，不构成正式的收费公示。",
    feesColumns: ["类别", "项目", "金额（韩元）"],
    feesPending: "【待核实：医院批准的实际价目表】",
    policyMark: "AHN'S POLICY",
    scrollAction: "查看详情",
  },
  "zh-TW": {
    eyebrow: "AHN'S PLASTIC SURGERY · 患者須知",
    overview: "清楚的資訊，值得信賴的關懷。",
    contents: "本頁目錄",
    sectionWord: "公告條款",
    closeHeading: "Care begins with clarity.",
    closeDescription:
      "如需進一步瞭解，請聯絡院所。我們致力於提供清楚易懂的資訊。",
    feesLabel: "非健保診療費用及證明文件收費",
    feesNotice:
      "目前尚未提供經院所確認的實際價目表，以下表格僅供版面展示，不構成正式收費公告。",
    feesColumns: ["類別", "項目", "金額（韓元）"],
    feesPending: "【待確認：院所核准的實際價目表】",
    policyMark: "AHN'S POLICY",
    scrollAction: "查看詳情",
  },
};

const decorativeLabels: Record<EditorialKind, string> = {
  privacy: "Privacy & trust.",
  terms: "Our commitment.",
  "non-covered-fees": "Transparency in care.",
  "reservation-policy": "Your visit, thoughtfully planned.",
};

const shortCodes: Record<EditorialKind, string> = {
  privacy: "PRIVACY",
  terms: "TERMS",
  "non-covered-fees": "FEES",
  "reservation-policy": "RESERVATION",
};

const sectionId = (index: number) =>
  `legal-section-${String(index + 1).padStart(2, "0")}`;
const sectionNumber = (index: number) => String(index + 1).padStart(2, "0");

/**
 * 법적 안내 4개 페이지의 공통 에디토리얼 레이아웃.
 * 환자의 권리와 의무는 같은 시각적 톤의 전용 카드 레이아웃을 사용합니다.
 * 모든 실제 조항은 기존 legalContent에서 그대로 읽어 원문을 변경하지 않습니다.
 */
export default function LegalDocument({ kind }: { kind: EditorialKind }) {
  const detected = useLocale();
  const locale = isAppLocale(detected) ? detected : defaultLocale;
  const copy = editorialCopy[locale];
  const ui = legalUi[locale];
  const document = legalContent[locale][kind];
  const isFees = kind === "non-covered-fees";
  const isReservation = kind === "reservation-policy";

  return (
    <S.Page>
      <S.Hero aria-labelledby="legal-title">
        <S.HeroInner>
          <S.HeroContent>
            <S.Eyebrow>
              <S.EyebrowRule />
              {copy.eyebrow}
            </S.Eyebrow>
            <S.HeroTitle id="legal-title">{document.title}</S.HeroTitle>
            <S.HeroScript>{decorativeLabels[kind]}</S.HeroScript>
            <S.HeroLead>{document.lead}</S.HeroLead>
            <S.HeroAction href="#legal-content">
              {copy.scrollAction} <span aria-hidden="true">↘</span>
            </S.HeroAction>
          </S.HeroContent>
          <S.HeroArtwork aria-hidden="true">
            <S.ArtOuter />
            <S.ArtInner />
            <S.ArtLetter>A</S.ArtLetter>
            <S.ArtCaption>
              AHN&apos;S
              <br />
              PLASTIC SURGERY
            </S.ArtCaption>
          </S.HeroArtwork>
        </S.HeroInner>
        <S.HeroFoot>
          <span>{shortCodes[kind]} / 2026</span>
          <span>{copy.overview}</span>
        </S.HeroFoot>
      </S.Hero>

      <S.IntroBand id="legal-content">
        <S.Container>
          <S.IntroHead>
            <S.IntroKicker>
              {copy.policyMark} <span aria-hidden="true">—</span>{" "}
              {shortCodes[kind]}
            </S.IntroKicker>
            <S.IntroTitle>{ui.nav[kind]}</S.IntroTitle>
            <S.IntroCount>
              {String(document.sections.length).padStart(2, "0")}{" "}
              <small>{copy.sectionWord}</small>
            </S.IntroCount>
          </S.IntroHead>
          <S.ReviewNote aria-label={ui.draft}>
            <S.ReviewMarker aria-hidden="true">i</S.ReviewMarker>
            <S.ReviewCopy>
              <strong>{ui.draft}</strong>
              <span>
                {ui.draftDescription} {ui.reviewRequired}
              </span>
            </S.ReviewCopy>
          </S.ReviewNote>
        </S.Container>
      </S.IntroBand>

      {isFees && (
        <S.FeesSection aria-labelledby="fees-table-title">
          <S.Container>
            <S.FeesHeading id="fees-table-title">
              {copy.feesLabel}
            </S.FeesHeading>
            <S.FeesDescription>{copy.feesNotice}</S.FeesDescription>
            <S.FeesTableScroll>
              <S.FeesTable>
                <thead>
                  <tr>
                    {copy.feesColumns.map((column) => (
                      <th key={column} scope="col">
                        {column}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan={3}>{copy.feesPending}</td>
                  </tr>
                </tbody>
              </S.FeesTable>
            </S.FeesTableScroll>
            <S.FeesWarning>{ui.noPrices}</S.FeesWarning>
          </S.Container>
        </S.FeesSection>
      )}

      <S.BodySection $variant={kind}>
        <S.Container>
          {isReservation ? (
            <S.TimelineGrid>
              {document.sections.map((section, index) => (
                <S.TimelineCard
                  key={`${kind}-${locale}-${index}`}
                  id={sectionId(index)}
                >
                  <S.CardTop>
                    <S.CardNumber>{sectionNumber(index)}</S.CardNumber>
                    <S.CardIcon aria-hidden="true">↗</S.CardIcon>
                  </S.CardTop>
                  <S.CardTitle>{section.heading}</S.CardTitle>
                  <S.CardText>{section.body}</S.CardText>
                  <S.CardUnderline aria-hidden="true" />
                </S.TimelineCard>
              ))}
            </S.TimelineGrid>
          ) : (
            <S.ReadingLayout>
              <S.IndexNav aria-label={copy.contents}>
                <S.IndexSticky>
                  <S.IndexEyebrow>{shortCodes[kind]}</S.IndexEyebrow>
                  <S.IndexHeading>{copy.contents}</S.IndexHeading>
                  <S.IndexItems>
                    {document.sections.map((section, index) => (
                      <S.IndexLink
                        key={`${kind}-nav-${index}`}
                        href={`#${sectionId(index)}`}
                      >
                        <span>{sectionNumber(index)}</span>
                        <span>{section.heading}</span>
                      </S.IndexLink>
                    ))}
                  </S.IndexItems>
                </S.IndexSticky>
              </S.IndexNav>
              <S.ArticleColumn>
                {document.sections.map((section, index) => (
                  <S.ArticleCard
                    key={`${kind}-${locale}-${index}`}
                    id={sectionId(index)}
                  >
                    <S.ArticleHead>
                      <S.ArticleNumber>{sectionNumber(index)}</S.ArticleNumber>
                      <S.ArticleHeading>{section.heading}</S.ArticleHeading>
                    </S.ArticleHead>
                    <S.ArticleBody>{section.body}</S.ArticleBody>
                  </S.ArticleCard>
                ))}
              </S.ArticleColumn>
            </S.ReadingLayout>
          )}
        </S.Container>
      </S.BodySection>

      <S.ClosingSection>
        <S.Container>
          <S.ClosingGrid>
            <div>
              <S.ClosingKicker>{copy.policyMark}</S.ClosingKicker>
              <S.ClosingTitle>{copy.closeHeading}</S.ClosingTitle>
            </div>
            <S.ClosingDescription>{copy.closeDescription}</S.ClosingDescription>
          </S.ClosingGrid>
          <S.OtherPolicies aria-label={ui.subtitle}>
            {legalKinds.map((entry) => (
              <S.PolicyLink
                key={entry}
                href={localizedPath(legalPaths[entry], locale)}
                $active={entry === kind}
                aria-current={entry === kind ? "page" : undefined}
              >
                <span>{ui.nav[entry]}</span>
                <span aria-hidden="true">↗</span>
              </S.PolicyLink>
            ))}
          </S.OtherPolicies>
          <S.BackHome href={localizedPath("/", locale)}>
            {ui.backHome} <span aria-hidden="true">↗</span>
          </S.BackHome>
        </S.Container>
      </S.ClosingSection>
    </S.Page>
  );
}
