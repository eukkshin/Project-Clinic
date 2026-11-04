"use client";

import * as S from "@/components/auth/LoginModal.styles";
import LoginSplitView from "@/components/auth/LoginSplitView";

export default function LoginPageClient() {
  return (
    <S.PageShell>
      <S.PageCard>
        <LoginSplitView mode="page" headingId="login-page-title" />
      </S.PageCard>
    </S.PageShell>
  );
}
