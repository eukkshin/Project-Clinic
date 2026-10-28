"use strict";
// Apply public procedure menus to the current Next.js + Express project.
// Usage: node scripts/apply.cjs "." "E:\\you_react\\10_plastic\\clinic-backend"
const fs = require("node:fs");
const path = require("node:path");

const [frontend, backend] = process.argv.slice(2);
if (!frontend || !backend) {
  console.error('사용법: node scripts/apply.cjs "." "백엔드_경로"');
  process.exit(1);
}
const root = path.resolve(__dirname, "..");
const check = (test, message) => {
  if (!test) throw new Error(message);
};
function read(file) {
  check(fs.existsSync(file), `파일 없음: ${file}`);
  return fs.readFileSync(file, "utf8");
}
function replaceOnce(source, before, after, label) {
  check(
    source.includes(before),
    `수정 위치를 찾지 못했습니다 (${label}). 이 파일을 확인해야 합니다.`,
  );
  const index = source.indexOf(before);
  check(
    source.indexOf(before, index + before.length) === -1,
    `수정 위치가 둘 이상입니다 (${label})`,
  );
  return source.replace(before, after);
}
function insertAfter(source, anchor, addition, label) {
  return replaceOnce(source, anchor, anchor + addition, label);
}
function insertBefore(source, anchor, addition, label) {
  return replaceOnce(source, anchor, addition + anchor, label);
}

function updateHeader(source) {
  if (source.includes("usePublishedProcedureMenus(menus)")) return source;
  const lineEnd = source.includes("\r\n") ? "\r\n" : "\n";
  // Import only; do not replace existing header or its styles.
  check(
    source.includes("import HeaderNavDropdown from"),
    "HeaderNavDropdown import를 찾지 못했습니다.",
  );
  source = source.replace(
    "import HeaderNavDropdown from",
    `import MobileProcedureSubmenu from "./dropdown/MobileProcedureSubmenu";${lineEnd}` +
      `import { usePublishedProcedureMenus } from "@/lib/detail/usePublishedProcedureMenus";${lineEnd}` +
      "import HeaderNavDropdown from",
  );
  const hook =
    /const\s+\[menus,\s*setMenus\]\s*=\s*useState<MenuItem\[\]>\(DEFAULT_MENUS\);/;
  check(hook.test(source), "Header의 menus 상태 선언을 찾지 못했습니다.");
  source = source.replace(
    hook,
    (match) =>
      match +
      lineEnd +
      "  const publishedMenus = usePublishedProcedureMenus(menus);",
  );
  const desktop = /\{menus\.map\(\(menu\)\s*=>\s*\(/g;
  check(
    (source.match(desktop) ?? []).length === 1,
    "데스크톱 메뉴 루프를 하나만 찾아야 합니다.",
  );
  source = source.replace(desktop, "{publishedMenus.map((menu) => (");
  // Search may not exist in older versions of Header; preserve them unchanged.
  if (source.includes("menus={menus}"))
    source = source.replace("menus={menus}", "menus={publishedMenus}");
  // The mobile menu opens a div per parent; place the subtype menu under its link.
  const mobileStart =
    /\{menus\.map\(\(menu,\s*index\)\s*=>\s*\(\s*<S\.MobileNavLink/;
  check(
    mobileStart.test(source),
    "모바일 메뉴 구조를 찾지 못했습니다. 기존 Header는 수정하지 않습니다.",
  );
  source = source.replace(
    mobileStart,
    `{publishedMenus.map((menu, index) => (${lineEnd}              <div key={menu.id}>${lineEnd}              <S.MobileNavLink`,
  );
  const mobileBeginning = source.indexOf(
    "{publishedMenus.map((menu, index) => (",
  );
  check(mobileBeginning >= 0, "모바일 메뉴 시작 위치를 찾지 못했습니다.");
  const mobileEnding = source.indexOf("</S.MobileNavLink>", mobileBeginning);
  check(mobileEnding >= 0, "모바일 메뉴 링크 끝 위치를 찾지 못했습니다.");
  return (
    source.slice(0, mobileEnding + "</S.MobileNavLink>".length) +
    `${lineEnd}                {Boolean(menu.children?.length) && (${lineEnd}` +
    `                  <MobileProcedureSubmenu items={menu.children ?? []} onNavigate={closeMenu} />${lineEnd}` +
    `                )}${lineEnd}              </div>` +
    source.slice(mobileEnding + "</S.MobileNavLink>".length)
  );
}
function updateDropdown(source) {
  if (
    source.includes("const isParentDuplicate =") ||
    source.includes("const hasCategoryPage =")
  )
    return source;
  const old =
    /const items:\s*NavSubmenuItem\[\]\s*=\s*\[\s*\/\/[^\n]*\n\s*\{ name: menu\.children\?\.length \? "전체 보기" : menu\.name, url: menu\.url \},\s*\.\.\.\(menu\.children \?\? \[\]\),\s*\];/;
  if (!old.test(source)) {
    console.warn("드롭다운 UI 코드를 건드리지 않고 유지합니다.");
    return source;
  }
  return source.replace(
    old,
    `const isParentDuplicate = menu.children?.some((child) => child.url === menu.url) ?? false;
  const items: NavSubmenuItem[] = [
    ...(!isParentDuplicate
      ? [{ name: menu.children?.length ? "전체 보기" : menu.name, url: menu.url }]
      : []),
    ...(menu.children ?? []),
  ];`,
  );
}
function updateRoutes(source) {
  // Don't depend on the exact formatting of the existing /categories route.
  if (/publicRouter\s*\.\s*get\s*\(\s*['"]\/navigation['"]/.test(source))
    return source;
  const dynamic =
    /^([ \t]*)publicRouter\s*\.\s*get\s*\(\s*['"]\/:category\/:slug['"]/m;
  const found = dynamic.exec(source);
  check(
    found,
    "detail.routes.js에서 /:category/:slug 공개 라우트를 찾지 못했습니다. 자동 수정 중단",
  );
  check(
    /\bwrap\s*=|function\s+wrap\b/.test(source) &&
      /\bok\s*=|function\s+ok\b/.test(source),
    "기존 라우터의 wrap/ok 유틸 형식이 달라 자동 수정하지 않습니다.",
  );
  return (
    source.slice(0, found.index) +
    `${found[1]}publicRouter.get("/navigation", wrap(async (_req, res) => ok(res, await service.publicNavigation())));\n` +
    source.slice(found.index)
  );
}
function updateService(source) {
  if (/\basync\s+publicNavigation\s*\(/.test(source)) return source;
  const anchor = /^([ \t]*)async\s+publicCategories\s*\(/m;
  const found = anchor.exec(source);
  check(
    found,
    "detail.service.js에서 publicCategories() 메서드를 찾지 못했습니다. 자동 수정 중단",
  );
  check(
    /\bconst\s+query\s*=/.test(source),
    "상세페이지 서비스 query 함수 형식이 달라 자동 수정하지 않습니다.",
  );
  const extra = `${found[1]}async publicNavigation() {
${found[1]}  const rows = await query(\`SELECT C.SLUG AS CATEGORY_SLUG, P.SLUG AS PAGE_SLUG, P.TITLE AS PAGE_TITLE
${found[1]}    FROM DETAIL_PAGE P JOIN DETAIL_CATEGORY C ON C.CATEGORY_ID = P.CATEGORY_ID
${found[1]}    WHERE C.IS_VISIBLE = 'Y' AND P.STATUS = 'PUBLISHED'
${found[1]}    ORDER BY C.SORT_ORDER, P.SORT_ORDER, P.PAGE_ID\`);
${found[1]}  return rows.map((r) => ({
${found[1]}    category: r.CATEGORY_SLUG,
${found[1]}    slug: r.PAGE_SLUG,
${found[1]}    name: r.PAGE_TITLE,
${found[1]}    url: \`/\${encodeURIComponent(r.CATEGORY_SLUG)}/\${encodeURIComponent(r.PAGE_SLUG)}\`,
${found[1]}  }));
${found[1]}},
`;
  return source.slice(0, found.index) + extra + source.slice(found.index);
}

const frontSrc = path.resolve(frontend, "src");
const backSrc = path.resolve(backend, "src");
const existing = [
  [path.join(frontSrc, "components/Header.tsx"), updateHeader],
  [
    path.join(frontSrc, "components/dropdown/HeaderNavDropdown.tsx"),
    updateDropdown,
  ],
  [path.join(backSrc, "routes/detail.routes.js"), updateRoutes],
  [path.join(backSrc, "services/detail.service.js"), updateService],
];
const addition = [
  "src/lib/detail/procedureNav.ts",
  "src/lib/detail/usePublishedProcedureMenus.ts",
  "src/components/dropdown/MobileProcedureSubmenu.tsx",
  "src/assets/css/components/dropdown/MobileProcedureSubmenu.styles.ts",
];

// Validate all changes first; do not leave a half-applied patch on anchor failure.
const changes = existing.map(([filename, transform]) => {
  const oldText = read(filename);
  return { filename, oldText, newText: transform(oldText) };
});
const copies = addition.map((rel) => {
  const source = path.join(root, rel);
  check(fs.existsSync(source), `패치 새 파일 없음: ${source}`);
  const target = path.join(path.resolve(frontend), rel);
  return { source, target };
});
for (const { filename, oldText, newText } of changes) {
  if (oldText === newText) {
    console.log("이미 적용됨/유지:", filename);
    continue;
  }
  const backup = filename + ".before-public-nav.bak";
  if (!fs.existsSync(backup)) fs.copyFileSync(filename, backup);
  fs.writeFileSync(filename, newText, "utf8");
  console.log("수정:", filename);
}
for (const { source, target } of copies) {
  fs.mkdirSync(path.dirname(target), { recursive: true });
  if (!fs.existsSync(target) && path.resolve(source) !== path.resolve(target)) {
    fs.copyFileSync(source, target);
    console.log("신규 파일 복사:", target);
  } else {
    console.log("기존 파일 유지:", target);
  }
}
console.log(
  "\n완료: Express/Next.js를 재시작하고 /api/details/navigation을 확인하세요.",
);
