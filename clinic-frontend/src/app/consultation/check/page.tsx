"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { FormEvent, useState } from "react";

import { lookupGuestConsult } from "@/lib/consultation/api";

import type { GuestConsultLookup } from "@/lib/consultation/api";

export default function GuestConsultLookupPage() {
  const t = useTranslations("Consultation");
  const [accessKey, setAccessKey] = useState("");
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<GuestConsultLookup | null>(null);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    setPending(true);
    setError("");
    setResult(null);
    try {
      setResult(await lookupGuestConsult(accessKey.trim()));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : t("submitFailed"));
    } finally {
      setPending(false);
    }
  }

  return (
    <main
      style={{
        minHeight: "75vh",
        padding: "100px 20px 80px",
        background: "#f7f8f4",
        color: "#25483b",
      }}
    >
      <section
        style={{
          width: "min(100%,620px)",
          margin: "auto",
          padding: "32px",
          background: "white",
          border: "1px solid #e1e9e3",
          borderRadius: 16,
        }}
      >
        <p style={{ letterSpacing: 3, fontSize: 11 }}>
          AHN&apos;S · CONSULTATION
        </p>
        <h1 style={{ fontSize: 26, margin: "12px 0 10px" }}>
          {t("lookupPageTitle")}
        </h1>
        <p
          style={{
            fontSize: 13,
            lineHeight: 1.7,
            color: "#6b8175",
            marginBottom: 22,
          }}
        >
          {t("lookupPageDescription")}
        </p>
        <form onSubmit={submit}>
          <label
            htmlFor="guest-consult-access-key"
            style={{ display: "block", fontSize: 13, marginBottom: 16 }}
          >
            {t("lookupCodeLabel")}
          </label>
          <input
            id="guest-consult-access-key"
            style={{
              width: "100%",
              padding: "13px 15px",
              border: "1px solid #c9d7cf",
              borderRadius: 10,
              fontSize: 14,
            }}
            type="password"
            name="accessKey"
            value={accessKey}
            onChange={(event) => setAccessKey(event.target.value)}
            maxLength={128}
            required
            autoComplete="off"
            spellCheck={false}
          />
          <small
            style={{
              display: "block",
              fontSize: 11,
              color: "#718777",
              marginTop: 6,
              marginBottom: 18,
            }}
          >
            {t("lookupCodeHint")}
          </small>
          <button
            type="submit"
            disabled={pending}
            style={{
              background: "#1b4d3e",
              color: "white",
              width: "100%",
              border: 0,
              borderRadius: 10,
              padding: 14,
              cursor: pending ? "wait" : "pointer",
            }}
          >
            {pending ? t("submitting") : t("lookupAnswers")}
          </button>
        </form>
        {error && (
          <p
            role="alert"
            style={{ color: "#b44e49", fontSize: 13, marginTop: 20 }}
          >
            {error}
          </p>
        )}
        {result && (
          <div
            role="status"
            style={{
              marginTop: 24,
              padding: 18,
              background: "#f0f7f2",
              borderRadius: 12,
            }}
          >
            <p style={{ fontSize: 13, marginBottom: 10 }}>
              {t("receiptNo")}:{" "}
              <strong style={{ wordBreak: "break-all" }}>
                {result.receiptNo}
              </strong>
            </p>
            <strong>
              {t("lookupStatus")}: {result.status}
            </strong>
            <p
              style={{ whiteSpace: "pre-wrap", lineHeight: 1.7, fontSize: 14 }}
            >
              {result.answer || t("lookupPending")}
            </p>
          </div>
        )}
        <Link
          href="/consultation"
          style={{
            display: "inline-block",
            marginTop: 24,
            color: "#38614e",
            fontSize: 13,
          }}
        >
          {t("lookupBack")}
        </Link>
      </section>
    </main>
  );
}
