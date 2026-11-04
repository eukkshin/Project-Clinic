"use client";

import { useTranslations } from "next-intl";
import { useRef } from "react";
import {
  FiArrowRight,
  FiCheckCircle,
  FiChevronLeft,
  FiChevronRight,
  FiCompass,
  FiEye,
  FiFeather,
  FiHeart,
  FiMessageCircle,
  FiShield,
  FiUserCheck,
} from "react-icons/fi";

import DetailImage from "@/components/procedures/DetailImage";
import * as S from "@/components/procedures/DetailPage.styles";
import * as V from "@/components/procedures/DetailSectionLayouts.styles";
import { Accordion } from "@/components/ui/Accordion";

import type { DetailSectionData } from "@/types/detail";
interface Props {
  section: DetailSectionData;
  index: number;
  isLast?: boolean;
}

const featureIcons = [FiEye, FiFeather, FiHeart, FiShield];
const processIcons = [FiMessageCircle, FiCompass, FiCheckCircle, FiUserCheck];

export default function DetailSectionRenderer({
  section,
  index,
  isLast = false,
}: Props) {
  const { content } = section;
  const t = useTranslations("Procedures");
  const layout = content.layout ?? "default";
  const galleryRef = useRef<HTMLDivElement>(null);
  const eyebrow =
    section.eyebrow ??
    `${String(index + 1).padStart(2, "0")} · ${section.type}`;
  // Footer starts at #1b3528. Final section uses this same deep green for a seamless transition.
  const light = section.type === "PROCESS" || section.type === "CTA" || isLast;
  const tone = light
    ? "dark"
    : section.type === "FEATURES" || section.type === "FAQ"
      ? "mist"
      : "cream";

  const moveGallery = (direction: number) => {
    const el = galleryRef.current;
    if (!el) return;
    el.scrollBy({
      left: direction * el.clientWidth * 0.8,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
    });
  };

  return (
    <S.EditorialSection
      id={`detail-${section.id}`}
      $tone={tone}
      data-tone={tone}
      aria-labelledby={`detail-title-${section.id}`}
    >
      <S.Content>
        {(section.type === "INTRO" || section.type === "TEXT") &&
          (layout === "comparison" ? (
            <div data-detail-animate>
              <S.Label $light={light}>{eyebrow}</S.Label>
              <S.Title $light={light} id={`detail-title-${section.id}`}>
                {section.title}
              </S.Title>
              {content.description && (
                <S.Description
                  $light={light}
                  style={{ marginTop: 22, maxWidth: 800 }}
                >
                  {content.description}
                </S.Description>
              )}
              <V.ComparisonGrid>
                <V.ComparisonCard $light={light}>
                  <V.ComparisonIndex $light={light}>
                    01 / {content.compareLeftTitle || t("firstItem")}
                  </V.ComparisonIndex>
                  <h3>{content.compareLeftTitle || t("firstItem")}</h3>
                  <p>{content.compareLeftBody || t("enterDescription")}</p>
                </V.ComparisonCard>
                <V.ComparisonCard $light={light}>
                  <V.ComparisonIndex $light={light}>
                    02 / {content.compareRightTitle || t("secondItem")}
                  </V.ComparisonIndex>
                  <h3>{content.compareRightTitle || t("secondItem")}</h3>
                  <p>{content.compareRightBody || t("enterDescription")}</p>
                </V.ComparisonCard>
              </V.ComparisonGrid>
            </div>
          ) : (
            <V.IntroVariantGrid $imageLeft={layout === "image-left"}>
              <S.IntroText data-detail-animate>
                <S.Label $light={light}>{eyebrow}</S.Label>
                <S.Title $light={light} id={`detail-title-${section.id}`}>
                  {section.title}
                </S.Title>
                {content.description && (
                  <S.Description $light={light}>
                    {content.description}
                  </S.Description>
                )}
              </S.IntroText>
              <S.IntroVisual data-detail-animate>
                {content.imageUrl ? (
                  <DetailImage
                    src={content.imageUrl}
                    alt={content.imageAlt ?? t("introImageAlt")}
                    fill
                    sizes="(max-width:768px) 100vw, 50vw"
                  />
                ) : (
                  <S.EmptyMedia>
                    <span>AHN'S</span>
                  </S.EmptyMedia>
                )}
                <S.IntroMark aria-hidden="true">
                  {t("naturalBeauty")}
                </S.IntroMark>
              </S.IntroVisual>
            </V.IntroVariantGrid>
          ))}

        {section.type === "FEATURES" && (
          <>
            <S.FeaturesHeading data-detail-animate>
              <div>
                <S.Label $light={light}>{eyebrow}</S.Label>
                <S.Title $light={light} id={`detail-title-${section.id}`}>
                  {section.title}
                </S.Title>
              </div>
              {content.description && (
                <S.Description $light={light}>
                  {content.description}
                </S.Description>
              )}
            </S.FeaturesHeading>
            {layout === "rows" ? (
              <V.FeatureRows>
                {(content.items ?? []).map((item, i) => {
                  const Icon = featureIcons[i % featureIcons.length];
                  return (
                    <V.FeatureRow
                      $light={light}
                      key={`${section.id}-${i}`}
                      data-detail-animate
                    >
                      <span className="number">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <Icon aria-hidden="true" />
                      <h3>{item}</h3>
                    </V.FeatureRow>
                  );
                })}
              </V.FeatureRows>
            ) : (
              <S.FeatureGrid>
                {(content.items ?? []).map((item, i) => {
                  const Icon = featureIcons[i % featureIcons.length];
                  return (
                    <S.FeatureCard
                      key={`${section.id}-${i}`}
                      data-detail-animate
                    >
                      <Icon aria-hidden="true" />
                      <h3>{item}</h3>
                      <span>
                        {t("keyPoint")} · {String(i + 1).padStart(2, "0")}
                      </span>
                    </S.FeatureCard>
                  );
                })}
              </S.FeatureGrid>
            )}
          </>
        )}

        {section.type === "PROCESS" && (
          <>
            <S.ProcessHeading data-detail-animate>
              <div>
                <S.Label $light={light}>{eyebrow}</S.Label>
                <S.Title $light={light} id={`detail-title-${section.id}`}>
                  {section.title}
                </S.Title>
              </div>
              {content.description && (
                <S.Description $light>{content.description}</S.Description>
              )}
            </S.ProcessHeading>
            {layout === "timeline" ? (
              <V.ProcessTimeline>
                {(content.items ?? []).map((item, i) => (
                  <V.TimelineItem
                    key={`${section.id}-${i}`}
                    data-detail-animate
                  >
                    <span className="step">
                      {t("step", { number: String(i + 1).padStart(2, "0") })}
                    </span>
                    <h3>{item}</h3>
                  </V.TimelineItem>
                ))}
              </V.ProcessTimeline>
            ) : (
              <S.ProcessGrid>
                {(content.items ?? []).map((item, i) => {
                  const Icon = processIcons[i % processIcons.length];
                  return (
                    <S.ProcessItem
                      key={`${section.id}-${i}`}
                      data-detail-animate
                    >
                      <S.ProcessNumber>
                        {String(i + 1).padStart(2, "0")}
                      </S.ProcessNumber>
                      <S.ProcessDisc>
                        <Icon aria-hidden="true" />
                      </S.ProcessDisc>
                      <h3>{item}</h3>
                      <p>
                        {t("step", { number: String(i + 1).padStart(2, "0") })}
                      </p>
                    </S.ProcessItem>
                  );
                })}
              </S.ProcessGrid>
            )}
          </>
        )}

        {section.type === "GALLERY" && (
          <>
            <S.GalleryHeading data-detail-animate>
              <div>
                <S.Label $light={light}>{eyebrow}</S.Label>
                <S.Title $light={light} id={`detail-title-${section.id}`}>
                  {section.title}
                </S.Title>
              </div>
              {(content.images?.length ?? 0) > 1 && (
                <S.GalleryControls>
                  <button
                    type="button"
                    aria-label={t("previousImage")}
                    onClick={() => moveGallery(-1)}
                  >
                    <FiChevronLeft />
                  </button>
                  <button
                    type="button"
                    aria-label={t("nextImage")}
                    onClick={() => moveGallery(1)}
                  >
                    <FiChevronRight />
                  </button>
                </S.GalleryControls>
              )}
            </S.GalleryHeading>
            {content.description && (
              <S.Description
                $light={light}
                data-detail-animate
                style={{ marginBottom: 28 }}
              >
                {content.description}
              </S.Description>
            )}
            {(content.images?.length ?? 0) > 0 ? (
              <S.GalleryTrack ref={galleryRef} aria-label={t("galleryAria")}>
                {(content.images ?? []).map((img, i) => (
                  <S.GalleryCard key={`${section.id}-${i}`}>
                    <S.GalleryVisual>
                      <DetailImage
                        src={img.src}
                        alt={img.alt}
                        fill
                        sizes="(max-width:768px) 80vw, 36vw"
                      />
                    </S.GalleryVisual>
                    <figcaption>{img.alt}</figcaption>
                  </S.GalleryCard>
                ))}
              </S.GalleryTrack>
            ) : (
              <S.Description>{t("noImages")}</S.Description>
            )}
            <S.FinePrint $light={light}>
              {t("individualDisclaimer")}
            </S.FinePrint>
          </>
        )}

        {section.type === "FAQ" && (
          <S.FaqGrid>
            <div data-detail-animate>
              <S.Label $light={light}>{eyebrow}</S.Label>
              <S.Title $light={light} id={`detail-title-${section.id}`}>
                {section.title}
              </S.Title>
              {content.description && (
                <S.Description $light={light} style={{ marginTop: 23 }}>
                  {content.description}
                </S.Description>
              )}
            </div>
            <S.FaqAccordionArea data-detail-animate>
              {/* 기존 QnA 화면의 Accordion 동작과 디자인을 재사용. CMS 섹션 FAQ 데이터만 전달. */}
              <Accordion key={section.id}>
                {(content.faqs ?? []).map((faq, i) => {
                  const itemId = `${section.id}-faq-${i}`;
                  return (
                    <Accordion.Item key={itemId} id={itemId}>
                      <Accordion.Title>{faq.question}</Accordion.Title>
                      <Accordion.Content>{faq.answer}</Accordion.Content>
                    </Accordion.Item>
                  );
                })}
              </Accordion>
            </S.FaqAccordionArea>
          </S.FaqGrid>
        )}

        {section.type === "CTA" && (
          <S.CtaPanel data-detail-animate>
            <S.Label $light={light}>{eyebrow}</S.Label>
            <S.Title $light={light} id={`detail-title-${section.id}`}>
              {section.title}
            </S.Title>
            {content.description && (
              <S.Description $light={light}>
                {content.description}
              </S.Description>
            )}
            <S.CtaButton href={content.buttonHref ?? "/#site-footer-contact"}>
              {content.buttonLabel ?? t("contactConsultation")}{" "}
              <FiArrowRight aria-hidden="true" />
            </S.CtaButton>
          </S.CtaPanel>
        )}
      </S.Content>
    </S.EditorialSection>
  );
}
