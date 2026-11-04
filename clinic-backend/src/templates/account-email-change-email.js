"use strict";

function escapeHtml(v) {
  return String(v).replace(
    /[&<>"']/g,
    (c) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[c],
  );
}

function buildEmailChangeMessage({ confirmUrl }) {
  const raw =
    confirmUrl instanceof URL ? confirmUrl.toString() : String(confirmUrl);
  const link = new URL(raw);
  if (!["http:", "https:"].includes(link.protocol))
    throw new Error("확인 링크 URL이 올바르지 않습니다.");
  const url = escapeHtml(link.toString());

  return {
    subject: "[AHNS 성형외과] 이메일 주소 변경 인증",
    text: `AHNS 계정 이메일 변경 인증\n\n본인이 변경을 요청했다면 아래 링크에 접속하여 로그인 상태에서 변경을 확정해 주세요.\n${link.toString()}\n\n링크는 15분 동안 한 번만 사용할 수 있습니다. 본인이 요청하지 않았다면 이 메일을 무시하세요.`,
    html: `<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
<body style="margin:0;background:#f5f3ed;font-family:Arial,'Malgun Gothic',sans-serif;color:#294737">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;background:#f5f3ed"><tr><td align="center" style="padding:36px 14px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:590px;border-collapse:collapse;background:#fff">
<tr><td height="4" style="background:#b09f77;font-size:0"></td></tr>
<tr><td style="background:#203c2f;padding:36px 40px"><span style="font:34px Georgia,serif;color:#f7f5f0">AHNS<span style="color:#b09f77">.</span></span><p style="margin:12px 0 0;letter-spacing:3px;color:#d4d7c5;font-size:10px">PRIVATE AESTHETIC CLINIC</p></td></tr>
<tr><td style="padding:42px 40px 46px"><p style="color:#b09f77;font-size:11px;letter-spacing:2px">ACCOUNT SECURITY / EMAIL</p>
<h1 style="margin:16px 0;font-size:27px;font-weight:500;color:#294737">이메일 변경 인증</h1>
<p style="font-size:14px;line-height:1.9;color:#647768">새 이메일 주소에 대한 인증 요청이 접수되었습니다.<br>아래 버튼을 눌러 계정 설정 페이지에서 변경을 확정해 주세요.</p>
<p style="margin:32px 0"><a href="${url}" style="display:inline-block;background:#294737;color:#fff;text-decoration:none;font-size:13px;padding:16px 25px">이메일 변경 확인하기 &nbsp;→</a></p>
<p style="font-size:12px;color:#708374;line-height:1.8">인증 링크는 15분 동안 한 번만 사용할 수 있습니다.<br>본인이 요청하지 않았다면 메일을 무시해 주세요.</p>
<div style="margin-top:32px;padding-top:20px;border-top:1px solid #e7ebe3;font-size:11px;line-height:1.8;word-break:break-all"><a style="color:#456f59" href="${url}">${url}</a></div>
</td></tr><tr><td style="background:#eef1e9;padding:23px 40px;font-size:11px;color:#738477">AHNS · PRIVATE MEMBERSHIP<br>본 메일은 계정 보안 확인을 위해 자동으로 발송되었습니다.</td></tr>
</table></td></tr></table></body></html>`,
  };
}

module.exports = { buildEmailChangeMessage };
