import Image from "next/image";

import CategoryNav from "@/components/CategoryNav";
import CircularOverlay from "@/components/CircularOverlay";
import { SafetySlider } from "@/components/main/SafetySlider";
import Selfies from "@/components/main/Selfies";
import { VlogSlider } from "@/components/main/VlogSlider";
import MainCarousel from "@/components/MainCarousel";
import RollingBanner from "@/components/RollingBanner";

export default function Home() {
  return (
    <>
      <MainCarousel />
      <RollingBanner />
      <CategoryNav />
      <Selfies />
      <CircularOverlay />
      <VlogSlider />
      <SafetySlider />
    </>
  );
}
