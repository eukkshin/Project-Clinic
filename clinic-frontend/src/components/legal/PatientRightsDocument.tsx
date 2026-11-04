"use client";

import { useLocale } from "next-intl";

import { AppLocale, defaultLocale, isAppLocale } from "@/i18n/config";
import { localizedPath } from "@/i18n/url";
import {
  legalContent,
  legalKinds,
  legalPaths,
  legalUi,
} from "@/lib/legal/content";

import * as S from "./PatientRightsDocument.styles";

type Copy = {
  eyebrow: string;
  displayLine: string;
  rightsTitle: string;
  rightsDescription: string;
  dutiesTitle: string;
  dutiesDescription: string;
  rightsJump: string;
  dutiesJump: string;
  rightsSmall: string;
  dutiesSmall: string;
  closingTitle: string;
  closingText: string;
};

const textByLocale: Record<AppLocale, Copy> = {
  ko: {
    eyebrow: "환자 안내 · AHN'S PLASTIC SURGERY",
    displayLine: "Respect in every detail.",
    rightsTitle: "환자의 권리",
    rightsDescription: "존중받고, 충분히 설명받고, 스스로 선택할 권리",
    dutiesTitle: "환자의 의무",
    dutiesDescription: "더 안전한 진료를 위해 함께 지켜야 할 약속",
    rightsJump: "환자의 권리 살펴보기",
    dutiesJump: "환자의 의무 살펴보기",
    rightsSmall: "PATIENT RIGHTS",
    dutiesSmall: "PATIENT RESPONSIBILITIES",
    closingTitle: "Respect goes both ways.",
    closingText:
      "안스성형외과는 환자 한 분 한 분의 존엄과 선택을 존중하며, 신뢰를 바탕으로 한 진료 환경을 지향합니다.",
  },
  en: {
    eyebrow: "PATIENT INFORMATION · AHN'S PLASTIC SURGERY",
    displayLine: "Respect in every detail.",
    rightsTitle: "Your Rights",
    rightsDescription:
      "Be respected, be informed, and make your own decisions.",
    dutiesTitle: "Your Responsibilities",
    dutiesDescription: "Shared commitments that support safe, thoughtful care.",
    rightsJump: "Explore your rights",
    dutiesJump: "Explore your responsibilities",
    rightsSmall: "PATIENT RIGHTS",
    dutiesSmall: "PATIENT RESPONSIBILITIES",
    closingTitle: "Respect goes both ways.",
    closingText:
      "At AHN'S, we value each patient's dignity and choices and strive for a caring environment built on trust.",
  },
  ja: {
    eyebrow: "患者さまへのご案内 · AHN'S PLASTIC SURGERY",
    displayLine: "Respect in every detail.",
    rightsTitle: "患者の権利",
    rightsDescription: "尊重され、十分な説明を受け、自ら選ぶために。",
    dutiesTitle: "患者の義務",
    dutiesDescription: "より安全な診療のために、ともに守る約束。",
    rightsJump: "患者の権利を見る",
    dutiesJump: "患者の義務を見る",
    rightsSmall: "PATIENT RIGHTS",
    dutiesSmall: "PATIENT RESPONSIBILITIES",
    closingTitle: "Respect goes both ways.",
    closingText:
      "AHN'Sは患者さま一人ひとりの尊厳と選択を尊重し、信頼に基づく診療環境を目指します。",
  },
  "zh-CN": {
    eyebrow: "患者须知 · AHN'S PLASTIC SURGERY",
    displayLine: "Respect in every detail.",
    rightsTitle: "患者权利",
    rightsDescription: "获得尊重、充分知情，并自主作出选择。",
    dutiesTitle: "患者义务",
    dutiesDescription: "为了安全就诊，需要共同遵守的约定。",
    rightsJump: "了解患者权利",
    dutiesJump: "了解患者义务",
    rightsSmall: "PATIENT RIGHTS",
    dutiesSmall: "PATIENT RESPONSIBILITIES",
    closingTitle: "Respect goes both ways.",
    closingText:
      "AHN'S尊重每位患者的尊严与选择，致力于营造相互信任的诊疗环境。",
  },
  "zh-TW": {
    eyebrow: "患者須知 · AHN'S PLASTIC SURGERY",
    displayLine: "Respect in every detail.",
    rightsTitle: "患者權利",
    rightsDescription: "獲得尊重、充分知情，並自主做出選擇。",
    dutiesTitle: "患者義務",
    dutiesDescription: "為了安全就醫，需要共同遵守的約定。",
    rightsJump: "了解患者權利",
    dutiesJump: "了解患者義務",
    rightsSmall: "PATIENT RIGHTS",
    dutiesSmall: "PATIENT RESPONSIBILITIES",
    closingTitle: "Respect goes both ways.",
    closingText:
      "AHN'S尊重每位患者的尊嚴與選擇，致力於營造相互信任的診療環境。",
  },
};

// 콘텐츠 원문은 기존 법적 안내 데이터에서 그대로 읽습니다.
// 제목 앞의 목록 번호만 카드 상단의 시각적 번호와 중복되지 않게 제거합니다.
function stripHeadingNumber(heading: string) {
  return heading.replace(/^(?:\d+[.)]|[一二三四五六七八九十]+、)\s*/u, "");
}

export default function PatientRightsDocument() {
  const detected = useLocale();
  const locale = isAppLocale(detected) ? detected : defaultLocale;
  const copy = textByLocale[locale];
  const ui = legalUi[locale];
  const doc = legalContent[locale]["patient-rights"];
  const rights = doc.sections.slice(0, 4);
  const duties = doc.sections.slice(4);

  return (
    <S.Page>
      <S.Hero aria-labelledby="patient-page-title">
        <S.HeroInner>
          <S.HeroCopy>
            <S.Eyebrow>
              <S.EyebrowRule />
              {copy.eyebrow}
            </S.Eyebrow>
            <S.HeroTitle id="patient-page-title">{doc.title}</S.HeroTitle>
            <S.HeroAccent>{copy.displayLine}</S.HeroAccent>
            <S.HeroLead>{doc.lead}</S.HeroLead>
            <S.HeroActions aria-label={doc.title}>
              <S.HeroAnchor href="#patient-rights-section">
                {copy.rightsJump} <span aria-hidden="true">↘</span>
              </S.HeroAnchor>
              <S.HeroAnchor href="#patient-duties-section" $secondary>
                {copy.dutiesJump} <span aria-hidden="true">↘</span>
              </S.HeroAnchor>
            </S.HeroActions>
          </S.HeroCopy>
          <S.HeroArt aria-hidden="true">
            <S.ArtRing $first />
            <S.ArtRing />
            <S.ArtMonogram>A</S.ArtMonogram>
            <S.ArtSignature>
              AHN'S
              <br />
              PLASTIC SURGERY
            </S.ArtSignature>
          </S.HeroArt>
        </S.HeroInner>
        <S.HeroBottom aria-hidden="true">
          <span>01 / {copy.rightsSmall}</span>
          <span>02 / {copy.dutiesSmall}</span>
        </S.HeroBottom>
      </S.Hero>

      <S.RightsSection
        id="patient-rights-section"
        aria-labelledby="rights-title"
      >
        <S.SectionInner>
          <S.SectionIntro>
            <S.SectionMeta>
              <span>01</span>
              <S.MetaLine />
              {copy.rightsSmall}
            </S.SectionMeta>
            <S.SectionTitle id="rights-title">
              {copy.rightsTitle}
            </S.SectionTitle>
            <S.SectionDescription>
              {copy.rightsDescription}
            </S.SectionDescription>
          </S.SectionIntro>
          <S.RightsGrid role="list">
            {rights.map((section, index) => (
              <S.RightsCard key={`${locale}-right-${index}`} role="listitem">
                <S.CardTop>
                  <S.CardNumber>
                    {String(index + 1).padStart(2, "0")}
                  </S.CardNumber>
                  <S.CardMark aria-hidden="true">✳</S.CardMark>
                </S.CardTop>
                <S.CardTitle>{stripHeadingNumber(section.heading)}</S.CardTitle>
                <S.CardBody>{section.body}</S.CardBody>
                <S.CardBottomLine aria-hidden="true" />
              </S.RightsCard>
            ))}
          </S.RightsGrid>
        </S.SectionInner>
      </S.RightsSection>

      <S.DutiesSection
        id="patient-duties-section"
        aria-labelledby="duties-title"
      >
        <S.DutiesInner>
          <S.DutiesIntro>
            <S.SectionMeta $light>
              <span>02</span>
              <S.MetaLine />
              {copy.dutiesSmall}
            </S.SectionMeta>
            <S.DutiesTitle id="duties-title">{copy.dutiesTitle}</S.DutiesTitle>
            <S.DutiesDescription>{copy.dutiesDescription}</S.DutiesDescription>
          </S.DutiesIntro>
          <S.DutiesGrid role="list">
            {duties.map((section, index) => (
              <S.DutyCard key={`${locale}-duty-${index}`} role="listitem">
                <S.DutyNumber>
                  {String(index + 5).padStart(2, "0")}
                </S.DutyNumber>
                <S.DutyTitle>{stripHeadingNumber(section.heading)}</S.DutyTitle>
                <S.DutyBody>{section.body}</S.DutyBody>
                <S.DutyArrow aria-hidden="true">↗</S.DutyArrow>
              </S.DutyCard>
            ))}
          </S.DutiesGrid>
        </S.DutiesInner>
      </S.DutiesSection>

      <S.ClosingSection>
        <S.ClosingInner>
          <S.ClosingHeadline>{copy.closingTitle}</S.ClosingHeadline>
          <S.ClosingText>{copy.closingText}</S.ClosingText>
          <S.DraftNote aria-label={ui.draft}>
            <strong>{ui.draft}</strong>
            <p>{ui.draftDescription}</p>
            <p>{ui.reviewRequired}</p>
          </S.DraftNote>
          <S.LegalNav aria-label={ui.subtitle}>
            {legalKinds.map((kind) => (
              <S.LegalLink
                key={kind}
                href={localizedPath(legalPaths[kind], locale)}
                $active={kind === "patient-rights"}
                aria-current={kind === "patient-rights" ? "page" : undefined}
              >
                {ui.nav[kind]}
              </S.LegalLink>
            ))}
          </S.LegalNav>
          <S.BackHome href={localizedPath("/", locale)}>
            {ui.backHome} <span aria-hidden="true">↗</span>
          </S.BackHome>
        </S.ClosingInner>
      </S.ClosingSection>
    </S.Page>
  );
}
