"use client";

import { useEffect, useMemo, useState } from 'react';

interface HangulTypingProps {
  text: string;
  speed?: number;
}

// 한글 초성 19개
const CHOSEONG = [
  "ㄱ",
  "ㄲ",
  "ㄴ",
  "ㄷ",
  "ㄸ",
  "ㄹ",
  "ㅁ",
  "ㅂ",
  "ㅃ",
  "ㅅ",
  "ㅆ",
  "ㅇ",
  "ㅈ",
  "ㅉ",
  "ㅊ",
  "ㅋ",
  "ㅌ",
  "ㅍ",
  "ㅎ",
];

// 한글을 자음 → 초성+중성 → 완성형으로 변환
function createTypingFrames(text: string): string[] {
  const frames: string[] = [];
  let completed = "";

  for (const char of Array.from(text)) {
    const code = char.codePointAt(0)!;

    // 완성형 한글 범위
    if (code >= 0xac00 && code <= 0xd7a3) {
      const offset = code - 0xac00;

      const cho = Math.floor(offset / 588);
      const jung = Math.floor((offset % 588) / 28);
      const jong = offset % 28;

      // 초성 출력
      frames.push(completed + CHOSEONG[cho]);

      // 초성 + 중성 출력
      const syllable = String.fromCharCode(0xac00 + cho * 588 + jung * 28);

      frames.push(completed + syllable);

      // 종성이 존재하면 완성형 출력
      if (jong !== 0) {
        frames.push(completed + char);
      }
    } else {
      // 영어, 공백, 특수문자
      frames.push(completed + char);
    }

    completed += char;
  }

  return frames;
}

export default function HangulTyping({ text, speed = 75 }: HangulTypingProps) {
  const [displayText, setDisplayText] = useState("");
  const [finished, setFinished] = useState(false);

  const frames = useMemo(() => createTypingFrames(text), [text]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplayText(text);
      setFinished(true);
      return;
    }

    let index = 0;

    setDisplayText("");
    setFinished(false);

    const interval = window.setInterval(() => {
      if (index >= frames.length) {
        window.clearInterval(interval);
        setFinished(true);
        return;
      }

      setDisplayText(frames[index]);
      index++;
    }, speed);

    return () => {
      window.clearInterval(interval);
    };
  }, [frames, speed, text]);

  return (
    <span
      aria-label={text}
      style={{
        position: "relative",
      }}
    >
      <span aria-hidden="true">{displayText}</span>

      {!finished && (
        <span
          aria-hidden="true"
          style={{
            display: "inline-block",
            width: "2px",
            height: "0.85em",
            marginLeft: "4px",
            background: "currentColor",
            verticalAlign: "-0.08em",
          }}
        />
      )}
    </span>
  );
}
