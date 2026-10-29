/*
 * 브랜드 내비게이션 + Header 테마 최소 변경 스크립트.
 * 기존 파일을 덮어쓰지 않고 정확히 일치하는 구문만 수정합니다.
 * 모든 사전 검사 성공 후 백업 및 쓰기를 진행합니다. 반복 실행도 가능합니다.
 * node scripts/apply-brand-navigation.cjs
 */
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(process.argv[2] || process.cwd());
const targets = {
  header: path.join(root, "src/components/Header.tsx"),
  style: path.join(root, "src/assets/css/components/Header.styles.ts"),
  brand:
    [
      path.join(root, "src/components/about/brand/BrandEditorial.tsx"),
      path.join(root, "src/components/brand/BrandEditorial.tsx"),
    ].find((candidate) => fs.existsSync(candidate)) ||
    path.join(root, "src/components/about/brand/BrandEditorial.tsx"),
  shared: path.join(root, "src/lib/navigation/aboutNavigation.ts"),
};

function assertFile(p) {
  if (!fs.existsSync(p)) throw new Error(`파일을 찾을 수 없습니다: ${p}`);
}
function replaceOnce(source, original, updated, title) {
  if (source.includes(updated)) return source;
  const count = source.split(original).length - 1;
  if (count !== 1)
    throw new Error(
      `${title} (일치 ${count}개): 파일이 예상 구조와 다릅니다. 수정 전 원본을 확인하세요.`,
    );
  return source.replace(original, updated);
}

try {
  for (const target of Object.values(targets)) assertFile(target);
  const raw = {
    header: fs.readFileSync(targets.header, "utf8"),
    style: fs.readFileSync(targets.style, "utf8"),
    brand: fs.readFileSync(targets.brand, "utf8"),
  };
  const original = Object.fromEntries(
    Object.entries(raw).map(([key, content]) => [
      key,
      content.replace(/\r\n/g, "\n"),
    ]),
  );
  const changed = { ...original };

  // Header: 공통 메뉴, 그리고 밝은 브랜드 Hero 위에서는 딥그린 텍스트 사용.
  changed.header = replaceOnce(
    changed.header,
    "import * as S from '@/assets/css/components/Header.styles';",
    "import * as S from '@/assets/css/components/Header.styles';\nimport { withAboutNavigation } from '@/lib/navigation/aboutNavigation';",
    "Header 공통 내비 import",
  );
  changed.header = replaceOnce(
    changed.header,
    '  const isHome = pathname === "/";',
    '  const isHome = pathname === "/";\n  const isBrandPage = pathname === "/about/brand";',
    "Header 브랜드 경로",
  );
  changed.header = replaceOnce(
    changed.header,
    "useState<MenuItem[]>(DEFAULT_MENUS)",
    "useState<MenuItem[]>(withAboutNavigation(DEFAULT_MENUS))",
    "Header 기본 메뉴",
  );
  changed.header = replaceOnce(
    changed.header,
    "if (valid.length) setMenus(valid);",
    "if (valid.length) setMenus(withAboutNavigation(valid));",
    "Header 관리자 메뉴",
  );
  changed.header = replaceOnce(
    changed.header,
    "const transparent = isHome && !scrolled && !menuOpen;",
    "const transparent = (isHome || isBrandPage) && !scrolled && !menuOpen && !searchOpen;",
    "Header 투명 상태",
  );
  changed.header = replaceOnce(
    changed.header,
    "        $transparent={transparent}",
    "        $transparent={transparent}\n        $brandLight={isBrandPage && transparent}",
    "Header 브랜드 테마 전달",
  );

  // Styled Components: 기존 홈 Hero의 흰 글자는 그대로, 브랜드에서만 딥그린.
  changed.style = replaceOnce(
    changed.style,
    "  $transparent: boolean;\n  $dark: boolean;",
    "  $transparent: boolean;\n  $brandLight: boolean;\n  $dark: boolean;",
    "Header 스타일 props",
  );
  changed.style = replaceOnce(
    changed.style,
    '  --header-text: ${({ $transparent, $dark }) =>\n    $transparent || $dark ? "#F7F6F1" : "#2D4836"};',
    '  --header-text: ${({ $transparent, $dark, $brandLight }) =>\n    $brandLight ? "#1B3528" : $transparent || $dark ? "#F7F6F1" : "#2D4836"};',
    "Header 텍스트 색",
  );
  changed.style = replaceOnce(
    changed.style,
    '  --header-border: ${({ $transparent, $dark }) =>\n    $transparent || $dark ? "rgba(255,255,255,.3)" : "rgba(40,75,53,.23)"};',
    '  --header-border: ${({ $transparent, $dark, $brandLight }) =>\n    $brandLight ? "rgba(27,53,40,.25)" : $transparent || $dark ? "rgba(255,255,255,.3)" : "rgba(40,75,53,.23)"};',
    "Header 구분선 색",
  );
  changed.style = replaceOnce(
    changed.style,
    '  text-shadow: ${({ $transparent }) =>\n    $transparent ? "0 2px 20px rgba(15,35,22,.28)" : "none"};',
    '  text-shadow: ${({ $transparent, $brandLight }) =>\n    $brandLight ? "none" : $transparent ? "0 2px 20px rgba(15,35,22,.28)" : "none"};',
    "Header 텍스트 그림자",
  );

  // Brand: import 구문의 따옴표/공백에 의존하지 않습니다.
  // 먼저 안전한 위치인 "use client" 직후에 필요한 import를 추가합니다.
  function addBrandImport(source, statement, alreadyPresent) {
    if (alreadyPresent.test(source)) return source;
    const directive = /^(\s*["']use client["'];?\s*\n)/;
    if (!directive.test(source)) {
      throw new Error(
        'BrandEditorial에 "use client" 지시문이 없습니다. 직접 소스 확인 필요.',
      );
    }
    return source.replace(directive, `$1${statement}\n`);
  }

  changed.brand = addBrandImport(
    changed.brand,
    'import { usePathname } from "next/navigation";',
    /import\s*\{[^}]*\busePathname\b[^}]*\}\s*from\s*["']next\/navigation["']/,
  );
  changed.brand = addBrandImport(
    changed.brand,
    'import { isAboutLinkActive, useAboutNavigation } from "@/lib/navigation/aboutNavigation";',
    /import\s*\{[^}]*\buseAboutNavigation\b[^}]*\}\s*from\s*["']@\/lib\/navigation\/aboutNavigation["']/,
  );

  // 기존 하드코딩 배열을 하나만 제거합니다. 이미 Hook으로 교체되어 있으면 건너뜁니다.
  const staticMenus =
    changed.brand.match(/\bconst\s+aboutPages\s*=\s*\[/g) || [];
  if (staticMenus.length > 1) {
    throw new Error(
      "BrandEditorial의 aboutPages 배열이 여러 개 있습니다. 자동 수정 중단.",
    );
  }
  if (staticMenus.length === 1) {
    const oldArray =
      /(?:^|\n)\s*const\s+aboutPages\s*=\s*\[[\s\S]*?\]\s*(?:as\s+const)?\s*;\s*/;
    if (!oldArray.test(changed.brand)) {
      throw new Error(
        "BrandEditorial의 aboutPages 배열 끝을 찾지 못했습니다. 자동 수정 중단.",
      );
    }
    changed.brand = changed.brand.replace(oldArray, "\n");
  }

  // useState의 위치와 관계없이 컴포넌트 함수 첫머리에 Hook을 삽입합니다.
  const hasPathnameHook = /\bconst\s+pathname\s*=\s*usePathname\s*\(/.test(
    changed.brand,
  );
  const hasAboutHook =
    /\bconst\s+aboutPages\s*=\s*useAboutNavigation\s*\(/.test(changed.brand);
  if (!hasPathnameHook || !hasAboutHook) {
    const declaration =
      /\bexport\s+default\s+function\s+BrandEditorial\s*\([^)]*\)\s*\{/;
    const matches =
      changed.brand.match(new RegExp(declaration.source, "g")) || [];
    if (matches.length !== 1) {
      throw new Error(
        "BrandEditorial 컴포넌트 선언을 찾을 수 없습니다. 자동 수정 중단.",
      );
    }
    const hooks = `${hasPathnameHook ? "" : "\n  const pathname = usePathname();"}${hasAboutHook ? "" : "\n  const aboutPages = useAboutNavigation();"}`;
    changed.brand = changed.brand.replace(
      declaration,
      (match) => `${match}${hooks}`,
    );
  }

  // ABOUT 메뉴 JSX 내부만 변환해 다른 페이지 링크는 보존합니다.
  const navBlocks =
    changed.brand.match(/<S\.AboutNav\b[\s\S]*?<\/S\.AboutNav>/g) || [];
  if (navBlocks.length !== 1 || !navBlocks[0].includes("aboutPages.map")) {
    throw new Error(
      "브랜드 ABOUT 메뉴 JSX를 찾지 못했습니다. 해당 부분을 수동 수정해야 합니다.",
    );
  }
  const beforeNav = navBlocks[0];
  let afterNav = beforeNav.replace(/\bpage\.href\b/g, "page.url");
  afterNav = afterNav.replace(
    /\$active=\{page\.url\s*===\s*["']\/about\/brand["']\}/g,
    "$active={isAboutLinkActive(pathname, page.url)}",
  );
  afterNav = afterNav.replace(
    /aria-current=\{page\.url\s*===\s*["']\/about\/brand["']\s*\?\s*["']page["']\s*:\s*undefined\}/g,
    'aria-current={isAboutLinkActive(pathname, page.url) ? "page" : undefined}',
  );
  if (
    !afterNav.includes("href={page.url}") ||
    !afterNav.includes("$active={isAboutLinkActive(pathname, page.url)}") ||
    !afterNav.includes("aria-current={isAboutLinkActive(pathname, page.url)")
  ) {
    throw new Error(
      "브랜드 메뉴의 링크/활성 상태 JSX가 예상과 달라 자동 수정 중단.",
    );
  }
  changed.brand = changed.brand.replace(beforeNav, afterNav);

  const touched = Object.keys(changed).filter(
    (key) => original[key] !== changed[key],
  );
  if (!touched.length) {
    console.log("이미 적용된 상태입니다. 변경할 파일이 없습니다.");
    process.exit(0);
  }
  // 모든 검증을 마친 뒤 변경 대상의 백업만 만듭니다.
  for (const key of touched) {
    const target = targets[key];
    const backup = `${target}.brand-nav.bak`;
    if (!fs.existsSync(backup)) fs.copyFileSync(target, backup);
    fs.writeFileSync(
      target,
      raw[key].includes("\r\n")
        ? changed[key].replace(/\n/g, "\r\n")
        : changed[key],
      "utf8",
    );
    console.log(`수정: ${path.relative(root, target)}`);
  }
  console.log("완료. 원본은 각 파일 옆 *.brand-nav.bak 에 저장되어 있습니다.");
} catch (error) {
  console.error(`적용 중단: ${error.message}`);
  console.error("구조가 다른 파일에는 강제로 덮어쓰지 않습니다.");
  process.exitCode = 1;
}
