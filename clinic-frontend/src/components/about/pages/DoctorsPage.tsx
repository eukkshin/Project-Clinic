"use client";

import Link from "next/link";

import * as S from "@/components/about/pages/AboutPages.styles";
import {
  AboutBottom,
  AboutFrame,
} from "@/components/about/shared/AboutFoundation";

export default function DoctorsPage() {
  return (
    <AboutFrame>
      <S.DoctorsHero>
        <S.Container>
          <S.Eyebrow data-about-reveal>02 / OUR PEOPLE</S.Eyebrow>
          <div style={{ height: 38 }} />
          <S.DoctorsGrid>
            <div data-about-reveal>
              <S.Title>
                기술을 넘어,
                <br />
                사람을 바라보는
                <br />
                <em>시선.</em>
              </S.Title>
              <S.Body
                style={{ maxWidth: 450, marginTop: 43, color: S.C.muted }}
              >
                의료진을 소개하는 일은 단순한 경력을 나열하는 일이 아니라,
                상담에 임하는 태도와 진료의 관점을 전하는 일이라고 생각합니다.
              </S.Body>
              <S.EditorialLink
                as={Link}
                href="/about/philosophy"
                style={{ marginTop: 55 }}
              >
                진료 철학 보기 <span aria-hidden="true">↗</span>
              </S.EditorialLink>
            </div>
            <S.PortraitPlaceholder
              data-about-reveal
              role="img"
              aria-label="실제 의료진 사진 등록 전의 추상적인 프로필 자리 표시 이미지"
            >
              <S.Eyebrow>AHN&apos;S / PEOPLE</S.Eyebrow>
              <div style={{ alignSelf: "flex-start" }}>
                <div
                  style={{
                    fontFamily: "Georgia,serif",
                    fontSize: "clamp(68px,9vw,145px)",
                    fontStyle: "italic",
                    lineHeight: 1,
                  }}
                >
                  People.
                </div>
                <p
                  style={{
                    fontSize: 12,
                    letterSpacing: ".15em",
                    marginTop: 16,
                  }}
                >
                  MEDICAL TEAM PROFILE
                </p>
              </div>
            </S.PortraitPlaceholder>
          </S.DoctorsGrid>
        </S.Container>
      </S.DoctorsHero>
      <S.DarkPanel style={{ padding: "clamp(100px,11vw,180px) 0" }}>
        <S.Container data-about-reveal>
          <S.Eyebrow>MEET THE MEDICAL TEAM</S.Eyebrow>
          <S.SectionTitle style={{ maxWidth: 880, marginTop: 36 }}>
            얼굴을 마주하는 일,
            <br />
            마음을 이해하는 일.
          </S.SectionTitle>
          <S.Body style={{ opacity: 0.72, marginTop: 35, maxWidth: 610 }}>
            의료진의 실제 사진·성함·전문 분야·학력 및 경력 정보는 확인된 공식
            자료로 등록될 예정입니다. 시안에 임의의 의사 이름이나 경력을 넣지
            않았습니다.
          </S.Body>
        </S.Container>
      </S.DarkPanel>
      <S.Container style={{ padding: "clamp(100px,10vw,175px) 0" }}>
        <S.Eyebrow data-about-reveal>PROFILE / INFORMATION</S.Eyebrow>
        <S.DoctorsSmallGrid>
          {[
            {
              n: "01",
              t: "의료진 프로필",
              d: "실제 의료진 사진과 성함이 등록되면 이 영역에 표시됩니다.",
            },
            {
              n: "02",
              t: "전문 진료 분야",
              d: "공식적으로 확인된 진료 분야와 소개 문구를 게시합니다.",
            },
            {
              n: "03",
              t: "경력 및 학술 활동",
              d: "확인된 약력·자격·학술 정보를 정리하여 안내합니다.",
            },
          ].map((item) => (
            <S.DoctorsInfoCell data-about-reveal key={item.n}>
              <S.Eyebrow>{item.n} — DETAILS</S.Eyebrow>
              <h3>{item.t}</h3>
              <p>{item.d}</p>
            </S.DoctorsInfoCell>
          ))}
        </S.DoctorsSmallGrid>
      </S.Container>
      <AboutBottom title="대화가 진료의 시작이 됩니다." />
    </AboutFrame>
  );
}
