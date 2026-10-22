import CategoryNav from "@/components/CategoryNav";
import CircularOverlay from "@/components/CircularOverlay";
import Hero from "@/components/hero/Hero";
import { SafetySlider } from "@/components/main/SafetySlider";
import Selfies from "@/components/main/Selfies";
import VlogSafetyFlow from "@/components/main/VlogSafetyFlow";
import { VlogSlider } from "@/components/main/VlogSlider";
import RollingBanner from "@/components/RollingBanner";

/**
 * 홈페이지 섹션 구성.
 * Home()은 서버 컴포넌트로 유지한다.
 * Hero/SignatureGallery 내부에서만 GSAP 등 클라이언트 기능을 실행한다.
 */
export default function Home() {
  return (
    <>
      {/*
        RollingBanner를 Hero의 rollingBanner prop으로 전달한다.
        이전처럼 <Hero /> 아래에 <RollingBanner />를 별도로 넣지 않는다.
        → 한 번만 렌더링되고, Hero 중앙에 겹쳐 표시된다.
        → Hero 스크롤 인터랙션이 시작되면 자연스럽게 사라진다.
      */}
      <Hero rollingBanner={<RollingBanner />} />

      <CategoryNav />
      <Selfies />
      <CircularOverlay />
      <VlogSafetyFlow vlog={<VlogSlider />} safety={<SafetySlider />} />
    </>
  );
}
