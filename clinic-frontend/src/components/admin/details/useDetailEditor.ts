"use client";
import { detailApi, detailErrorMessage } from "@/lib/admin/detailApi";
import type {
  DetailCategory,
  DetailPage,
  DetailSection,
  DetailStatus,
  PagePayload,
  SectionPayload,
  Visible,
} from "@/types/adminDetail";
import type { DetailSectionData } from "@/types/detail";
import { useCallback, useEffect, useMemo, useState } from "react";

import {
  STATUS_NAMES,
  emptyPage,
  emptySection,
  fromPage,
  fromSection,
  isSlug,
  sectionPayload,
  type SectionDraft,
} from "@/lib/admin/detailEditorModel";
interface Dialog {
  title: string;
  message: string;
  onConfirm?: () => void;
}
export function useDetailEditor() {
  const [categories, setCategories] = useState<DetailCategory[]>([]);
  const [pages, setPages] = useState<DetailPage[]>([]);
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
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
  const [sectionRightTab, setSectionRightTab] = useState<"list" | "preview">(
    "preview",
  );
  const [pageRightTab, setPageRightTab] = useState<"list" | "preview">("list");

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

  const draftPreviewSection = useMemo<DetailSectionData>(() => {
    // 저장 payload와 동일한 매핑을 사용하되 FAQ 작성 중 미완성 행도 화면에서 보이게 합니다.
    const content = sectionPayload(sectionForm, true).content;
    return {
      id: sectionForm.id.trim() || "draft-preview",
      type: sectionForm.type,
      title: sectionForm.title.trim() || "섹션 제목을 입력해 주세요",
      eyebrow: sectionForm.eyebrow.trim() || "AHN'S · PREVIEW",
      content,
    };
  }, [sectionForm]);
  const draftIsLast =
    sectionForm.type === "CTA" ||
    (editingSectionId !== null &&
      sections.filter((s) => s.isVisible === "Y").at(-1)?.sectionId ===
        editingSectionId);

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
    if (uploadingImage) {
      notify("이미지 업로드가 끝난 다음 저장해 주세요.", "업로드 중");
      return;
    }
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
      setSectionRightTab("preview");
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
    if (uploadingImage) {
      notify("이미지 업로드가 끝난 다음 저장해 주세요.", "업로드 중");
      return;
    }
    if (!sectionPage) return;
    if (!isSlug(sectionForm.id) || !sectionForm.title.trim()) {
      notify(
        "섹션 키와 제목을 입력하세요. 키는 영문 소문자·숫자·하이픈만 허용합니다.",
        "입력 확인",
      );
      return;
    }
    if (
      sectionForm.layout === "comparison" &&
      !(
        sectionForm.compareLeftTitle.trim() &&
        sectionForm.compareLeftBody.trim() &&
        sectionForm.compareRightTitle.trim() &&
        sectionForm.compareRightBody.trim()
      )
    ) {
      notify(
        "비교형 레이아웃은 양쪽 제목과 설명을 모두 입력해 주세요.",
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

  return {
    categories,
    pages,
    activeCategoryId,
    loading,
    busy,
    uploadingImage,
    setUploadingImage,
    orderDirty,
    dialog,
    setDialog,
    showCategoryEditor,
    setShowCategoryEditor,
    editingCategoryId,
    categoryForm,
    setCategoryForm,
    editingPageId,
    pageForm,
    sectionPage,
    setSectionPage,
    sections,
    sectionOrderDirty,
    editingSectionId,
    setEditingSectionId,
    sectionForm,
    setSectionForm,
    sectionRightTab,
    setSectionRightTab,
    pageRightTab,
    setPageRightTab,
    notify,
    draftPreviewSection,
    draftIsLast,
    activeCategory,
    visiblePages,
    resetPage,
    switchCategory,
    editPage,
    updatePage,
    savePage,
    removePage,
    updateStatus,
    movePage,
    savePageOrder,
    resetCategory,
    editCategory,
    saveCategory,
    removeCategory,
    openSections,
    reloadSections,
    resetSection,
    editSection,
    updateSection,
    saveSection,
    deleteSection,
    toggleSection,
    moveSection,
    saveSectionOrder,
  };
}
