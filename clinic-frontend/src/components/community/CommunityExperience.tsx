"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FormEvent, ReactNode, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";

import * as S from "@/components/community/Community.styles";
import {
  CommunityEntry,
  CommunityResult,
  loadCommunity,
  submitQuickConsultation,
  toYoutubeEmbed,
} from "@/lib/community/client";
import {
  COMMUNITY_BY_KIND,
  COMMUNITY_PAGES,
  CommunityKind,
} from "@/lib/community/config";

type DataStatus = "loading" | "ready" | "error";

function CommunityMotion() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>("[data-ahns-community]");
    if (
      !root ||
      !("IntersectionObserver" in window) ||
      !window.matchMedia("(prefers-reduced-motion: no-preference)").matches
    )
      return;
    const targets = Array.from(
      root.querySelectorAll<HTMLElement>("[data-c-reveal]"),
    );
    for (const target of targets) {
      if (target.getBoundingClientRect().top <= window.innerHeight * 0.94)
        target.dataset.cVisible = "true";
    }
    root.dataset.cMotion = "on";
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries)
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).dataset.cVisible = "true";
            observer.unobserve(entry.target);
          }
      },
      { threshold: 0.08, rootMargin: "0px 0px -28px 0px" },
    );
    for (const target of targets)
      if (target.dataset.cVisible !== "true") observer.observe(target);
    return () => {
      observer.disconnect();
      delete root.dataset.cMotion;
    };
  }, []);
  return null;
}

function CommunityNav() {
  const pathname = usePathname();
  return (
    <S.TopBar aria-label="커뮤니티 하위 페이지">
      <S.NavTitle>
        COMMUNITY <span>/</span>
      </S.NavTitle>
      <S.NavTrack>
        {COMMUNITY_PAGES.map((page) => (
          <S.NavLink
            as={Link}
            key={page.kind}
            href={page.href}
            $active={pathname === page.href}
            aria-current={pathname === page.href ? "page" : undefined}
          >
            {page.label}
          </S.NavLink>
        ))}
      </S.NavTrack>
    </S.TopBar>
  );
}

function CommunityFrame({ children }: { children: ReactNode }) {
  return (
    <S.Page data-ahns-community>
      <CommunityMotion />
      <CommunityNav />
      {children}
    </S.Page>
  );
}

function BottomCTA() {
  return (
    <S.DarkBand>
      <S.Container>
        <S.DarkBandInner>
          <div data-c-reveal>
            <S.Eyebrow>AHN’S / THE CONVERSATION</S.Eyebrow>
            <h2 style={{ marginTop: 24 }}>
              당신의 이야기가
              <br />
              시작되는 곳.
            </h2>
          </div>
          <div data-c-reveal>
            <p>
              일상적인 궁금증부터 상담 예약까지.
              <br />
              차분하고 편안한 소통을 이어갑니다.
            </p>
            <div style={{ marginTop: 27 }}>
              <S.TextLink as={Link} href="/community/consultation">
                온라인 상담하기 <span aria-hidden="true">↗</span>
              </S.TextLink>
            </div>
          </div>
        </S.DarkBandInner>
      </S.Container>
    </S.DarkBand>
  );
}

function CommunityHome() {
  const featured = COMMUNITY_PAGES.filter(
    (page) => page.kind !== "consultation",
  );
  return (
    <CommunityFrame>
      <S.MainHero>
        <S.Container>
          <S.HeroCopy data-c-reveal>
            <S.Eyebrow>AHN’S COMMUNITY / EDITION 01</S.Eyebrow>
            <S.Display>
              아름다움에 대한
              <br />
              모든 이야기,
              <br />
              <em>Our Stories.</em>
            </S.Display>
            <S.Lead>
              AHN’S가 전하는 소식과 기록, 그리고 궁금한 마음에 대한 답변을
              한곳에 모았습니다.
            </S.Lead>
            <S.TextLink as={Link} href="/community/notice">
              새로운 소식 살펴보기 <span aria-hidden="true">↗</span>
            </S.TextLink>
            <S.HeroCounter>
              001 — 007{" "}
              <span style={{ paddingLeft: 15, fontSize: 11 }}>
                Scroll to explore
              </span>
            </S.HeroCounter>
          </S.HeroCopy>
          <S.HeroPhotoFrame data-c-reveal>
            <Image
              src="/images/community/editorial-hero.webp"
              alt="따뜻한 자연광 속 인물 에디토리얼 이미지"
              fill
              priority
              sizes="(max-width: 860px) 100vw, 48vw"
            />
            <S.PhotoCaption>Beyond Beauty.</S.PhotoCaption>
          </S.HeroPhotoFrame>
        </S.Container>
      </S.MainHero>
      <S.MainFeature>
        <S.MainFeatureCopy data-c-reveal>
          <S.Eyebrow>FEATURED / IN FOCUS</S.Eyebrow>
          <div>
            <h2>
              오늘의 소식부터
              <br />
              내일의 이야기까지.
            </h2>
            <p style={{ marginTop: 23 }}>
              진료 정보는 정확하게, 소식은 명료하게, 소통은 따뜻하게. 필요한
              이야기를 편안하게 찾아보세요.
            </p>
          </div>
          <S.TextLink as={Link} href="/community/events">
            이벤트 살펴보기 <span aria-hidden="true">↗</span>
          </S.TextLink>
        </S.MainFeatureCopy>
        <S.FeatureImage>
          <Image
            src="/images/community/editorial-shadow.webp"
            alt="자연광과 식물 그림자의 에디토리얼 이미지"
            fill
            sizes="(max-width: 860px) 100vw, 50vw"
          />
        </S.FeatureImage>
      </S.MainFeature>
      <S.Section>
        <S.Container>
          <S.SectionHead data-c-reveal>
            <div>
              <S.Eyebrow>EXPLORE THE COMMUNITY</S.Eyebrow>
              <h2 style={{ marginTop: 24 }}>당신을 위한 일곱 가지 이야기.</h2>
            </div>
            <p>
              찾고 싶은 주제를 선택하세요.
              <br />
              모든 항목은 각각의 전용 페이지로 연결됩니다.
            </p>
          </S.SectionHead>
          <S.LinkGrid>
            {featured.map((page) => (
              <S.LinkCard as={Link} href={page.href} key={page.kind}>
                <span className="number">
                  {page.number} / {page.english}
                </span>
                <h3>{page.label}</h3>
                <p>{page.description}</p>
                <span className="arrow" aria-hidden="true">
                  ↗
                </span>
              </S.LinkCard>
            ))}
          </S.LinkGrid>
        </S.Container>
      </S.Section>
      <BottomCTA />
    </CommunityFrame>
  );
}

function SubHero({ kind }: { kind: CommunityKind }) {
  const page = COMMUNITY_BY_KIND[kind];
  return (
    <S.SubHero>
      <S.Container>
        <div data-c-reveal>
          <S.Eyebrow>AHN’S COMMUNITY / {page.english}</S.Eyebrow>
          <S.Display>{page.title}</S.Display>
          <S.Lead>{page.description}</S.Lead>
        </div>
        <S.HeroIndex aria-hidden="true">{page.number}</S.HeroIndex>
      </S.Container>
    </S.SubHero>
  );
}

function useCommunityEntries(kind: CommunityKind) {
  const [status, setStatus] = useState<DataStatus>("loading");
  const [result, setResult] = useState<CommunityResult>({
    connected: false,
    entries: [],
  });
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    setStatus("loading");
    setResult({ connected: false, entries: [] });
    loadCommunity(kind, controller.signal)
      .then((data) => {
        if (controller.signal.aborted) return;
        setResult(data);
        setStatus("ready");
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        console.error(`[AHN'S community] ${kind} load failed`, error);
        setStatus("error");
      });
    return () => controller.abort();
  }, [kind, retry]);
  return { status, result, retry: () => setRetry((v) => v + 1) };
}

function EmptyNotice({
  kind,
  status,
  connected,
  onRetry,
  query,
}: {
  kind: CommunityKind;
  status: DataStatus;
  connected: boolean;
  onRetry: () => void;
  query: string;
}) {
  const page = COMMUNITY_BY_KIND[kind];
  const notWired = !connected && status === "ready";
  const heading =
    status === "loading"
      ? "내용을 불러오고 있습니다."
      : status === "error"
        ? "데이터를 불러오지 못했어요."
        : query
          ? "검색 결과가 없습니다."
          : notWired
            ? "공개 자료 연결을 준비하고 있어요."
            : "등록된 내용이 없습니다.";
  const explanation =
    status === "error"
      ? "서버 연결과 API 권한을 확인해 주세요."
      : query
        ? "검색어를 바꿔 다시 확인해 주세요."
        : notWired
          ? `${page.label}은 공개 데이터 API가 확인되면 이 위치에 자동으로 표시됩니다. 임의의 사례나 후기를 만들어 게시하지 않았습니다.`
          : "새로운 소식이 등록되면 이곳에서 확인하실 수 있습니다.";
  return (
    <S.EmptyBox role="status">
      <span className="symbol" aria-hidden="true">
        A.
      </span>
      <h3>{heading}</h3>
      <p>{explanation}</p>
      {status === "error" && (
        <S.Button type="button" onClick={onRetry}>
          다시 불러오기
        </S.Button>
      )}
    </S.EmptyBox>
  );
}

function formatDate(value: string): string {
  if (!value) return "";
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime())
    ? value.slice(0, 10)
    : parsed.toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
}

function Pagination({
  page,
  count,
  onChange,
}: {
  page: number;
  count: number;
  onChange: (value: number) => void;
}) {
  if (count <= 1) return null;
  return (
    <S.Pages aria-label="목록 페이지 선택">
      {Array.from({ length: count }, (_, i) => i + 1).map((num) => (
        <button
          key={num}
          type="button"
          aria-current={num === page ? "page" : undefined}
          onClick={() => onChange(num)}
        >
          {num}
        </button>
      ))}
    </S.Pages>
  );
}

function MediaTile({
  item,
  kind,
  onPlay,
}: {
  item: CommunityEntry;
  kind: CommunityKind;
  onPlay?: (entry: CommunityEntry) => void;
}) {
  const isVideo = kind === "vlog";
  return (
    <S.Tile>
      {isVideo ? (
        <button
          type="button"
          onClick={() => onPlay?.(item)}
          disabled={!item.video}
          aria-label={`${item.title} 영상 보기`}
          style={{
            border: 0,
            background: "none",
            padding: 0,
            textAlign: "left",
            cursor: item.video ? "pointer" : "default",
          }}
        >
          <S.TileImage>
            {item.image ? (
              <Image
                src={item.image}
                alt=""
                fill
                unoptimized
                sizes="(max-width: 620px) 100vw, (max-width: 1000px) 50vw, 33vw"
              />
            ) : (
              <span className="fallback">AHN’S Film</span>
            )}
            {item.video && (
              <span
                aria-hidden="true"
                style={{
                  position: "absolute",
                  left: "50%",
                  top: "50%",
                  transform: "translate(-50%, -50%)",
                  width: 57,
                  height: 57,
                  border: "1px solid #fff",
                  color: "#fff",
                  borderRadius: "50%",
                  display: "grid",
                  placeItems: "center",
                  background: "rgba(22,51,38,.25)",
                  fontSize: 19,
                }}
              >
                ▶
              </span>
            )}
          </S.TileImage>
        </button>
      ) : (
        <S.TileImage>
          {item.image ? (
            <Image
              src={item.image}
              alt={
                kind === "before-after"
                  ? "등록된 이미지 자료"
                  : "이벤트 관련 이미지"
              }
              fill
              unoptimized
              sizes="(max-width: 620px) 100vw, (max-width: 1000px) 50vw, 33vw"
            />
          ) : (
            <span className="fallback">AHN’S Editorial</span>
          )}
        </S.TileImage>
      )}
      <div className="metadata">
        <span>{item.category}</span>
        <span>{formatDate(item.date)}</span>
      </div>
      <h3>{item.title}</h3>
      {item.subtitle && <p>{item.subtitle}</p>}
    </S.Tile>
  );
}

function VideoDialog({ source, close }: { source: string; close: () => void }) {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  useEffect(() => {
    const keydown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", keydown);
    const old = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", keydown);
      document.body.style.overflow = old;
    };
  }, [close]);
  if (!ready) return null;
  return createPortal(
    <S.ModalBackdrop
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <S.ModalWindow
        role="dialog"
        aria-modal="true"
        aria-label="VLOG 영상 보기"
      >
        <button onClick={close} type="button" autoFocus>
          닫기 ×
        </button>
        <iframe
          src={source}
          title="AHN’S VLOG"
          loading="eager"
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </S.ModalWindow>
    </S.ModalBackdrop>,
    document.body,
  );
}

function EditorialNote({
  kind,
}: {
  kind: "notice" | "reviews" | "before-after";
}) {
  const details = {
    notice: {
      eyebrow: "AN OPEN LETTER",
      title: (
        <>
          알아야 할 이야기는
          <br />더 분명하고 정직하게.
        </>
      ),
      text: "운영 일정과 주요 안내는 정확하게 확인된 내용을 중심으로 게시합니다. 준비된 소식은 공지사항에서 차례대로 만나보실 수 있습니다.",
      photo: "/images/community/editorial-shadow.webp",
      alt: "차분한 자연광과 실내 공간",
    },
    reviews: {
      eyebrow: "A PERSONAL STORY",
      title: (
        <>
          한 사람의 경험을
          <br />
          가볍게 다루지 않습니다.
        </>
      ),
      text: "후기는 실제 작성자의 동의와 공개 범위를 확인한 후 제공해야 합니다. 결과는 사람마다 다를 수 있으며, 후기 하나가 모든 사람의 결과를 대표하지는 않습니다.",
      photo: "/images/community/editorial-face.webp",
      alt: "차분한 인물 에디토리얼 이미지",
    },
    "before-after": {
      eyebrow: "RESPONSIBLE PRESENTATION",
      title: (
        <>
          이미지 하나에도
          <br />
          충분한 맥락이 필요하니까.
        </>
      ),
      text: "전후 사진은 실제 공개 동의, 촬영 시점과 조건, 필요한 주의 정보를 함께 확인한 뒤 소개합니다. 기존의 단일 셀피 이미지를 전후 비교자료로 표시하지 않았습니다.",
      photo: "/images/community/editorial-light.webp",
      alt: "공간의 자연광을 담은 사진",
    },
  }[kind];
  return (
    <S.Essay data-c-reveal>
      <S.EssayImage>
        <Image
          src={details.photo}
          alt={details.alt}
          fill
          sizes="(max-width:820px) 100vw, 45vw"
        />
      </S.EssayImage>
      <S.EssayCopy>
        <S.Eyebrow>{details.eyebrow}</S.Eyebrow>
        <h2>{details.title}</h2>
        <p>{details.text}</p>
      </S.EssayCopy>
    </S.Essay>
  );
}

function EntriesView({
  kind,
}: {
  kind: Exclude<CommunityKind, "consultation">;
}) {
  const { status, result, retry } = useCommunityEntries(kind);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [page, setPage] = useState(1);
  const [opened, setOpened] = useState<string | null>(null);
  const [videoSource, setVideoSource] = useState<string | null>(null);
  const [videoLink, setVideoLink] = useState<string | null>(null);

  const categories = useMemo(
    () => [
      ...new Set(result.entries.map((entry) => entry.category).filter(Boolean)),
    ],
    [result.entries],
  );
  const filtered = useMemo(
    () =>
      result.entries.filter((entry) => {
        const text =
          `${entry.title} ${entry.subtitle} ${entry.question} ${entry.answer} ${entry.category}`.toLocaleLowerCase(
            "ko-KR",
          );
        return (
          (category === "all" || entry.category === category) &&
          text.includes(query.trim().toLocaleLowerCase("ko-KR"))
        );
      }),
    [result.entries, category, query],
  );
  const limit =
    kind === "notice" || kind === "reviews" || kind === "qna" ? 8 : 9;
  const pageCount = Math.ceil(filtered.length / limit);
  const visible = filtered.slice((page - 1) * limit, page * limit);

  const chooseVideo = (item: CommunityEntry) => {
    if (!item.video) return;
    const embed = toYoutubeEmbed(item.video);
    if (embed) setVideoSource(embed);
    else setVideoLink(item.video);
  };

  useEffect(() => {
    setPage(1);
    setOpened(null);
  }, [query, category, kind]);

  return (
    <S.ContentRegion>
      <S.Container>
        <S.Toolbar>
          <S.Count>
            {COMMUNITY_BY_KIND[kind].english} &nbsp; / &nbsp;{" "}
            {status === "ready"
              ? `${filtered.length.toLocaleString("ko-KR")} RECORDS`
              : "LOADING"}
          </S.Count>
          <S.SearchInput
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`${COMMUNITY_BY_KIND[kind].label} 검색`}
            aria-label={`${COMMUNITY_BY_KIND[kind].label} 검색`}
          />
        </S.Toolbar>
        {kind === "qna" && categories.length > 1 && (
          <S.ChipRow aria-label="질문 분류">
            <S.Chip
              type="button"
              $active={category === "all"}
              onClick={() => setCategory("all")}
            >
              전체
            </S.Chip>
            {categories.map((c) => (
              <S.Chip
                key={c}
                type="button"
                $active={category === c}
                onClick={() => setCategory(c)}
              >
                {c}
              </S.Chip>
            ))}
          </S.ChipRow>
        )}
        {visible.length === 0 ? (
          <EmptyNotice
            kind={kind}
            status={status}
            connected={result.connected}
            onRetry={retry}
            query={query}
          />
        ) : kind === "qna" ? (
          <S.Lines>
            {visible.map((item) => {
              const expanded = opened === item.id;
              const answerId = `community-answer-${item.id}`;
              return (
                <S.FaqItem key={item.id}>
                  <S.FaqQuestion
                    type="button"
                    $open={expanded}
                    aria-expanded={expanded}
                    aria-controls={answerId}
                    onClick={() => setOpened(expanded ? null : item.id)}
                  >
                    <span className="q">Q.</span>
                    <span className="question">
                      {item.question || item.title}
                    </span>
                    <span className="plus" aria-hidden="true">
                      +
                    </span>
                  </S.FaqQuestion>
                  {expanded && (
                    <S.FaqAnswer id={answerId}>
                      {item.answer || "답변 준비 중입니다."}
                    </S.FaqAnswer>
                  )}
                </S.FaqItem>
              );
            })}
          </S.Lines>
        ) : kind === "notice" || kind === "reviews" ? (
          <S.Lines>
            {visible.map((item) => (
              <S.LineItem key={item.id}>
                <span className="tag">{item.category || "AHN’S"}</span>
                <div>
                  <h3>{item.title}</h3>
                  {item.subtitle && <p>{item.subtitle}</p>}
                </div>
                <time>{formatDate(item.date)}</time>
              </S.LineItem>
            ))}
          </S.Lines>
        ) : (
          <S.TileGrid>
            {visible.map((item) => (
              <MediaTile
                key={item.id}
                item={item}
                kind={kind}
                onPlay={chooseVideo}
              />
            ))}
          </S.TileGrid>
        )}
        <Pagination page={page} count={pageCount} onChange={setPage} />
        {(kind === "notice" ||
          kind === "reviews" ||
          kind === "before-after") && <EditorialNote kind={kind} />}
        {kind === "before-after" && (
          <S.InfoGrid>
            <div>
              <strong>01 / Consent</strong>
              <span>환자 동의 및 공개 범위 확인</span>
            </div>
            <div>
              <strong>02 / Context</strong>
              <span>촬영 시기와 시술 정보를 함께 안내</span>
            </div>
            <div>
              <strong>03 / Integrity</strong>
              <span>보정·조명 등 비교 조건 검토</span>
            </div>
          </S.InfoGrid>
        )}
      </S.Container>
      {videoSource && (
        <VideoDialog source={videoSource} close={() => setVideoSource(null)} />
      )}
      {videoLink && (
        <S.ModalBackdrop onMouseDown={() => setVideoLink(null)}>
          <S.ModalWindow
            role="dialog"
            aria-modal="true"
            aria-label="외부 VLOG 영상 링크"
          >
            <button onClick={() => setVideoLink(null)} type="button">
              닫기 ×
            </button>
            <p style={{ fontSize: 18, lineHeight: 1.8, padding: "35px 0" }}>
              외부 사이트의 영상입니다.
            </p>
            <a
              href={videoLink}
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: "underline" }}
            >
              새 탭에서 영상 열기 ↗
            </a>
          </S.ModalWindow>
        </S.ModalBackdrop>
      )}
    </S.ContentRegion>
  );
}

function ConsultationPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [department, setDepartment] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [working, setWorking] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (working) return;
    const cleanName = name.trim();
    const cleanPhone = phone.replace(/\D/g, "");
    if (
      !cleanName ||
      !/^\d{9,11}$/.test(cleanPhone) ||
      !department ||
      !agreed
    ) {
      setIsError(true);
      setMessage("성함·연락처·상담 분야와 개인정보 동의를 확인해 주세요.");
      return;
    }
    setWorking(true);
    setMessage("");
    try {
      await submitQuickConsultation({
        name: cleanName,
        phone: cleanPhone,
        department,
      });
      setName("");
      setPhone("");
      setDepartment("");
      setAgreed(false);
      setIsError(false);
      setMessage("상담 신청이 접수되었습니다. 담당자가 안내해 드리겠습니다.");
    } catch {
      setIsError(true);
      setMessage("신청을 접수하지 못했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setWorking(false);
    }
  };
  return (
    <S.ContentRegion>
      <S.Container>
        <S.ConsultGrid>
          <S.ConsultIntro data-c-reveal>
            <S.Eyebrow>BEGIN WITH A CONVERSATION</S.Eyebrow>
            <h2>
              조금 더 가까이,
              <br />한 사람의 이야기를 듣겠습니다.
            </h2>
            <p>
              원하시는 상담 분야와 연락처를 남겨 주시면 담당자가 확인 후
              연락드립니다. 구체적인 진료와 시술 적합성은 의료진 상담에서 확인할
              수 있습니다.
            </p>
            <div className="illustration">
              <Image
                src="/images/community/editorial-light.webp"
                alt="햇살이 드는 차분한 공간"
                fill
                sizes="(max-width: 860px) 100vw, 43vw"
                style={{ objectFit: "cover" }}
              />
            </div>
          </S.ConsultIntro>
          <S.Form onSubmit={handleSubmit} data-c-reveal>
            <div>
              <label htmlFor="consult-name">01 / 성함</label>
              <input
                id="consult-name"
                autoComplete="name"
                maxLength={40}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="성함을 입력해 주세요"
                required
              />
            </div>
            <div>
              <label htmlFor="consult-phone">02 / 연락처</label>
              <input
                id="consult-phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="연락받으실 번호를 입력해 주세요"
                required
              />
            </div>
            <div>
              <label htmlFor="consult-department">03 / 상담 분야</label>
              <select
                id="consult-department"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                required
              >
                <option value="">상담 분야를 선택해 주세요</option>
                <option value="눈성형">눈성형</option>
                <option value="코성형">코성형</option>
                <option value="동안성형">동안성형</option>
                <option value="쁘띠시술">쁘띠시술</option>
                <option value="기타">기타</option>
              </select>
            </div>
            <div className="privacy">
              <input
                id="consult-consent"
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                required
              />
              <label htmlFor="consult-consent">
                이름·연락처·상담 분야를 상담 연락 목적으로 제공하는 것에
                동의합니다. (필수)
              </label>
            </div>
            <p className="fine">
              운영 공개 전 실제 개인정보처리방침과 보유 기간을 안내하는 링크를
              반드시 연결해 주세요.
            </p>
            {message && (
              <p
                className={`message ${isError ? "error" : "success"}`}
                role="status"
              >
                {message}
              </p>
            )}
            <S.Button type="submit" disabled={working}>
              {working ? "접수 중…" : "상담 신청하기 ↗"}
            </S.Button>
          </S.Form>
        </S.ConsultGrid>
        <S.InfoGrid>
          <div>
            <strong>01 / Listen</strong>
            <span>편안한 첫 상담</span>
          </div>
          <div>
            <strong>02 / Discuss</strong>
            <span>개인별 상태와 선택지 확인</span>
          </div>
          <div>
            <strong>03 / Decide</strong>
            <span>충분한 설명과 신중한 결정</span>
          </div>
        </S.InfoGrid>
      </S.Container>
    </S.ContentRegion>
  );
}

export default function CommunityExperience({
  kind,
}: {
  kind?: CommunityKind;
}) {
  if (!kind) return <CommunityHome />;
  return (
    <CommunityFrame>
      <SubHero kind={kind} />
      {kind === "consultation" ? (
        <ConsultationPage />
      ) : (
        <EntriesView kind={kind} />
      )}
      <BottomCTA />
    </CommunityFrame>
  );
}
