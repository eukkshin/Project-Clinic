"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  FiArrowDown,
  FiArrowLeft,
  FiArrowUp,
  FiCheck,
  FiEdit2,
  FiExternalLink,
  FiLayers,
  FiPlus,
  FiSave,
  FiSettings,
  FiTrash2,
  FiX,
} from "react-icons/fi";

import * as S from "@/assets/css/admin/DetailCMS.styles";
import { Popup } from "@/components/modal/Popup";
import { detailApi, detailErrorMessage } from "@/lib/adminDetailApi";

import type {
  DetailCategory,
  DetailPage,
  DetailSection,
  DetailSectionContent,
  DetailStatus,
  PagePayload,
  SectionPayload,
  SectionType,
  Visible,
} from "@/types/adminDetail";

const SECTION_NAMES: Record<SectionType, string> = {
  INTRO: "시술 소개",
  FEATURES: "시술 특징",
  PROCESS: "진행 과정",
  GALLERY: "이미지 갤러리",
  FAQ: "자주 묻는 질문",
  TEXT: "일반 텍스트",
  CTA: "상담 유도",
};
const STATUS_NAMES: Record<DetailStatus, string> = {
  DRAFT: "임시저장",
  PUBLISHED: "공개",
  HIDDEN: "숨김",
};
const isSlug = (value: string) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
const toLines = (value: string) =>
  value
    .split("\n")
    .map((x) => x.trim())
    .filter(Boolean);

function emptyPage(categoryId = 0, sortOrder = 0): PagePayload {
  return {
    categoryId,
    slug: "",
    title: "",
    sortOrder,
    heroEyebrow: "AHN'S PLASTIC SURGERY",
    heroTitle: "",
    heroDescription: "",
    heroImageUrl: "",
    heroImageAlt: "",
    heroImagePosition: "center center",
    seoTitle: "",
    seoDescription: "",
  };
}
function fromPage(page: DetailPage): PagePayload {
  return {
    categoryId: page.categoryId,
    slug: page.slug,
    title: page.title,
    sortOrder: page.sortOrder,
    heroEyebrow: page.hero.eyebrow || "",
    heroTitle: page.hero.title,
    heroDescription: page.hero.description || "",
    heroImageUrl: page.hero.imageUrl || "",
    heroImageAlt: page.hero.imageAlt || "",
    heroImagePosition: page.hero.imagePosition || "center center",
    seoTitle: page.seo.title || "",
    seoDescription: page.seo.description || "",
  };
}
type SectionDraft = {
  id: string;
  type: SectionType;
  title: string;
  eyebrow: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
  itemsText: string;
  imagesText: string;
  faqsText: string;
  buttonLabel: string;
  buttonHref: string;
  sortOrder: number;
  isVisible: Visible;
  extras: DetailSectionContent;
};
function emptySection(sortOrder = 0): SectionDraft {
  return {
    id: "",
    type: "INTRO",
    title: "",
    eyebrow: "",
    description: "",
    imageUrl: "",
    imageAlt: "",
    itemsText: "",
    imagesText: "",
    faqsText: "",
    buttonLabel: "",
    buttonHref: "",
    sortOrder,
    isVisible: "Y",
    extras: {},
  };
}
function fromSection(section: DetailSection): SectionDraft {
  const c = section.content ?? {};
  return {
    id: section.id,
    type: section.type,
    title: section.title,
    eyebrow: section.eyebrow || "",
    description: c.description || "",
    imageUrl: c.imageUrl || "",
    imageAlt: c.imageAlt || "",
    itemsText: (c.items || []).join("\n"),
    imagesText: (c.images || []).map((x) => `${x.src} | ${x.alt}`).join("\n"),
    faqsText: (c.faqs || [])
      .map((x) => `${x.question} | ${x.answer}`)
      .join("\n"),
    buttonLabel: c.buttonLabel || "",
    buttonHref: c.buttonHref || "",
    sortOrder: section.sortOrder,
    isVisible: section.isVisible,
    extras: c,
  };
}
function sectionPayload(draft: SectionDraft): SectionPayload {
  const base: DetailSectionContent = { ...draft.extras };
  // 종류 변경 시 이전 섹션 타입의 콘텐츠 필드는 제거하고 새 구조만 저장합니다.
  for (const key of [
    "description",
    "imageUrl",
    "imageAlt",
    "items",
    "images",
    "faqs",
    "buttonLabel",
    "buttonHref",
  ])
    delete base[key];
  switch (draft.type) {
    case "INTRO":
    case "TEXT":
      base.description = draft.description.trim();
      if (draft.imageUrl.trim()) {
        base.imageUrl = draft.imageUrl.trim();
        base.imageAlt = draft.imageAlt.trim();
      }
      break;
    case "FEATURES":
    case "PROCESS":
      base.items = toLines(draft.itemsText);
      break;
    case "GALLERY":
      base.images = toLines(draft.imagesText).map((line) => {
        const i = line.indexOf("|");
        return {
          src: (i < 0 ? line : line.slice(0, i)).trim(),
          alt: (i < 0 ? "" : line.slice(i + 1)).trim(),
        };
      });
      break;
    case "FAQ":
      base.faqs = toLines(draft.faqsText).map((line) => {
        const i = line.indexOf("|");
        if (i < 1 || i === line.length - 1)
          throw new Error("FAQ는 각 줄을 질문 | 답변 형식으로 입력해 주세요.");
        return {
          question: line.slice(0, i).trim(),
          answer: line.slice(i + 1).trim(),
        };
      });
      break;
    case "CTA":
      base.description = draft.description.trim();
      base.buttonLabel = draft.buttonLabel.trim();
      base.buttonHref = draft.buttonHref.trim();
      break;
  }
  return {
    id: draft.id.trim(),
    type: draft.type,
    title: draft.title.trim(),
    eyebrow: draft.eyebrow.trim(),
    content: base,
    sortOrder: draft.sortOrder,
    isVisible: draft.isVisible,
  };
}

interface Dialog {
  title: string;
  message: string;
  onConfirm?: () => void;
}
export default function AdminDetailPages() {
  const [categories, setCategories] = useState<DetailCategory[]>([]);
  const [pages, setPages] = useState<DetailPage[]>([]);
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [orderDirty, setOrderDirty] = useState(false);
  const [dialog, setDialog] = useState<Dialog | null>(null);
  const [showCategoryEditor, setShowCategoryEditor] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(
    null,
  );
  const [categoryForm, setCategoryForm] = useState({
    slug: "",
    name: "",
    description: "",
    isVisible: "Y" as Visible,
  });

  const [editingPageId, setEditingPageId] = useState<number | null>(null);
  const [pageForm, setPageForm] = useState<PagePayload>(() => emptyPage());
  const [sectionPage, setSectionPage] = useState<DetailPage | null>(null);
  const [sections, setSections] = useState<DetailSection[]>([]);
  const [sectionOrderDirty, setSectionOrderDirty] = useState(false);
  const [editingSectionId, setEditingSectionId] = useState<number | null>(null);
  const [sectionForm, setSectionForm] = useState<SectionDraft>(() =>
    emptySection(),
  );

  const notify = useCallback(
    (message: string, title = "안내") =>
      setDialog({ title, message, onConfirm: () => setDialog(null) }),
    [],
  );
  const confirm = (message: string, fn: () => Promise<void>) => {
    setDialog({
      title: "삭제 확인",
      message,
      onConfirm: () => {
        setDialog(null);
        void fn();
      },
    });
  };
  const perform = async (callback: () => Promise<void>, message?: string) => {
    setBusy(true);
    try {
      await callback();
      if (message) notify(message, "처리 완료");
    } catch (error) {
      notify(detailErrorMessage(error), "처리 실패");
    } finally {
      setBusy(false);
    }
  };

  const refresh = useCallback(async () => {
    const [nextCategories, nextPages] = await Promise.all([
      detailApi.categories(),
      detailApi.pages(),
    ]);
    setCategories(nextCategories);
    setPages(nextPages);
    setOrderDirty(false);
    setActiveCategoryId((prev) =>
      prev != null && nextCategories.some((c) => c.categoryId === prev)
        ? prev
        : ((nextCategories.find((c) => c.slug === "eyes") || nextCategories[0])
            ?.categoryId ?? null),
    );
  }, []);
  useEffect(() => {
    let mounted = true;
    void refresh()
      .catch((error) => {
        if (mounted) notify(detailErrorMessage(error), "목록 조회 실패");
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [refresh, notify]);

  const activeCategory = useMemo(
    () => categories.find((c) => c.categoryId === activeCategoryId) || null,
    [categories, activeCategoryId],
  );
  const visiblePages = useMemo(
    () => pages.filter((p) => p.categoryId === activeCategoryId),
    [pages, activeCategoryId],
  );
  // 첫 목록 조회 뒤 신규 등록 폼의 카테고리 ID를 선택 탭과 일치시킵니다.
  useEffect(() => {
    if (activeCategoryId === null || editingPageId !== null) return;
    setPageForm((prev) => ({
      ...prev,
      categoryId: activeCategoryId,
      sortOrder: prev.sortOrder || 1,
    }));
  }, [activeCategoryId, editingPageId]);
  const resetPage = (catId: number | null = activeCategoryId) => {
    setEditingPageId(null);
    const count = pages.filter((p) => p.categoryId === catId).length;
    setPageForm(emptyPage(catId || 0, count + 1));
  };
  const switchCategory = (id: number) => {
    setActiveCategoryId(id);
    setSectionPage(null);
    setEditingSectionId(null);
    resetPage(id);
  };
  const editPage = (page: DetailPage) => {
    setEditingPageId(page.pageId);
    setPageForm(fromPage(page));
  };
  const updatePage = <K extends keyof PagePayload>(
    key: K,
    value: PagePayload[K],
  ) => setPageForm((prev) => ({ ...prev, [key]: value }));

  const savePage = () => {
    if (
      !pageForm.categoryId ||
      !pageForm.title.trim() ||
      !pageForm.heroTitle.trim() ||
      !isSlug(pageForm.slug)
    ) {
      notify(
        "카테고리, 페이지명, Hero 제목과 올바른 URL 슬러그(영문 소문자·숫자·하이픈)를 입력하세요.",
        "입력 확인",
      );
      return;
    }
    void perform(
      async () => {
        if (editingPageId !== null)
          await detailApi.editPage(editingPageId, pageForm);
        else {
          const result = await detailApi.addPage(pageForm);
          setEditingPageId(result.pageId);
        }
        await refresh();
      },
      editingPageId
        ? "상세페이지가 수정되었어요."
        : "상세페이지가 임시저장 상태로 등록되었어요.",
    );
  };
  const removePage = (page: DetailPage) =>
    confirm(
      `「${page.title}」 페이지와 소속 섹션 전체가 영구 삭제됩니다. 삭제할까요?`,
      async () => {
        await perform(async () => {
          await detailApi.deletePage(page.pageId);
          if (editingPageId === page.pageId) resetPage();
          if (sectionPage?.pageId === page.pageId) setSectionPage(null);
          await refresh();
        }, "상세페이지를 삭제했어요.");
      },
    );
  const updateStatus = (page: DetailPage, status: DetailStatus) => {
    void perform(async () => {
      await detailApi.setPageStatus(page.pageId, status);
      await refresh();
    }, `「${page.title}」 상태를 ${STATUS_NAMES[status]}(으)로 변경했어요.`);
  };
  const movePage = (pageId: number, direction: -1 | 1) => {
    const rowIndex = visiblePages.findIndex((p) => p.pageId === pageId);
    const other = visiblePages[rowIndex + direction];
    if (!other) return;
    setPages((prev) => {
      const next = [...prev];
      const a = next.findIndex((p) => p.pageId === pageId);
      const b = next.findIndex((p) => p.pageId === other.pageId);
      [next[a], next[b]] = [next[b], next[a]];
      return next;
    });
    setOrderDirty(true);
  };
  const savePageOrder = () => {
    void perform(async () => {
      await detailApi.reorderPages(pages.map((p) => p.pageId));
      await refresh();
    }, "페이지 노출 순서를 저장했어요.");
  };

  const resetCategory = () => {
    setEditingCategoryId(null);
    setCategoryForm({ slug: "", name: "", description: "", isVisible: "Y" });
    setShowCategoryEditor(true);
  };
  const editCategory = (category: DetailCategory) => {
    setEditingCategoryId(category.categoryId);
    setCategoryForm({
      slug: category.slug,
      name: category.name,
      description: category.description || "",
      isVisible: category.isVisible,
    });
    setShowCategoryEditor(true);
  };
  const saveCategory = () => {
    if (!isSlug(categoryForm.slug) || !categoryForm.name.trim()) {
      notify("카테고리 슬러그와 이름을 정확히 입력해 주세요.", "입력 확인");
      return;
    }
    void perform(
      async () => {
        const old = categories.find((c) => c.categoryId === editingCategoryId);
        const payload = {
          slug: categoryForm.slug.trim(),
          name: categoryForm.name.trim(),
          description: categoryForm.description.trim(),
          isVisible: categoryForm.isVisible,
          sortOrder: old?.sortOrder ?? categories.length + 1,
        };
        if (editingCategoryId !== null)
          await detailApi.editCategory(editingCategoryId, payload);
        else {
          const r = await detailApi.addCategory(payload);
          setActiveCategoryId(r.categoryId);
        }
        await refresh();
        setShowCategoryEditor(false);
        setEditingCategoryId(null);
      },
      editingCategoryId ? "카테고리 수정 완료" : "새 카테고리를 추가했어요.",
    );
  };
  const removeCategory = () => {
    const category = categories.find((c) => c.categoryId === editingCategoryId);
    if (!category) return;
    confirm(
      `「${category.name}」 카테고리를 삭제할까요? 하위 페이지가 있으면 DB에서 삭제를 차단합니다.`,
      async () => {
        await perform(async () => {
          await detailApi.deleteCategory(category.categoryId);
          setShowCategoryEditor(false);
          await refresh();
        }, "카테고리를 삭제했어요.");
      },
    );
  };

  const openSections = (page: DetailPage) => {
    void perform(async () => {
      const rows = await detailApi.sections(page.pageId);
      setSections(rows);
      setSectionPage(page);
      setEditingSectionId(null);
      setSectionOrderDirty(false);
      setSectionForm(emptySection(rows.length + 1));
    });
  };
  const reloadSections = async (id: number) => {
    setSections(await detailApi.sections(id));
    setSectionOrderDirty(false);
  };
  const resetSection = () => {
    setEditingSectionId(null);
    setSectionForm(emptySection(sections.length + 1));
  };
  const editSection = (section: DetailSection) => {
    setEditingSectionId(section.sectionId);
    setSectionForm(fromSection(section));
  };
  const updateSection = <K extends keyof SectionDraft>(
    key: K,
    value: SectionDraft[K],
  ) => setSectionForm((prev) => ({ ...prev, [key]: value }));
  const saveSection = () => {
    if (!sectionPage) return;
    if (!isSlug(sectionForm.id) || !sectionForm.title.trim()) {
      notify(
        "섹션 키와 제목을 입력하세요. 키는 영문 소문자·숫자·하이픈만 허용합니다.",
        "입력 확인",
      );
      return;
    }
    let payload: SectionPayload;
    try {
      payload = sectionPayload(sectionForm);
    } catch (error) {
      notify(detailErrorMessage(error), "입력 확인");
      return;
    }
    void perform(
      async () => {
        if (editingSectionId !== null)
          await detailApi.editSection(editingSectionId, payload);
        else {
          const result = await detailApi.addSection(
            sectionPage.pageId,
            payload,
          );
          setEditingSectionId(result.sectionId);
        }
        await reloadSections(sectionPage.pageId);
      },
      editingSectionId ? "섹션을 수정했어요." : "섹션을 등록했어요.",
    );
  };
  const deleteSection = (section: DetailSection) =>
    confirm(`「${section.title}」 섹션을 삭제할까요?`, async () => {
      if (!sectionPage) return;
      await perform(async () => {
        await detailApi.deleteSection(section.sectionId);
        if (editingSectionId === section.sectionId) resetSection();
        await reloadSections(sectionPage.pageId);
      }, "섹션을 삭제했어요.");
    });
  const toggleSection = (section: DetailSection) => {
    if (!sectionPage) return;
    void perform(async () => {
      await detailApi.setSectionVisible(
        section.sectionId,
        section.isVisible === "Y" ? "N" : "Y",
      );
      await reloadSections(sectionPage.pageId);
    }, "섹션 공개 설정을 변경했어요.");
  };
  const moveSection = (index: number, direction: -1 | 1) => {
    const j = index + direction;
    if (j < 0 || j >= sections.length) return;
    setSections((prev) => {
      const next = [...prev];
      [next[index], next[j]] = [next[j], next[index]];
      return next;
    });
    setSectionOrderDirty(true);
  };
  const saveSectionOrder = () => {
    if (!sectionPage) return;
    void perform(async () => {
      await detailApi.reorderSections(
        sectionPage.pageId,
        sections.map((s) => s.sectionId),
      );
      await reloadSections(sectionPage.pageId);
    }, "섹션 순서를 저장했어요.");
  };

  return (
    <S.Root>
      <div className="admin-page-header">
        <S.PageHeader style={{ width: "100%" }}>
          <div className="admin-page-title-block">
            <span className="admin-page-eyebrow">
              CONTENT / PROCEDURE PAGES
            </span>
            <S.Heading>상세페이지 관리</S.Heading>
            <p className="admin-page-description">
              카테고리별 시술 페이지, 메인 이미지, 섹션과 노출 상태를
              관리합니다.
            </p>
          </div>
          <S.HeaderActions>
            {sectionPage ? (
              <S.Button
                type="button"
                onClick={() => {
                  setSectionPage(null);
                  resetSection();
                }}
              >
                <FiArrowLeft /> 페이지 목록
              </S.Button>
            ) : (
              <>
                <S.Button type="button" onClick={resetCategory}>
                  <FiSettings /> 카테고리 관리
                </S.Button>
                <S.Button
                  type="button"
                  $variant="primary"
                  onClick={() => resetPage()}
                  disabled={!activeCategoryId}
                >
                  <FiPlus /> 새 상세페이지
                </S.Button>
              </>
            )}
          </S.HeaderActions>
        </S.PageHeader>
      </div>

      <S.TabsShell className="admin-filter-panel">
        <S.Tabs aria-label="상세페이지 카테고리">
          {categories.map((category) => (
            <S.CategoryTab
              type="button"
              key={category.categoryId}
              $active={activeCategoryId === category.categoryId}
              onClick={() => switchCategory(category.categoryId)}
              aria-pressed={activeCategoryId === category.categoryId}
            >
              {category.name}{" "}
              <small>
                {
                  pages.filter((p) => p.categoryId === category.categoryId)
                    .length
                }
              </small>
            </S.CategoryTab>
          ))}
          {!categories.length && (
            <S.Hint>
              등록된 카테고리가 없습니다. 카테고리를 먼저 추가하세요.
            </S.Hint>
          )}
        </S.Tabs>
        <S.Button
          type="button"
          onClick={() => {
            if (activeCategory) editCategory(activeCategory);
            else resetCategory();
          }}
        >
          <FiEdit2 /> 선택 카테고리 편집
        </S.Button>
      </S.TabsShell>

      {showCategoryEditor && (
        <S.CategoryManager className="admin-panel">
          <div className="admin-panel-head">
            <S.PanelHeadRow>
              <S.PanelTitle>
                {editingCategoryId !== null ? "카테고리 수정" : "카테고리 추가"}
              </S.PanelTitle>
              <S.Button
                type="button"
                onClick={() => setShowCategoryEditor(false)}
              >
                <FiX /> 닫기
              </S.Button>
            </S.PanelHeadRow>
          </div>
          <div className="admin-panel-body">
            <S.CatGrid>
              <S.Field>
                카테고리명
                <S.Input
                  value={categoryForm.name}
                  placeholder="예: 눈성형"
                  maxLength={120}
                  onChange={(e) =>
                    setCategoryForm((p) => ({ ...p, name: e.target.value }))
                  }
                />
              </S.Field>
              <S.Field>
                URL 카테고리 슬러그
                <S.Input
                  value={categoryForm.slug}
                  placeholder="예: eyes"
                  maxLength={80}
                  onChange={(e) =>
                    setCategoryForm((p) => ({ ...p, slug: e.target.value }))
                  }
                />
              </S.Field>
              <S.Field>
                설명
                <S.Input
                  value={categoryForm.description}
                  maxLength={500}
                  onChange={(e) =>
                    setCategoryForm((p) => ({
                      ...p,
                      description: e.target.value,
                    }))
                  }
                />
              </S.Field>
              <S.Field>
                방문자 페이지 노출
                <S.Select
                  value={categoryForm.isVisible}
                  onChange={(e) =>
                    setCategoryForm((p) => ({
                      ...p,
                      isVisible: e.target.value as Visible,
                    }))
                  }
                >
                  <option value="Y">노출</option>
                  <option value="N">숨김</option>
                </S.Select>
              </S.Field>
            </S.CatGrid>
            <S.FormActions>
              <S.Button
                $variant="primary"
                disabled={busy}
                onClick={saveCategory}
              >
                <FiSave />{" "}
                {editingCategoryId ? "카테고리 수정" : "카테고리 추가"}
              </S.Button>
              <S.Button onClick={resetCategory}>
                <FiPlus /> 새 카테고리
              </S.Button>
              {editingCategoryId !== null && (
                <S.Button
                  $variant="danger"
                  disabled={busy}
                  onClick={removeCategory}
                >
                  <FiTrash2 /> 삭제
                </S.Button>
              )}
            </S.FormActions>
            <S.Hint>
              카테고리 슬러그를 변경하면 기존 상세페이지 URL도 변경돼요. Header
              메뉴 링크도 확인해 주세요.
            </S.Hint>
          </div>
        </S.CategoryManager>
      )}

      {loading ? (
        <S.Empty>상세페이지 목록을 불러오는 중...</S.Empty>
      ) : sectionPage ? (
        <>
          <S.Breadcrumb>
            <FiLayers /> {activeCategory?.name} / {sectionPage.title} / 섹션
            편집
          </S.Breadcrumb>
          <S.WorkGrid className="admin-page-grid">
            <S.Panel className="admin-editor-column admin-panel">
              <div className="admin-panel-head">
                <S.PanelHeadRow>
                  <S.PanelTitle>
                    {editingSectionId !== null ? "섹션 수정" : "새 섹션 등록"}
                  </S.PanelTitle>
                  <S.Button type="button" onClick={resetSection}>
                    <FiPlus /> 새로 작성
                  </S.Button>
                </S.PanelHeadRow>
              </div>
              <S.PanelBody className="admin-panel-body">
                <S.Field>
                  섹션 종류
                  <S.Select
                    value={sectionForm.type}
                    onChange={(e) =>
                      updateSection("type", e.target.value as SectionType)
                    }
                  >
                    {(Object.keys(SECTION_NAMES) as SectionType[]).map(
                      (type) => (
                        <option key={type} value={type}>
                          {SECTION_NAMES[type]}
                        </option>
                      ),
                    )}
                  </S.Select>
                </S.Field>
                <S.Field>
                  섹션 키 (SideNav 앵커)
                  <S.Input
                    value={sectionForm.id}
                    maxLength={100}
                    placeholder="intro / features / faq"
                    onChange={(e) => updateSection("id", e.target.value)}
                  />
                </S.Field>
                <S.Field>
                  섹션 제목
                  <S.Input
                    value={sectionForm.title}
                    maxLength={200}
                    placeholder="예: 자연스러운 아름다움"
                    onChange={(e) => updateSection("title", e.target.value)}
                  />
                </S.Field>
                <S.Field>
                  상단 라벨 (Eyebrow)
                  <S.Input
                    value={sectionForm.eyebrow}
                    maxLength={150}
                    placeholder="예: 01 / INTRODUCTION"
                    onChange={(e) => updateSection("eyebrow", e.target.value)}
                  />
                </S.Field>
                {(sectionForm.type === "INTRO" ||
                  sectionForm.type === "TEXT" ||
                  sectionForm.type === "CTA") && (
                  <S.Field>
                    설명
                    <S.Textarea
                      value={sectionForm.description}
                      onChange={(e) =>
                        updateSection("description", e.target.value)
                      }
                      placeholder="본문에 표시될 설명"
                    />
                  </S.Field>
                )}
                {(sectionForm.type === "INTRO" ||
                  sectionForm.type === "TEXT") && (
                  <S.FieldGrid>
                    <S.Field>
                      섹션 이미지 URL
                      <S.Input
                        value={sectionForm.imageUrl}
                        onChange={(e) =>
                          updateSection("imageUrl", e.target.value)
                        }
                        placeholder="/images/detail/..."
                      />
                    </S.Field>
                    <S.Field>
                      이미지 대체 텍스트
                      <S.Input
                        value={sectionForm.imageAlt}
                        onChange={(e) =>
                          updateSection("imageAlt", e.target.value)
                        }
                      />
                    </S.Field>
                  </S.FieldGrid>
                )}
                {(sectionForm.type === "FEATURES" ||
                  sectionForm.type === "PROCESS") && (
                  <S.Field>
                    {sectionForm.type === "FEATURES"
                      ? "특징 목록"
                      : "진행 단계"}
                    <S.Textarea
                      rows={7}
                      value={sectionForm.itemsText}
                      onChange={(e) =>
                        updateSection("itemsText", e.target.value)
                      }
                      placeholder={
                        "한 줄에 한 항목씩 입력\n예: 상담 및 상태 평가\n예: 개인별 계획 안내"
                      }
                    />
                    <S.Hint>각 줄이 하나의 카드/단계로 표시됩니다.</S.Hint>
                  </S.Field>
                )}
                {sectionForm.type === "GALLERY" && (
                  <S.Field>
                    이미지 목록
                    <S.Textarea
                      rows={7}
                      value={sectionForm.imagesText}
                      onChange={(e) =>
                        updateSection("imagesText", e.target.value)
                      }
                      placeholder={
                        "/images/detail/a.webp | 이미지 설명\n/images/detail/b.webp | 이미지 설명"
                      }
                    />
                    <S.Hint>
                      각 줄마다 이미지 URL | 대체 텍스트를 입력하세요.
                    </S.Hint>
                  </S.Field>
                )}
                {sectionForm.type === "FAQ" && (
                  <S.Field>
                    질문·답변
                    <S.Textarea
                      rows={8}
                      value={sectionForm.faqsText}
                      onChange={(e) =>
                        updateSection("faqsText", e.target.value)
                      }
                      placeholder={
                        "상담은 어떻게 하나요? | 상담 안내를 참고해 주세요.\n진료 시간은? | 예약 시 확인해 주세요."
                      }
                    />
                    <S.Hint>각 줄마다 질문 | 답변을 입력하세요.</S.Hint>
                  </S.Field>
                )}
                {sectionForm.type === "CTA" && (
                  <S.FieldGrid>
                    <S.Field>
                      버튼 문구
                      <S.Input
                        value={sectionForm.buttonLabel}
                        onChange={(e) =>
                          updateSection("buttonLabel", e.target.value)
                        }
                        placeholder="상담 신청하기"
                      />
                    </S.Field>
                    <S.Field>
                      이동 경로
                      <S.Input
                        value={sectionForm.buttonHref}
                        onChange={(e) =>
                          updateSection("buttonHref", e.target.value)
                        }
                        placeholder="/#site-footer-contact"
                      />
                    </S.Field>
                  </S.FieldGrid>
                )}
                <S.FieldGrid>
                  <S.Field>
                    노출 설정
                    <S.Select
                      value={sectionForm.isVisible}
                      onChange={(e) =>
                        updateSection("isVisible", e.target.value as Visible)
                      }
                    >
                      <option value="Y">노출</option>
                      <option value="N">숨김</option>
                    </S.Select>
                  </S.Field>
                  <S.Field>
                    순서 번호
                    <S.Input
                      type="number"
                      min={0}
                      value={sectionForm.sortOrder}
                      onChange={(e) =>
                        updateSection("sortOrder", Number(e.target.value))
                      }
                    />
                  </S.Field>
                </S.FieldGrid>
                <S.FormActions>
                  <S.Button
                    $variant="primary"
                    type="button"
                    disabled={busy}
                    onClick={saveSection}
                  >
                    <FiSave />{" "}
                    {editingSectionId !== null ? "섹션 수정" : "섹션 등록"}
                  </S.Button>
                  <S.Button type="button" onClick={resetSection}>
                    취소 / 초기화
                  </S.Button>
                </S.FormActions>
              </S.PanelBody>
            </S.Panel>
            <S.Panel className="admin-record-column admin-panel">
              <div className="admin-panel-head">
                <S.PanelHeadRow>
                  <S.PanelTitle>등록된 섹션 ({sections.length})</S.PanelTitle>
                  <S.Button
                    type="button"
                    $variant="primary"
                    disabled={!sectionOrderDirty || busy}
                    onClick={saveSectionOrder}
                  >
                    <FiSave /> 순서 저장
                  </S.Button>
                </S.PanelHeadRow>
              </div>
              <S.TableWrap className="admin-table-scroll">
                <S.Table className="admin-data-table">
                  <thead>
                    <tr>
                      <th>순서</th>
                      <th>섹션</th>
                      <th>종류</th>
                      <th>노출</th>
                      <th>관리</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sections.map((section, index) => (
                      <tr key={section.sectionId}>
                        <td>
                          <S.InlineActions>
                            <span>{index + 1}</span>
                            <S.IconButton
                              aria-label="위로 이동"
                              type="button"
                              disabled={index === 0}
                              onClick={() => moveSection(index, -1)}
                            >
                              <FiArrowUp />
                            </S.IconButton>
                            <S.IconButton
                              aria-label="아래로 이동"
                              type="button"
                              disabled={index === sections.length - 1}
                              onClick={() => moveSection(index, 1)}
                            >
                              <FiArrowDown />
                            </S.IconButton>
                          </S.InlineActions>
                        </td>
                        <td>
                          <S.NameCell>
                            <strong>{section.title}</strong>
                            <small>#{section.id}</small>
                          </S.NameCell>
                        </td>
                        <td>{SECTION_NAMES[section.type]}</td>
                        <td>
                          <S.Button
                            type="button"
                            disabled={busy}
                            onClick={() => toggleSection(section)}
                          >
                            {section.isVisible === "Y" ? "노출" : "숨김"}
                          </S.Button>
                        </td>
                        <td>
                          <S.InlineActions>
                            <S.IconButton
                              type="button"
                              aria-label="섹션 편집"
                              onClick={() => editSection(section)}
                            >
                              <FiEdit2 />
                            </S.IconButton>
                            <S.IconButton
                              type="button"
                              $danger
                              aria-label="섹션 삭제"
                              onClick={() => deleteSection(section)}
                            >
                              <FiTrash2 />
                            </S.IconButton>
                          </S.InlineActions>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </S.Table>
                {sections.length === 0 && (
                  <S.Empty>
                    아직 섹션이 없어요. 왼쪽에서 새 섹션을 등록해 주세요.
                  </S.Empty>
                )}
              </S.TableWrap>
            </S.Panel>
          </S.WorkGrid>
        </>
      ) : (
        <S.WorkGrid className="admin-page-grid">
          <S.Panel className="admin-editor-column admin-panel">
            <div className="admin-panel-head">
              <S.PanelHeadRow>
                <S.PanelTitle>
                  {editingPageId !== null
                    ? "상세페이지 수정"
                    : "새 상세페이지 등록"}
                </S.PanelTitle>
                <S.Button type="button" onClick={() => resetPage()}>
                  <FiPlus /> 새로 작성
                </S.Button>
              </S.PanelHeadRow>
            </div>
            <S.PanelBody className="admin-panel-body">
              <S.Field>
                카테고리
                <S.Select
                  value={pageForm.categoryId || activeCategoryId || ""}
                  onChange={(e) =>
                    updatePage("categoryId", Number(e.target.value))
                  }
                >
                  {categories.map((c) => (
                    <option key={c.categoryId} value={c.categoryId}>
                      {c.name}
                    </option>
                  ))}
                </S.Select>
              </S.Field>
              <S.FieldGrid>
                <S.Field>
                  시술 페이지명
                  <S.Input
                    value={pageForm.title}
                    maxLength={200}
                    onChange={(e) => updatePage("title", e.target.value)}
                    placeholder="예: 자연유착 쌍꺼풀"
                  />
                </S.Field>
                <S.Field>
                  URL 슬러그
                  <S.Input
                    value={pageForm.slug}
                    maxLength={120}
                    onChange={(e) => updatePage("slug", e.target.value)}
                    placeholder="예: natural-adhesion"
                  />
                </S.Field>
              </S.FieldGrid>
              <S.Hint>
                방문자 주소: /
                {categories.find((c) => c.categoryId === pageForm.categoryId)
                  ?.slug || "category"}
                /{pageForm.slug || "slug"}
              </S.Hint>
              <S.Divider />
              <S.Subheading>Hero 비주얼</S.Subheading>
              <S.Field>
                상단 라벨
                <S.Input
                  value={pageForm.heroEyebrow}
                  maxLength={180}
                  onChange={(e) => updatePage("heroEyebrow", e.target.value)}
                />
              </S.Field>
              <S.Field>
                Hero 메인 제목
                <S.Input
                  value={pageForm.heroTitle}
                  maxLength={300}
                  onChange={(e) => updatePage("heroTitle", e.target.value)}
                  placeholder="예: 자연스럽게, 당신답게"
                />
              </S.Field>
              <S.Field>
                Hero 설명
                <S.Textarea
                  rows={3}
                  value={pageForm.heroDescription}
                  onChange={(e) =>
                    updatePage("heroDescription", e.target.value)
                  }
                />
              </S.Field>
              <S.Field>
                Hero 이미지 URL
                <S.Input
                  value={pageForm.heroImageUrl}
                  maxLength={1000}
                  onChange={(e) => updatePage("heroImageUrl", e.target.value)}
                  placeholder="/images/detail/eyes/hero.webp"
                />
              </S.Field>
              {pageForm.heroImageUrl &&
                ((pageForm.heroImageUrl.startsWith("/") &&
                  !pageForm.heroImageUrl.startsWith("//")) ||
                  pageForm.heroImageUrl.startsWith("https://")) && (
                  <S.ImagePreview
                    $url={pageForm.heroImageUrl}
                    aria-label="Hero 이미지 미리보기"
                  />
                )}
              <S.FieldGrid>
                <S.Field>
                  이미지 alt
                  <S.Input
                    value={pageForm.heroImageAlt}
                    maxLength={300}
                    onChange={(e) => updatePage("heroImageAlt", e.target.value)}
                  />
                </S.Field>
                <S.Field>
                  이미지 위치
                  <S.Input
                    value={pageForm.heroImagePosition}
                    maxLength={60}
                    onChange={(e) =>
                      updatePage("heroImagePosition", e.target.value)
                    }
                    placeholder="center center"
                  />
                </S.Field>
              </S.FieldGrid>
              <S.Divider />
              <S.Subheading>검색 최적화 (SEO)</S.Subheading>
              <S.Field>
                SEO 제목
                <S.Input
                  value={pageForm.seoTitle}
                  maxLength={200}
                  onChange={(e) => updatePage("seoTitle", e.target.value)}
                />
              </S.Field>
              <S.Field>
                SEO 설명
                <S.Textarea
                  rows={3}
                  value={pageForm.seoDescription}
                  onChange={(e) => updatePage("seoDescription", e.target.value)}
                />
              </S.Field>
              <S.Field>
                순서 번호
                <S.Input
                  type="number"
                  min={0}
                  value={pageForm.sortOrder}
                  onChange={(e) =>
                    updatePage("sortOrder", Number(e.target.value))
                  }
                />
              </S.Field>
              <S.FormActions>
                <S.Button
                  type="button"
                  $variant="primary"
                  disabled={busy || !categories.length}
                  onClick={savePage}
                >
                  <FiSave />{" "}
                  {editingPageId !== null ? "변경사항 저장" : "상세페이지 등록"}
                </S.Button>
                <S.Button type="button" onClick={() => resetPage()}>
                  초기화
                </S.Button>
              </S.FormActions>
              <S.Hint>
                신규 상세페이지는 임시저장(DRAFT)으로 등록됩니다. 콘텐츠 등록 후
                우측 목록에서 공개로 변경하세요.
              </S.Hint>
            </S.PanelBody>
          </S.Panel>
          <S.Panel className="admin-record-column admin-panel">
            <div className="admin-panel-head">
              <S.PanelHeadRow>
                <S.PanelTitle>
                  {activeCategory?.name || "카테고리"} 상세페이지 (
                  {visiblePages.length})
                </S.PanelTitle>
                <S.Button
                  type="button"
                  $variant="primary"
                  disabled={!orderDirty || busy}
                  onClick={savePageOrder}
                >
                  <FiSave /> 순서 저장
                </S.Button>
              </S.PanelHeadRow>
            </div>
            <S.TableWrap className="admin-table-scroll">
              <S.Table className="admin-data-table">
                <thead>
                  <tr>
                    <th>순서</th>
                    <th>페이지명 · URL</th>
                    <th>공개 상태</th>
                    <th>관리</th>
                  </tr>
                </thead>
                <tbody>
                  {visiblePages.map((page, index) => (
                    <tr key={page.pageId}>
                      <td>
                        <S.InlineActions>
                          <span>{index + 1}</span>
                          <S.IconButton
                            type="button"
                            aria-label="위로 이동"
                            disabled={index === 0}
                            onClick={() => movePage(page.pageId, -1)}
                          >
                            <FiArrowUp />
                          </S.IconButton>
                          <S.IconButton
                            type="button"
                            aria-label="아래로 이동"
                            disabled={index === visiblePages.length - 1}
                            onClick={() => movePage(page.pageId, 1)}
                          >
                            <FiArrowDown />
                          </S.IconButton>
                        </S.InlineActions>
                      </td>
                      <td>
                        <S.NameCell>
                          <strong>{page.title}</strong>
                          <small>
                            /{page.category}/{page.slug}
                          </small>
                        </S.NameCell>
                      </td>
                      <td>
                        <S.InlineActions>
                          <S.Status $status={page.status}>
                            {STATUS_NAMES[page.status]}
                          </S.Status>
                          <S.Select
                            aria-label={`${page.title} 공개 상태`}
                            value={page.status}
                            disabled={busy}
                            style={{ width: 91, minHeight: 32, padding: "5px" }}
                            onChange={(e) =>
                              updateStatus(page, e.target.value as DetailStatus)
                            }
                          >
                            <option value="DRAFT">임시저장</option>
                            <option value="PUBLISHED">공개</option>
                            <option value="HIDDEN">숨김</option>
                          </S.Select>
                        </S.InlineActions>
                      </td>
                      <td>
                        <S.InlineActions>
                          <S.IconButton
                            type="button"
                            title="정보 편집"
                            aria-label="정보 편집"
                            onClick={() => editPage(page)}
                          >
                            <FiEdit2 />
                          </S.IconButton>
                          <S.Button
                            type="button"
                            onClick={() => openSections(page)}
                          >
                            <FiLayers /> 섹션
                          </S.Button>
                          {page.status === "PUBLISHED" && (
                            <S.IconButton
                              type="button"
                              title="방문자 페이지 열기"
                              aria-label="방문자 페이지 열기"
                              onClick={() =>
                                window.open(
                                  `/${page.category}/${page.slug}`,
                                  "_blank",
                                  "noopener,noreferrer",
                                )
                              }
                            >
                              <FiExternalLink />
                            </S.IconButton>
                          )}
                          <S.IconButton
                            type="button"
                            $danger
                            title="삭제"
                            aria-label="삭제"
                            onClick={() => removePage(page)}
                          >
                            <FiTrash2 />
                          </S.IconButton>
                        </S.InlineActions>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </S.Table>
              {!visiblePages.length && (
                <S.Empty>
                  이 카테고리에 등록된 상세페이지가 없습니다. 왼쪽에서 첫 번째
                  페이지를 등록해 주세요.
                </S.Empty>
              )}
            </S.TableWrap>
            <div className="admin-panel-body">
              <S.InfoRow>
                <FiCheck />{" "}
                {orderDirty
                  ? "변경된 순서를 저장해 주세요."
                  : "페이지 순서는 저장된 상태예요."}
              </S.InfoRow>
            </div>
          </S.Panel>
        </S.WorkGrid>
      )}

      <Popup
        isOpen={dialog !== null}
        title={dialog?.title || "안내"}
        onClose={() => setDialog(null)}
        onConfirm={dialog?.onConfirm}
      >
        {dialog?.message || ""}
      </Popup>
    </S.Root>
  );
}
