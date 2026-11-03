"use client";

import { ReactNode, useState } from 'react';

import { Popup } from '@/components/ui/Popup';
import { cancelReservation } from '@/lib/reservation/api';
import * as S from '@/styles/mypage/MyPage.styles';

import { useMyPageData } from './useMyPageData';

import type { MyConsultation, MyProfile, MyReservation } from "@/types/mypage";

type Tab = "profile" | "reservations" | "consultations";

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

function formatDate(value: string | null | undefined) {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    ...(value.includes("T")
      ? { hour: "2-digit", minute: "2-digit", hour12: false }
      : {}),
  }).format(d);
}

function Shell({ tab, children }: { tab: Tab; children: ReactNode }) {
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
  };
  const description: Record<Tab, string> = {
    profile: "나의 정보와 예약, 상담 기록을 한곳에서 확인하세요.",
    reservations: "예약한 일정을 편리하게 확인할 수 있는 공간입니다.",
    consultations: "상담 문의와 진행 상태를 확인할 수 있는 공간입니다.",
  };
  const routes: { key: Tab; text: string; href: string }[] = [
    { key: "profile", text: "내 정보", href: "/mypage" },
    { key: "reservations", text: "예약 내역", href: "/mypage/reservations" },
    {
      key: "consultations",
      text: "내 상담 내역",
      href: "/mypage/consultations",
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
            나를 위한 기록과 일정을
            <br /> 한곳에서 확인하세요.
          </S.SidebarDescription>
          <S.SideNav aria-label="마이페이지 메뉴">
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
  return (
    <S.EmptyPanel role="status">
      <S.EmptyMark>✳</S.EmptyMark>
      <S.EmptyHeading>{title}</S.EmptyHeading>
      <S.EmptyDescription>{error || description}</S.EmptyDescription>
      <S.ButtonRow>
        {onRetry && (
          <S.PlainButton type="button" onClick={onRetry}>
            다시 불러오기
          </S.PlainButton>
        )}
        {onDemo && (
          <S.PlainButton type="button" onClick={onDemo}>
            샘플 화면 보기
          </S.PlainButton>
        )}
        <S.PrimaryLink href="/register/login">로그인 페이지</S.PrimaryLink>
      </S.ButtonRow>
    </S.EmptyPanel>
  );
}

function ProfileDetails({ profile }: { profile: MyProfile }) {
  const fields = [
    { label: "이름", value: profile.name },
    { label: "아이디", value: profile.userId },
    { label: "이메일", value: profile.email ?? "-" },
    { label: "휴대폰 번호", value: profile.phone ?? "-" },
    { label: "가입일", value: formatDate(profile.joinedAt) },
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
          안녕하세요, {profile?.name ?? "회원님"}.
        </S.WelcomeHeading>
        <S.WelcomeDescription>
          AHNS에서의 소중한 일정과 상담 기록을 편안하게 확인하세요.
        </S.WelcomeDescription>
      </S.WelcomePanel>
      <S.SummaryCard>
        <S.SummaryEyebrow>UPCOMING RESERVATION</S.SummaryEyebrow>
        <S.SummaryDate>
          {upcoming
            ? formatDate(upcoming.scheduledAt)
            : reservationsLoading && !demo
              ? "방문 일정을 확인하는 중입니다."
              : "예정된 방문 상담이 없습니다."}
        </S.SummaryDate>
        <S.SummaryMeta>
          {upcoming
            ? `${upcoming.department} · ${upcoming.status}`
            : reservationsLoading && !demo
              ? "등록된 예약을 확인하고 있습니다."
              : "원하시는 날짜와 시간을 선택해 방문 예약을 진행할 수 있습니다."}
        </S.SummaryMeta>
        <S.SummaryLink
          href={upcoming ? "/mypage/reservations" : "/reservation"}
        >
          {upcoming ? "예약 내역 확인" : "방문 상담 예약하기"}{" "}
          <span aria-hidden="true">↗</span>
        </S.SummaryLink>
      </S.SummaryCard>
      <Heading
        number="01"
        title="회원 정보"
        description="회원님의 기본 정보를 확인하실 수 있습니다."
        action={
          profile && !demo ? (
            <S.PlainButton onClick={retry} type="button">
              새로고침
            </S.PlainButton>
          ) : undefined
        }
      />
      {demo && (
        <S.DemoMessage>
          샘플 미리보기입니다. 실제 회원 정보가 아니며 저장되지 않습니다.{" "}
          <S.PlainButton onClick={() => setDemo(false)}>
            미리보기 종료
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
              ? "회원 정보를 불러오는 중입니다"
              : error
                ? "회원 정보를 확인하지 못했습니다"
                : "회원 정보 연동 준비 중"
          }
          description={
            connected
              ? "등록된 회원 정보를 확인해 주세요."
              : "개인정보 보호를 위한 로그인 연동 후 회원 정보가 표시됩니다."
          }
          error={error}
          onRetry={connected && error ? retry : undefined}
          onDemo={() => setDemo(true)}
        />
      )}
      <S.Cards>
        <S.CardLink href="/mypage/reservations">
          <S.CardNumber>01</S.CardNumber>
          <S.CardTitle>예약 내역 ↗</S.CardTitle>
          <S.CardDescription>
            예약 일정과 진행 상태를 확인하세요.
          </S.CardDescription>
        </S.CardLink>
        <S.CardLink href="/mypage/consultations">
          <S.CardNumber>02</S.CardNumber>
          <S.CardTitle>내 상담 내역 ↗</S.CardTitle>
          <S.CardDescription>상담 문의와 답변을 확인하세요.</S.CardDescription>
        </S.CardLink>
      </S.Cards>
    </Shell>
  );
}

export function ReservationsView() {
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
        reason instanceof Error ? reason.message : "예약 취소에 실패했습니다.",
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
        title="예약 내역"
        description="예약 상태를 확인하고 방문 일정을 살펴보세요."
        action={
          <S.PrimaryLink href="/reservation">
            방문 상담 예약하기 ↗
          </S.PrimaryLink>
        }
      />
      {cancelError && <S.Notice role="alert">{cancelError}</S.Notice>}
      {demo && (
        <S.DemoMessage>
          샘플 예약 3건을 보여주고 있습니다. 실제 예약 내역이 아닙니다.{" "}
          <S.PlainButton onClick={() => setDemo(false)}>
            미리보기 종료
          </S.PlainButton>
        </S.DemoMessage>
      )}
      {(items.length > 0 || loading) && (
        <S.FilterRow role="group" aria-label="예약 상태 필터">
          {filters.map((f) => (
            <S.FilterButton
              key={f}
              $active={filter === f}
              type="button"
              aria-pressed={filter === f}
              onClick={() => setFilter(f)}
            >
              {f}
            </S.FilterButton>
          ))}
        </S.FilterRow>
      )}
      {loading && !demo ? (
        <StateNotice
          title="예약 내역을 불러오는 중입니다"
          description="예약 정보를 확인하고 있습니다."
        />
      ) : error && !demo ? (
        <StateNotice
          title="예약 내역 조회 실패"
          description="잠시 후 다시 시도해 주세요."
          error={error}
          onRetry={retry}
          onDemo={() => setDemo(true)}
        />
      ) : !items.length ? (
        <StateNotice
          title={
            connected ? "예약 내역이 없습니다" : "예약 서비스 연동 준비 중"
          }
          description={
            connected
              ? "예약 내역이 등록되면 이곳에 표시됩니다."
              : "인증된 예약 조회 API가 연결되면 내 예약만 표시됩니다."
          }
          onDemo={() => setDemo(true)}
        />
      ) : !filtered.length ? (
        <StateNotice
          title="해당 상태의 예약이 없습니다"
          description="다른 예약 상태를 선택해 주세요."
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
                  {r.status}
                </S.Status>
              </S.ItemTop>
              <S.ItemTitle>{r.department}</S.ItemTitle>
              <S.ItemMeta>
                <span>방문 예정 · {formatDate(r.scheduledAt)}</span>
                {r.createdAt && <span>접수일 · {formatDate(r.createdAt)}</span>}
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
                    예약 취소
                  </S.PlainButton>
                )}
            </S.ItemCard>
          ))}
        </S.ItemList>
      )}
      <S.Notice>
        예약대기·예약확정 상태의 미래 예약은 온라인 취소할 수 있습니다. 취소 후
        다른 회원이 해당 시간대를 예약할 수 있습니다.
      </S.Notice>
      <Popup
        isOpen={cancelTarget !== null}
        title="방문 예약 취소"
        onClose={() => {
          if (!cancelling) setCancelTarget(null);
        }}
        onConfirm={() => {
          void confirmCancellation();
        }}
      >
        방문 예약을 취소할까요? 취소하면 해당 시간대가 다시 예약 가능 상태로
        전환됩니다.
      </Popup>
    </Shell>
  );
}

export function ConsultationsView() {
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
        title="내 상담 내역"
        description="문의하신 상담 내용과 처리 상태를 확인하세요."
        action={
          <S.PrimaryLink href="/community/consultation">
            상담 안내 보기 ↗
          </S.PrimaryLink>
        }
      />
      {demo && (
        <S.DemoMessage>
          샘플 상담 2건을 보여주고 있습니다. 실제 상담 내역이 아닙니다.{" "}
          <S.PlainButton onClick={() => setDemo(false)}>
            미리보기 종료
          </S.PlainButton>
        </S.DemoMessage>
      )}
      {(items.length > 0 || loading) && (
        <>
          <S.SearchRow>
            <S.Search
              aria-label="상담 제목 검색"
              placeholder="상담 제목 검색"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            {connected && !demo && (
              <S.PlainButton onClick={retry}>새로고침</S.PlainButton>
            )}
          </S.SearchRow>
          <S.FilterRow role="group" aria-label="상담 상태 필터">
            {filters.map((f) => (
              <S.FilterButton
                type="button"
                key={f}
                $active={filter === f}
                aria-pressed={filter === f}
                onClick={() => setFilter(f)}
              >
                {f}
              </S.FilterButton>
            ))}
          </S.FilterRow>
        </>
      )}
      {loading && !demo ? (
        <StateNotice
          title="상담 내역을 불러오는 중입니다"
          description="상담 정보를 확인하고 있습니다."
        />
      ) : error && !demo ? (
        <StateNotice
          title="상담 내역 조회 실패"
          description="잠시 후 다시 시도해 주세요."
          error={error}
          onRetry={retry}
          onDemo={() => setDemo(true)}
        />
      ) : !items.length ? (
        <StateNotice
          title={
            connected ? "상담 내역이 없습니다" : "상담 서비스 연동 준비 중"
          }
          description={
            connected
              ? "문의한 내역이 등록되면 이곳에 표시됩니다."
              : "인증된 상담 조회 API가 연결되면 내 상담 내역이 표시됩니다."
          }
          onDemo={() => setDemo(true)}
        />
      ) : !filtered.length ? (
        <StateNotice
          title="검색 결과가 없습니다"
          description="검색어나 상태 조건을 변경해 주세요."
        />
      ) : (
        <S.ItemList>
          {filtered.map((c) => (
            <S.ItemCard key={c.id}>
              <S.ItemTop>
                <S.ItemIndex>CONSULTATION · {c.id}</S.ItemIndex>
                <S.Status $done={c.status === "상담완료"}>{c.status}</S.Status>
              </S.ItemTop>
              <S.ItemTitle>{c.title}</S.ItemTitle>
              <S.ItemMeta>
                <span>접수일 · {formatDate(c.createdAt)}</span>
                {c.department && <span>상담분야 · {c.department}</span>}
              </S.ItemMeta>
              <S.Toggle
                type="button"
                aria-expanded={openId === c.id}
                aria-controls={`consult-body-${c.id}`}
                onClick={() => setOpenId(openId === c.id ? null : c.id)}
              >
                {openId === c.id ? "내용 닫기 −" : "상담 내용 확인 +"}
              </S.Toggle>
              {openId === c.id && (
                <div id={`consult-body-${c.id}`}>
                  <S.Detail>{c.content}</S.Detail>
                  {c.response ? (
                    <S.Reply>
                      <b>상담 답변</b>
                      {c.response}
                    </S.Reply>
                  ) : (
                    <S.Reply>
                      <b>답변 대기중</b>담당자가 상담 내용을 확인하고 있습니다.
                    </S.Reply>
                  )}
                </div>
              )}
            </S.ItemCard>
          ))}
        </S.ItemList>
      )}
      <S.Notice>
        상담 내용은 민감한 정보일 수 있으므로, 관리자 전체 조회 API가 아닌 본인
        인증 전용 API를 사용해야 합니다.
      </S.Notice>
    </Shell>
  );
}
