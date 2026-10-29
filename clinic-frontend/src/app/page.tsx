import CategoryNav from "@/components/home/CategoryNav";
import CircularOverlay from "@/components/home/CircularOverlay";
import EditorialExperience from "@/components/home/EditorialExperience";
import Hero from "@/components/home/Hero";
import HomeAtmosphere from "@/components/home/HomeAtmosphere";
import RollingBanner from "@/components/home/RollingBanner";
import { SafetySlider } from "@/components/home/SafetySlider";
import Selfies from "@/components/home/Selfies";
import VlogSafetyFlow from "@/components/home/VlogSafetyFlow";
import { VlogSlider } from "@/components/home/VlogSlider";

/**
 * 전체 메인페이지는 Server Component로 유지한다.
 *
 * 마지막 두 콘텐츠를 VlogSafetyFlow에 전달하는 이유:
 * VlogSlider와 SafetySlider는 기존 DB 연동을 담당한다.
 * 그 두 컴포넌트를 수정하지 않고 그 사이에만 브랜드 장면을 추가하고,
 *
 * 세 장면의 배경을 VlogSafetyFlow 하나에서 그리기 위해서다.
 */
export default function Home() {
  return (
    <HomeAtmosphere>
      <EditorialExperience />
      {/* Full-Bleed Hero와 중앙 RollingBanner */}
      <Hero rollingBanner={<RollingBanner />} />

      {/* DB 연동 가로 진료 갤러리 */}
      <CategoryNav />

      {/* 기존 후기/이벤트 인터랙션 유지 */}
      <Selfies />
      <CircularOverlay />

      {/* 단일 그라데이션 배경으로 이어지는 3장면 */}
      <VlogSafetyFlow vlog={<VlogSlider />} safety={<SafetySlider />} />
    </HomeAtmosphere>
  );
}
