"use client";

import * as S from "@/assets/css/components/detail/DetailLayout.styles";
import DetailImage from "@/components/detail/DetailImage";

import type { DetailSectionData } from "@/types/detail";
interface Props {
  section: DetailSectionData;
  index: number;
}

export default function DetailSectionRenderer({ section, index }: Props) {
  const { content } = section;

  return (
    <S.Section
      id={`detail-${section.id}`}
      $alternate={index % 2 === 1}
      aria-labelledby={`detail-title-${section.id}`}
    >
      <S.SectionInner>
        <S.SectionEyebrow>
          {section.eyebrow ?? `SECTION ${String(index + 1).padStart(2, "0")}`}
        </S.SectionEyebrow>
        <S.SectionTitle id={`detail-title-${section.id}`}>
          {section.title}
        </S.SectionTitle>

        {(section.type === "INTRO" || section.type === "TEXT") && (
          <S.IntroGrid>
            <S.SectionDescription>{content.description}</S.SectionDescription>
            {content.imageUrl && (
              <S.IntroMedia>
                <DetailImage
                  src={content.imageUrl}
                  alt={content.imageAlt ?? ""}
                  fill
                  sizes="(max-width: 768px) 100vw, 40vw"
                  style={{ objectFit: "cover" }}
                />
              </S.IntroMedia>
            )}
          </S.IntroGrid>
        )}

        {section.type === "FEATURES" && (
          <S.FeatureGrid>
            {(content.items ?? []).map((item, itemIndex) => (
              <S.FeatureCard key={`${section.id}-${itemIndex}`}>
                <span>{String(itemIndex + 1).padStart(2, "0")}</span>
                {item}
              </S.FeatureCard>
            ))}
          </S.FeatureGrid>
        )}

        {section.type === "PROCESS" && (
          <S.ProcessList>
            {(content.items ?? []).map((item, itemIndex) => (
              <S.ProcessItem key={`${section.id}-${itemIndex}`}>
                <span>STEP {String(itemIndex + 1).padStart(2, "0")}</span>
                {item}
              </S.ProcessItem>
            ))}
          </S.ProcessList>
        )}

        {section.type === "GALLERY" && (
          <S.Gallery>
            {(content.images ?? []).map((item, itemIndex) => (
              <S.GalleryItem key={`${section.id}-${itemIndex}`}>
                <DetailImage
                  src={item.src}
                  alt={item.alt}
                  width={760}
                  height={570}
                />
                <figcaption>{item.alt}</figcaption>
              </S.GalleryItem>
            ))}
            {!content.images?.length && (
              <S.SectionDescription>
                등록된 이미지가 없습니다.
              </S.SectionDescription>
            )}
          </S.Gallery>
        )}

        {section.type === "FAQ" && (
          <S.FAQList>
            {(content.faqs ?? []).map((item, itemIndex) => (
              <S.FAQItem key={`${section.id}-${itemIndex}`}>
                <summary>{item.question}</summary>
                <p>{item.answer}</p>
              </S.FAQItem>
            ))}
          </S.FAQList>
        )}

        {section.type === "CTA" && (
          <>
            <S.SectionDescription>{content.description}</S.SectionDescription>
            <S.CtaLink href={content.buttonHref ?? "/#site-footer-contact"}>
              {content.buttonLabel ?? "상담 문의하기"} ↗
            </S.CtaLink>
          </>
        )}
      </S.SectionInner>
    </S.Section>
  );
}
