"use strict";

/**
 * AHNS password reset transactional email.
 * Table layout + inline CSS for major mail clients.
 * The token-bearing URL must only be supplied server-side.
 */
function escapeHtml(value) {
  return String(value).replace(
    /[&<>"']/g,
    (char) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[char],
  );
}

function buildPasswordResetEmail({ resetUrl }) {
  const rawUrl =
    resetUrl instanceof URL ? resetUrl.toString() : String(resetUrl ?? "");
  const parsedUrl = new URL(rawUrl);
  if (!["http:", "https:"].includes(parsedUrl.protocol)) {
    throw new Error("재설정 링크는 HTTP(S) URL이어야 합니다.");
  }
  const url = escapeHtml(parsedUrl.toString());

  const text = [
    "AHNS 성형외과 | 비밀번호 재설정",
    "",
    "계정의 비밀번호 재설정 요청이 접수되었습니다.",
    "아래 링크를 열어 새 비밀번호를 설정해 주세요.",
    "",
    parsedUrl.toString(),
    "",
    "이 링크는 발급 후 30분 동안 유효하며 한 번만 사용할 수 있습니다.",
    "본인이 요청하지 않았다면 이 메일을 무시해 주세요.",
    "",
    "AHNS 성형외과",
  ].join("\n");

  const html = `<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="color-scheme" content="light">
  <meta name="supported-color-schemes" content="light">
  <title>AHNS | 비밀번호 재설정 안내</title>
  <style>
    @media screen and (max-width: 620px) {
      .outer-pad { padding: 16px 12px !important; }
      .header-pad { padding: 32px 28px 30px !important; }
      .content-pad { padding: 38px 27px 34px !important; }
      .footer-pad { padding: 24px 27px !important; }
      .heading { font-size: 27px !important; }
      .detail-cell { display: block !important; width: 100% !important; box-sizing: border-box !important; }
      .detail-cell-first { border-right: 0 !important; border-bottom: 1px solid #e4e7de !important; }
      .cta { display: block !important; text-align: center !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background-color:#f5f3ee;color:#243b32;font-family:Arial,'Apple SD Gothic Neo','Malgun Gothic',sans-serif;-webkit-text-size-adjust:100%;">
  <div style="display:none;font-size:1px;line-height:1px;color:#f5f3ee;max-height:0;max-width:0;opacity:0;overflow:hidden;mso-hide:all;">
    AHNS 비밀번호 재설정 요청 안내 · 링크는 30분 동안 한 번만 사용 가능합니다.
  </div>
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;width:100%;background-color:#f5f3ee;">
    <tr>
      <td class="outer-pad" align="center" style="padding:48px 20px 46px;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;width:100%;max-width:600px;background-color:#ffffff;">
          <tr><td height="4" style="height:4px;background-color:#bdab83;font-size:0;line-height:0;">&nbsp;</td></tr>
          <tr>
            <td class="header-pad" style="padding:42px 48px 39px;background-color:#193d32;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;width:100%;">
                <tr>
                  <td style="font-family:Georgia,'Times New Roman',serif;font-size:39px;line-height:1.1;letter-spacing:2px;color:#f7f5ef;font-weight:normal;">AHNS<span style="color:#c9b88e;">.</span></td>
                </tr>
                <tr>
                  <td style="padding-top:12px;font-size:10px;line-height:1.6;letter-spacing:3px;color:#d3c5a7;font-weight:normal;">PRIVATE AESTHETIC CLINIC</td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td class="content-pad" style="padding:50px 48px 43px;background-color:#ffffff;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;width:100%;">
                <tr>
                  <td style="font-size:10px;line-height:1.6;letter-spacing:2.7px;color:#9c8b68;font-weight:bold;">ACCOUNT SECURITY &nbsp; / &nbsp; 01</td>
                </tr>
                <tr>
                  <td class="heading" style="padding-top:17px;font-size:31px;line-height:1.35;color:#203c30;font-weight:bold;letter-spacing:-1px;">비밀번호 재설정</td>
                </tr>
                <tr>
                  <td style="padding-top:16px;font-size:14px;line-height:1.95;color:#637369;letter-spacing:-0.2px;">
                    계정의 비밀번호 재설정 요청이 접수되었습니다.<br>
                    아래 버튼을 눌러 새로운 비밀번호를 설정해 주세요.
                  </td>
                </tr>
                <tr><td style="padding-top:32px;">
                  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;width:100%;background-color:#f7f8f4;border:1px solid #e4e7de;">
                    <tr>
                      <td class="detail-cell detail-cell-first" width="50%" style="width:50%;padding:20px 22px;border-right:1px solid #e4e7de;vertical-align:top;">
                        <div style="font-size:10px;line-height:1.5;letter-spacing:1.4px;color:#869389;">LINK VALIDITY</div>
                        <div style="padding-top:6px;font-size:16px;font-weight:bold;color:#24483a;line-height:1.5;">30분 유효</div>
                      </td>
                      <td class="detail-cell" width="50%" style="width:50%;padding:20px 22px;vertical-align:top;">
                        <div style="font-size:10px;line-height:1.5;letter-spacing:1.4px;color:#869389;">SECURITY</div>
                        <div style="padding-top:6px;font-size:16px;font-weight:bold;color:#24483a;line-height:1.5;">1회만 사용 가능</div>
                      </td>
                    </tr>
                  </table>
                </td></tr>
                <tr>
                  <td align="center" style="padding-top:35px;">
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:separate;">
                      <tr>
                        <td align="center" bgcolor="#244c3d" style="background-color:#244c3d;text-align:center;">
                          <a class="cta" href="${url}" target="_blank" rel="noopener noreferrer" style="display:inline-block;padding:17px 34px;color:#ffffff;background-color:#244c3d;font-size:14px;line-height:1.4;font-weight:bold;letter-spacing:0.1px;text-decoration:none;">새 비밀번호 설정하기 &nbsp; →</a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-top:16px;font-size:11px;line-height:1.8;color:#9a9f97;">이 링크는 발급 후 30분이 지나면 자동으로 만료됩니다.</td>
                </tr>
                <tr>
                  <td style="padding-top:38px;">
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;width:100%;border-top:1px solid #e8e9e2;">
                      <tr><td style="padding-top:22px;font-size:12px;line-height:1.85;color:#78847b;">
                        버튼이 열리지 않으면 아래 링크를 복사해 브라우저에 붙여 넣어 주세요.
                      </td></tr>
                      <tr><td style="padding-top:8px;font-size:11px;line-height:1.8;word-break:break-all;overflow-wrap:anywhere;">
                        <a href="${url}" target="_blank" rel="noopener noreferrer" style="color:#456d59;text-decoration:underline;word-break:break-all;">${url}</a>
                      </td></tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td class="footer-pad" style="padding:26px 48px 27px;background-color:#f0f2eb;border-top:1px solid #e2e6dc;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;width:100%;">
                <tr><td style="font-size:11px;font-weight:bold;letter-spacing:1px;color:#506959;">SECURITY NOTICE</td></tr>
                <tr><td style="padding-top:9px;font-size:12px;line-height:1.85;color:#6f8074;">
                  본인이 요청하지 않은 비밀번호 재설정 메일이라면<br>별도의 조치 없이 이 메일을 무시하셔도 됩니다.
                </td></tr>
              </table>
            </td>
          </tr>
        </table>
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;width:100%;max-width:600px;">
          <tr><td align="center" style="padding:26px 15px 0;color:#9b9f93;font-size:11px;line-height:1.8;letter-spacing:0.2px;">AHNS &nbsp; · &nbsp; PRIVATE AESTHETIC CLINIC<br>본 메일은 비밀번호 재설정을 위해 자동 발송되었습니다.</td></tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  return { html, text };
}

module.exports = { buildPasswordResetEmail };
