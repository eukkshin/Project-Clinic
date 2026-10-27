import styled from "styled-components";

export const PageRoot = styled.div`
  position: relative;
  width: 100%;
  min-width: 0;
  background: #f8f7f3;
  color: #244535;
`;

export const Main = styled.main`
  width: 100%;
  min-width: 0;
  /* 콘텐츠에 별도 좌측 컬럼을 예약하지 않음: Hero 포함 전체 가로폭 사용 */
`;

export const Section = styled.section<{ $alternate: boolean }>`
  width: 100%;
  min-height: min(730px, 82svh);
  padding: clamp(100px, 12vw, 160px) clamp(26px, 8vw, 130px);
  box-sizing: border-box;
  display: flex;
  align-items: center;
  background: ${({ $alternate }) => $alternate ? "#eff2ec" : "#f8f7f3"};
  scroll-margin-top: 100px;

  @media (max-width: 768px) {
    min-height: 520px;
    padding: 94px 24px;
  }
`;

export const SectionInner = styled.div`
  width: min(100%, 1120px);
  margin: 0 auto;
`;

export const SectionEyebrow = styled.p`
  margin: 0 0 15px;
  font-size: 12px;
  font-weight: 700;
  color: #76907a;
  letter-spacing: .22em;
`;

export const SectionTitle = styled.h2`
  margin: 0 0 34px;
  color: #244535;
  font-size: clamp(31px, 3.7vw, 58px);
  font-weight: 600;
  line-height: 1.28;
  letter-spacing: -.05em;
  word-break: keep-all;
`;

export const SectionDescription = styled.p`
  margin: 0;
  max-width: 760px;
  white-space: pre-line;
  font-size: clamp(15px, 1.4vw, 19px);
  color: #53695c;
  line-height: 2.0;
  word-break: keep-all;
`;

export const IntroGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr minmax(250px, .9fr);
  gap: clamp(30px, 5vw, 80px);
  align-items: center;
  @media (max-width: 768px) { grid-template-columns: 1fr; }
`;

export const IntroMedia = styled.div`
  position: relative;
  overflow: hidden;
  border-radius: 22px;
  background: #e5eae1;
  aspect-ratio: 5 / 4;
`;

export const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 220px), 1fr));
  gap: 18px;
`;

export const FeatureCard = styled.div`
  padding: 36px 30px;
  min-height: 155px;
  background: rgba(255,255,255,.73);
  border: 1px solid rgba(77,109,83,.13);
  border-radius: 20px;
  box-shadow: 0 8px 28px rgba(27,77,62,.035);
  color: #31513e;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 20px;
  font-size: 18px;
  line-height: 1.5;
  word-break: keep-all;

  & span { color: #9bb09d; font-size: 12px; font-weight: 700; }
`;

export const ProcessList = styled.ol`
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 210px), 1fr));
  gap: 20px;
`;

export const ProcessItem = styled.li`
  padding: 32px 24px;
  border-top: 1px solid rgba(65,104,75,.4);
  color: #31513e;
  font-size: 18px;
  line-height: 1.6;
  & span { display: block; font-size: 11px; color: #829d87; margin-bottom: 25px; }
`;

export const Gallery = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 320px), 1fr));
  gap: 18px;
`;

export const GalleryItem = styled.figure`
  margin: 0;
  & img { width: 100%; height: auto; aspect-ratio: 4 / 3; object-fit: cover; border-radius: 18px; }
  & figcaption { margin-top: 10px; font-size: 13px; color: #637c68; }
`;

export const FAQList = styled.div`
  display: grid;
  gap: 12px;
  max-width: 900px;
`;

export const FAQItem = styled.details`
  border: 1px solid rgba(77,109,83,.14);
  border-radius: 14px;
  background: rgba(255,255,255,.70);
  padding: 21px 25px;
  color: #53695c;
  line-height: 1.8;
  & summary { color: #244535; font-weight: 600; cursor: pointer; }
  & p { white-space: pre-line; }
`;

export const CtaLink = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  padding: 14px 28px;
  margin-top: 28px;
  color: #fff;
  text-decoration: none;
  background: #244535;
  font-size: 14px;
  font-weight: 600;
  transition: background .25s ease, transform .25s ease;
  &:hover { background: #376c4a; transform: translateY(-2px); }
`;
