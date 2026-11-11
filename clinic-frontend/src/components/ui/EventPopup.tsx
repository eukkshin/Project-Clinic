"use client";

import axios from "axios";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { FiArrowUpRight, FiX } from "react-icons/fi";

import ConsultCaptcha, {
  consultCaptchaEnabled,
} from "@/components/security/ConsultCaptcha";
import * as S from "@/components/ui/EventPopup.styles";
import { stripLocalePrefix } from "@/i18n/url";
import { API_ORIGIN } from "@/lib/api/config";

const API_URL = API_ORIGIN;

/** 관리자 GET /api/admin/popups에서 내려오는 원본 DB 데이터 형식 */
interface PopupApiItem {
  POPUP_IDX: number;
  FILE_NAME: string;
  LINK?: string | null;
  USE_TODAY_CLOSE?: "Y" | "N" | null;
  START_DATE?: string | null;
  END_DATE?: string | null;
}

interface PopupApiResponse {
  success: boolean;
  maxPopups?: number;
  popups?: PopupApiItem[];
}

/** UI에 필요한 프로퍼티만 선별해 사용한다. */
interface PopupData {
  id: number;
  imageUrl: string;
  link: string;
  useTodayClose: boolean;
  top: number;
  left: number;
}

interface QuickConsultResponse {
  success?: boolean;
  message?: string;
}

/**
 * 백엔드가 내려준 URL을 그대로 href에 넣기 전에 안전한 주소인지 확인한다.
 * http(s) 주소나 '/'로 시작하는 내부 경로만 허용하여 javascript: 링크를 차단한다.
 */
function safePopupLink(value: string | null | undefined): string {
  const url = (value ?? "").trim();
  if (/^https?:\/\//i.test(url) || /^\/(?!\/)/.test(url)) return url;
  return "";
}

function PopupCard({
  popup,
  onClose,
}: {
  popup: PopupData;
  onClose: (id: number, hideToday: boolean) => void;
}) {
  const tPopup = useTranslations("EventPopup");
  // 카드마다 독립된 상담 입력값과 오늘 하루 숨김 체크 여부를 갖는다.
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [department, setDepartment] = useState("");
  const [isAgreed, setIsAgreed] = useState(false);
  const [captchaToken, setCaptchaToken] = useState("");
  const [captchaReset, setCaptchaReset] = useState(0);
  const [hideToday, setHideToday] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    if (!name.trim()) return setFeedback(tPopup("missingName"));
    if (!/^\d{9,11}$/.test(phone) || /^(\d)\1{8,}$/.test(phone)) {
      return setFeedback(tPopup("invalidPhone"));
    }
    if (!department.trim()) return setFeedback(tPopup("missingDepartment"));
    if (!isAgreed) return setFeedback(tPopup("needConsent"));
    if (consultCaptchaEnabled && !captchaToken)
      return setFeedback(tPopup("needCaptcha"));

    try {
      setIsSubmitting(true);
      setFeedback("");

      // 원래 이벤트 팝업에서 사용하던 API와 데이터 키를 유지한다.
      const { data } = await axios.post<QuickConsultResponse>(
        `${API_URL}/api/consult/quick`,
        {
          name: name.trim(),
          phone,
          department: department.trim(),
          privacyConsent: isAgreed,
          captchaToken,
        },
      );

      if (!data.success) throw new Error(data.message || "상담 접수 실패");

      // 정상 접수되면 폼을 초기화하고 해당 팝업만 닫는다.
      setName("");
      setPhone("");
      setDepartment("");
      setIsAgreed(false);
      onClose(popup.id, popup.useTodayClose && hideToday);
    } catch (error) {
      console.error("이벤트 팝업 상담 신청 실패:", error);
      setFeedback(tPopup("submitFailed"));
    } finally {
      setIsSubmitting(false);
      setCaptchaReset((v) => v + 1);
    }
  };

  // 이벤트가 실제 URL을 갖고 있을 때만 클릭 가능한 이미지로 만든다.
  const image = (
    <S.ImageWrapper>
      <S.PopupImage src={popup.imageUrl} alt={tPopup("imageAlt")} />
      <S.ImageBadge>AHN'S SPECIAL OFFER</S.ImageBadge>
    </S.ImageWrapper>
  );

  return (
    <S.PopupContainer
      $top={popup.top}
      $left={popup.left}
      role="dialog"
      aria-label={tPopup("dialog", { number: popup.id })}
    >
      <S.ImageArea>
        {popup.link ? (
          <S.PopupLink
            href={popup.link}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={tPopup("openEvent")}
          >
            {image}
          </S.PopupLink>
        ) : (
          image
        )}
        {popup.link && (
          <S.ImageLinkCaption>
            {tPopup("viewEvent")}{" "}
            <FiArrowUpRight aria-hidden="true" size={14} />
          </S.ImageLinkCaption>
        )}
      </S.ImageArea>

      <S.FormWrapper>
        <S.FormHeading>
          <S.Eyebrow>PERSONAL CONSULTATION</S.Eyebrow>
          <S.FormTitle>{tPopup("title")}</S.FormTitle>
          <S.FormCaption>{tPopup("description")}</S.FormCaption>
        </S.FormHeading>

        <S.ConsultForm onSubmit={handleSubmit}>
          <S.InputGroup>
            <S.Input
              type="text"
              placeholder={tPopup("name")}
              aria-label={tPopup("name")}
              autoComplete="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              maxLength={40}
              required
            />
            <S.Input
              type="tel"
              placeholder={tPopup("phone")}
              aria-label={tPopup("phone")}
              autoComplete="tel"
              inputMode="numeric"
              value={phone}
              onChange={(event) =>
                setPhone(event.target.value.replace(/\D/g, ""))
              }
              maxLength={11}
              required
            />
          </S.InputGroup>

          <S.InputGroup>
            <S.Input
              type="text"
              placeholder={tPopup("departmentPlaceholder")}
              aria-label={tPopup("department")}
              value={department}
              onChange={(event) => setDepartment(event.target.value)}
              maxLength={60}
              required
            />
          </S.InputGroup>

          <S.ConsentRow>
            <S.PrivacyLabel>
              <S.PrivacyCheckbox
                type="checkbox"
                checked={isAgreed}
                onChange={(event) => setIsAgreed(event.target.checked)}
                required
              />
              <S.PrivacyText>{tPopup("consent")}</S.PrivacyText>
            </S.PrivacyLabel>
          </S.ConsentRow>

          <ConsultCaptcha onToken={setCaptchaToken} resetKey={captchaReset} />
          {feedback && <S.FormFeedback role="alert">{feedback}</S.FormFeedback>}

          <S.SubmitBtn
            type="submit"
            disabled={
              isSubmitting ||
              !isAgreed ||
              !name.trim() ||
              !phone.trim() ||
              !department ||
              (consultCaptchaEnabled && !captchaToken)
            }
          >
            {isSubmitting ? tPopup("submitting") : tPopup("submit")}
            <FiArrowUpRight aria-hidden="true" size={17} />
          </S.SubmitBtn>
        </S.ConsultForm>
      </S.FormWrapper>

      <S.FooterWrapper>
        {popup.useTodayClose ? (
          <S.CloseLabel>
            <S.CloseCheckbox
              type="checkbox"
              checked={hideToday}
              onChange={(event) => setHideToday(event.target.checked)}
            />
            {tPopup("hideToday")}
          </S.CloseLabel>
        ) : (
          <S.FooterSmall>AHN'S PLASTIC SURGERY</S.FooterSmall>
        )}

        <S.CloseBtn
          type="button"
          onClick={() => onClose(popup.id, popup.useTodayClose && hideToday)}
          aria-label={tPopup("closePopup")}
        >
          {tPopup("close")} <FiX size={15} aria-hidden="true" />
        </S.CloseBtn>
      </S.FooterWrapper>
    </S.PopupContainer>
  );
}

export default function EventPopup() {
  const pathname = stripLocalePrefix(usePathname());
  const [popupList, setPopupList] = useState<PopupData[]>([]);
  const [visiblePopupIds, setVisiblePopupIds] = useState<number[]>([]);

  useEffect(() => {
    const controller = new AbortController();

    const fetchPopups = async () => {
      try {
        const { data } = await axios.get<PopupApiResponse>(
          `${API_URL}/api/public/site/popups`,
          { signal: controller.signal },
        );
        if (
          !data.success ||
          !Array.isArray(data.popups) ||
          controller.signal.aborted
        )
          return;

        const now = Date.now();
        const eligible = data.popups.filter((popup) => {
          // 관리자가 입력한 노출 시작/종료일을 기존과 같이 사용한다.
          const start = popup.START_DATE
            ? new Date(popup.START_DATE).getTime()
            : -Infinity;
          const end = popup.END_DATE
            ? new Date(popup.END_DATE).getTime()
            : Infinity;
          if (now < start || now > end) return false;
          if (!popup.FILE_NAME) return false;

          const hideUntil = window.localStorage.getItem(
            `hide_popup_${popup.POPUP_IDX}`,
          );
          return !(hideUntil && now < Number(hideUntil));
        });

        const max =
          typeof data.maxPopups === "number" && data.maxPopups >= 0
            ? data.maxPopups
            : eligible.length;

        const formatted = eligible.slice(0, max).map((popup, index) => ({
          id: popup.POPUP_IDX,
          imageUrl: `${API_URL}/images/${encodeURIComponent(popup.FILE_NAME)}`,
          link: safePopupLink(popup.LINK),
          useTodayClose: popup.USE_TODAY_CLOSE === "Y",
          top: 150 + index * 30,
          left: 100 + index * 420,
        }));

        setPopupList(formatted);
        setVisiblePopupIds(formatted.map((item) => item.id));
      } catch (error) {
        if (!controller.signal.aborted)
          console.error("이벤트 팝업 로드 실패:", error);
      }
    };

    void fetchPopups();
    return () => controller.abort();
  }, []);

  /** '오늘 하루 보지 않음'이 체크된 경우에만 다음 날 자정까지 숨긴다. */
  const handleClose = (id: number, hideToday: boolean) => {
    if (hideToday) {
      const nextMidnight = new Date();
      nextMidnight.setHours(24, 0, 0, 0);
      window.localStorage.setItem(
        `hide_popup_${id}`,
        String(nextMidnight.getTime()),
      );
    }
    setVisiblePopupIds((prev) => prev.filter((popupId) => popupId !== id));
  };

  // 회원가입·로그인·마이페이지 등에서는 팝업을 표시하지 않는다.
  const shouldHide = ["/register", "/login", "/mypage"].some((route) =>
    pathname.includes(route),
  );
  const visible = popupList.filter((popup) =>
    visiblePopupIds.includes(popup.id),
  );
  if (shouldHide || visible.length === 0) return null;

  return (
    <S.PopupLayer>
      {visible.map((popup) => (
        <PopupCard key={popup.id} popup={popup} onClose={handleClose} />
      ))}
    </S.PopupLayer>
  );
}
