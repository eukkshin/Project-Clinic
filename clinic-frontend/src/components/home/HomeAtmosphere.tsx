"use client";

import { HomeCanvas } from "@/components/home/HomeAtmosphere.styles";
import type { ReactNode } from "react";

export default function HomeAtmosphere({ children }: { children: ReactNode }) {
  return <HomeCanvas data-editorial-home>{children}</HomeCanvas>;
}
