/**
 * 공개된 시술 상세페이지를 기존 관리자 Header 메뉴와 병합한다.
 * 병원소개/커뮤니티/관리자가 만든 별도 메뉴는 변경하지 않는다.
 */
export interface HeaderNavMenu {
  id: number;
  name: string;
  url: string;
  children?: { name: string; url: string }[];
}

export interface PublicProcedureLink {
  category: string;
  slug: string;
  name: string;
  url: string;
}

const NAME_TO_CATEGORY: Record<string, string> = {
  눈성형: "eyes",
  코성형: "nose",
  동안성형: "anti-aging",
  쁘띠시술: "petit",
};
const CATEGORIES = new Set(Object.values(NAME_TO_CATEGORY));
const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function categoryForMenu(menu: HeaderNavMenu): string | null {
  const byName = NAME_TO_CATEGORY[menu.name.replace(/\s+/g, "")];
  if (byName) return byName;
  // 관리자에서 메뉴명을 바꾸어도 등록한 카테고리 URL은 인식한다.
  const prefix = menu.url.match(/^\/(eyes|nose|anti-aging|petit)(?:\/|$)/)?.[1];
  return prefix && CATEGORIES.has(prefix) ? prefix : null;
}

function isProcedurePath(url: string, category: string): boolean {
  return url.startsWith(`/${category}/`) && !url.startsWith(`/${category}//`);
}

export function mergePublishedProcedureMenus<T extends HeaderNavMenu>(
  menus: T[],
  published: PublicProcedureLink[] | null,
): T[] {
  // API 오류 시 기존 관리자가 설정한 메뉴를 그대로 보여준다.
  if (published === null) return menus;

  const pagesByCategory = new Map<string, { name: string; url: string }[]>();
  for (const item of published) {
    if (!CATEGORIES.has(item.category) || !SLUG_RE.test(item.slug)) continue;
    if (typeof item.name !== "string" || !item.name.trim()) continue;

    const url = `/${item.category}/${item.slug}`;
    const items = pagesByCategory.get(item.category) ?? [];
    if (!items.some((old) => old.url === url)) {
      items.push({ name: item.name.trim(), url });
    }
    pagesByCategory.set(item.category, items);
  }

  return menus.map((menu) => {
    const category = categoryForMenu(menu);
    if (!category) return menu;

    const publicChildren = pagesByCategory.get(category) ?? [];
    const manualChildren = (menu.children ?? []).filter(
      (child) => !isProcedurePath(child.url, category),
    );
    const children = [...publicChildren, ...manualChildren];

    // 기존 상위 링크가 '/' 등 임시 URL 또는 상세페이지 URL이면 공개된 첫 시술로 연결.
    // 관리자가 지정한 별도의 소개/이벤트 링크는 보존.
    const parentUrl = menu.url.trim();
    const isProcedureParent = isProcedurePath(parentUrl, category);
    const isPlaceholder =
      parentUrl === "/" || parentUrl === "" || parentUrl === `/${category}`;
    const nextUrl =
      isPlaceholder || isProcedureParent
        ? isProcedureParent && publicChildren.some((x) => x.url === parentUrl)
          ? parentUrl
          : (publicChildren[0]?.url ?? "/")
        : menu.url;

    return { ...menu, url: nextUrl, children };
  });
}
