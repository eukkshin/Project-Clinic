"use client";

import Image from 'next/image';
import Link from 'next/link';

import * as S from '@/components/about/pages/AboutPages.styles';
import { AboutBottom, AboutFrame } from '@/components/about/shared/AboutFoundation';
import HangulTyping from '@/components/ui/TypingText';

const beliefs = [
  {
    num: "01 /",
    title: "먼저, 충분히 듣습니다.",
    body: "어떤 부분이 고민인지, 무엇을 기대하는지 귀 기울이는 것에서 대화를 시작합니다. 상담의 출발점은 시술이 아니라 사람입니다.",
  },
  {
    num: "02 /",
    title: "조화를 함께 생각합니다.",
    body: "누구에게나 같은 답을 제시하기보다 개인의 상태와 전체적인 균형을 고려해 가능한 방향을 설명하는 것을 중요하게 생각합니다.",
  },
  {
    num: "03 /",
    title: "선택을 존중합니다.",
    body: "시술 방법뿐 아니라 예상 가능한 한계와 유의사항까지 충분히 이해하고 결정할 수 있도록 돕는 진료를 지향합니다.",
  },
];

export default function PhilosophyPage() {
  return (
    <AboutFrame>
      <S.PhilosophyHero>
        <S.Container>
          <S.Eyebrow data-about-reveal>01 / OUR PHILOSOPHY</S.Eyebrow>
          <S.PhilosophyHeroGrid>
            <div data-about-reveal style={{ paddingTop: 55 }}>
              <S.Title>
                아름다움보다
                <br />
                먼저 생각하는
                <br />
                <em>
                  <HangulTyping text="한 사람." speed={90} />
                </em>
              </S.Title>
              <S.Body
                style={{ marginTop: 40, maxWidth: 425, color: S.C.muted }}
              >
                아름다움은 정해진 하나의 기준이 아니라, 각자의 얼굴과 이야기에
                맞게 발견하는 조화라고 생각합니다.
              </S.Body>
            </div>
            <S.PhilosophyImage data-about-reveal>
              <Image
                src="/images/about/philosophy-hero.webp"
                alt="부드러운 자연광 아래 섬세한 인물 사진"
                fill
                priority
                sizes="(max-width: 800px) 90vw, 43vw"
              />
            </S.PhilosophyImage>
          </S.PhilosophyHeroGrid>
        </S.Container>
      </S.PhilosophyHero>
      <S.PhilosophyRail>
        <S.Container>
          <S.Eyebrow data-about-reveal>
            OUR THREE PRINCIPLES / 세 가지 관점
          </S.Eyebrow>
          <div style={{ height: 75 }} />
          {beliefs.map((item) => (
            <S.PhilosophyRow data-about-reveal key={item.num}>
              <span>{item.num}</span>
              <h3>{item.title}</h3>
              <S.Body style={{ color: S.C.muted, maxWidth: 400 }}>
                {item.body}
              </S.Body>
            </S.PhilosophyRow>
          ))}
        </S.Container>
      </S.PhilosophyRail>
      <S.PhilosophyQuote>
        <S.Container data-about-reveal>
          <S.Eyebrow>THE ART OF LISTENING</S.Eyebrow>
          <blockquote>
            좋은 선택의 시작은
            <br />
            충분한 이해에서 비롯됩니다.
          </blockquote>
          <p>AN APPROACH BUILT AROUND YOU</p>
          <div style={{ marginTop: 55 }}>
            <S.EditorialLink as={Link} href="/about/doctors">
              의료진 알아보기 <span aria-hidden="true">↗</span>
            </S.EditorialLink>
          </div>
        </S.Container>
      </S.PhilosophyQuote>
      <AboutBottom />
    </AboutFrame>
  );
}
