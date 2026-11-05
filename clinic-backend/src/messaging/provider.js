"use strict";
// 고객에게 실제 전달되었는지는 별도의 전송결과 수신이 필요합니다.
// SDK의 성공 응답은 통신사/카카오에 '발송 요청 접수'를 의미합니다.
const EVENTS = ["CREATED", "RESCHEDULED", "CANCELLED", "REMINDER"];
function digits(phone) {
  return String(phone || "").replace(/[^0-9]/g, "");
}
function providerReady(channel) {
  const provider = (
    process.env.RESERVATION_MESSAGE_TRANSPORT || "disabled"
  ).toLowerCase();
  const shared =
    provider === "solapi" &&
    !!process.env.SOLAPI_API_KEY &&
    !!process.env.SOLAPI_API_SECRET &&
    !!digits(process.env.SOLAPI_FROM);
  if (!shared) return false;
  if (channel === "KAKAO")
    return (
      !!process.env.SOLAPI_KAKAO_PF_ID &&
      EVENTS.every((event) => !!process.env[`SOLAPI_KAKAO_TEMPLATE_${event}`])
    );
  return channel === "SMS";
}
function messageFor(event, reservation) {
  const when = `${reservation.SLOT_DATE} ${reservation.SLOT_TIME}`;
  switch (event) {
    case "CREATED":
      return `[안스성형외과] 방문예약이 확정되었습니다. 일시: ${when}. 예약 내역은 홈페이지에서 확인해 주세요.`;
    case "RESCHEDULED":
      return `[안스성형외과] 방문예약 일정이 변경되었습니다. 변경 일시: ${when}. 예약 내역을 확인해 주세요.`;
    case "CANCELLED":
      return `[안스성형외과] ${when} 방문예약이 취소되었습니다. 문의사항은 병원으로 연락해 주세요.`;
    case "REMINDER":
      return `[안스성형외과] 방문예약 안내: ${when} 방문 예정입니다. 방문이 어려우시면 홈페이지에서 미리 확인해 주세요.`;
    default:
      throw new Error("지원하지 않는 발송 유형");
  }
}
function variables(reservation) {
  return {
    "#{병원명}": "안스성형외과",
    "#{예약일}": String(reservation.SLOT_DATE),
    "#{예약시간}": String(reservation.SLOT_TIME),
  };
}
let singleton;
async function sendMessage(job, reservation) {
  if (!providerReady(job.CHANNEL)) {
    const error = new Error("발송 공급자 설정이 완료되지 않았습니다.");
    error.code = "CONFIG_MISSING";
    throw error;
  }
  const recipient = digits(reservation.CONTACT_PHONE);
  if (!/^01[016789][0-9]{7,8}$/.test(recipient)) {
    const error = new Error("수신 가능한 휴대전화 번호가 아닙니다.");
    error.code = "INVALID_PHONE";
    throw error;
  }
  if (!singleton) {
    // SOLAPI는 계정/SDK 설치 후에만 동적으로 불러와 기본 개발환경에서 크래시하지 않습니다.
    const { SolapiMessageService } = require("solapi");
    singleton = new SolapiMessageService(
      process.env.SOLAPI_API_KEY,
      process.env.SOLAPI_API_SECRET,
    );
  }
  const request = { to: recipient, from: digits(process.env.SOLAPI_FROM) };
  if (job.CHANNEL === "KAKAO") {
    request.kakaoOptions = {
      pfId: process.env.SOLAPI_KAKAO_PF_ID,
      templateId: process.env[`SOLAPI_KAKAO_TEMPLATE_${job.EVENT_TYPE}`],
      variables: variables(reservation),
      disableSms: true, // 임의의 SMS 대체 발송에 따른 이중 과금/오발송 방지
    };
  } else {
    request.text = messageFor(job.EVENT_TYPE, reservation);
  }
  const response = await singleton.send(request);
  if (!response || typeof response !== "object")
    throw new Error("공급자 응답을 확인할 수 없습니다.");
  if (
    Array.isArray(response.failedMessageList) &&
    response.failedMessageList.length > 0
  ) {
    const error = new Error("공급자가 메시지 등록을 거부했습니다.");
    error.code = "REJECTED";
    throw error;
  }
  return (
    String(
      response?.groupId ||
        response?.groupInfo?.groupId ||
        response?.group?.groupId ||
        "",
    ).slice(0, 100) || null
  );
}
module.exports = {
  EVENTS,
  digits,
  providerReady,
  messageFor,
  variables,
  sendMessage,
};
