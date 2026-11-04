"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import DaumPostcode from "react-daum-postcode";

import AuthBrandPanel from "@/components/auth/AuthBrandPanel";
import AuthLanguageSwitcher from "@/components/i18n/AuthLanguageSwitcher";
import { Popup } from "@/components/ui/Popup";
import { defaultLocale, isAppLocale } from "@/i18n/config";
import { localizedPath } from "@/i18n/url";
import { API_ORIGIN } from "@/lib/api/config";
import {
  CONSENT_POLICY_VERSION,
  registrationConsentCopy,
} from "@/lib/auth/registrationConsent";
import * as S from "@/styles/auth/Auth.styles";

type RegisterForm = {
  userName: string;
  userId: string;
  userPw: string;
  userPwConfirm: string;
  email: string;
  emailDomain: string;
  isMailAgreed: boolean;
  phone: string;
  isSnsAgreed: boolean;
  gender: string;
  zipcode: string;
  address1: string;
  address2: string;
};

type PopupConfig = {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm?: () => void;
};

type PostcodeData = {
  address: string;
  addressType: string;
  bname: string;
  buildingName: string;
  zonecode: string;
};

type ApiResponse = { message?: string };

const API_URL = API_ORIGIN;

function combineEmail(email: string, domain: string): string {
  const input = email.trim();
  if (input.includes("@") || !domain || domain === "직접입력") return input;
  return `${input}@${domain}`;
}

export default function TermsPage() {
  // 회원가입 PC 화면은 우측 폼만 스크롤한다. 단계 변경 시 이 요소를 맨 위로 이동.
  const formScrollRef = useRef<HTMLElement>(null);
  const scrollRegistrationToTop = () => {
    if (window.matchMedia("(min-width: 801px)").matches) {
      formScrollRef.current?.scrollTo({ top: 0, behavior: "instant" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const router = useRouter();
  const t = useTranslations("Auth");
  const currentLocale = useLocale();
  const locale = isAppLocale(currentLocale) ? currentLocale : defaultLocale;
  const legalCopy = registrationConsentCopy[locale];
  const [step, setStep] = useState<1 | 2>(1);
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [privacyAgreed, setPrivacyAgreed] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(true);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(true);
  const [isPostcodeOpen, setIsPostcodeOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [popupConfig, setPopupConfig] = useState<PopupConfig>({
    isOpen: false,
    title: "",
    message: "",
  });

  const [formData, setFormData] = useState<RegisterForm>({
    userName: "",
    userId: "",
    userPw: "",
    userPwConfirm: "",
    email: "",
    emailDomain: "직접입력",
    isMailAgreed: false,
    phone: "",
    isSnsAgreed: false,
    gender: "",
    zipcode: "",
    address1: "",
    address2: "",
  });

  const allAgreed = termsAgreed && privacyAgreed;
  const hasConfirmValue = formData.userPwConfirm.length > 0;
  const passwordsMatch = formData.userPw === formData.userPwConfirm;

  const openPopup = (
    title: string,
    message: string,
    onConfirm?: () => void,
  ) => {
    setPopupConfig({ isOpen: true, title, message, onConfirm });
  };
  const closePopup = () =>
    setPopupConfig((prev) => ({ ...prev, isOpen: false }));

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = event.target;
    if (!(name in formData)) return;
    const checked = (event.target as HTMLInputElement).checked;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleCompletePostcode = (data: PostcodeData) => {
    let fullAddress = data.address;
    let extraAddress = "";
    if (data.addressType === "R") {
      if (data.bname) extraAddress += data.bname;
      if (data.buildingName) {
        extraAddress += extraAddress
          ? `, ${data.buildingName}`
          : data.buildingName;
      }
      if (extraAddress) fullAddress += ` (${extraAddress})`;
    }
    setFormData((prev) => ({
      ...prev,
      zipcode: data.zonecode,
      address1: fullAddress,
    }));
    setIsPostcodeOpen(false);
  };

  // 주소 팝업은 키보드 Esc로도 닫을 수 있다.
  useEffect(() => {
    if (!isPostcodeOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsPostcodeOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isPostcodeOpen]);

  const goToForm = () => {
    if (!allAgreed) {
      openPopup(t("inputError"), t("requiredTermsError"));
      return;
    }
    setStep(2);
    scrollRegistrationToTop();
  };

  // POST 필드/엔드포인트와 가입 후 /register/login 이동을 기존과 동일하게 유지한다.
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting) return;
    if (!allAgreed) {
      openPopup(t("inputError"), t("requiredTermsError"));
      setStep(1);
      return;
    }
    if (
      !formData.userName.trim() ||
      !formData.userId.trim() ||
      !formData.userPw
    ) {
      openPopup(t("inputError"), t("missingAccountFields"));
      return;
    }
    if (!passwordsMatch) {
      openPopup(t("inputError"), t("pwNotSame"));
      return;
    }
    const fullEmail = combineEmail(formData.email, formData.emailDomain);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fullEmail)) {
      openPopup(t("inputError"), t("invalidEmail"));
      return;
    }

    if (formData.isSnsAgreed && !formData.phone.trim()) {
      openPopup(t("inputError"), t("smsNeedsPhone"));
      return;
    }
    if (formData.userPw.length < 8) {
      openPopup(t("inputError"), t("shortPassword"));
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(`${API_URL}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userName: formData.userName.trim(),
          userId: formData.userId.trim(),
          userPw: formData.userPw,
          email: fullEmail,
          isMailAgreed: formData.isMailAgreed,
          phone: formData.phone,
          isSnsAgreed: formData.isSnsAgreed,
          gender: formData.gender,
          zipcode: formData.zipcode,
          address1: formData.address1,
          address2: formData.address2,
          // 서버에서 약관 버전을 검증하고 동의 시각을 서버 기준으로 기록해야 합니다.
          // 기존 이메일·SMS 플래그도 유지해 레거시 API와의 호환을 돕습니다.
          consents: {
            terms: { agreed: termsAgreed, version: CONSENT_POLICY_VERSION },
            privacyNotice: {
              acknowledged: privacyAgreed,
              version: CONSENT_POLICY_VERSION,
            },
            marketingEmail: formData.isMailAgreed,
            marketingSms: formData.isSnsAgreed,
          },
        }),
      });
      const result = (await response.json().catch(() => ({}))) as ApiResponse;
      if (!response.ok) {
        openPopup(t("signUpError"), result.message || t("signUpFailed"));
        return;
      }
      openPopup(t("signUpComplete"), t("signUpDone"), () => {
        closePopup();
        router.push(localizedPath("/register/login", locale));
      });
    } catch (error) {
      console.error("회원가입 요청 실패:", error);
      openPopup(t("serverError"), t("serverErrorMsg"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <S.RegisterShell data-lenis-prevent>
        <S.RegisterLayout>
          <AuthBrandPanel mode="register" />
          <S.FormSurface ref={formScrollRef} aria-labelledby="register-title">
            <S.FormContent>
              <S.Topline>
                <span>JOIN AHN&apos;S / 02</span>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <AuthLanguageSwitcher />
                  <S.TextLink href={localizedPath("/register/login", locale)}>
                    {t("backLogin")} ↗
                  </S.TextLink>
                </div>
              </S.Topline>
              <S.Kicker>BEGIN YOUR JOURNEY</S.Kicker>
              <S.Heading id="register-title">{t("joinHeading")}</S.Heading>
              <S.Lead>{t("joinLead")}</S.Lead>

              <S.Stepper aria-label={t("joinHeading")}>
                <S.StepItem
                  $active={step === 1}
                  $done={step === 2}
                  aria-current={step === 1 ? "step" : undefined}
                >
                  <S.StepCircle $active={step === 1} $done={step === 2}>
                    {step === 2 ? "✓" : "01"}
                  </S.StepCircle>
                  {t("termsStep")}
                </S.StepItem>
                <S.StepLine aria-hidden="true" />
                <S.StepItem
                  $active={step === 2}
                  aria-current={step === 2 ? "step" : undefined}
                >
                  <S.StepCircle $active={step === 2}>02</S.StepCircle>
                  {t("detailsStep")}
                </S.StepItem>
              </S.Stepper>

              {step === 1 ? (
                <div>
                  <S.AgreeAll>
                    <S.CheckboxLabel>
                      <input
                        type="checkbox"
                        checked={allAgreed}
                        onChange={(event) => {
                          setTermsAgreed(event.target.checked);
                          setPrivacyAgreed(event.target.checked);
                        }}
                      />
                      <strong>{legalCopy.allRequired}</strong>
                    </S.CheckboxLabel>
                  </S.AgreeAll>

                  <S.TermsCard>
                    <S.TermsHeader>
                      <S.CheckboxLabel>
                        <input
                          type="checkbox"
                          checked={termsAgreed}
                          onChange={(event) =>
                            setTermsAgreed(event.target.checked)
                          }
                        />
                        <strong>
                          {legalCopy.termsLabel}{" "}
                          <span aria-label={t("noticeRequired")}>
                            ({legalCopy.required})
                          </span>
                        </strong>
                      </S.CheckboxLabel>
                      <S.TermsToggle
                        type="button"
                        aria-expanded={isTermsOpen}
                        aria-controls="terms-content"
                        onClick={() => setIsTermsOpen((open) => !open)}
                      >
                        {isTermsOpen ? t("collapse") : t("expand")}
                      </S.TermsToggle>
                    </S.TermsHeader>
                    {isTermsOpen && (
                      <S.TermsBody id="terms-content">
                        {legalCopy.termsSummary}
                        {"\n\n"}
                        <S.TextLink
                          href={localizedPath("/terms", locale)}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {legalCopy.readTerms} ↗
                        </S.TextLink>
                      </S.TermsBody>
                    )}
                  </S.TermsCard>

                  <S.TermsCard>
                    <S.TermsHeader>
                      <S.CheckboxLabel>
                        <input
                          type="checkbox"
                          checked={privacyAgreed}
                          onChange={(event) =>
                            setPrivacyAgreed(event.target.checked)
                          }
                        />
                        <strong>
                          {legalCopy.privacyLabel}{" "}
                          <span aria-label={t("noticeRequired")}>
                            ({legalCopy.required})
                          </span>
                        </strong>
                      </S.CheckboxLabel>
                      <S.TermsToggle
                        type="button"
                        aria-expanded={isPrivacyOpen}
                        aria-controls="privacy-content"
                        onClick={() => setIsPrivacyOpen((open) => !open)}
                      >
                        {isPrivacyOpen ? t("collapse") : t("expand")}
                      </S.TermsToggle>
                    </S.TermsHeader>
                    {isPrivacyOpen && (
                      <S.TermsBody id="privacy-content">
                        {legalCopy.privacySummary}
                        {"\n\n"}
                        <S.TextLink
                          href={localizedPath("/privacy", locale)}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {legalCopy.readPrivacy} ↗
                        </S.TextLink>
                      </S.TermsBody>
                    )}
                  </S.TermsCard>

                  <S.TermsCard>
                    <S.TermsHeader>
                      <S.CheckboxLabel>
                        <input
                          type="checkbox"
                          name="isMailAgreed"
                          checked={formData.isMailAgreed}
                          onChange={handleChange}
                        />
                        <span>
                          {legalCopy.emailMarketing} ({legalCopy.optional})
                        </span>
                      </S.CheckboxLabel>
                    </S.TermsHeader>
                  </S.TermsCard>
                  <S.TermsCard>
                    <S.TermsHeader>
                      <S.CheckboxLabel>
                        <input
                          type="checkbox"
                          name="isSnsAgreed"
                          checked={formData.isSnsAgreed}
                          onChange={handleChange}
                        />
                        <span>
                          {legalCopy.smsMarketing} ({legalCopy.optional})
                        </span>
                      </S.CheckboxLabel>
                    </S.TermsHeader>
                  </S.TermsCard>
                  <S.LegalNote>{legalCopy.notice}</S.LegalNote>
                  <S.ButtonRow>
                    <S.Button
                      type="button"
                      $secondary
                      onClick={() =>
                        router.push(localizedPath("/register/login", locale))
                      }
                    >
                      {t("previous")}
                    </S.Button>
                    <S.Button type="button" onClick={goToForm}>
                      {t("nextStep")} ↗
                    </S.Button>
                  </S.ButtonRow>
                </div>
              ) : (
                <S.Form onSubmit={handleSubmit} noValidate>
                  <S.FormSection>
                    <S.SectionHeading>{t("basicInformation")}</S.SectionHeading>
                    <S.FieldGrid>
                      <S.Field>
                        <S.Label htmlFor="join-name">
                          {t("name")} <span>({t("required")})</span>
                        </S.Label>
                        <S.TextInput
                          id="join-name"
                          name="userName"
                          autoComplete="name"
                          value={formData.userName}
                          onChange={handleChange}
                          placeholder={t("namePlaceholder")}
                        />
                      </S.Field>
                      <S.Field>
                        <S.Label htmlFor="join-id">
                          {t("id")} <span>({t("required")})</span>
                        </S.Label>
                        <S.TextInput
                          id="join-id"
                          name="userId"
                          autoComplete="username"
                          value={formData.userId}
                          onChange={handleChange}
                          placeholder={t("userIdPlaceholder")}
                        />
                      </S.Field>
                    </S.FieldGrid>
                    <S.Field>
                      <S.Label htmlFor="join-pw">
                        {t("password")} <span>({t("required")})</span>
                      </S.Label>
                      <S.InputWrap>
                        <S.InputWithButton
                          id="join-pw"
                          type={showPassword ? "text" : "password"}
                          autoComplete="new-password"
                          name="userPw"
                          value={formData.userPw}
                          onChange={handleChange}
                          placeholder={t("passwordPlaceholder")}
                        />
                        <S.InsideButton
                          type="button"
                          onClick={() => setShowPassword((show) => !show)}
                          aria-pressed={showPassword}
                          aria-label={
                            showPassword ? t("hidePassword") : t("showPassword")
                          }
                        >
                          {showPassword ? t("hide") : t("show")}
                        </S.InsideButton>
                      </S.InputWrap>
                    </S.Field>
                    <S.Field>
                      <S.Label htmlFor="join-pw-confirm">
                        {t("confirmPassword")} <span>({t("required")})</span>
                      </S.Label>
                      <S.TextInput
                        id="join-pw-confirm"
                        name="userPwConfirm"
                        type={showPassword ? "text" : "password"}
                        autoComplete="new-password"
                        value={formData.userPwConfirm}
                        onChange={handleChange}
                        placeholder={t("confirmPlaceholder")}
                        aria-invalid={hasConfirmValue && !passwordsMatch}
                        aria-describedby={
                          hasConfirmValue ? "password-match" : undefined
                        }
                      />
                      {hasConfirmValue && (
                        <S.FieldHelp
                          id="password-match"
                          data-error={!passwordsMatch}
                          data-valid={passwordsMatch}
                          role="status"
                        >
                          {passwordsMatch
                            ? t("passwordMatch")
                            : t("passwordMismatch")}
                        </S.FieldHelp>
                      )}
                    </S.Field>
                  </S.FormSection>

                  <S.FormSection>
                    <S.SectionHeading>{t("contactSection")}</S.SectionHeading>
                    <S.Field>
                      <S.Label htmlFor="join-email">
                        {t("email")} <span>({t("required")})</span>
                      </S.Label>
                      <S.FieldGrid>
                        <S.TextInput
                          id="join-email"
                          name="email"
                          type="text"
                          autoComplete="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder={t("emailPlaceholder")}
                        />
                        <S.SelectInput
                          name="emailDomain"
                          value={formData.emailDomain}
                          onChange={handleChange}
                          aria-label={t("emailDomain")}
                        >
                          <option value="직접입력">{t("manualInput")}</option>
                          <option value="naver.com">@naver.com</option>
                          <option value="gmail.com">@gmail.com</option>
                          <option value="daum.net">@daum.net</option>
                        </S.SelectInput>
                      </S.FieldGrid>
                    </S.Field>
                    <S.Field>
                      <S.Label htmlFor="join-phone">
                        {t("phone")} <span>({t("optional")})</span>
                      </S.Label>
                      <S.TextInput
                        id="join-phone"
                        name="phone"
                        type="tel"
                        inputMode="tel"
                        autoComplete="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder={t("phonePlaceholder")}
                      />
                    </S.Field>
                    <S.Field>
                      <S.Label>
                        {t("gender")} <span>({t("optional")})</span>
                      </S.Label>
                      <S.RadioGroup role="radiogroup" aria-label={t("gender")}>
                        <S.RadioPill>
                          <input
                            type="radio"
                            name="gender"
                            value="male"
                            checked={formData.gender === "male"}
                            onChange={handleChange}
                          />{" "}
                          {t("male")}
                        </S.RadioPill>
                        <S.RadioPill>
                          <input
                            type="radio"
                            name="gender"
                            value="female"
                            checked={formData.gender === "female"}
                            onChange={handleChange}
                          />{" "}
                          {t("female")}
                        </S.RadioPill>
                      </S.RadioGroup>
                    </S.Field>
                  </S.FormSection>

                  <S.FormSection>
                    <S.SectionHeading>{t("addressSection")}</S.SectionHeading>
                    <S.Field>
                      <S.Label htmlFor="join-postcode">
                        {t("address")} <span>({t("optional")})</span>
                      </S.Label>
                      <S.InlinePair>
                        <S.TextInput
                          id="join-postcode"
                          name="zipcode"
                          value={formData.zipcode}
                          readOnly
                          placeholder={t("postal")}
                        />
                        <S.MiniButton
                          type="button"
                          $secondary
                          onClick={() => setIsPostcodeOpen(true)}
                        >
                          {t("findPostal")}
                        </S.MiniButton>
                      </S.InlinePair>
                      <S.TextInput
                        name="address1"
                        aria-label={t("baseAddress")}
                        value={formData.address1}
                        readOnly
                        placeholder={t("baseAddress")}
                      />
                      <S.TextInput
                        name="address2"
                        aria-label={t("detailAddress")}
                        autoComplete="address-line2"
                        value={formData.address2}
                        onChange={handleChange}
                        placeholder={t("detailAddressPlaceholder")}
                      />
                    </S.Field>
                  </S.FormSection>

                  <S.ButtonRow>
                    <S.Button
                      type="button"
                      $secondary
                      onClick={() => {
                        setStep(1);
                        scrollRegistrationToTop();
                      }}
                    >
                      {t("previousStep")}
                    </S.Button>
                    <S.Button type="submit" disabled={submitting}>
                      {submitting
                        ? t("registering")
                        : t("registerSubmit") + " ↗"}
                    </S.Button>
                  </S.ButtonRow>
                </S.Form>
              )}

              <S.FormFooter>
                {t("alreadyMember")}{" "}
                <S.TextLink href={localizedPath("/register/login", locale)}>
                  {t("loginAction")} →
                </S.TextLink>
              </S.FormFooter>
            </S.FormContent>
          </S.FormSurface>
        </S.RegisterLayout>
      </S.RegisterShell>

      {isPostcodeOpen && (
        <S.ModalScrim
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setIsPostcodeOpen(false);
          }}
        >
          <S.ModalCard
            role="dialog"
            aria-modal="true"
            aria-labelledby="postcode-title"
          >
            <S.ModalHead>
              <h3 id="postcode-title">{t("postcodeTitle")}</h3>
              <S.ModalClose
                type="button"
                onClick={() => setIsPostcodeOpen(false)}
                aria-label={t("closePostcode")}
              >
                {t("close")} ✕
              </S.ModalClose>
            </S.ModalHead>
            <DaumPostcode onComplete={handleCompletePostcode} />
          </S.ModalCard>
        </S.ModalScrim>
      )}

      <Popup
        isOpen={popupConfig.isOpen}
        title={popupConfig.title}
        onClose={closePopup}
        onConfirm={popupConfig.onConfirm}
      >
        {popupConfig.message}
      </Popup>
    </>
  );
}
