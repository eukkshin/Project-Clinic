"use client";

import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { FiX } from "react-icons/fi";

import LoginForm from "@/components/auth/LoginForm";
import * as S from "@/components/auth/LoginModal.styles";
import AuthLanguageSwitcher from "@/components/i18n/AuthLanguageSwitcher";
import { defaultLocale, isAppLocale } from "@/i18n/config";
import { localizedPath } from "@/i18n/url";

interface LoginSplitViewProps {
  mode: "modal" | "page";
  headingId: string;
  onClose?: () => void;
  onSuccess?: () => void;
}

/** 로그인 모달과 독립 로그인 페이지에 공통으로 쓰는 04번 이미지 스플릿 UI. */
export default function LoginSplitView({
  mode,
  headingId,
  onClose,
  onSuccess,
}: LoginSplitViewProps) {
  const t = useTranslations("Auth");
  const selectedLocale = useLocale();
  const locale = isAppLocale(selectedLocale) ? selectedLocale : defaultLocale;
  const home = localizedPath("/", locale);

  return (
    <S.SplitLayout>
      <S.VisualPanel aria-hidden="true">
        <S.VisualImage>
          <Image
            src="/images/ahns-login-floral.jpg"
            alt=""
            fill
            sizes="(max-width: 700px) 1px, (max-width: 1100px) 40vw, 400px"
            priority={mode === "page"}
          />
        </S.VisualImage>
        <S.VisualCaption>
          <p>
            Discover
            <br />a more
            <br />
            refined you.
          </p>
        </S.VisualCaption>
      </S.VisualPanel>

      <S.FormPanel>
        <S.PanelHeader>
          <S.BrandLink href={home} aria-label="AHN'S Plastic Surgery home">
            AHN&apos;S
            <span>PLASTIC SURGERY</span>
          </S.BrandLink>

          <S.HeaderTools>
            <AuthLanguageSwitcher inModal={mode === "modal"} />
            {mode === "modal" ? (
              <S.Close type="button" onClick={onClose} aria-label={t("close")}>
                <FiX size={16} />
              </S.Close>
            ) : (
              <S.CloseLink href={home} aria-label={t("homeBack")}>
                <FiX size={16} />
              </S.CloseLink>
            )}
          </S.HeaderTools>
        </S.PanelHeader>

        <S.FormBody>
          <S.Heading id={headingId}>{t("modalWelcome")}</S.Heading>
          <S.Lead>{t("modalLead")}</S.Lead>
          <S.LoginFormScope>
            <LoginForm onSuccess={onSuccess} />
          </S.LoginFormScope>
        </S.FormBody>
      </S.FormPanel>
    </S.SplitLayout>
  );
}
