import DetailSideNav from '@/components/detail/DetailSideNav';

const sections = [
  { id: 'intro', title: '시술 소개' },
  { id: 'features', title: '시술 특징' },
  { id: 'process', title: '수술 과정' },
  { id: 'gallery', title: '전후 사진' },
  { id: 'faq', title: '자주 묻는 질문' },
];

export default function DetailLayout() {
  return (
    <>
      <DetailSideNav sections={sections} scrollOffset={100} />

      <main>
        <section id="intro">시술 소개</section>
        <section id="features">시술 특징</section>
        <section id="process">수술 과정</section>
        <section id="gallery">전후 사진</section>
        <section id="faq">FAQ</section>
      </main>
    </>
  );
}
