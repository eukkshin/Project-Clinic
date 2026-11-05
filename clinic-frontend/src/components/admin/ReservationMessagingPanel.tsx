"use client";
import { useCallback, useEffect, useState } from "react";
import { FiRefreshCw, FiSend } from "react-icons/fi";

import {
  getMessageHistory,
  getMessagingPolicy,
  retryMessage,
  updateMessagingPolicy,
} from "@/lib/reservation/message-api";

import * as S from "./AdminSettings.styles";
import * as M from "./ReservationMessaging.styles";

import type {
  MessagingPolicy,
  EditablePolicy,
  MessageHistory,
  MessageEvent,
  MessageState,
} from "@/lib/reservation/message-api";
const label: Record<MessageEvent, string> = {
  CREATED: "예약 완료",
  RESCHEDULED: "일정 변경",
  CANCELLED: "예약 취소",
  REMINDER: "방문 전 안내",
};
const states: Record<MessageState, string> = {
  QUEUED: "대기",
  PROCESSING: "발송 요청 중",
  ACCEPTED: "공급자 접수",
  FAILED: "실패",
  UNKNOWN: "결과 확인 필요",
  SKIPPED: "무효",
  CANCELLED: "취소",
};
const toEditable = (p: MessagingPolicy): EditablePolicy => ({
  enabled: p.enabled,
  channel: p.channel,
  sendCreated: p.sendCreated,
  sendRescheduled: p.sendRescheduled,
  sendCancelled: p.sendCancelled,
  sendReminder: p.sendReminder,
  reminderHours: p.reminderHours,
  startHour: p.startHour,
  endHour: p.endHour,
});

export default function ReservationMessagingPanel() {
  const [policy, setPolicy] = useState<MessagingPolicy | null>(null);
  const [draft, setDraft] = useState<EditablePolicy | null>(null);
  const [items, setItems] = useState<MessageHistory[]>([]);
  const [pending, setPending] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const load = useCallback(async () => {
    try {
      const [settings, history] = await Promise.all([
        getMessagingPolicy(),
        getMessageHistory(),
      ]);
      setPolicy(settings);
      setDraft(toEditable(settings));
      setItems(history);
      setError("");
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "알림 설정을 불러오지 못했습니다.",
      );
    }
  }, []);
  useEffect(() => {
    void load();
  }, [load]);
  function set<K extends keyof EditablePolicy>(
    key: K,
    value: EditablePolicy[K],
  ) {
    setDraft((prev) => (prev ? { ...prev, [key]: value } : prev));
    setNotice("");
  }
  async function save() {
    if (!draft || pending) return;
    setPending(true);
    setError("");
    setNotice("");
    try {
      const result = await updateMessagingPolicy(draft);
      setPolicy(result);
      setDraft(toEditable(result));
      setNotice(
        "서버 알림 정책을 저장했습니다. 변경한 안내 시간은 이후 생성·변경되는 예약부터 적용됩니다.",
      );
      void getMessageHistory()
        .then(setItems)
        .catch(() => {});
    } catch (e) {
      setError(e instanceof Error ? e.message : "설정을 저장하지 못했습니다.");
    } finally {
      setPending(false);
    }
  }
  async function retry(item: MessageHistory) {
    if (pending) return;
    let confirmed = false;
    if (item.state === "UNKNOWN") {
      confirmed = window.confirm(
        "공급자 관리 화면에서 실제 발송 여부를 확인했나요? 결과가 불명확한 요청을 다시 보내면 고객에게 중복 문자가 갈 수 있습니다. 확인했다면 계속 진행하세요.",
      );
      if (!confirmed) return;
    } else if (
      !window.confirm(`예약 #${item.reservationId} 안내를 재시도하시겠습니까?`)
    )
      return;
    setPending(true);
    setError("");
    setNotice("");
    try {
      await retryMessage(item.id, confirmed);
      setNotice(
        "재시도 대기열에 등록했습니다. 실제 전달 완료는 공급자 조회가 필요합니다.",
      );
      setItems(await getMessageHistory());
    } catch (e) {
      setError(e instanceof Error ? e.message : "재시도에 실패했습니다.");
    } finally {
      setPending(false);
    }
  }
  return (
    <S.Card>
      <S.CardHead>
        <FiSend size={19} />
        <div>
          <h2>예약 문자·알림톡 자동 발송</h2>
          <p>서버 공통 설정 · 운영 관리자 권한 필요 · 기본 발송 중지</p>
        </div>
      </S.CardHead>
      <S.Body>
        {!draft ? (
          <S.Notice>발송 정책을 불러오는 중입니다.</S.Notice>
        ) : (
          <>
            <S.Notice>
              연동 상태:{" "}
              {policy?.providerReady
                ? "SOLAPI 준비됨"
                : "외부 발송 서비스 미연결"}{" "}
              · 채널 {draft.channel}
            </S.Notice>
            <S.SettingRow>
              <S.RowText>
                <strong>자동 발송 활성화</strong>
                <small>
                  발신번호와 승인된 템플릿 등 서버 설정이 완료된 경우에만
                  활성화할 수 있습니다.
                </small>
              </S.RowText>
              <S.Toggle
                type="button"
                role="switch"
                aria-label="예약 자동 발송"
                aria-checked={draft.enabled}
                $on={draft.enabled}
                onClick={() => set("enabled", !draft.enabled)}
              />
            </S.SettingRow>
            <S.SettingRow>
              <S.RowText>
                <strong>발송 채널</strong>
                <small>알림톡은 승인된 템플릿이 있어야 발송됩니다.</small>
              </S.RowText>
              <S.Select
                value={draft.channel}
                onChange={(e) =>
                  set("channel", e.target.value as EditablePolicy["channel"])
                }
              >
                <option value="SMS">문자 SMS</option>
                <option value="KAKAO">카카오 알림톡</option>
              </S.Select>
            </S.SettingRow>
            {(
              [
                ["sendCreated", "예약 완료 알림"],
                ["sendRescheduled", "예약 변경 알림"],
                ["sendCancelled", "예약 취소 알림"],
                ["sendReminder", "방문 전 리마인더"],
              ] as const
            ).map(([key, title]) => (
              <S.SettingRow key={key}>
                <S.RowText>
                  <strong>{title}</strong>
                  <small>
                    해당 예약 이벤트가 발생했을 때 발송 대기열에 추가합니다.
                  </small>
                </S.RowText>
                <S.Toggle
                  type="button"
                  role="switch"
                  aria-label={title}
                  aria-checked={draft[key]}
                  $on={draft[key]}
                  onClick={() => set(key, !draft[key])}
                />
              </S.SettingRow>
            ))}
            <S.SettingRow>
              <S.RowText>
                <strong>방문 전 발송 시점</strong>
                <small>
                  예약 시각 기준. 이미 만들어진 대기열에는 소급 적용되지
                  않습니다.
                </small>
              </S.RowText>
              <S.Select
                value={draft.reminderHours}
                onChange={(e) =>
                  set(
                    "reminderHours",
                    Number(e.target.value) as EditablePolicy["reminderHours"],
                  )
                }
              >
                {[12, 24, 48, 72].map((hours) => (
                  <option key={hours} value={hours}>
                    {hours}시간 전
                  </option>
                ))}
              </S.Select>
            </S.SettingRow>
            <S.SettingRow>
              <S.RowText>
                <strong>문자 발송 시간 (한국시간)</strong>
                <small>
                  설정한 시간 밖에는 발송을 보류합니다. 종료 시각은 포함되지
                  않습니다.
                </small>
              </S.RowText>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <M.Hour
                  aria-label="발송 시작 시각"
                  value={draft.startHour}
                  onChange={(e) => set("startHour", Number(e.target.value))}
                >
                  {Array.from({ length: 23 }, (_, i) => (
                    <option key={i} value={i}>
                      {String(i).padStart(2, "0")}시
                    </option>
                  ))}
                </M.Hour>
                <span>~</span>
                <M.Hour
                  aria-label="발송 종료 시각"
                  value={draft.endHour}
                  onChange={(e) => set("endHour", Number(e.target.value))}
                >
                  {Array.from({ length: 24 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {String(i + 1).padStart(2, "0")}시
                    </option>
                  ))}
                </M.Hour>
              </div>
            </S.SettingRow>
            <M.Buttons>
              <S.Action
                type="button"
                disabled={pending}
                onClick={() => void load()}
              >
                <FiRefreshCw /> 새로고침
              </S.Action>
              <S.Action
                type="button"
                disabled={pending}
                onClick={() => void save()}
              >
                발송 설정 저장
              </S.Action>
            </M.Buttons>
          </>
        )}
        <S.Notice>
          공급자 접수는 실제 휴대전화 도착과 다릅니다. 전달 결과 확인은 공급자
          콘솔 또는 추후 웹훅 연동이 필요합니다.
        </S.Notice>
        {notice && <M.Feedback role="status">{notice}</M.Feedback>}
        {error && (
          <M.Feedback role="alert" $error>
            {error}
          </M.Feedback>
        )}
      </S.Body>
      <S.CardHead>
        <FiRefreshCw size={19} />
        <div>
          <h2>최근 발송 요청 이력</h2>
          <p>예약번호만 표시 · 고객 연락처 및 상담 내용 비공개</p>
        </div>
      </S.CardHead>
      <S.Body>
        <M.Buttons>
          <S.Action
            type="button"
            disabled={pending}
            onClick={() =>
              void getMessageHistory()
                .then(setItems)
                .catch((e) =>
                  setError(e instanceof Error ? e.message : "조회 실패"),
                )
            }
          >
            목록 새로고침
          </S.Action>
        </M.Buttons>
        <M.List>
          {items.length === 0 ? (
            <S.Notice>발송 대기 또는 처리된 요청이 없습니다.</S.Notice>
          ) : (
            items.map((item) => (
              <M.Record key={item.id}>
                <div className="headline">
                  <strong>
                    예약 #{item.reservationId} · {label[item.eventType]}
                  </strong>
                  <M.Status $state={item.state}>{states[item.state]}</M.Status>
                </div>
                <div className="meta">
                  <small>{item.slotKey}</small>
                  <small>{item.channel}</small>
                  <small>요청 {item.attempts}회</small>
                  <small>예정 {item.dueAtKst} KST</small>
                </div>
                {item.error && <small className="warning">{item.error}</small>}
                {item.state === "ACCEPTED" && (
                  <small>
                    공급자에서 요청 접수됨 · 실제 단말 도착 여부 미확인
                  </small>
                )}
                {(item.state === "FAILED" || item.state === "UNKNOWN") && (
                  <M.Buttons>
                    <S.Action
                      disabled={pending}
                      type="button"
                      onClick={() => void retry(item)}
                    >
                      확인 후 재시도
                    </S.Action>
                  </M.Buttons>
                )}
              </M.Record>
            ))
          )}
        </M.List>
      </S.Body>
    </S.Card>
  );
}
