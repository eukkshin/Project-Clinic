export type CommunityKind =
  | "notice"
  | "events"
  | "reviews"
  | "before-after"
  | "consultation"
  | "qna"
  | "vlog";

export type CommunityPageInfo = {
  kind: CommunityKind;
  href: string;
  label: string;
  english: string;
  title: string;
  description: string;
  number: string;
};

export const COMMUNITY_PAGES: CommunityPageInfo[] = [
  {
    kind: "notice",
    href: "/community/notice",
    label: "공지사항",
    english: "NOTICE",
    title: "새로운 소식을 전합니다.",
    description: "AHN’S의 주요 안내와 운영 소식을 확인하세요.",
    number: "01",
  },
  {
    kind: "events",
    href: "/community/events",
    label: "이벤트",
    english: "EVENTS",
    title: "지금의 소식을 만나보세요.",
    description: "관리자가 등록한 이벤트 안내를 한곳에서 살펴보세요.",
    number: "02",
  },
  {
    kind: "reviews",
    href: "/community/reviews",
    label: "시술 후기",
    english: "STORIES",
    title: "각자의 이야기를 존중합니다.",
    description:
      "실제 공개 동의와 검토가 완료된 후기만 게시할 수 있도록 준비한 공간입니다.",
    number: "03",
  },
  {
    kind: "before-after",
    href: "/community/before-after",
    label: "전후사진",
    english: "GALLERY",
    title: "변화를 기록하는 방법.",
    description:
      "촬영 조건과 공개 동의를 확인한 전후 비교 자료를 위한 공간입니다.",
    number: "04",
  },
  {
    kind: "consultation",
    href: "/community/consultation",
    label: "온라인 상담",
    english: "CONSULTATION",
    title: "편안한 첫 대화를 시작하세요.",
    description:
      "궁금한 점이 있다면 상담을 요청해 주세요. 담당자가 안내해 드립니다.",
    number: "05",
  },
  {
    kind: "qna",
    href: "/community/qna",
    label: "Q&A",
    english: "QUESTIONS",
    title: "궁금한 마음에 답합니다.",
    description: "관리자가 등록한 자주 묻는 질문을 주제별로 확인하세요.",
    number: "06",
  },
  {
    kind: "vlog",
    href: "/community/vlog",
    label: "VLOG",
    english: "AHN’S FILM",
    title: "공간과 이야기를 영상으로.",
    description: "AHN’S의 일상과 콘텐츠를 영상으로 만나보세요.",
    number: "07",
  },
];

export const COMMUNITY_BY_KIND: Record<CommunityKind, CommunityPageInfo> =
  Object.fromEntries(
    COMMUNITY_PAGES.map((page) => [page.kind, page]),
  ) as Record<CommunityKind, CommunityPageInfo>;
