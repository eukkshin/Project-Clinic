"use client";

import { useServerInsertedHTML } from "next/navigation";
import React, { useState } from "react";
import { ServerStyleSheet, StyleSheetManager } from "styled-components";

export default function StyledComponentsRegistry({
  children,
}: {
  children: React.ReactNode;
}) {
  const [styledComponentsStyleSheet, setStyledComponentsStyleSheet] = useState(
    () => new ServerStyleSheet(),
  );

  useServerInsertedHTML(() => {
    const styles = styledComponentsStyleSheet.getStyleElement();
    // 메모리 누수를 막고, 이후 랜더링 시 스타일이 중복으로 쌓이는 것을 방지하기 위해 스타일 바구니를 한번 비워줌(초기화)
    styledComponentsStyleSheet.instance.clearTag();
    return <>{styles}</>;
  });

  //브라우저 환경에서는 이미 서버에서 스타일을 다 받아온 상태이므로
  //스타일 수집 과정을 생략하고 하위 요소 (children)를 그대로 랜더링함
  if (typeof window !== "undefined") {
    return <>{children}</>;
  }

  return (
    <StyleSheetManager sheet={styledComponentsStyleSheet.instance}>
      {children}
    </StyleSheetManager>
  );
}
