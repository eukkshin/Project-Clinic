"use client";

import { useEffect, useRef, useState } from "react";
import { FaCheck, FaChevronDown, FaGlobe } from "react-icons/fa6";

import * as S from "@/components/dropdown/LanguageDropdown.styles";

export type Language = "KR" | "EN" | "JP" | "CN" | "TW";

interface LanguageDropdownProps {
  mobile?: boolean;
  defaultLanguage?: Language;
  onChange?: (language: Language) => void;
  transparent?: boolean;
}

const languages: { value: Language; label: string }[] = [
  { value: "KR", label: "한국어" },
  { value: "EN", label: "English" },
  { value: "JP", label: "日本語" },
  { value: "CN", label: "简体中文" },
  { value: "TW", label: "繁體中文" },
];

export default function LanguageDropdown({
  mobile = false,
  defaultLanguage = "KR",
  onChange,
  transparent = false,
}: LanguageDropdownProps) {
  const [open, setOpen] = useState(false);
  const [language, setLanguage] = useState<Language>(defaultLanguage);

  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const handleOutside = (event: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener("pointerdown", handleOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("pointerdown", handleOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  const selectLanguage = (value: Language) => {
    setLanguage(value);
    setOpen(false);
    onChange?.(value);
    triggerRef.current?.focus();
  };

  return (
    <S.Root ref={rootRef} $mobile={mobile}>
      <S.Trigger
        ref={triggerRef}
        type="button"
        $mobile={mobile}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`언어 선택, 현재 ${language}`}
        onClick={() => setOpen((prev) => !prev)}
      >
        <FaGlobe size={13} />
        {language}

        <S.Chevron $open={open}>
          <FaChevronDown size={10} />
        </S.Chevron>
      </S.Trigger>

      {open && (
        <S.GlassPanel
          $mobile={mobile}
          role="menu"
          aria-label="언어 선택"
          $transparent={transparent}
        >
          {languages.map((item) => (
            <S.LanguageItem
              key={item.value}
              type="button"
              role="menuitemradio"
              aria-checked={language === item.value}
              $active={language === item.value}
              onClick={() => selectLanguage(item.value)}
            >
              <span>{item.label}</span>

              {language === item.value ? (
                <S.Check>
                  <FaCheck />
                </S.Check>
              ) : (
                <em>{item.value}</em>
              )}
            </S.LanguageItem>
          ))}
        </S.GlassPanel>
      )}
    </S.Root>
  );
}
