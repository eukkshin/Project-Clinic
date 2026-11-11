import type { Metadata } from "next";
import { getLocale } from "next-intl/server";

import { AppLocale, locales, normalizeLocale } from "@/i18n/config";
import { localizedPath } from "@/i18n/url";

/** SITE_URL 또는 NEXT_PUBLIC_SITE_URL은 실제 운영 도메인(프로토콜 포함)이어야 합니다. */
export function getSiteOrigin(): string | null {
  const raw = process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL;
  if (!raw) return null;
  try {
    const url = new URL(raw);
    if (
      !["https:", "http:"].includes(url.protocol) ||
      url.username ||
      url.password ||
      url.pathname !== "/"
    )
      return null;
    if (process.env.NODE_ENV === "production" && url.protocol !== "https:")
      return null;
    return url.origin;
  } catch {
    return null;
  }
}

const seoText = {
  "/": {
    ko: [
      "AHNS | 아름다움, 그 이상의 가치",
      "AHNS의 진료 철학과 시술 안내, 후기 및 상담 정보를 확인해 보세요.",
    ],
    en: [
      "AHNS | Beauty Beyond Expectations",
      "Explore AHNS: our philosophy, procedures, patient information and consultations.",
    ],
    ja: [
      "AHNS | 美しさ、その先の価値へ",
      "AHNSの診療理念、施術案内、患者様向け情報やご相談についてご覧ください。",
    ],
    "zh-CN": [
      "AHNS | 美丽，不止于此",
      "了解AHNS的诊疗理念、项目介绍、患者信息与咨询服务。",
    ],
    "zh-TW": [
      "AHNS | 美麗，不止於此",
      "了解AHNS的診療理念、療程介紹、患者資訊與諮詢服務。",
    ],
  },
  "/about/brand": {
    ko: [
      "브랜드 소개 | AHNS",
      "AHNS의 브랜드 스토리와 진료에 대한 가치관을 소개합니다.",
    ],
    en: [
      "Our Brand | AHNS",
      "Discover the brand story and values behind AHNS.",
    ],
    ja: [
      "ブランド紹介 | AHNS",
      "AHNSのブランドストーリーと大切にしている価値観をご紹介します。",
    ],
    "zh-CN": ["品牌介绍 | AHNS", "了解AHNS的品牌故事和核心价值。"],
    "zh-TW": ["品牌介紹 | AHNS", "認識AHNS的品牌故事與核心價值。"],
  },
  "/about/philosophy": {
    ko: [
      "진료 철학 | AHNS",
      "AHNS가 중요하게 생각하는 진료 철학과 원칙을 소개합니다.",
    ],
    en: [
      "Our Philosophy | AHNS",
      "Learn about the care philosophy and principles at AHNS.",
    ],
    ja: [
      "診療理念 | AHNS",
      "AHNSが大切にする診療理念と基本方針をご紹介します。",
    ],
    "zh-CN": ["诊疗理念 | AHNS", "了解AHNS重视的诊疗理念与原则。"],
    "zh-TW": ["診療理念 | AHNS", "了解AHNS重視的診療理念與原則。"],
  },
  "/about/doctors": {
    ko: ["의료진 소개 | AHNS", "AHNS 의료진 소개 및 진료 안내입니다."],
    en: [
      "Medical Team | AHNS",
      "Information about the AHNS medical team and consultations.",
    ],
    ja: [
      "医療スタッフ紹介 | AHNS",
      "AHNSの医療スタッフと診療についてご案内します。",
    ],
    "zh-CN": ["医疗团队 | AHNS", "了解AHNS医疗团队与诊疗服务。"],
    "zh-TW": ["醫療團隊 | AHNS", "認識AHNS醫療團隊與診療服務。"],
  },
  "/about/facilities": {
    ko: ["진료 환경 | AHNS", "AHNS 진료 공간과 시설을 소개합니다."],
    en: [
      "Our Facilities | AHNS",
      "Explore the clinical spaces and facilities at AHNS.",
    ],
    ja: ["院内施設 | AHNS", "AHNSの院内空間と設備をご紹介します。"],
    "zh-CN": ["诊疗环境 | AHNS", "了解AHNS的诊疗空间与环境。"],
    "zh-TW": ["診療環境 | AHNS", "認識AHNS的診療空間與環境。"],
  },
  "/about/safety": {
    ko: [
      "안전 시스템 | AHNS",
      "AHNS의 진료 과정과 안전을 위한 기본 원칙을 소개합니다.",
    ],
    en: [
      "Approach to Safety | AHNS",
      "Discover the safety principles that guide care at AHNS.",
    ],
    ja: [
      "安全への取り組み | AHNS",
      "AHNSが診療で大切にする安全への取り組みをご紹介します。",
    ],
    "zh-CN": ["安全理念 | AHNS", "了解AHNS诊疗过程中的安全原则。"],
    "zh-TW": ["安全理念 | AHNS", "了解AHNS診療過程中的安全原則。"],
  },
  "/about/location": {
    ko: ["오시는 길 | AHNS", "AHNS 성형외과의 위치와 방문 방법을 안내합니다."],
    en: [
      "Location & Directions | AHNS",
      "Find directions and visiting information for AHNS.",
    ],
    ja: ["アクセス | AHNS", "AHNSへのアクセス・ご来院案内をご確認ください。"],
    "zh-CN": ["交通指南 | AHNS", "查看AHNS的位置与来院方式。"],
    "zh-TW": ["交通指南 | AHNS", "查看AHNS的位置與來院方式。"],
  },
  "/reservation": {
    ko: [
      "방문 상담 예약 | AHNS",
      "방문 상담 예약 가능 날짜와 시간을 확인하세요.",
    ],
    en: [
      "Book a Consultation | AHNS",
      "Check available dates and times to book an in-person consultation.",
    ],
    ja: ["来院相談予約 | AHNS", "ご来院相談の予約可能な日時をご確認ください。"],
    "zh-CN": ["到院咨询预约 | AHNS", "查看可预约的到院咨询日期和时间。"],
    "zh-TW": ["到院諮詢預約 | AHNS", "查看可預約的到院諮詢日期與時間。"],
  },
  "/consultation": {
    ko: ["1:1 상담문의 | AHNS", "AHNS 1:1 상담 문의를 남겨 주세요."],
    en: [
      "One-to-One Consultation | AHNS",
      "Send a private consultation inquiry to AHNS.",
    ],
    ja: ["個別相談 | AHNS", "AHNSへの個別相談・お問い合わせはこちら。"],
    "zh-CN": ["一对一咨询 | AHNS", "向AHNS提交一对一咨询。"],
    "zh-TW": ["一對一諮詢 | AHNS", "向AHNS提交一對一諮詢。"],
  },
  "/community": {
    "ko": ["커뮤니티 | AHNS", "공지사항, 이벤트, Q&A, 영상 등 AHNS 커뮤니티 콘텐츠를 확인하세요."],
    "en": ["Community | AHNS", "Explore clinic updates, events, FAQs and videos from AHNS."],
    "ja": ["コミュニティ | AHNS", "AHNSのお知らせ、イベント、よくあるご質問、動画をご覧ください。"],
    "zh-CN": ["社区 | AHNS", "浏览 AHNS 公告、活动、常见问题与视频。"],
    "zh-TW": ["社群 | AHNS", "瀏覽 AHNS 公告、活動、常見問題與影片。"],
  },
  "/community/notice": {
    "ko": ["공지사항 | AHNS", "AHNS의 주요 공지와 운영 안내를 확인하세요."],
    "en": ["Notices | AHNS", "See official clinic notices and updates from AHNS."],
    "ja": ["お知らせ | AHNS", "AHNSからの重要なお知らせや診療案内をご確認ください。"],
    "zh-CN": ["公告 | AHNS", "查看 AHNS 诊所公告与重要通知。"],
    "zh-TW": ["公告 | AHNS", "查看 AHNS 診所公告與重要通知。"],
  },
  "/community/events": {
    "ko": ["이벤트 | AHNS", "AHNS에서 안내하는 이벤트 정보를 확인하세요."],
    "en": ["Events | AHNS", "Discover current clinic events and announcements from AHNS."],
    "ja": ["イベント | AHNS", "AHNSのイベント・キャンペーン情報をご案内します。"],
    "zh-CN": ["活动 | AHNS", "查看 AHNS 当前活动与相关通知。"],
    "zh-TW": ["活動 | AHNS", "查看 AHNS 最新活動與相關資訊。"],
  },
  "/community/reviews": {
    "ko": ["시술 후기 | AHNS", "공개 동의가 확인된 시술 후기를 살펴보세요."],
    "en": ["Patient Stories | AHNS", "Read experiences shared with appropriate publication consent."],
    "ja": ["施術体験談 | AHNS", "公開への同意が確認された体験談をご案内します。"],
    "zh-CN": ["体验分享 | AHNS", "了解已确认公开同意的体验分享。"],
    "zh-TW": ["經驗分享 | AHNS", "了解已確認公開同意的經驗分享。"],
  },
  "/community/before-after": {
    "ko": ["전후사진 | AHNS", "공개 동의 및 촬영 조건을 확인한 비교 자료를 안내합니다."],
    "en": ["Before & After | AHNS", "View comparison materials with publication consent and photography context."],
    "ja": ["ビフォーアフター | AHNS", "公開同意と撮影条件を確認した比較資料をご案内します。"],
    "zh-CN": ["术前术后 | AHNS", "查看已核对公开同意与拍摄条件的对比资料。"],
    "zh-TW": ["術前術後 | AHNS", "查看已確認公開同意與拍攝條件的對比資料。"],
  },
  "/community/consultation": {
    "ko": ["온라인 상담 | AHNS", "AHNS 온라인 상담으로 궁금한 점을 문의하세요."],
    "en": ["Online Consultation | AHNS", "Send a consultation inquiry to the AHNS team."],
    "ja": ["オンライン相談 | AHNS", "AHNSへのオンライン相談・お問い合わせはこちら。"],
    "zh-CN": ["在线咨询 | AHNS", "向 AHNS 团队发送咨询问题。"],
    "zh-TW": ["線上諮詢 | AHNS", "向 AHNS 團隊提出諮詢問題。"],
  },
  "/community/qna": {
    "ko": ["자주 묻는 질문 | AHNS", "AHNS의 상담 및 시술 관련 자주 묻는 질문을 확인하세요."],
    "en": ["FAQs | AHNS", "Browse frequently asked questions about AHNS consultations and procedures."],
    "ja": ["よくあるご質問 | AHNS", "AHNSへのご相談や施術に関するご質問を確認できます。"],
    "zh-CN": ["常见问题 | AHNS", "浏览有关 AHNS 咨询与项目的常见问题。"],
    "zh-TW": ["常見問題 | AHNS", "瀏覽有關 AHNS 諮詢與療程的常見問題。"],
  },
  "/community/vlog": {
    "ko": ["VLOG | AHNS", "AHNS의 일상과 소식을 영상으로 만나보세요."],
    "en": ["VLOG | AHNS", "Watch videos featuring everyday moments and updates from AHNS."],
    "ja": ["VLOG | AHNS", "AHNSの日常やお知らせを動画でご覧ください。"],
    "zh-CN": ["VLOG | AHNS", "通过视频了解 AHNS 的日常与最新消息。"],
    "zh-TW": ["VLOG | AHNS", "透過影片了解 AHNS 的日常與最新消息。"],
  },
  "/search": {
    ko: ["통합검색 | AHNS", "AHNS의 시술 정보 및 안내를 검색합니다."],
    en: [
      "Search | AHNS",
      "Search for information about AHNS procedures and services.",
    ],
    ja: ["サイト内検索 | AHNS", "AHNSの施術とサービスについて検索できます。"],
    "zh-CN": ["站内搜索 | AHNS", "搜索AHNS的项目与服务信息。"],
    "zh-TW": ["站內搜尋 | AHNS", "搜尋AHNS的療程與服務資訊。"],
  },
} as const;
export type SeoPath = keyof typeof seoText;

/** 실제 고정 번역이 확인된 페이지에만 다국어 대체 URL을 공개합니다. */
export const HREFLANG_READY_PATHS: readonly SeoPath[] = [
  "/about/brand",
  "/about/philosophy",
  "/about/facilities",
  "/about/safety",
];

export function absoluteLocalizedUrl(
  path: string,
  locale: AppLocale,
): string | null {
  const origin = getSiteOrigin();
  return origin ? origin + localizedPath(path, locale) : null;
}

export async function publicPageMetadata(path: SeoPath): Promise<Metadata> {
  const locale = normalizeLocale(await getLocale()) || "ko";
  const [title, description] = seoText[path][locale];
  const canonical = absoluteLocalizedUrl(path, locale);
  const allowAlternates = HREFLANG_READY_PATHS.includes(path);
  const languages =
    allowAlternates && canonical
      ? Object.fromEntries(
          locales.map((l) => [l, absoluteLocalizedUrl(path, l)!]),
        )
      : undefined;

  return {
    title,
    description,
    ...(canonical
      ? { alternates: { canonical, ...(languages ? { languages } : {}) } }
      : {}),
    openGraph: {
      title,
      description,
      ...(canonical ? { url: canonical } : {}),
      locale: locale.replace("-", "_"),
    },
    // 검색 결과는 쿼리에 따라 달라지므로 검색엔진 색인에서 제외합니다.
    ...(path === "/search" ? { robots: { index: false, follow: true } } : {}),
  };
}

/** 동적 시술 상세의 제목은 DB 번역을 사용하고, URL만 정규화합니다.
 * 공개 번역 존재 여부를 반환하는 API가 아직 없으므로 동적 상세의 hreflang은 생성하지 않습니다.
 */
export async function detailCanonical(
  path: string,
): Promise<Metadata["alternates"]> {
  const locale = normalizeLocale(await getLocale()) || "ko";
  const canonical = absoluteLocalizedUrl(path, locale);
  return canonical ? { canonical } : undefined;
}
