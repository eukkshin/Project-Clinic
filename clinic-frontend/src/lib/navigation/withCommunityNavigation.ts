import { COMMUNITY_PAGES } from '@/lib/community/config';

type NavChild = {
  name: string;
  url: string;
};

export type NavMenu = {
  id: number;
  name: string;
  url: string;
  children?: NavChild[];
};

/**
 * 현재 Header 관리자 메뉴를 유지하면서 커뮤니티 링크만 연결합니다.
 *
 * - 새로운 하위 URL은 기존 CommunityNav의 COMMUNITY_PAGES에서 읽습니다.
 * - 기존 다른 메뉴와 관리자가 등록한 추가 하위 메뉴는 유지합니다.
 * - '커뮤니티'가 없으면 새 메뉴를 추가합니다.
 * - 같은 커뮤니티 경로를 두 번 넣지 않습니다.
 * - 커뮤니티 기본 항목 이름이 등록된 경우 해당 항목의 링크만 실제 페이지 주소로 정정합니다.
 */
export function withCommunityNavigation(menus: NavMenu[]): NavMenu[] {
  const communityChildren = COMMUNITY_PAGES.map(({ label, href }) => ({
    name: label,
    url: href,
  }));

  const targetIndex = menus.findIndex((menu) => {
    const name = menu.name.replace(/\s/g, "").toLowerCase();
    const url = menu.url.replace(/\/+$/, "") || "/";
    return name === "커뮤니티" || name === "community" || url === "/community";
  });

  if (targetIndex === -1) {
    const maxId = menus.reduce(
      (largest, menu) => Math.max(largest, menu.id),
      0,
    );
    return [
      ...menus,
      {
        id: maxId + 1,
        name: "커뮤니티",
        url: "/community",
        children: communityChildren,
      },
    ];
  }

  return menus.map((menu, index) => {
    if (index !== targetIndex) return menu;

    const existing = (menu.children ?? []).map((child) => {
      // 예전 관리자 메뉴에 같은 항목명으로 잘못된 경로가 저장되어 있다면 수정합니다.
      const canonical = communityChildren.find(
        (item) => item.name === child.name,
      );
      return canonical ? { ...child, url: canonical.url } : child;
    });

    const seen = new Set(existing.map((child) => child.url));
    const missing = communityChildren.filter((child) => !seen.has(child.url));

    return {
      ...menu,
      url: "/community",
      children: [...existing, ...missing],
    };
  });
}
