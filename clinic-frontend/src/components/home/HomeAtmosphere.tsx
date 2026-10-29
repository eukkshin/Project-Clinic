"use client";

import type { ReactNode } from "react";
import { HomeCanvas } from "@/assets/css/components/HomeAtmosphere.styles";

export default function HomeAtmosphere({ children }: { children: ReactNode }) {
  return <HomeCanvas data-editorial-home>{children}</HomeCanvas>;
}
