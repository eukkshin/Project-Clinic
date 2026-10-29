import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const src = path.join(root, "src");

function run(cmd) {
  execSync(cmd, { cwd: root, stdio: "inherit", shell: true });
}

function ensureDir(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function gitRm(rel) {
  const abs = path.join(root, rel);
  if (!fs.existsSync(abs)) return;
  run(`git rm -f -- "${rel.replaceAll("\\", "/")}"`);
}

function gitMv(from, to) {
  const fromAbs = path.join(root, from);
  const toAbs = path.join(root, to);
  if (!fs.existsSync(fromAbs)) {
    console.warn("missing", from);
    return;
  }
  ensureDir(toAbs);
  run(`git mv -- "${from.replaceAll("\\", "/")}" "${to.replaceAll("\\", "/")}"`);
}

const unused = [
  "src/components/about/brand/BrandStory.tsx",
  "src/components/about/brand/BrandMotion.tsx",
  "src/assets/css/components/about/brand/BrandStory.styles.ts",
  "src/components/icons/GlobeIcon.tsx",
  "src/components/icons/UserIcon.tsx",
  "src/assets/css/admin/AdminPolish.styles.ts",
  "src/data/detail/demo.ts",
  "src/assets/css/components/about/LocationExperience.styles.ts",
  "src/assets/css/components/about/LocationEditorial.styles.ts",
  "src/assets/css/components/Sub.styles.ts",
  "src/assets/css/Style.style.ts",
  "src/assets/css/Popup.styles.ts",
  "src/assets/css/components/detail/DetailHero.styles.ts",
  "src/assets/css/AdminCommon.styles.ts",
  "src/components/detail/NosePreviewSectionImport.tsx",
];

for (const file of unused) gitRm(file);

const moves = [
  ["src/assets/css/Common.styles.ts", "src/styles/mixins.ts"],
  ["src/assets/css/GlobalStyle.ts", "src/styles/global.ts"],
  ["src/assets/css/common/LayoutStyle.ts", "src/styles/pagination.ts"],
  ["src/assets/css/ChangePw.styles.ts", "src/styles/auth/FindPassword.styles.ts"],
  ["src/assets/css/auth/Auth.styles.ts", "src/styles/auth/Auth.styles.ts"],

  ["src/assets/css/admin/Admin.style.ts", "src/styles/admin/index.ts"],
  ["src/assets/css/admin/AdminShell.styles.ts", "src/styles/admin/AdminShell.styles.ts"],
  ["src/assets/css/admin/AdminWorkspace.styles.ts", "src/styles/admin/AdminWorkspace.styles.ts"],
  ["src/assets/css/admin/Board.styles.ts", "src/styles/admin/Board.styles.ts"],
  ["src/assets/css/admin/Consult.styles.ts", "src/styles/admin/Consult.styles.ts"],
  ["src/assets/css/admin/Dash.styles.ts", "src/styles/admin/Dash.styles.ts"],
  ["src/assets/css/admin/DetailCMS.styles.ts", "src/styles/admin/DetailCMS.styles.ts"],
  ["src/assets/css/admin/DetailEditorPreview.styles.ts", "src/styles/admin/DetailEditorPreview.styles.ts"],
  ["src/assets/css/admin/DetailImageUpload.styles.ts", "src/styles/admin/DetailImageUpload.styles.ts"],
  ["src/assets/css/admin/Event.styles.ts", "src/styles/admin/Event.styles.ts"],
  ["src/assets/css/admin/Footer.styles.ts", "src/styles/admin/Footer.styles.ts"],
  ["src/assets/css/admin/NavSetting.styles.ts", "src/styles/admin/NavSetting.styles.ts"],
  ["src/assets/css/admin/News.styles.ts", "src/styles/admin/News.styles.ts"],
  ["src/assets/css/admin/Pop.styles.ts", "src/styles/admin/Pop.styles.ts"],
  ["src/assets/css/admin/QnA.styles.ts", "src/styles/admin/QnA.styles.ts"],
  ["src/assets/css/admin/Safety.styles.ts", "src/styles/admin/Safety.styles.ts"],
  ["src/assets/css/admin/Self.styles.ts", "src/styles/admin/Self.styles.ts"],
  ["src/assets/css/admin/Tone.styles.ts", "src/styles/admin/Tone.styles.ts"],
  ["src/assets/css/admin/User.styles.ts", "src/styles/admin/User.styles.ts"],
  ["src/assets/css/admin/Vlog.styles.ts", "src/styles/admin/Vlog.styles.ts"],

  ["src/components/Header.tsx", "src/components/layout/Header.tsx"],
  ["src/assets/css/components/Header.styles.ts", "src/components/layout/Header.styles.ts"],
  ["src/components/Footer.tsx", "src/components/layout/Footer.tsx"],
  ["src/assets/css/components/Footer.style.ts", "src/components/layout/Footer.styles.ts"],
  ["src/components/ConditionalLayout.tsx", "src/components/layout/ConditionalLayout.tsx"],
  ["src/components/SmoothScroll.tsx", "src/components/layout/SmoothScroll.tsx"],
  ["src/components/HospitalMap.tsx", "src/components/layout/HospitalMap.tsx"],

  ["src/components/hero/Hero.tsx", "src/components/home/Hero.tsx"],
  ["src/assets/css/components/Hero.styles.ts", "src/components/home/Hero.styles.ts"],
  ["src/components/CategoryNav.tsx", "src/components/home/CategoryNav.tsx"],
  ["src/assets/css/components/CategoryNav.styles.ts", "src/components/home/CategoryNav.styles.ts"],
  ["src/components/CircularOverlay.tsx", "src/components/home/CircularOverlay.tsx"],
  ["src/assets/css/components/CircularOverlay.styles.ts", "src/components/home/CircularOverlay.styles.ts"],
  ["src/components/RollingBanner.tsx", "src/components/home/RollingBanner.tsx"],
  ["src/assets/css/components/RollingBanner.styles.ts", "src/components/home/RollingBanner.styles.ts"],
  ["src/components/main/HomeAtmosphere.tsx", "src/components/home/HomeAtmosphere.tsx"],
  ["src/assets/css/components/HomeAtmosphere.styles.ts", "src/components/home/HomeAtmosphere.styles.ts"],
  ["src/components/main/EditorialExperience.tsx", "src/components/home/EditorialExperience.tsx"],
  ["src/assets/css/components/EditorialExperience.styles.ts", "src/components/home/EditorialExperience.styles.ts"],
  ["src/components/main/Selfies.tsx", "src/components/home/Selfies.tsx"],
  ["src/assets/css/components/Selfies.styles.ts", "src/components/home/Selfies.styles.ts"],
  ["src/components/main/SafetySlider.tsx", "src/components/home/SafetySlider.tsx"],
  ["src/assets/css/components/SafetySlider.styles.ts", "src/components/home/SafetySlider.styles.ts"],
  ["src/components/main/VlogSlider.tsx", "src/components/home/VlogSlider.tsx"],
  ["src/assets/css/components/VlogSlider.styles.ts", "src/components/home/VlogSlider.styles.ts"],
  ["src/components/main/VlogSafetyFlow.tsx", "src/components/home/VlogSafetyFlow.tsx"],
  ["src/assets/css/components/VlogSafetyFlow.styles.ts", "src/components/home/VlogSafetyFlow.styles.ts"],

  ["src/assets/css/components/about/AboutTextNav.styles.ts", "src/components/about/AboutTextNav.styles.ts"],
  ["src/assets/css/components/about/AboutPages.styles.ts", "src/components/about/pages/AboutPages.styles.ts"],
  ["src/assets/css/components/about/LocationFlat.styles.ts", "src/components/about/location/LocationFlat.styles.ts"],
  ["src/assets/css/components/about/brand/BrandEditorial.styles.ts", "src/components/about/brand/BrandEditorial.styles.ts"],
  ["src/components/about/pages/FacillitiesPage.tsx", "src/components/about/pages/FacilitiesPage.tsx"],

  ["src/assets/css/components/community/Community.styles.ts", "src/components/community/Community.styles.ts"],

  ["src/components/detail/AntiAgingDetailView.tsx", "src/components/procedures/AntiAgingDetailView.tsx"],
  ["src/components/detail/DetailEditorPreview.tsx", "src/components/procedures/DetailEditorPreview.tsx"],
  ["src/components/detail/DetailHero.tsx", "src/components/procedures/DetailHero.tsx"],
  ["src/components/detail/DetailImage.tsx", "src/components/procedures/DetailImage.tsx"],
  ["src/components/detail/DetailImageUpload.tsx", "src/components/procedures/DetailImageUpload.tsx"],
  ["src/components/detail/DetailLayout.tsx", "src/components/procedures/DetailLayout.tsx"],
  ["src/components/detail/DetailSectionRenderer.tsx", "src/components/procedures/DetailSectionRenderer.tsx"],
  ["src/components/detail/DetailSideNav.tsx", "src/components/procedures/DetailSideNav.tsx"],
  ["src/components/detail/NoseDetailView.tsx", "src/components/procedures/NoseDetailView.tsx"],
  ["src/components/detail/PetitDetailView.tsx", "src/components/procedures/PetitDetailView.tsx"],
  ["src/components/detail/ProcedurePreviewSectionImport.tsx", "src/components/procedures/ProcedurePreviewSectionImport.tsx"],
  ["src/assets/css/components/detail/AntiAgingDetail.styles.ts", "src/components/procedures/AntiAgingDetail.styles.ts"],
  ["src/assets/css/components/detail/DetailLayout.styles.ts", "src/components/procedures/DetailLayout.styles.ts"],
  ["src/assets/css/components/detail/DetailPage.styles.ts", "src/components/procedures/DetailPage.styles.ts"],
  ["src/assets/css/components/detail/DetailSectionLayouts.styles.ts", "src/components/procedures/DetailSectionLayouts.styles.ts"],
  ["src/assets/css/components/detail/DetailSideNav.styles.ts", "src/components/procedures/DetailSideNav.styles.ts"],
  ["src/assets/css/components/detail/NoseDetail.styles.ts", "src/components/procedures/NoseDetail.styles.ts"],
  ["src/assets/css/components/detail/PetitDetail.styles.ts", "src/components/procedures/PetitDetail.styles.ts"],

  ["src/assets/css/components/dropdown/AccountDropdown.styles.ts", "src/components/dropdown/AccountDropdown.styles.ts"],
  ["src/assets/css/components/dropdown/HeaderNavDropdown.styles.ts", "src/components/dropdown/HeaderNavDropdown.styles.ts"],
  ["src/assets/css/components/dropdown/HeaderSearch.styles.ts", "src/components/dropdown/HeaderSearch.styles.ts"],
  ["src/assets/css/components/dropdown/HeaderSearchLayout.styles.ts", "src/components/dropdown/HeaderSearchLayout.styles.ts"],
  ["src/assets/css/components/dropdown/LanguageDropdown.styles.ts", "src/components/dropdown/LanguageDropdown.styles.ts"],
  ["src/assets/css/components/dropdown/MobileProcedureSubmenu.styles.ts", "src/components/dropdown/MobileProcedureSubmenu.styles.ts"],

  ["src/components/modal/Popup.tsx", "src/components/ui/Popup.tsx"],
  ["src/assets/css/popup/PopupLiquid.styles.ts", "src/components/ui/Popup.styles.ts"],
  ["src/components/QuaAccordion/Accordion.tsx", "src/components/ui/Accordion.tsx"],
  ["src/components/QuaAccordion/Accordion.style.ts", "src/components/ui/Accordion.styles.ts"],
  ["src/components/EventPopup.tsx", "src/components/ui/EventPopup.tsx"],
  ["src/assets/css/components/EventPopup.styles.ts", "src/components/ui/EventPopup.styles.ts"],
  ["src/components/QuickConsultBar.tsx", "src/components/ui/QuickConsultBar.tsx"],
  ["src/assets/css/components/QuickConsultBar.styles.ts", "src/components/ui/QuickConsultBar.styles.ts"],
];

for (const [from, to] of moves) gitMv(from, to);

function walk(dir, acc = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || entry.name === ".next") continue;
      walk(full, acc);
    } else if (/\.(ts|tsx)$/.test(entry.name)) acc.push(full);
  }
  return acc;
}

const replacements = [
  ["@/assets/css/Common.styles", "@/styles/mixins"],
  ["@/assets/css/GlobalStyle", "@/styles/global"],
  ["@/assets/css/common/LayoutStyle", "@/styles/pagination"],
  ["@/assets/css/ChangePw.styles", "@/styles/auth/FindPassword.styles"],
  ["@/assets/css/auth/Auth.styles", "@/styles/auth/Auth.styles"],
  ["@/assets/css/admin/Admin.style", "@/styles/admin"],
  ["@/assets/css/admin/AdminShell.styles", "@/styles/admin/AdminShell.styles"],
  ["@/assets/css/admin/AdminWorkspace.styles", "@/styles/admin/AdminWorkspace.styles"],
  ["@/assets/css/admin/DetailCMS.styles", "@/styles/admin/DetailCMS.styles"],
  ["@/assets/css/admin/DetailEditorPreview.styles", "@/styles/admin/DetailEditorPreview.styles"],
  ["@/assets/css/admin/DetailImageUpload.styles", "@/styles/admin/DetailImageUpload.styles"],
  ["@/assets/css/Style.style", "@/styles/auth/FindPassword.styles"],

  ["@/assets/css/components/Header.styles", "@/components/layout/Header.styles"],
  ["@/assets/css/components/Footer.style", "@/components/layout/Footer.styles"],
  ["@/assets/css/components/Hero.styles", "@/components/home/Hero.styles"],
  ["@/assets/css/components/CategoryNav.styles", "@/components/home/CategoryNav.styles"],
  ["@/assets/css/components/CircularOverlay.styles", "@/components/home/CircularOverlay.styles"],
  ["@/assets/css/components/RollingBanner.styles", "@/components/home/RollingBanner.styles"],
  ["@/assets/css/components/HomeAtmosphere.styles", "@/components/home/HomeAtmosphere.styles"],
  ["@/assets/css/components/EditorialExperience.styles", "@/components/home/EditorialExperience.styles"],
  ["@/assets/css/components/Selfies.styles", "@/components/home/Selfies.styles"],
  ["@/assets/css/components/SafetySlider.styles", "@/components/home/SafetySlider.styles"],
  ["@/assets/css/components/VlogSlider.styles", "@/components/home/VlogSlider.styles"],
  ["@/assets/css/components/VlogSafetyFlow.styles", "@/components/home/VlogSafetyFlow.styles"],
  ["@/assets/css/components/about/AboutTextNav.styles", "@/components/about/AboutTextNav.styles"],
  ["@/assets/css/components/about/AboutPages.styles", "@/components/about/pages/AboutPages.styles"],
  ["@/assets/css/components/about/LocationFlat.styles", "@/components/about/location/LocationFlat.styles"],
  ["@/assets/css/components/about/brand/BrandEditorial.styles", "@/components/about/brand/BrandEditorial.styles"],
  ["@/assets/css/components/community/Community.styles", "@/components/community/Community.styles"],
  ["@/assets/css/components/detail/AntiAgingDetail.styles", "@/components/procedures/AntiAgingDetail.styles"],
  ["@/assets/css/components/detail/DetailLayout.styles", "@/components/procedures/DetailLayout.styles"],
  ["@/assets/css/components/detail/DetailPage.styles", "@/components/procedures/DetailPage.styles"],
  ["@/assets/css/components/detail/DetailSectionLayouts.styles", "@/components/procedures/DetailSectionLayouts.styles"],
  ["@/assets/css/components/detail/DetailSideNav.styles", "@/components/procedures/DetailSideNav.styles"],
  ["@/assets/css/components/detail/NoseDetail.styles", "@/components/procedures/NoseDetail.styles"],
  ["@/assets/css/components/detail/PetitDetail.styles", "@/components/procedures/PetitDetail.styles"],
  ["@/assets/css/components/dropdown/HeaderSearchLayout.styles", "@/components/dropdown/HeaderSearchLayout.styles"],
  ["@/assets/css/components/dropdown/HeaderNavDropdown.styles", "@/components/dropdown/HeaderNavDropdown.styles"],
  ["@/assets/css/components/dropdown/HeaderSearch.styles", "@/components/dropdown/HeaderSearch.styles"],
  ["@/assets/css/components/dropdown/AccountDropdown.styles", "@/components/dropdown/AccountDropdown.styles"],
  ["@/assets/css/components/dropdown/LanguageDropdown.styles", "@/components/dropdown/LanguageDropdown.styles"],
  ["@/assets/css/components/dropdown/MobileProcedureSubmenu.styles", "@/components/dropdown/MobileProcedureSubmenu.styles"],
  ["@/assets/css/popup/PopupLiquid.styles", "@/components/ui/Popup.styles"],
  ["@/assets/css/components/EventPopup.styles", "@/components/ui/EventPopup.styles"],
  ["@/assets/css/components/QuickConsultBar.styles", "@/components/ui/QuickConsultBar.styles"],

  ["@/components/ConditionalLayout", "@/components/layout/ConditionalLayout"],
  ["@/components/SmoothScroll", "@/components/layout/SmoothScroll"],
  ["@/components/HospitalMap", "@/components/layout/HospitalMap"],
  ["@/components/hero/Hero", "@/components/home/Hero"],
  ["@/components/CategoryNav", "@/components/home/CategoryNav"],
  ["@/components/CircularOverlay", "@/components/home/CircularOverlay"],
  ["@/components/RollingBanner", "@/components/home/RollingBanner"],
  ["@/components/main/EditorialExperience", "@/components/home/EditorialExperience"],
  ["@/components/main/HomeAtmosphere", "@/components/home/HomeAtmosphere"],
  ["@/components/main/SafetySlider", "@/components/home/SafetySlider"],
  ["@/components/main/Selfies", "@/components/home/Selfies"],
  ["@/components/main/VlogSafetyFlow", "@/components/home/VlogSafetyFlow"],
  ["@/components/main/VlogSlider", "@/components/home/VlogSlider"],
  ["@/components/about/pages/FacillitiesPage", "@/components/about/pages/FacilitiesPage"],
  ["@/components/detail/AntiAgingDetailView", "@/components/procedures/AntiAgingDetailView"],
  ["@/components/detail/DetailEditorPreview", "@/components/procedures/DetailEditorPreview"],
  ["@/components/detail/DetailHero", "@/components/procedures/DetailHero"],
  ["@/components/detail/DetailImageUpload", "@/components/procedures/DetailImageUpload"],
  ["@/components/detail/DetailImage", "@/components/procedures/DetailImage"],
  ["@/components/detail/DetailLayout", "@/components/procedures/DetailLayout"],
  ["@/components/detail/DetailSectionRenderer", "@/components/procedures/DetailSectionRenderer"],
  ["@/components/detail/DetailSideNav", "@/components/procedures/DetailSideNav"],
  ["@/components/detail/NoseDetailView", "@/components/procedures/NoseDetailView"],
  ["@/components/detail/PetitDetailView", "@/components/procedures/PetitDetailView"],
  ["@/components/detail/NosePreviewSectionImport", "@/components/procedures/ProcedurePreviewSectionImport"],
  ["@/components/detail/ProcedurePreviewSectionImport", "@/components/procedures/ProcedurePreviewSectionImport"],
  ["@/components/modal/Popup", "@/components/ui/Popup"],
  ["@/components/QuaAccordion/Accordion.style", "@/components/ui/Accordion.styles"],
  ["@/components/QuaAccordion/Accordion", "@/components/ui/Accordion"],
];

function rewrite(content) {
  let next = content;
  next = next.replaceAll('../Common.styles', '@/styles/mixins');
  next = next.replaceAll("./Accordion.style", "./Accordion.styles");
  next = next.replaceAll('export * from "../AdminCommon.styles";\n', "");
  next = next.replaceAll('export * from "../common/LayoutStyle";', 'export * from "@/styles/pagination";');
  for (const [from, to] of replacements) {
    next = next.split(from).join(to);
  }
  return next;
}

for (const file of walk(src)) {
  const before = fs.readFileSync(file, "utf8");
  const after = rewrite(before);
  if (after !== before) fs.writeFileSync(file, after);
}

const relativeFixes = {
  "src/components/layout/Header.tsx": (text) =>
    text
      .replaceAll("from './dropdown/", "from '@/components/dropdown/")
      .replaceAll('from "./dropdown/', 'from "@/components/dropdown/'),
  "src/components/layout/ConditionalLayout.tsx": (text) =>
    text
      .replace('import EventPopup from "./EventPopup";\nimport Footer from "./Footer";\nimport Header from "./Header";\nimport QuickConsultBar from "./QuickConsultBar";',
        `import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import EventPopup from "@/components/ui/EventPopup";
import QuickConsultBar from "@/components/ui/QuickConsultBar";`)
      .replace('import React from "react";\nimport styled from "styled-components";\n\n', 'import React from "react";\n\n'),
};

for (const [rel, fn] of Object.entries(relativeFixes)) {
  const abs = path.join(root, rel);
  fs.writeFileSync(abs, fn(fs.readFileSync(abs, "utf8")));
}

console.log("refactor-structure done");
