"use client";

import Link from 'next/link';
import { useState } from 'react';

import * as S from '@/components/about/pages/AboutPages.styles';
import { AboutBottom, AboutFrame } from '@/components/about/shared/AboutFoundation';
import HangulTyping from '@/components/ui/TypingText';

// 미확인 장비·인증·의료인력·응급체계 등의 구체적 사실을 주장하지 않는 원칙 소개용 텍스트.
const steps = [
  {
    no: "01",
    en: "LISTEN",
    label: "충분한 상담",
    text: "현재 상태와 원하는 방향, 관련 병력과 우려 사항을 충분히 이야기하는 것에서 시작합니다.",
  },
  {
    no: "02",
    en: "EXPLAIN",
    label: "명확한 설명",
    text: "가능한 방법과 한계, 주의사항에 관한 설명을 바탕으로 충분한 이해를 돕습니다.",
  },
  {
    no: "03",
    en: "DECIDE",
    label: "신중한 선택",
    text: "개인의 상태와 진료 결과를 고려하여 필요한 선택을 의료진과 상의합니다.",
  },
  {
    no: "04",
    en: "FOLLOW",
    label: "경과 확인",
    text: "진료 후 경과와 유의사항을 확인하고 궁금한 점을 이어서 상담합니다.",
  },
] as const;

export default function SafetyPage() {
  const [active, setActive] = useState(0);
  return (
    <AboutFrame>
      <S.SafetyHero>
        <S.Container>
          <S.Eyebrow data-about-reveal>04 / OUR COMMITMENT</S.Eyebrow>
          <S.FacilitiesCopy style={{ padding: "38px 0 0" }}>
            <S.Title data-about-reveal>
              보이지 않는
              <br />
              부분까지
              <br />
              <em>
                <HangulTyping text="신중하게." speed={90} />
              </em>
            </S.Title>
            <S.Body
              data-about-reveal
              style={{ maxWidth: 460, color: S.C.muted, alignSelf: "end" }}
            >
              좋은 진료는 눈에 보이는 결과만으로 완성되지 않습니다. 충분한
              설명과 신중한 판단, 진료 전후의 소통을 중요하게 생각합니다.
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
            안심을 향한
            <br />네 가지 약속.
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
          <S.SafetyTimeline role="group" aria-label="진료 원칙 단계 선택">
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
                <strong>{step.label}</strong>
                <span aria-hidden="true">{active === index ? "●" : "↗"}</span>
              </S.SafetyStep>
            ))}
          </S.SafetyTimeline>
          <S.SafetyDetail aria-live="polite" key={active}>
            <S.Eyebrow>{steps[active].no} / 04</S.Eyebrow>
            <div>
              <h3>{steps[active].label}</h3>
              <p>{steps[active].text}</p>
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
                title: "설명은 충분히, 판단은 신중히.",
                desc: "시술에 앞서 개인에게 필요한 정보와 예상할 수 있는 한계, 일반적인 유의사항을 충분히 확인하는 것을 중요하게 생각합니다.",
              },
              {
                n: "02",
                title: "서두르지 않는 상담.",
                desc: "궁금한 점을 자유롭게 묻고, 이해한 뒤 선택할 수 있는 상담의 과정을 지향합니다.",
              },
              {
                n: "03",
                title: "기본을 잊지 않는 태도.",
                desc: "진료 과정에 관한 구체적인 안내와 실제 적용 여부는 의료진의 진료 및 병원 공식 정보에 따라 확인해 주세요.",
              },
            ].map((item) => (
              <S.SafetyNote data-about-reveal key={item.n}>
                <div>
                  <S.Eyebrow>{item.n} / PRINCIPLE</S.Eyebrow>
                  <h3 style={{ marginTop: 25 }}>{item.title}</h3>
                </div>
                <S.Body style={{ color: S.C.muted, maxWidth: 510 }}>
                  {item.desc}
                </S.Body>
              </S.SafetyNote>
            ))}
          </div>
          <S.EditorialLink
            as={Link}
            href="/about/philosophy"
            style={{ marginTop: 45 }}
          >
            진료 철학 자세히 보기 <span aria-hidden="true">↗</span>
          </S.EditorialLink>
        </S.Container>
      </S.SafetyNotes>
      <AboutBottom title="충분히 알아보고, 신중히 선택하세요." />
    </AboutFrame>
  );
}
