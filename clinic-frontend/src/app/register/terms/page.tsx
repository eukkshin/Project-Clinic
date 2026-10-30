"use client";

import { API_ORIGIN } from "@/lib/api/config";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import DaumPostcode from "react-daum-postcode";

import { Popup } from "@/components/ui/Popup";
import * as S from "@/styles/auth/Auth.styles";

import AuthBrandPanel from "@/components/auth/AuthBrandPanel";

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
  residentNumFront: string;
  residentNumBack: string;
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

// 아래 두 문구는 사용자가 전달한 기존 코드에서 가져온 초안이다.
// 실제 서비스 배포 전 법무/개인정보 담당자가 적합한 약관 전문으로 교체해야 한다.
const TERMS_TEXT = `[OO성형외과의원 온라인회원 약관]
이 약관은 OO성형외과의원(이하 '회사')가 제공하는 서비스 이용조건 및 절차에 대한 사항과 기타 필요한 사항을 전기통신사업법 및 동법 시행령이 정하는 대로 준수하고 규정함을 목적으로 합니다.

제 1조 목적
① OO성형외과의원 이용자 약관(이하 "본 약관"이라 합니다)은 이용자가 OO성형외과의원에서 제공하는 인터넷 관련 서비스(이하 "서비스"라 합니다)를 이용함에 있어 회원과 OO성형외과의원의 권리·의무 및 책임사항을 규정함을 목적으로 합니다.

제 2조 회원의 정의`;

const PRIVACY_TEXT = `1. - 목적 : 이용자 식별 및 본인여부 확인
- 항목 : 이름, 아이디, 비밀번호
- 보유 및 이용기간 : 회원탈퇴 후 5일까지

2. - 목적 : 민원 등 고객 고충처리
- 항목 : 이메일, 휴대전화번호
- 보유 및 이용기간 : 회원탈퇴 후 5일까지

3. - 목적 : 만 14세 미만 아동 확인
- 항목 : 법정 생년월일`;

/** 기존 클라이언트 주민등록번호 검증 로직 보존. 법적 수집 근거 및 서버 보안은 별도 검토 필수. */
function validateResidentNumber(front: string, back: string): boolean {
  const rrn = front + back;
  if (!/^\d{13}$/.test(rrn)) return false;
  const weights = [2, 3, 4, 5, 6, 7, 8, 9, 2, 3, 4, 5];
  let sum = 0;
  for (let i = 0; i < 12; i += 1) {
    sum += Number(rrn[i]) * weights[i];
  }
  return (11 - (sum % 11)) % 10 === Number(rrn[12]);
}

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
    residentNumFront: "",
    residentNumBack: "",
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
    if (
      (name === "residentNumFront" || name === "residentNumBack") &&
      !/^\d*$/.test(value)
    ) {
      return;
    }
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
      openPopup("약관동의 오류", "필수 약관에 모두 동의해 주세요.");
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
      openPopup("약관동의 오류", "필수 약관에 모두 동의해 주세요.");
      setStep(1);
      return;
    }
    if (
      !formData.userName.trim() ||
      !formData.userId.trim() ||
      !formData.userPw
    ) {
      openPopup("입력 오류", "이름, 아이디, 비밀번호를 모두 입력해 주세요.");
      return;
    }
    if (!passwordsMatch) {
      openPopup(
        "비밀번호 오류",
        "비밀번호와 비밀번호 확인이 일치하지 않습니다.",
      );
      return;
    }
    if (!formData.residentNumFront || !formData.residentNumBack) {
      openPopup("입력 오류", "주민등록번호를 입력해 주세요.");
      return;
    }
    if (
      !validateResidentNumber(
        formData.residentNumFront,
        formData.residentNumBack,
      )
    ) {
      openPopup(
        "주민등록번호 오류",
        "유효하지 않은 주민등록번호입니다. 다시 확인해 주세요.",
      );
      return;
    }
    const fullEmail = combineEmail(formData.email, formData.emailDomain);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fullEmail)) {
      openPopup("이메일 오류", "올바른 이메일 주소를 입력해 주세요.");
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
          residentNum: `${formData.residentNumFront}${formData.residentNumBack}`,
          zipcode: formData.zipcode,
          address1: formData.address1,
          address2: formData.address2,
        }),
      });
      const result = (await response.json().catch(() => ({}))) as ApiResponse;
      if (!response.ok) {
        openPopup("가입 오류", result.message || "회원가입에 실패했습니다.");
        return;
      }
      openPopup("가입 완료", "회원가입이 완료되었습니다.", () => {
        closePopup();
        router.push("/register/login");
      });
    } catch (error) {
      console.error("회원가입 요청 실패:", error);
      openPopup("서버 오류", "서버와 통신하는 중 오류가 발생했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <S.RegisterShell>
        <S.RegisterLayout>
          <AuthBrandPanel mode="register" />
          <S.FormSurface ref={formScrollRef} aria-labelledby="register-title">
            <S.FormContent>
              <S.Topline>
                <span>JOIN AHN&apos;S / 02</span>
                <S.TextLink href="/register/login">
                  로그인으로 돌아가기 ↗
                </S.TextLink>
              </S.Topline>
              <S.Kicker>BEGIN YOUR JOURNEY</S.Kicker>
              <S.Heading id="register-title">Ahn&apos;s 회원가입</S.Heading>
              <S.Lead>
                당신을 위한 섬세한 시작.
                <br />
                필요한 정보를 차근차근 입력해 주세요.
              </S.Lead>

              <S.Stepper aria-label="회원가입 진행 단계">
                <S.StepItem
                  $active={step === 1}
                  $done={step === 2}
                  aria-current={step === 1 ? "step" : undefined}
                >
                  <S.StepCircle $active={step === 1} $done={step === 2}>
                    {step === 2 ? "✓" : "01"}
                  </S.StepCircle>
                  약관 동의
                </S.StepItem>
                <S.StepLine aria-hidden="true" />
                <S.StepItem
                  $active={step === 2}
                  aria-current={step === 2 ? "step" : undefined}
                >
                  <S.StepCircle $active={step === 2}>02</S.StepCircle>
                  정보 입력
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
                      <strong>필수 약관 전체 동의</strong>
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
                          이용약관 <span aria-label="필수 항목">(필수)</span>
                        </strong>
                      </S.CheckboxLabel>
                      <S.TermsToggle
                        type="button"
                        aria-expanded={isTermsOpen}
                        aria-controls="terms-content"
                        onClick={() => setIsTermsOpen((open) => !open)}
                      >
                        {isTermsOpen ? "접기 −" : "펼치기 +"}
                      </S.TermsToggle>
                    </S.TermsHeader>
                    {isTermsOpen && (
                      <S.TermsBody id="terms-content">{TERMS_TEXT}</S.TermsBody>
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
                          개인정보 수집 및 이용{" "}
                          <span aria-label="필수 항목">(필수)</span>
                        </strong>
                      </S.CheckboxLabel>
                      <S.TermsToggle
                        type="button"
                        aria-expanded={isPrivacyOpen}
                        aria-controls="privacy-content"
                        onClick={() => setIsPrivacyOpen((open) => !open)}
                      >
                        {isPrivacyOpen ? "접기 −" : "펼치기 +"}
                      </S.TermsToggle>
                    </S.TermsHeader>
                    {isPrivacyOpen && (
                      <S.TermsBody id="privacy-content">
                        {PRIVACY_TEXT}
                      </S.TermsBody>
                    )}
                  </S.TermsCard>

                  <S.LegalNote>
                    현재 약관 문구는 기존 코드의 초안입니다. 실제 서비스에서는
                    검토된 약관 전문으로 교체해야 합니다.
                  </S.LegalNote>
                  <S.ButtonRow>
                    <S.Button
                      type="button"
                      $secondary
                      onClick={() => router.push("/register/login")}
                    >
                      이전
                    </S.Button>
                    <S.Button type="button" onClick={goToForm}>
                      다음 단계 ↗
                    </S.Button>
                  </S.ButtonRow>
                </div>
              ) : (
                <S.Form onSubmit={handleSubmit} noValidate>
                  <S.FormSection>
                    <S.SectionHeading>기본 정보</S.SectionHeading>
                    <S.FieldGrid>
                      <S.Field>
                        <S.Label htmlFor="join-name">
                          이름 <span>(필수)</span>
                        </S.Label>
                        <S.TextInput
                          id="join-name"
                          name="userName"
                          autoComplete="name"
                          value={formData.userName}
                          onChange={handleChange}
                          placeholder="이름을 입력해 주세요"
                        />
                      </S.Field>
                      <S.Field>
                        <S.Label htmlFor="join-id">
                          아이디 <span>(필수)</span>
                        </S.Label>
                        <S.TextInput
                          id="join-id"
                          name="userId"
                          autoComplete="username"
                          value={formData.userId}
                          onChange={handleChange}
                          placeholder="사용할 아이디"
                        />
                      </S.Field>
                    </S.FieldGrid>
                    <S.Field>
                      <S.Label htmlFor="join-pw">
                        비밀번호 <span>(필수)</span>
                      </S.Label>
                      <S.InputWrap>
                        <S.InputWithButton
                          id="join-pw"
                          type={showPassword ? "text" : "password"}
                          autoComplete="new-password"
                          name="userPw"
                          value={formData.userPw}
                          onChange={handleChange}
                          placeholder="비밀번호를 입력해 주세요"
                        />
                        <S.InsideButton
                          type="button"
                          onClick={() => setShowPassword((show) => !show)}
                          aria-pressed={showPassword}
                          aria-label={
                            showPassword ? "비밀번호 숨기기" : "비밀번호 표시"
                          }
                        >
                          {showPassword ? "숨기기" : "보기"}
                        </S.InsideButton>
                      </S.InputWrap>
                    </S.Field>
                    <S.Field>
                      <S.Label htmlFor="join-pw-confirm">
                        비밀번호 확인 <span>(필수)</span>
                      </S.Label>
                      <S.TextInput
                        id="join-pw-confirm"
                        name="userPwConfirm"
                        type={showPassword ? "text" : "password"}
                        autoComplete="new-password"
                        value={formData.userPwConfirm}
                        onChange={handleChange}
                        placeholder="비밀번호를 다시 입력해 주세요"
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
                            ? "비밀번호가 일치합니다."
                            : "비밀번호가 일치하지 않습니다."}
                        </S.FieldHelp>
                      )}
                    </S.Field>
                  </S.FormSection>

                  <S.FormSection>
                    <S.SectionHeading>연락처 및 본인 정보</S.SectionHeading>
                    <S.Field>
                      <S.Label htmlFor="join-resident-front">
                        주민등록번호 <span>(기존 서버 필수 필드)</span>
                      </S.Label>
                      <S.InlinePair>
                        <S.TextInput
                          id="join-resident-front"
                          type="text"
                          inputMode="numeric"
                          maxLength={6}
                          placeholder="앞 6자리"
                          name="residentNumFront"
                          autoComplete="off"
                          value={formData.residentNumFront}
                          onChange={handleChange}
                        />
                        <S.DividerDash aria-hidden="true">−</S.DividerDash>
                        <S.TextInput
                          id="join-resident-back"
                          aria-label="주민등록번호 뒤 7자리"
                          type="password"
                          inputMode="numeric"
                          maxLength={7}
                          placeholder="뒤 7자리"
                          name="residentNumBack"
                          autoComplete="off"
                          value={formData.residentNumBack}
                          onChange={handleChange}
                        />
                      </S.InlinePair>
                      <S.FieldHelp>
                        실제 서비스에서는 주민등록번호 수집의 법적 근거 및 보호
                        조치를 먼저 확인해야 합니다.
                      </S.FieldHelp>
                    </S.Field>
                    <S.Field>
                      <S.Label htmlFor="join-email">
                        이메일 <span>(필수)</span>
                      </S.Label>
                      <S.FieldGrid>
                        <S.TextInput
                          id="join-email"
                          name="email"
                          type="text"
                          autoComplete="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="이메일 또는 아이디"
                        />
                        <S.SelectInput
                          name="emailDomain"
                          value={formData.emailDomain}
                          onChange={handleChange}
                          aria-label="이메일 도메인 선택"
                        >
                          <option value="직접입력">직접 입력</option>
                          <option value="naver.com">@naver.com</option>
                          <option value="gmail.com">@gmail.com</option>
                          <option value="daum.net">@daum.net</option>
                        </S.SelectInput>
                      </S.FieldGrid>
                      <S.CheckboxLabel>
                        <input
                          type="checkbox"
                          name="isMailAgreed"
                          checked={formData.isMailAgreed}
                          onChange={handleChange}
                        />
                        정보 및 이벤트 이메일 수신 동의 (선택)
                      </S.CheckboxLabel>
                    </S.Field>
                    <S.Field>
                      <S.Label htmlFor="join-phone">
                        휴대폰 번호 <span>(선택)</span>
                      </S.Label>
                      <S.TextInput
                        id="join-phone"
                        name="phone"
                        type="tel"
                        inputMode="tel"
                        autoComplete="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="'-' 없이 입력해 주세요"
                      />
                      <S.CheckboxLabel>
                        <input
                          type="checkbox"
                          name="isSnsAgreed"
                          checked={formData.isSnsAgreed}
                          onChange={handleChange}
                        />
                        정보 및 이벤트 SMS 수신 동의 (선택)
                      </S.CheckboxLabel>
                    </S.Field>
                    <S.Field>
                      <S.Label>
                        성별 <span>(선택)</span>
                      </S.Label>
                      <S.RadioGroup role="radiogroup" aria-label="성별">
                        <S.RadioPill>
                          <input
                            type="radio"
                            name="gender"
                            value="male"
                            checked={formData.gender === "male"}
                            onChange={handleChange}
                          />{" "}
                          남성
                        </S.RadioPill>
                        <S.RadioPill>
                          <input
                            type="radio"
                            name="gender"
                            value="female"
                            checked={formData.gender === "female"}
                            onChange={handleChange}
                          />{" "}
                          여성
                        </S.RadioPill>
                      </S.RadioGroup>
                    </S.Field>
                  </S.FormSection>

                  <S.FormSection>
                    <S.SectionHeading>주소 정보</S.SectionHeading>
                    <S.Field>
                      <S.Label htmlFor="join-postcode">
                        주소 <span>(선택)</span>
                      </S.Label>
                      <S.InlinePair>
                        <S.TextInput
                          id="join-postcode"
                          name="zipcode"
                          value={formData.zipcode}
                          readOnly
                          placeholder="우편번호"
                        />
                        <S.MiniButton
                          type="button"
                          $secondary
                          onClick={() => setIsPostcodeOpen(true)}
                        >
                          우편번호 찾기
                        </S.MiniButton>
                      </S.InlinePair>
                      <S.TextInput
                        name="address1"
                        aria-label="기본주소"
                        value={formData.address1}
                        readOnly
                        placeholder="기본주소"
                      />
                      <S.TextInput
                        name="address2"
                        aria-label="상세주소"
                        autoComplete="address-line2"
                        value={formData.address2}
                        onChange={handleChange}
                        placeholder="상세주소를 입력해 주세요"
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
                      이전 단계
                    </S.Button>
                    <S.Button type="submit" disabled={submitting}>
                      {submitting ? "가입 처리 중..." : "회원가입 완료 ↗"}
                    </S.Button>
                  </S.ButtonRow>
                </S.Form>
              )}

              <S.FormFooter>
                이미 계정이 있으신가요?{" "}
                <S.TextLink href="/register/login">로그인하기 →</S.TextLink>
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
              <h3 id="postcode-title">주소 검색</h3>
              <S.ModalClose
                type="button"
                onClick={() => setIsPostcodeOpen(false)}
                aria-label="주소 검색 닫기"
              >
                닫기 ✕
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
