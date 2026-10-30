"use client";

import {
  FiArrowDown,
  FiArrowLeft,
  FiArrowUp,
  FiCheck,
  FiEdit2,
  FiExternalLink,
  FiEye,
  FiLayers,
  FiPlus,
  FiSave,
  FiSettings,
  FiTrash2,
  FiX,
} from "react-icons/fi";

import DetailEditorPreview from "@/components/admin/details/DetailEditorPreview";
import DetailImageUpload from "@/components/admin/details/DetailImageUpload";
import ProcedurePreviewSectionImport from "@/components/admin/details/ProcedurePreviewSectionImport";
import { Popup } from "@/components/ui/Popup";
import * as S from "@/components/admin/details/DetailEditor.styles";

import type { DetailStatus, SectionType, Visible } from "@/types/adminDetail";

import {
  LAYOUT_OPTIONS,
  SECTION_NAMES,
  STATUS_NAMES,
  emptySection,
} from "@/lib/admin/detailEditorModel";
import { useDetailEditor } from "./useDetailEditor";

export default function DetailEditor() {
  const {
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
  } = useDetailEditor();
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

                  <S.InlineActions>
                    <ProcedurePreviewSectionImport
                      page={sectionPage}
                      disabled={busy || uploadingImage}
                      notify={notify}
                      onComplete={async () => {
                        await reloadSections(sectionPage.pageId);
                        setEditingSectionId(null);
                        setSectionForm(emptySection());
                        setSectionRightTab("list");
                      }}
                    />

                    <S.Button type="button" onClick={resetSection}>
                      <FiPlus /> 새로 작성
                    </S.Button>
                  </S.InlineActions>
                </S.PanelHeadRow>
              </div>
              <S.PanelBody className="admin-panel-body">
                <S.Field>
                  섹션 종류
                  <S.Select
                    value={sectionForm.type}
                    onChange={(e) =>
                      setSectionForm((prev) => ({
                        ...prev,
                        type: e.target.value as SectionType,
                        layout: "",
                      }))
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
                {LAYOUT_OPTIONS[sectionForm.type] && (
                  <S.Field>
                    섹션 레이아웃
                    <S.Select
                      value={sectionForm.layout}
                      onChange={(e) => updateSection("layout", e.target.value)}
                    >
                      {LAYOUT_OPTIONS[sectionForm.type]?.map((option) => (
                        <option
                          key={option.value || "default"}
                          value={option.value}
                        >
                          {option.label}
                        </option>
                      ))}
                    </S.Select>
                    <S.Hint>
                      레이아웃 설정만 변경해도 기존 텍스트는 유지됩니다. 저장 후
                      방문자 페이지를 새로고침해 주세요.
                    </S.Hint>
                  </S.Field>
                )}
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
                {(
                  [
                    "INTRO",
                    "TEXT",
                    "FEATURES",
                    "PROCESS",
                    "GALLERY",
                    "FAQ",
                    "CTA",
                  ] as SectionType[]
                ).includes(sectionForm.type) && (
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
                  sectionForm.type === "TEXT") &&
                  sectionForm.layout === "comparison" && (
                    <>
                      <S.FieldGrid>
                        <S.Field>
                          왼쪽 비교 제목
                          <S.Input
                            value={sectionForm.compareLeftTitle}
                            onChange={(e) =>
                              updateSection("compareLeftTitle", e.target.value)
                            }
                            placeholder="예: 항목 A"
                          />
                        </S.Field>
                        <S.Field>
                          오른쪽 비교 제목
                          <S.Input
                            value={sectionForm.compareRightTitle}
                            onChange={(e) =>
                              updateSection("compareRightTitle", e.target.value)
                            }
                            placeholder="예: 항목 B"
                          />
                        </S.Field>
                      </S.FieldGrid>
                      <S.FieldGrid>
                        <S.Field>
                          왼쪽 설명
                          <S.Textarea
                            rows={4}
                            value={sectionForm.compareLeftBody}
                            onChange={(e) =>
                              updateSection("compareLeftBody", e.target.value)
                            }
                          />
                        </S.Field>
                        <S.Field>
                          오른쪽 설명
                          <S.Textarea
                            rows={4}
                            value={sectionForm.compareRightBody}
                            onChange={(e) =>
                              updateSection("compareRightBody", e.target.value)
                            }
                          />
                        </S.Field>
                      </S.FieldGrid>
                      <S.Hint>
                        2열 비교형은 등록된 내용만 표시합니다. 의료적 우월성이나
                        효과를 임의로 표시하지 않습니다.
                      </S.Hint>
                    </>
                  )}
                {(sectionForm.type === "INTRO" ||
                  sectionForm.type === "TEXT") &&
                  sectionForm.layout !== "comparison" && (
                    <DetailImageUpload
                      label="본문 이미지 파일 선택"
                      disabled={busy}
                      onUploading={setUploadingImage}
                      onUploaded={(images) =>
                        updateSection("imageUrl", images[0].url)
                      }
                    />
                  )}
                {(sectionForm.type === "INTRO" ||
                  sectionForm.type === "TEXT") &&
                  sectionForm.layout !== "comparison" && (
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
                  <DetailImageUpload
                    label="갤러리 이미지 파일 선택 (여러 장 가능)"
                    multiple
                    disabled={busy}
                    onUploading={setUploadingImage}
                    onUploaded={(images) =>
                      setSectionForm((prev) => ({
                        ...prev,
                        imagesText: [
                          prev.imagesText.trim(),
                          ...images.map(
                            (image) =>
                              `${image.url} | ${image.originalName.replace(/\.[^.]+$/, "").replace(/[|\r\n]/g, " ")}`,
                          ),
                        ]
                          .filter(Boolean)
                          .join("\n"),
                      }))
                    }
                  />
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
                    disabled={busy || uploadingImage}
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
                  <S.PanelTitle>
                    {sectionRightTab === "preview"
                      ? "섹션 실시간 미리보기"
                      : `등록된 섹션 (${sections.length})`}
                  </S.PanelTitle>
                  <S.InlineActions>
                    <S.Button
                      type="button"
                      $variant={
                        sectionRightTab === "preview" ? "primary" : "quiet"
                      }
                      aria-pressed={sectionRightTab === "preview"}
                      onClick={() => setSectionRightTab("preview")}
                    >
                      <FiEye /> 미리보기
                    </S.Button>
                    <S.Button
                      type="button"
                      $variant={
                        sectionRightTab === "list" ? "primary" : "quiet"
                      }
                      aria-pressed={sectionRightTab === "list"}
                      onClick={() => setSectionRightTab("list")}
                    >
                      <FiLayers /> 목록
                    </S.Button>
                    {sectionRightTab === "list" && (
                      <S.Button
                        type="button"
                        $variant="primary"
                        disabled={!sectionOrderDirty || busy}
                        onClick={saveSectionOrder}
                      >
                        <FiSave /> 순서 저장
                      </S.Button>
                    )}
                  </S.InlineActions>
                </S.PanelHeadRow>
              </div>
              {sectionRightTab === "preview" ? (
                <DetailEditorPreview
                  mode="section"
                  section={draftPreviewSection}
                  index={Math.max(
                    0,
                    sections.findIndex((s) => s.sectionId === editingSectionId),
                  )}
                  isLast={draftIsLast}
                  hidden={sectionForm.isVisible === "N"}
                />
              ) : (
                <>
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
                </>
              )}
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
              <DetailImageUpload
                label="Hero 이미지 파일 선택"
                disabled={busy}
                onUploading={setUploadingImage}
                onUploaded={(images) =>
                  updatePage("heroImageUrl", images[0].url)
                }
              />
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
                  pageForm.heroImageUrl.startsWith("https://") ||
                  pageForm.heroImageUrl.startsWith("http://")) && (
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
                  disabled={busy || uploadingImage || !categories.length}
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
                  {pageRightTab === "preview"
                    ? "Hero 실시간 미리보기"
                    : `${activeCategory?.name || "카테고리"} 상세페이지 (${visiblePages.length})`}
                </S.PanelTitle>
                <S.InlineActions>
                  <S.Button
                    type="button"
                    $variant={pageRightTab === "preview" ? "primary" : "quiet"}
                    aria-pressed={pageRightTab === "preview"}
                    onClick={() => setPageRightTab("preview")}
                  >
                    <FiEye /> 미리보기
                  </S.Button>
                  <S.Button
                    type="button"
                    $variant={pageRightTab === "list" ? "primary" : "quiet"}
                    aria-pressed={pageRightTab === "list"}
                    onClick={() => setPageRightTab("list")}
                  >
                    <FiLayers /> 목록
                  </S.Button>
                  {pageRightTab === "list" && (
                    <S.Button
                      type="button"
                      $variant="primary"
                      disabled={!orderDirty || busy}
                      onClick={savePageOrder}
                    >
                      <FiSave /> 순서 저장
                    </S.Button>
                  )}
                </S.InlineActions>
              </S.PanelHeadRow>
            </div>
            {pageRightTab === "preview" ? (
              <DetailEditorPreview mode="hero" page={pageForm} />
            ) : (
              <>
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
                                style={{
                                  width: 91,
                                  minHeight: 32,
                                  padding: "5px",
                                }}
                                onChange={(e) =>
                                  updateStatus(
                                    page,
                                    e.target.value as DetailStatus,
                                  )
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
                      이 카테고리에 등록된 상세페이지가 없습니다. 왼쪽에서 첫
                      번째 페이지를 등록해 주세요.
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
              </>
            )}
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
