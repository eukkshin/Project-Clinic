"use client";

import { useLocale, useTranslations } from "next-intl";
import { ReactNode, useState } from "react";

import { Popup } from "@/components/ui/Popup";
import { cancelReservation } from "@/lib/reservation/api";
import * as S from "@/styles/mypage/MyPage.styles";

import { useMyPageData } from "./useMyPageData";

import type { MyConsultation, MyProfile, MyReservation } from "@/types/mypage";

type Tab = "profile" | "reservations" | "consultations" | "accountsettings";

const previewProfile: MyProfile = {
  name: "샘플 회원",
  userId: "preview_user",
  email: "sample@example.com",
  phone: "010-****-1234",
  joinedAt: "2026-10-01",
};
const previewReservations: MyReservation[] = [
  {
    id: "EX-001",
    department: "진료 상담",
    scheduledAt: "2026-11-18T14:30:00",
    status: "예약확정",
    createdAt: "2026-10-25",
  },
  {
    id: "EX-002",
    department: "의료진 상담",
    scheduledAt: "2026-10-15T11:00:00",
    status: "방문완료",
    createdAt: "2026-10-04",
  },
  {
    id: "EX-003",
    department: "기타 상담",
    scheduledAt: "2026-11-25T10:00:00",
    status: "예약대기",
    createdAt: "2026-10-27",
  },
];
const previewConsultations: MyConsultation[] = [
  {
    id: "EX-C01",
    title: "방문 상담 일정 문의",
    department: "진료 상담",
    status: "상담완료",
    createdAt: "2026-10-22",
    content: "방문 가능 시간과 사전 준비 사항이 궁금합니다.",
    response: "원하시는 날짜를 말씀해 주시면 안내드리겠습니다.",
  },
  {
    id: "EX-C02",
    title: "상담 예약 문의",
    department: "기타 상담",
    status: "대기중",
    createdAt: "2026-10-28",
    content: "예약 절차에 대해 안내받고 싶습니다.",
  },
];

const DISPLAY_LOCALES: Record<string, string> = {
  ko: "ko-KR",
  en: "en-US",
  ja: "ja-JP",
  "zh-CN": "zh-CN",
  "zh-TW": "zh-TW",
};
function formatDate(value: string | null | undefined, locale: string) {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return new Intl.DateTimeFormat(DISPLAY_LOCALES[locale] ?? "ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    ...(value.includes("T")
      ? { hour: "2-digit", minute: "2-digit", hour12: false }
      : {}),
  }).format(d);
}

// Known backend department values are translated only for display.
// Unknown administrator-written values stay unchanged until CMS translations exist.
function useDepartmentLabel() {
  const t = useTranslations("MyPage");
  const names: Record<string, string> = {
    "진료 상담": t("deptGeneral"),
    "의료진 상담": t("deptDoctor"),
    "기타 상담": t("deptOther"),
    "눈 성형": t("deptEyes"),
    눈성형: t("deptEyes"),
    "코 성형": t("deptNose"),
    코성형: t("deptNose"),
    안면윤곽: t("deptContour"),
    동안성형: t("deptAntiAging"),
    리프팅: t("deptLifting"),
    "피부·쁘띠": t("deptSkin"),
    쁘띠시술: t("deptPetit"),
  };
  return (value: string) => names[value] ?? value;
}

function Shell({ tab, children }: { tab: Tab; children: ReactNode }) {
  const t = useTranslations("MyPage");
  const title: Record<Tab, ReactNode> = {
    profile: (
      <>
        My <em>AHNS.</em>
      </>
    ),
    reservations: (
      <>
        My <em>Reservations.</em>
      </>
    ),
    consultations: (
      <>
        My <em>Consultations.</em>
      </>
    ),
    accountsettings: (
      <>
        Account <em>Settings.</em>
      </>
    ),
  };
  const description: Record<Tab, string> = {
    profile: t("descProfile"),
    reservations: t("descReservations"),
    consultations: t("descConsultations"),
    accountsettings: t("descSettings"),
  };
  const routes: { key: Tab; text: string; href: string }[] = [
    { key: "profile", text: t("navProfile"), href: "/mypage" },
    {
      key: "reservations",
      text: t("navReservations"),
      href: "/mypage/reservations",
    },
    {
      key: "consultations",
      text: t("navConsultations"),
      href: "/mypage/consultations",
    },
    {
      key: "accountsettings",
      text: t("navSettings"),
      href: "/mypage/accountsettings",
    },
  ];
  return (
    <S.Root>
      <S.Hero>
        <S.HeroInner>
          <S.Eyebrow>PRIVATE MEMBERSHIP — AHNS</S.Eyebrow>
          <S.HeroTitle>{title[tab]}</S.HeroTitle>
          <S.HeroDescription>{description[tab]}</S.HeroDescription>
        </S.HeroInner>
      </S.Hero>
      <S.MainGrid>
        <S.Sidebar>
          <S.SidebarEyebrow>PRIVATE MEMBERSHIP</S.SidebarEyebrow>
          <S.SidebarHeading>My AHNS</S.SidebarHeading>
          <S.SidebarDescription>
            {t("sidebarDesc1")}
            <br /> {t("sidebarDesc2")}
          </S.SidebarDescription>
          <S.SideNav aria-label={t("sidebarMenu")}>
            {routes.map((r) => (
              <S.SideLink
                key={r.key}
                href={r.href}
                $active={tab === r.key}
                aria-current={tab === r.key ? "page" : undefined}
              >
                {r.text}
              </S.SideLink>
            ))}
          </S.SideNav>
        </S.Sidebar>
        <S.Content>{children}</S.Content>
      </S.MainGrid>
    </S.Root>
  );
}

function Heading({
  number,
  title,
  description,
  action,
}: {
  number: string;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <S.SectionHeading>
      <div>
        <S.SmallLabel>{number} / MEMBER SERVICE</S.SmallLabel>
        <S.Heading>{title}</S.Heading>
        <S.BodyText>{description}</S.BodyText>
      </div>
      {action}
    </S.SectionHeading>
  );
}

function StateNotice({
  title,
  description,
  error,
  onRetry,
  onDemo,
}: {
  title: string;
  description: string;
  error?: string | null;
  onRetry?: () => void;
  onDemo?: () => void;
}) {
  const t = useTranslations("MyPage");
  return (
    <S.EmptyPanel role="status">
      <S.EmptyMark>✳</S.EmptyMark>
      <S.EmptyHeading>{title}</S.EmptyHeading>
      <S.EmptyDescription>{error || description}</S.EmptyDescription>
      <S.ButtonRow>
        {onRetry && (
          <S.PlainButton type="button" onClick={onRetry}>
            {t("retry")}
          </S.PlainButton>
        )}
        {onDemo && (
          <S.PlainButton type="button" onClick={onDemo}>
            {t("preview")}
          </S.PlainButton>
        )}
        <S.PrimaryLink href="/register/login">{t("loginPage")}</S.PrimaryLink>
      </S.ButtonRow>
    </S.EmptyPanel>
  );
}

function ProfileDetails({ profile }: { profile: MyProfile }) {
  const t = useTranslations("MyPage");
  const locale = useLocale();
  const fields = [
    { label: t("fieldName"), value: profile.name },
    { label: t("fieldId"), value: profile.userId },
    { label: t("fieldEmail"), value: profile.email ?? "-" },
    { label: t("fieldPhone"), value: profile.phone ?? "-" },
    { label: t("fieldJoined"), value: formatDate(profile.joinedAt, locale) },
  ];
  return (
    <S.InfoGrid>
      {fields.map(({ label, value }) => (
        <S.InfoCell key={label}>
          <S.InfoLabel>{label}</S.InfoLabel>
          <S.InfoValue>{value}</S.InfoValue>
        </S.InfoCell>
      ))}
    </S.InfoGrid>
  );
}

export function MyPageView() {
  const t = useTranslations("MyPage");
  const locale = useLocale();
  const departmentLabel = useDepartmentLabel();
  const reservationLabels: Record<string, string> = {
    예약대기: t("reservationPending"),
    예약확정: t("reservationConfirmed"),
    방문완료: t("reservationCompleted"),
    취소: t("reservationCancelled"),
  };
  const { data, loading, error, retry, connected } =
    useMyPageData<MyProfile>("me");
  const [demo, setDemo] = useState(false);
  const { data: myReservations, loading: reservationsLoading } =
    useMyPageData<MyReservation[]>("reservations");
  const profile = demo ? previewProfile : data;
  const upcoming = (demo ? previewReservations : (myReservations ?? []))
    .filter(
      (reservation) =>
        ["예약대기", "예약확정"].includes(reservation.status) &&
        new Date(reservation.scheduledAt).getTime() > Date.now(),
    )
    .sort(
      (a, b) =>
        new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime(),
    )[0];

  return (
    <Shell tab="profile">
      <S.WelcomePanel>
        <S.WelcomeEyebrow>WELCOME TO YOUR PRIVATE SPACE</S.WelcomeEyebrow>
        <S.WelcomeHeading>
          {t("greeting", {
            name: demo ? t("sampleMember") : (profile?.name ?? t("member")),
          })}
        </S.WelcomeHeading>
        <S.WelcomeDescription>{t("welcomeDesc")}</S.WelcomeDescription>
      </S.WelcomePanel>
      <S.SummaryCard>
        <S.SummaryEyebrow>UPCOMING RESERVATION</S.SummaryEyebrow>
        <S.SummaryDate>
          {upcoming
            ? formatDate(upcoming.scheduledAt, locale)
            : reservationsLoading && !demo
              ? t("loadingNextVisit")
              : t("noNextVisit")}
        </S.SummaryDate>
        <S.SummaryMeta>
          {upcoming
            ? `${departmentLabel(upcoming.department)} · ${reservationLabels[upcoming.status] ?? upcoming.status}`
            : reservationsLoading && !demo
              ? t("loadingReservations")
              : t("createVisitDesc")}
        </S.SummaryMeta>
        <S.SummaryLink
          href={upcoming ? "/mypage/reservations" : "/reservation"}
        >
          {upcoming ? t("checkReservations") : t("bookVisit")}{" "}
          <span aria-hidden="true">↗</span>
        </S.SummaryLink>
      </S.SummaryCard>
      <Heading
        number="01"
        title={t("memberInfo")}
        description={t("memberInfoDesc")}
        action={
          profile && !demo ? (
            <S.PlainButton onClick={retry} type="button">
              {t("refresh")}
            </S.PlainButton>
          ) : undefined
        }
      />
      {demo && (
        <S.DemoMessage>
          {t("sampleProfileNotice")}{" "}
          <S.PlainButton onClick={() => setDemo(false)}>
            {t("endPreview")}
          </S.PlainButton>
        </S.DemoMessage>
      )}
      {profile ? (
        <S.PersonalPanel>
          <ProfileDetails profile={profile} />
        </S.PersonalPanel>
      ) : (
        <StateNotice
          title={
            loading
              ? t("loadingProfile")
              : error
                ? t("profileFailed")
                : t("profileNotReady")
          }
          description={connected ? t("checkProfile") : t("loginForProfile")}
          error={error}
          onRetry={connected && error ? retry : undefined}
          onDemo={() => setDemo(true)}
        />
      )}
      <S.Cards>
        <S.CardLink href="/mypage/reservations">
          <S.CardNumber>01</S.CardNumber>
          <S.CardTitle>{t("navReservations")} ↗</S.CardTitle>
          <S.CardDescription>{t("reservationCardDesc")}</S.CardDescription>
        </S.CardLink>
        <S.CardLink href="/mypage/consultations">
          <S.CardNumber>02</S.CardNumber>
          <S.CardTitle>{t("navConsultations")} ↗</S.CardTitle>
          <S.CardDescription>{t("consultationCardDesc")}</S.CardDescription>
        </S.CardLink>
      </S.Cards>
    </Shell>
  );
}

export function ReservationsView() {
  const t = useTranslations("MyPage");
  const locale = useLocale();
  const departmentLabel = useDepartmentLabel();
  const reservationStatusLabels: Record<string, string> = {
    전체: t("all"),
    예약대기: t("reservationPending"),
    예약확정: t("reservationConfirmed"),
    방문완료: t("reservationCompleted"),
    취소: t("reservationCancelled"),
  };
  const { data, loading, error, retry, connected } =
    useMyPageData<MyReservation[]>("reservations");
  const [cancelTarget, setCancelTarget] = useState<string | number | null>(
    null,
  );
  const [cancelling, setCancelling] = useState(false);
  const [cancelError, setCancelError] = useState<string | null>(null);
  const [filter, setFilter] = useState("전체");
  const [demo, setDemo] = useState(false);
  const items = demo ? previewReservations : (data ?? []);
  const filtered = items.filter(
    (r) => filter === "전체" || r.status === filter,
  );
  const filters = ["전체", "예약대기", "예약확정", "방문완료", "취소"];

  async function confirmCancellation() {
    if (cancelTarget === null || cancelling) return;
    setCancelling(true);
    setCancelError(null);
    try {
      await cancelReservation(cancelTarget);
      setCancelTarget(null);
      retry();
    } catch (reason) {
      setCancelError(
        reason instanceof Error ? reason.message : t("cancelFailed"),
      );
      setCancelTarget(null);
    } finally {
      setCancelling(false);
    }
  }

  return (
    <Shell tab="reservations">
      <Heading
        number="02"
        title={t("navReservations")}
        description={t("reservationHeadingDesc")}
        action={
          <S.PrimaryLink href="/reservation">{t("bookVisit")} ↗</S.PrimaryLink>
        }
      />
      {cancelError && <S.Notice role="alert">{cancelError}</S.Notice>}
      {demo && (
        <S.DemoMessage>
          {t("sampleReservationNotice")}{" "}
          <S.PlainButton onClick={() => setDemo(false)}>
            {t("endPreview")}
          </S.PlainButton>
        </S.DemoMessage>
      )}
      {(items.length > 0 || loading) && (
        <S.FilterRow role="group" aria-label={t("reservationFiltersAria")}>
          {filters.map((f) => (
            <S.FilterButton
              key={f}
              $active={filter === f}
              type="button"
              aria-pressed={filter === f}
              onClick={() => setFilter(f)}
            >
              {reservationStatusLabels[f] ?? f}
            </S.FilterButton>
          ))}
        </S.FilterRow>
      )}
      {loading && !demo ? (
        <StateNotice
          title={t("reservationLoading")}
          description={t("reservationLoadingDesc")}
        />
      ) : error && !demo ? (
        <StateNotice
          title={t("reservationLoadFailed")}
          description={t("tryLater")}
          error={error}
          onRetry={retry}
          onDemo={() => setDemo(true)}
        />
      ) : !items.length ? (
        <StateNotice
          title={connected ? t("noReservations") : t("reservationNotReady")}
          description={
            connected ? t("reservationsAppear") : t("reservationApiNotice")
          }
          onDemo={() => setDemo(true)}
        />
      ) : !filtered.length ? (
        <StateNotice
          title={t("noStatusReservations")}
          description={t("chooseAnotherStatus")}
        />
      ) : (
        <S.ItemList>
          {filtered.map((r) => (
            <S.ItemCard key={r.id}>
              <S.ItemTop>
                <S.ItemIndex>RESERVATION · {r.id}</S.ItemIndex>
                <S.Status
                  $done={r.status === "방문완료" || r.status === "취소"}
                >
                  {reservationStatusLabels[r.status] ?? r.status}
                </S.Status>
              </S.ItemTop>
              <S.ItemTitle>{departmentLabel(r.department)}</S.ItemTitle>
              <S.ItemMeta>
                <span>
                  {t("scheduled")} · {formatDate(r.scheduledAt, locale)}
                </span>
                {r.createdAt && (
                  <span>
                    {t("submittedOn")} · {formatDate(r.createdAt, locale)}
                  </span>
                )}
              </S.ItemMeta>
              {r.memo && <S.Detail>{r.memo}</S.Detail>}
              {!demo &&
                ["예약대기", "예약확정"].includes(r.status) &&
                new Date(r.scheduledAt).getTime() > Date.now() && (
                  <S.PlainButton
                    type="button"
                    onClick={() => {
                      setCancelError(null);
                      setCancelTarget(r.id);
                    }}
                  >
                    {t("cancelReservation")}
                  </S.PlainButton>
                )}
            </S.ItemCard>
          ))}
        </S.ItemList>
      )}
      <S.Notice>{t("cancelNotice")}</S.Notice>
      <Popup
        isOpen={cancelTarget !== null}
        title={t("cancelPopupTitle")}
        onClose={() => {
          if (!cancelling) setCancelTarget(null);
        }}
        onConfirm={() => {
          void confirmCancellation();
        }}
      >
        {t("cancelPopupBody")}
      </Popup>
    </Shell>
  );
}

export function ConsultationsView() {
  const t = useTranslations("MyPage");
  const locale = useLocale();
  const departmentLabel = useDepartmentLabel();
  const consultationStatusLabels: Record<string, string> = {
    전체: t("all"),
    대기중: t("consultPending"),
    상담중: t("consultInProgress"),
    상담완료: t("consultComplete"),
  };
  const { data, loading, error, retry, connected } =
    useMyPageData<MyConsultation[]>("consultations");
  const [filter, setFilter] = useState("전체");
  const [keyword, setKeyword] = useState("");
  const [openId, setOpenId] = useState<string | number | null>(null);
  const [demo, setDemo] = useState(false);
  const items = demo ? previewConsultations : (data ?? []);
  const filtered = items.filter(
    (c) =>
      (filter === "전체" || c.status === filter) &&
      `${c.title} ${c.department ?? ""}`
        .toLocaleLowerCase()
        .includes(keyword.trim().toLocaleLowerCase()),
  );
  const filters = ["전체", "대기중", "상담중", "상담완료"];
  return (
    <Shell tab="consultations">
      <Heading
        number="03"
        title={t("navConsultations")}
        description={t("consultationHeadingDesc")}
        action={
          <S.PrimaryLink href="/community/consultation">
            {t("consultationInfo")} ↗
          </S.PrimaryLink>
        }
      />
      {demo && (
        <S.DemoMessage>
          {t("sampleConsultationNotice")}{" "}
          <S.PlainButton onClick={() => setDemo(false)}>
            {t("endPreview")}
          </S.PlainButton>
        </S.DemoMessage>
      )}
      {(items.length > 0 || loading) && (
        <>
          <S.SearchRow>
            <S.Search
              aria-label={t("consultationTitleSearch")}
              placeholder={t("consultationTitleSearch")}
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            {connected && !demo && (
              <S.PlainButton onClick={retry}>{t("refresh")}</S.PlainButton>
            )}
          </S.SearchRow>
          <S.FilterRow role="group" aria-label={t("consultationFiltersAria")}>
            {filters.map((f) => (
              <S.FilterButton
                type="button"
                key={f}
                $active={filter === f}
                aria-pressed={filter === f}
                onClick={() => setFilter(f)}
              >
                {consultationStatusLabels[f] ?? f}
              </S.FilterButton>
            ))}
          </S.FilterRow>
        </>
      )}
      {loading && !demo ? (
        <StateNotice
          title={t("consultLoading")}
          description={t("consultLoadingDesc")}
        />
      ) : error && !demo ? (
        <StateNotice
          title={t("consultLoadFailed")}
          description={t("tryLater")}
          error={error}
          onRetry={retry}
          onDemo={() => setDemo(true)}
        />
      ) : !items.length ? (
        <StateNotice
          title={connected ? t("noConsultations") : t("consultNotReady")}
          description={connected ? t("consultsAppear") : t("consultApiNotice")}
          onDemo={() => setDemo(true)}
        />
      ) : !filtered.length ? (
        <StateNotice
          title={t("noSearchResults")}
          description={t("changeFilters")}
        />
      ) : (
        <S.ItemList>
          {filtered.map((c) => (
            <S.ItemCard key={c.id}>
              <S.ItemTop>
                <S.ItemIndex>CONSULTATION · {c.id}</S.ItemIndex>
                <S.Status $done={c.status === "상담완료"}>
                  {consultationStatusLabels[c.status] ?? c.status}
                </S.Status>
              </S.ItemTop>
              <S.ItemTitle>
                {demo
                  ? c.id === "EX-C01"
                    ? t("sampleConsultTitle1")
                    : t("sampleConsultTitle2")
                  : c.title}
              </S.ItemTitle>
              <S.ItemMeta>
                <span>
                  {t("submittedOn")} · {formatDate(c.createdAt, locale)}
                </span>
                {c.department && (
                  <span>
                    {t("consultationCategory")} ·{" "}
                    {departmentLabel(c.department)}
                  </span>
                )}
              </S.ItemMeta>
              <S.Toggle
                type="button"
                aria-expanded={openId === c.id}
                aria-controls={`consult-body-${c.id}`}
                onClick={() => setOpenId(openId === c.id ? null : c.id)}
              >
                {openId === c.id
                  ? `${t("closeDetails")} −`
                  : `${t("showDetails")} +`}
              </S.Toggle>
              {openId === c.id && (
                <div id={`consult-body-${c.id}`}>
                  <S.Detail>
                    {demo
                      ? c.id === "EX-C01"
                        ? t("sampleConsultContent1")
                        : t("sampleConsultContent2")
                      : c.content}
                  </S.Detail>
                  {c.response ? (
                    <S.Reply>
                      <b>{t("reply")}</b>
                      {demo ? t("sampleConsultResponse1") : c.response}
                    </S.Reply>
                  ) : (
                    <S.Reply>
                      <b>{t("waitingReply")}</b>
                      {t("waitingReplyDesc")}
                    </S.Reply>
                  )}
                </div>
              )}
            </S.ItemCard>
          ))}
        </S.ItemList>
      )}
      <S.Notice>{t("privacyNotice")}</S.Notice>
    </Shell>
  );
}
