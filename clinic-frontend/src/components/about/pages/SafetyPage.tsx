"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { useState } from "react";

import * as S from "@/components/about/pages/AboutPages.styles";
import {
  AboutBottom,
  AboutFrame,
} from "@/components/about/shared/AboutFoundation";
import HangulTyping from "@/components/ui/TypingText";

// 미확인 장비·인증·의료인력·응급체계 등의 구체적 사실을 주장하지 않는 원칙 소개용 텍스트.
const steps = [
  {
    no: "01",
    en: "LISTEN",
    labelKey: "step1Label",
    textKey: "step1Text",
  },
  {
    no: "02",
    en: "EXPLAIN",
    labelKey: "step2Label",
    textKey: "step2Text",
  },
  {
    no: "03",
    en: "DECIDE",
    labelKey: "step3Label",
    textKey: "step3Text",
  },
  {
    no: "04",
    en: "FOLLOW",
    labelKey: "step4Label",
    textKey: "step4Text",
  },
] as const;

export default function SafetyPage() {
  const [active, setActive] = useState(0);
  const t = useTranslations("About");
  return (
    <AboutFrame>
      <S.SafetyHero>
        <S.Container>
          <S.Eyebrow data-about-reveal>04 / OUR COMMITMENT</S.Eyebrow>
          <S.FacilitiesCopy style={{ padding: "38px 0 0" }}>
            <S.Title data-about-reveal>
              {t("safety.hero1")}
              <br />
              {t("safety.hero2")}
              <br />
              <em>
                <HangulTyping text={t("safety.hero3")} speed={90} />
              </em>
            </S.Title>
            <S.Body
              data-about-reveal
              style={{ maxWidth: 460, color: S.C.muted, alignSelf: "end" }}
            >
              {t("safety.heroDesc")}
            </S.Body>
          </S.FacilitiesCopy>
        </S.Container>
      </S.SafetyHero>
      <S.SafetyStage>
        <S.Container>
          <S.Eyebrow data-about-reveal>
            THE JOURNEY / FOUR THOUGHTFUL STEPS
          </S.Eyebrow>
          <S.SectionTitle data-about-reveal style={{ marginTop: 28 }}>
            {t("safety.stage1")}
            <br />
            {t("safety.stage2")}
          </S.SectionTitle>
          <S.SafetyFlowDiagram
            aria-hidden="true"
            viewBox="0 0 1100 125"
            fill="none"
          >
            <path
              d="M40 62 H1060"
              stroke="rgba(255,255,255,.24)"
              strokeWidth="1"
            />
            {steps.map((item, index) => (
              <g key={item.no}>
                <circle
                  cx={40 + index * 340}
                  cy="62"
                  r="17"
                  stroke="rgba(255,255,255,.5)"
                  strokeWidth="1"
                  fill={index === active ? "#E4E6D9" : "#1B3528"}
                />
                <circle
                  cx={40 + index * 340}
                  cy="62"
                  r="4"
                  fill={index === active ? "#1B3528" : "#E4E6D9"}
                />
              </g>
            ))}
            <path
              d={`M40 62 H${40 + active * 340}`}
              stroke="#E7E9D8"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </S.SafetyFlowDiagram>
          <S.SafetyTimeline role="group" aria-label={t("safety.stepsLabel")}>
            {steps.map((step, index) => (
              <S.SafetyStep
                type="button"
                key={step.no}
                $active={active === index}
                onClick={() => setActive(index)}
                aria-pressed={active === index}
              >
                <span>
                  {step.no} / {step.en}
                </span>
                <strong>{t(`safety.${step.labelKey}`)}</strong>
                <span aria-hidden="true">{active === index ? "●" : "↗"}</span>
              </S.SafetyStep>
            ))}
          </S.SafetyTimeline>
          <S.SafetyDetail aria-live="polite" key={active}>
            <S.Eyebrow>{steps[active].no} / 04</S.Eyebrow>
            <div>
              <h3>{t(`safety.${steps[active].labelKey}`)}</h3>
              <p>{t(`safety.${steps[active].textKey}`)}</p>
            </div>
          </S.SafetyDetail>
        </S.Container>
      </S.SafetyStage>
      <S.SafetyNotes>
        <S.Container>
          <S.Eyebrow data-about-reveal>PRINCIPLES / THE FOUNDATION</S.Eyebrow>
          <div style={{ marginTop: 65 }}>
            {[
              {
                n: "01",
                titleKey: "note1Title",
                descKey: "note1Desc",
              },
              {
                n: "02",
                titleKey: "note2Title",
                descKey: "note2Desc",
              },
              {
                n: "03",
                titleKey: "note3Title",
                descKey: "note3Desc",
              },
            ].map((item) => (
              <S.SafetyNote data-about-reveal key={item.n}>
                <div>
                  <S.Eyebrow>{item.n} / PRINCIPLE</S.Eyebrow>
                  <h3 style={{ marginTop: 25 }}>
                    {t(`safety.${item.titleKey}`)}
                  </h3>
                </div>
                <S.Body style={{ color: S.C.muted, maxWidth: 510 }}>
                  {t(`safety.${item.descKey}`)}
                </S.Body>
              </S.SafetyNote>
            ))}
          </div>
          <S.EditorialLink
            as={Link}
            href="/about/philosophy"
            style={{ marginTop: 45 }}
          >
            {t("safety.philosophyLink")} <span aria-hidden="true">↗</span>
          </S.EditorialLink>
        </S.Container>
      </S.SafetyNotes>
      <AboutBottom title={t("safety.bottomTitle")} />
    </AboutFrame>
  );
}
