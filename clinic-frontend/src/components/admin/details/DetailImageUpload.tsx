"use client";

import { ChangeEvent, useRef, useState } from "react";
import { FiImage, FiUploadCloud } from "react-icons/fi";

import { detailApi, detailErrorMessage } from "@/lib/admin/detailApi";
import * as S from "@/components/admin/details/DetailImageUpload.styles";

type Props = {
  label: string;
  multiple?: boolean;
  disabled?: boolean;
  onUploading?: (value: boolean) => void;
  onUploaded: (images: { url: string; originalName: string }[]) => void;
};

const MAX_BYTES = 8 * 1024 * 1024;
const ACCEPTED = new Set(["image/jpeg", "image/png", "image/webp"]);

export default function DetailImageUpload({
  label,
  multiple = false,
  disabled = false,
  onUploading,
  onUploaded,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const onFiles = async (event: ChangeEvent<HTMLInputElement>) => {
    const input = event.currentTarget;
    const files = Array.from(input.files ?? []);
    input.value = ""; // allow reselecting the same file
    if (!files.length || uploading || disabled) return;
    if (files.length > (multiple ? 6 : 1)) {
      setMessage(
        multiple
          ? "한 번에 최대 6장까지 업로드할 수 있어요."
          : "이미지를 한 장만 선택해 주세요.",
      );
      return;
    }
    if (
      files.some((file) => !ACCEPTED.has(file.type) || file.size > MAX_BYTES)
    ) {
      setMessage(
        "JPG·PNG·WebP 파일만 선택할 수 있고, 각 파일은 8MB 이하여야 해요.",
      );
      return;
    }
    setUploading(true);
    onUploading?.(true);
    setMessage("이미지를 업로드하는 중...");
    const completed: { url: string; originalName: string }[] = [];
    try {
      // Sequential uploads to avoid many sharp conversions competing for memory.
      for (const file of files) {
        const uploaded = await detailApi.uploadImage(file);
        completed.push({ url: uploaded.url, originalName: file.name });
      }
      // URL is only placed in the editor form; existing Save button persists it to Oracle.
      onUploaded(completed);
      setMessage(
        `${completed.length}장 업로드 완료. 아래 저장 버튼을 눌러 DB에 반영하세요.`,
      );
    } catch (error) {
      if (completed.length) onUploaded(completed);
      setMessage(`업로드 실패: ${detailErrorMessage(error)}`);
    } finally {
      setUploading(false);
      onUploading?.(false);
    }
  };

  return (
    <S.UploadBlock>
      <S.UploadRow>
        <S.UploadButton
          type="button"
          disabled={disabled || uploading}
          onClick={() => inputRef.current?.click()}
        >
          {uploading ? <FiImage /> : <FiUploadCloud />}{" "}
          {uploading ? "업로드 중..." : label}
        </S.UploadButton>
        <S.UploadInfo>
          JPG · PNG · WebP / 각 8MB 이하{multiple ? " / 최대 6장" : ""}
        </S.UploadInfo>
      </S.UploadRow>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple={multiple}
        onChange={onFiles}
        disabled={disabled || uploading}
        aria-label={label}
        style={{
          position: "absolute",
          width: 1,
          height: 1,
          opacity: 0,
          pointerEvents: "none",
        }}
        tabIndex={-1}
      />
      {message && <S.UploadFeedback role="status">{message}</S.UploadFeedback>}
    </S.UploadBlock>
  );
}
