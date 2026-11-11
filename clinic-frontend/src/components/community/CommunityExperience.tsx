"use client";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FormEvent, ReactNode, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";

import * as S from "@/components/community/Community.styles";
import ConsultCaptcha, {
  consultCaptchaEnabled,
} from "@/components/security/ConsultCaptcha";
import { defaultLocale, isAppLocale } from "@/i18n/config";
import { localizedPath, stripLocalePrefix } from "@/i18n/url";
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
const communityNavKeys = {
  notice: "notice",
  events: "events",
  reviews: "reviews",
  "before-after": "beforeAfter",
  consultation: "onlineConsultation",
  qna: "qna",
  vlog: "vlog",
} as const;

function useCommunityLocale() {
  const value = useLocale();
  return isAppLocale(value) ? value : defaultLocale;
}

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
  const pathname = stripLocalePrefix(usePathname());
  const locale = useCommunityLocale();
  const tCommunity = useTranslations("Community");
  const tNavigation = useTranslations("Navigation");
  return (
    <S.TopBar aria-label={tCommunity("subNavigation")}>
      <S.NavTitle>
        COMMUNITY <span>/</span>
      </S.NavTitle>
      <S.NavTrack>
        {COMMUNITY_PAGES.map((page) => (
          <S.NavLink
            as={Link}
            key={page.kind}
            href={localizedPath(page.href, locale)}
            $active={pathname === page.href}
            aria-current={pathname === page.href ? "page" : undefined}
          >
            {tNavigation(communityNavKeys[page.kind])}
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
  const locale = useCommunityLocale();
  const tCommunity = useTranslations("Community");
  return (
    <S.DarkBand>
      <S.Container>
        <S.DarkBandInner>
          <div data-c-reveal>
            <S.Eyebrow>AHN’S / THE CONVERSATION</S.Eyebrow>
            <h2 style={{ marginTop: 24 }}>
              {tCommunity("ctaTitle1")}
              <br />
              {tCommunity("ctaTitle2")}
            </h2>
          </div>
          <div data-c-reveal>
            <p>
              {tCommunity("ctaLine1")}
              <br />
              {tCommunity("ctaLine2")}
            </p>
            <div style={{ marginTop: 27 }}>
              <S.TextLink
                as={Link}
                href={localizedPath("/community/consultation", locale)}
              >
                {tCommunity("onlineConsultation")}{" "}
                <span aria-hidden="true">↗</span>
              </S.TextLink>
            </div>
          </div>
        </S.DarkBandInner>
      </S.Container>
    </S.DarkBand>
  );
}

function CommunityHome() {
  const locale = useCommunityLocale();
  const tCommunity = useTranslations("Community");
  const tNavigation = useTranslations("Navigation");
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
              {tCommunity("homeTitle1")}
              <br />
              {tCommunity("homeTitle2")}
              <br />
              <em>{tCommunity("homeStories")}</em>
            </S.Display>
            <S.Lead>{tCommunity("homeLead")}</S.Lead>
            <S.TextLink
              as={Link}
              href={localizedPath("/community/notice", locale)}
            >
              {tCommunity("viewNotices")} <span aria-hidden="true">↗</span>
            </S.TextLink>
            <S.HeroCounter>
              001 — 007{" "}
              <span style={{ paddingLeft: 15, fontSize: 11 }}>
                {tCommunity("scrollExplore")}
              </span>
            </S.HeroCounter>
          </S.HeroCopy>
          <S.HeroPhotoFrame data-c-reveal>
            <Image
              src="/images/community/editorial-hero.webp"
              alt={tCommunity("heroImageAlt")}
              fill
              priority
              sizes="(max-width: 860px) 100vw, 48vw"
            />
            <S.PhotoCaption>{tCommunity("heroPhotoCaption")}</S.PhotoCaption>
          </S.HeroPhotoFrame>
        </S.Container>
      </S.MainHero>
      <S.MainFeature>
        <S.MainFeatureCopy data-c-reveal>
          <S.Eyebrow>{tCommunity("featuredEyebrow")}</S.Eyebrow>
          <div>
            <h2>
              {tCommunity("featureTitle1")}
              <br />
              {tCommunity("featureTitle2")}
            </h2>
            <p style={{ marginTop: 23 }}>{tCommunity("featureLead")}</p>
          </div>
          <S.TextLink
            as={Link}
            href={localizedPath("/community/events", locale)}
          >
            {tCommunity("viewEvents")} <span aria-hidden="true">↗</span>
          </S.TextLink>
        </S.MainFeatureCopy>
        <S.FeatureImage>
          <Image
            src="/images/community/editorial-shadow.webp"
            alt={tCommunity("featuredImageAlt")}
            fill
            sizes="(max-width: 860px) 100vw, 50vw"
          />
        </S.FeatureImage>
      </S.MainFeature>
      <S.Section>
        <S.Container>
          <S.SectionHead data-c-reveal>
            <div>
              <S.Eyebrow>{tCommunity("exploreEyebrow")}</S.Eyebrow>
              <h2 style={{ marginTop: 24 }}>{tCommunity("exploreTitle")}</h2>
            </div>
            <p>
              {tCommunity("exploreLine1")}
              <br />
              {tCommunity("exploreLine2")}
            </p>
          </S.SectionHead>
          <S.LinkGrid>
            {featured.map((page) => (
              <S.LinkCard
                as={Link}
                href={localizedPath(page.href, locale)}
                key={page.kind}
              >
                <span className="number">
                  {page.number} / {page.english}
                </span>
                <h3>{tNavigation(communityNavKeys[page.kind])}</h3>
                <p>{tCommunity(`pages.${page.kind}.description`)}</p>
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
  const tCommunity = useTranslations("Community");
  const page = COMMUNITY_BY_KIND[kind];
  return (
    <S.SubHero>
      <S.Container>
        <div data-c-reveal>
          <S.Eyebrow>AHN’S COMMUNITY / {page.english}</S.Eyebrow>
          <S.Display>{tCommunity(`pages.${kind}.title`)}</S.Display>
          <S.Lead>{tCommunity(`pages.${kind}.description`)}</S.Lead>
        </div>
        <S.HeroIndex aria-hidden="true">{page.number}</S.HeroIndex>
      </S.Container>
    </S.SubHero>
  );
}

function useCommunityEntries(kind: CommunityKind) {
  const locale = useLocale();
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
    loadCommunity(kind, controller.signal, locale)
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
  }, [kind, retry, locale]);
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
  const tCommunity = useTranslations("Community");
  const notWired = !connected && status === "ready";
  const heading =
    status === "loading"
      ? tCommunity("loading")
      : status === "error"
        ? tCommunity("loadError")
        : query
          ? tCommunity("emptySearch")
          : notWired
            ? tCommunity("notConnected")
            : tCommunity("empty");
  const explanation =
    status === "error"
      ? tCommunity("checkServer")
      : query
        ? tCommunity("changeKeyword")
        : notWired
          ? tCommunity("notConnectedDetail", {
              section: tCommunity(`pages.${kind}.label`),
            })
          : tCommunity("emptyDetail");
  return (
    <S.EmptyBox role="status">
      <span className="symbol" aria-hidden="true">
        A.
      </span>
      <h3>{heading}</h3>
      <p>{explanation}</p>
      {status === "error" && (
        <S.Button type="button" onClick={onRetry}>
          {tCommunity("retry")}
        </S.Button>
      )}
    </S.EmptyBox>
  );
}

function formatDate(value: string, locale: string): string {
  if (!value) return "";
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime())
    ? value.slice(0, 10)
    : parsed.toLocaleDateString(locale, {
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
  const tCommunity = useTranslations("Community");
  if (count <= 1) return null;
  return (
    <S.Pages aria-label={tCommunity("pageSelect")}>
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
  const tCommunity = useTranslations("Community");
  const locale = useCommunityLocale();
  const isVideo = kind === "vlog";
  return (
    <S.Tile>
      {isVideo ? (
        <button
          type="button"
          onClick={() => onPlay?.(item)}
          disabled={!item.video}
          aria-label={tCommunity("playVideo", { title: item.title })}
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
                  ? tCommunity("galleryImageAlt")
                  : tCommunity("eventImageAlt")
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
        <span>{formatDate(item.date, locale)}</span>
      </div>
      <h3>{item.title}</h3>
      {item.subtitle && <p>{item.subtitle}</p>}
    </S.Tile>
  );
}

function VideoDialog({ source, close }: { source: string; close: () => void }) {
  const tCommunity = useTranslations("Community");
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
        aria-label={tCommunity("videoDialog")}
      >
        <button onClick={close} type="button" autoFocus>
          {tCommunity("close")} ×
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
  const tCommunity = useTranslations("Community");
  const prefix = {
    notice: "editorialNotice",
    reviews: "editorialReviews",
    "before-after": "editorialBeforeAfter",
  }[kind];
  const photo = {
    notice: "/images/community/editorial-shadow.webp",
    reviews: "/images/community/editorial-face.webp",
    "before-after": "/images/community/editorial-light.webp",
  }[kind];
  return (
    <S.Essay data-c-reveal>
      <S.EssayImage>
        <Image
          src={photo}
          alt={tCommunity(`${prefix}ImageAlt`)}
          fill
          sizes="(max-width:820px) 100vw, 45vw"
        />
      </S.EssayImage>
      <S.EssayCopy>
        <S.Eyebrow>{tCommunity(`${prefix}Eyebrow`)}</S.Eyebrow>
        <h2>
          {tCommunity(`${prefix}Title1`)}
          <br />
          {tCommunity(`${prefix}Title2`)}
        </h2>
        <p>{tCommunity(`${prefix}Text`)}</p>
      </S.EssayCopy>
    </S.Essay>
  );
}

function EntriesView({
  kind,
}: {
  kind: Exclude<CommunityKind, "consultation">;
}) {
  const tCommunity = useTranslations("Community");
  const locale = useCommunityLocale();
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
            locale,
          );
        return (
          (category === "all" || entry.category === category) &&
          text.includes(query.trim().toLocaleLowerCase(locale))
        );
      }),
    [result.entries, category, query, locale],
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
              ? tCommunity("recordCount", {
                  count: filtered.length.toLocaleString(locale),
                })
              : tCommunity("loadingShort")}
          </S.Count>
          <S.SearchInput
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={tCommunity("searchSection", {
              section: tCommunity(`pages.${kind}.label`),
            })}
            aria-label={tCommunity("searchSection", {
              section: tCommunity(`pages.${kind}.label`),
            })}
          />
        </S.Toolbar>
        {kind === "qna" && categories.length > 1 && (
          <S.ChipRow aria-label={tCommunity("questionFilters")}>
            <S.Chip
              type="button"
              $active={category === "all"}
              onClick={() => setCategory("all")}
            >
              {tCommunity("all")}
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
                      {item.answer || tCommunity("answerPending")}
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
                <time>{formatDate(item.date, locale)}</time>
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
              <strong>01 / {tCommunity("beforeAfterConsentTitle")}</strong>
              <span>{tCommunity("beforeAfterConsentText")}</span>
            </div>
            <div>
              <strong>02 / {tCommunity("beforeAfterContextTitle")}</strong>
              <span>{tCommunity("beforeAfterContextText")}</span>
            </div>
            <div>
              <strong>03 / {tCommunity("beforeAfterIntegrityTitle")}</strong>
              <span>{tCommunity("beforeAfterIntegrityText")}</span>
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
            aria-label={tCommunity("externalVideo")}
          >
            <button onClick={() => setVideoLink(null)} type="button">
              {tCommunity("close")} ×
            </button>
            <p style={{ fontSize: 18, lineHeight: 1.8, padding: "35px 0" }}>
              {tCommunity("externalVideoNotice")}
            </p>
            <a
              href={videoLink}
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: "underline" }}
            >
              {tCommunity("openExternalVideo")} ↗
            </a>
          </S.ModalWindow>
        </S.ModalBackdrop>
      )}
    </S.ContentRegion>
  );
}

function ConsultationPage() {
  const tCommunity = useTranslations("Community");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [department, setDepartment] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [captchaToken, setCaptchaToken] = useState("");
  const [captchaReset, setCaptchaReset] = useState(0);
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
      setMessage(tCommunity("consultValidation"));
      return;
    }
    if (consultCaptchaEnabled && !captchaToken) {
      setIsError(true);
      setMessage(tCommunity("consultCaptcha"));
      return;
    }
    setWorking(true);
    setMessage("");
    try {
      await submitQuickConsultation({
        name: cleanName,
        phone: cleanPhone,
        department,
        privacyConsent: agreed,
        captchaToken,
      });
      setName("");
      setPhone("");
      setDepartment("");
      setAgreed(false);
      setIsError(false);
      setMessage(tCommunity("consultSuccess"));
    } catch {
      setIsError(true);
      setMessage(tCommunity("consultFail"));
    } finally {
      setWorking(false);
      setCaptchaReset((v) => v + 1);
    }
  };
  return (
    <S.ContentRegion>
      <S.Container>
        <S.ConsultGrid>
          <S.ConsultIntro data-c-reveal>
            <S.Eyebrow>{tCommunity("consultEyebrow")}</S.Eyebrow>
            <h2>
              {tCommunity("consultTitle1")}
              <br />
              {tCommunity("consultTitle2")}
            </h2>
            <p>{tCommunity("consultLead")}</p>
            <div className="illustration">
              <Image
                src="/images/community/editorial-light.webp"
                alt={tCommunity("consultImageAlt")}
                fill
                sizes="(max-width: 860px) 100vw, 43vw"
                style={{ objectFit: "cover" }}
              />
            </div>
          </S.ConsultIntro>
          <S.Form onSubmit={handleSubmit} data-c-reveal>
            <div>
              <label htmlFor="consult-name">
                01 / {tCommunity("nameLabel")}
              </label>
              <input
                id="consult-name"
                autoComplete="name"
                maxLength={40}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={tCommunity("namePlaceholder")}
                required
              />
            </div>
            <div>
              <label htmlFor="consult-phone">
                02 / {tCommunity("phoneLabel")}
              </label>
              <input
                id="consult-phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={tCommunity("phonePlaceholder")}
                required
              />
            </div>
            <div>
              <label htmlFor="consult-department">
                03 / {tCommunity("departmentLabel")}
              </label>
              <select
                id="consult-department"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                required
              >
                <option value="">{tCommunity("selectDepartment")}</option>
                <option value="눈성형">{tCommunity("eyes")}</option>
                <option value="코성형">{tCommunity("nose")}</option>
                <option value="동안성형">{tCommunity("antiAging")}</option>
                <option value="쁘띠시술">{tCommunity("petit")}</option>
                <option value="기타">{tCommunity("other")}</option>
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
                {tCommunity("consultConsentText")}
              </label>
            </div>
            <p className="fine">{tCommunity("consultPolicyReminder")}</p>
            {message && (
              <p
                className={`message ${isError ? "error" : "success"}`}
                role="status"
              >
                {message}
              </p>
            )}
            <ConsultCaptcha onToken={setCaptchaToken} resetKey={captchaReset} />
            <S.Button
              type="submit"
              disabled={working || (consultCaptchaEnabled && !captchaToken)}
            >
              {working
                ? tCommunity("submitting")
                : `${tCommunity("submitConsultation")} ↗`}
            </S.Button>
          </S.Form>
        </S.ConsultGrid>
        <S.InfoGrid>
          <div>
            <strong>01 / {tCommunity("consultInfoListenTitle")}</strong>
            <span>{tCommunity("consultInfoListenText")}</span>
          </div>
          <div>
            <strong>02 / {tCommunity("consultInfoDiscussTitle")}</strong>
            <span>{tCommunity("consultInfoDiscussText")}</span>
          </div>
          <div>
            <strong>03 / {tCommunity("consultInfoDecideTitle")}</strong>
            <span>{tCommunity("consultInfoDecideText")}</span>
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
