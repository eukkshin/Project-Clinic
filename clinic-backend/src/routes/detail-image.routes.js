"use strict";

const express = require("express");
const multer = require("multer");
const sharp = require("sharp");
const crypto = require("node:crypto");
const fs = require("node:fs/promises");
const path = require("node:path");
const { allowOriginForWrite } = require("../auth/adminSession");

const MAX_FILE_BYTES = 8 * 1024 * 1024;
const MAX_PIXELS = 25_000_000;
const VALID_MIME = new Map([
  ["image/jpeg", "jpeg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
]);
const fileUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_BYTES, files: 1, fields: 0, parts: 1 },
  fileFilter(_req, file, done) {
    if (!VALID_MIME.has(file.mimetype)) {
      const err = new Error("JPG, PNG, WebP 이미지만 업로드할 수 있습니다.");
      err.status = 400;
      return done(err);
    }
    done(null, true);
  },
});

function publicOrigin() {
  // Client and Next.js must be able to load the resulting URL. Never derive it from Host header.
  const configured = process.env.PUBLIC_API_ORIGIN || "http://127.0.0.1:4000";
  const url = new URL(configured);
  if (
    !["http:", "https:"].includes(url.protocol) ||
    url.username ||
    url.password ||
    url.pathname !== "/" ||
    url.search ||
    url.hash
  ) {
    throw new Error(
      "PUBLIC_API_ORIGIN에 경로가 없는 HTTP(S) origin을 설정하세요.",
    );
  }
  if (process.env.NODE_ENV === "production" && url.protocol !== "https:") {
    throw new Error("운영 환경 PUBLIC_API_ORIGIN은 HTTPS로 설정해야 합니다.");
  }
  return url.origin;
}

/** Mounted at /api/admin/detail/images (POST /). Requires real server-side authentication. */
function createDetailImageRouter({ requireAdmin }) {
  if (typeof requireAdmin !== "function") {
    throw new Error(
      "이미지 업로드에는 실제 관리자 인증 미들웨어가 필요합니다.",
    );
  }
  const router = express.Router();
  router.use(requireAdmin);
  router.use(allowOriginForWrite);

  router.post("/", fileUpload.single("image"), async (req, res, next) => {
    try {
      if (!req.file || !req.file.buffer) {
        return res.status(400).json({
          success: false,
          message: "이미지 파일(image)이 필요합니다.",
        });
      }
      // Sharp actually decodes image bytes; mimetype/extension alone cannot be trusted.
      const image = sharp(req.file.buffer, {
        limitInputPixels: MAX_PIXELS,
        animated: false,
      });
      const meta = await image.metadata();
      if (
        !meta.width ||
        !meta.height ||
        meta.width * meta.height > MAX_PIXELS ||
        meta.format !== VALID_MIME.get(req.file.mimetype) ||
        (meta.pages || 1) > 1
      ) {
        return res.status(400).json({
          success: false,
          message: "지원하지 않는 이미지 형식 또는 크기입니다.",
        });
      }
      const origin = publicOrigin(); // validate configuration before writing any file
      const outputDir = path.resolve(
        __dirname,
        "../../public/images/detail-cms",
      );
      await fs.mkdir(outputDir, { recursive: true });
      const fileName = `${crypto.randomUUID()}.webp`;
      const outPath = path.join(outputDir, fileName);
      let result;
      try {
        result = await image
          .rotate() // honor EXIF orientation
          .resize({
            width: 2400,
            height: 2400,
            fit: "inside",
            withoutEnlargement: true,
          })
          .webp({ quality: 84, effort: 4 }) // metadata stripped by default
          .toFile(outPath);
      } catch (error) {
        await fs.unlink(outPath).catch(() => {});
        throw error;
      }
      const url = `${origin}/images/detail-cms/${fileName}`;
      return res.status(201).json({
        success: true,
        data: {
          url,
          fileName,
          width: result.width,
          height: result.height,
          bytes: result.size,
        },
      });
    } catch (error) {
      if (
        error.message &&
        /unsupported image|Input buffer contains unsupported|corrupt|image too large|pixel limit/i.test(
          error.message,
        )
      ) {
        return res.status(400).json({
          success: false,
          message: "이미지 파일이 손상되었거나 지원하지 않는 형식입니다.",
        });
      }
      return next(error);
    }
  });

  router.use((error, _req, res, next) => {
    if (res.headersSent) return next(error);
    if (error instanceof multer.MulterError) {
      return res.status(400).json({
        success: false,
        message:
          error.code === "LIMIT_FILE_SIZE"
            ? "이미지 용량은 8MB 이하여야 합니다."
            : "이미지는 한 번에 한 장씩 image 필드로 전송해 주세요.",
      });
    }
    if (error.status === 400) {
      return res.status(400).json({ success: false, message: error.message });
    }
    console.error("[Detail Image] 업로드 실패:", error);
    return res.status(500).json({
      success: false,
      message: "이미지 업로드 중 서버 오류가 발생했습니다.",
    });
  });
  return router;
}

module.exports = { createDetailImageRouter };
