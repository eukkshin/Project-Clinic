"use client";

import { createGlobalStyle } from "styled-components";

import * as S from "@/assets/css/admin/Admin.style";

/**
 * Ahn's Admin UI: static, high-readability management interface.
 * Scoped strictly to the admin shell so the public storefront is unaffected.
 */
export const AdminPolish = createGlobalStyle`
  .ahns-admin-shell {
    --admin-primary: #24543f;
    --admin-primary-hover: #1b4433;
    --admin-ink: #26392f;
    --admin-muted: #6c7f73;
    --admin-border: #e2eae4;
    --admin-surface: #ffffff;
    --admin-page: #f4f7f4;
    background: var(--admin-page);
    color: var(--admin-ink);
    font-family: Pretendard, "Noto Sans KR", -apple-system, BlinkMacSystemFont,
      "Segoe UI", sans-serif;
    min-height: 100dvh;
  }

  .ahns-admin-shell *,
  .ahns-admin-shell *::before,
  .ahns-admin-shell *::after { box-sizing: border-box; }

  .ahns-admin-shell [data-admin-sidebar] {
    background: #193B2E;
    border-right: 1px solid rgba(255,255,255,.08);
    color: #DBE8DE;
    scrollbar-color: rgba(213,234,218,.2) transparent;
    scrollbar-width: thin;
  }

  .ahns-admin-shell [data-admin-brand] {
    color: #F5F8F1;
    font-weight: 750;
    letter-spacing: -.03em;
    border-bottom: 1px solid rgba(255,255,255,.12);
  }

  .ahns-admin-shell [data-admin-group-label] {
    margin: 17px 16px 7px;
    padding-left: 11px;
    font-size: 10px;
    font-weight: 750;
    letter-spacing: .13em;
    color: #9BB4A4;
    white-space: nowrap;
  }
  .ahns-admin-shell [data-admin-group-label][data-hidden="true"] { display: none; }

  .ahns-admin-shell [data-admin-nav] {
    display: flex;
    align-items: center;
    gap: 11px;
    color: #C6D8CB;
    border-radius: 9px;
    min-height: 42px;
    border: 1px solid transparent;
    font-size: 13px;
    font-weight: 550;
    transition: background-color .12s ease, color .12s ease;
    text-decoration: none;
    outline-offset: -3px;
  }
  .ahns-admin-shell [data-admin-nav] svg { flex-shrink: 0; opacity: .85; }
  .ahns-admin-shell [data-admin-nav]:hover {
    background: rgba(245,255,248,.09);
    color: #fff;
  }
  .ahns-admin-shell [data-admin-nav][data-active="true"] {
    background: #E7F0E8;
    color: #204531;
    font-weight: 750;
    border-color: rgba(255,255,255,.3);
  }
  .ahns-admin-shell [data-admin-nav][data-active="true"] svg { opacity: 1; }
  .ahns-admin-shell [data-admin-nav]:focus-visible,
  .ahns-admin-shell button:focus-visible,
  .ahns-admin-shell a:focus-visible {
    outline: 2px solid #7EB493;
    outline-offset: 2px;
  }

  .ahns-admin-shell [data-admin-topbar] {
    background: rgba(255,255,255,.98);
    border-bottom: 1px solid var(--admin-border);
    color: var(--admin-ink);
    box-shadow: none;
  }
  .ahns-admin-shell [data-admin-topbar] [data-admin-topbar-title] {
    color: #2D4939;
    font-weight: 730;
    letter-spacing: -.025em;
  }
  .ahns-admin-shell [data-admin-topbar] [data-admin-user] {
    color: var(--admin-muted);
    font-size: 12px;
    font-weight: 600;
  }
  .ahns-admin-shell [data-admin-main] {
    flex: 1;
    min-width: 0;
    background: var(--admin-page);
    padding: clamp(20px, 2.5vw, 36px);
  }

  .ahns-admin-shell [data-admin-main] h1 {
    color: var(--admin-ink);
    letter-spacing: -.045em;
    font-size: clamp(22px, 2vw, 26px);
    font-weight: 750;
  }
  .ahns-admin-shell [data-admin-main] h2,
  .ahns-admin-shell [data-admin-main] h3,
  .ahns-admin-shell [data-admin-main] h6 {
    color: #2D4939;
    letter-spacing: -.025em;
  }

  /* Shared surface components across all fourteen admin screens. */

  .ahns-admin-shell ${S.SummaryCard},
  .ahns-admin-shell ${S.ChartCard},
  .ahns-admin-shell ${S.BoardCard},
  .ahns-admin-shell ${S.BoardLeftColumn},
  .ahns-admin-shell ${S.BoardRightColumn},
  .ahns-admin-shell ${S.ConsultFilterCard},
  .ahns-admin-shell ${S.ConsultTableCard},
  .ahns-admin-shell ${S.EventLeftColumn},
  .ahns-admin-shell ${S.EventRightColumn},
  .ahns-admin-shell ${S.RankEventCard},
  .ahns-admin-shell ${S.FooterCard},
  .ahns-admin-shell ${S.SetNavCard},
  .ahns-admin-shell ${S.NewsLeftColumn},
  .ahns-admin-shell ${S.NewsCard},
  .ahns-admin-shell ${S.PopLeftColumn},
  .ahns-admin-shell ${S.PopCard},
  .ahns-admin-shell ${S.AdminSafetyCard},
  .ahns-admin-shell ${S.AdminSafetyLeftColumn},
  .ahns-admin-shell ${S.AdminSafetyRightColumn},
  .ahns-admin-shell ${S.SelfLeftColumn},
  .ahns-admin-shell ${S.SelfCard},
  .ahns-admin-shell ${S.ToneSettingsCard},
  .ahns-admin-shell ${S.UserFilterCard},
  .ahns-admin-shell ${S.UserTableCard},
  .ahns-admin-shell ${S.AdminVlogCard},
  .ahns-admin-shell ${S.AdminVlogLeftColumn},
  .ahns-admin-shell ${S.AdminVlogRightColumn} {
    background: #fff;
    border: 1px solid #E3EAE4;
    border-radius: 12px;
    box-shadow: 0 2px 12px rgba(24, 58, 40, .04);
  }

  .ahns-admin-shell ${S.ChartHeader},
  .ahns-admin-shell ${S.BoardCardHeader},
  .ahns-admin-shell ${S.ConsultCardHeader},
  .ahns-admin-shell ${S.EventCardHeader},
  .ahns-admin-shell ${S.FooterCardHeader},
  .ahns-admin-shell ${S.SetNavCardHeader},
  .ahns-admin-shell ${S.NewsCardHeader},
  .ahns-admin-shell ${S.PopCardHeader},
  .ahns-admin-shell ${S.AdminSafetyCardHeader},
  .ahns-admin-shell ${S.SelfCardHeader},
  .ahns-admin-shell ${S.ToneCardHeader},
  .ahns-admin-shell ${S.UserCardHeader},
  .ahns-admin-shell ${S.AdminVlogCardHeader} {
    background: #FCFDFC;
    color: #2C4C38;
    border-bottom: 1px solid #E8EEE9;
  }

  .ahns-admin-shell ${S.BoardSaveButton},
  .ahns-admin-shell ${S.ConsultSearchButton},
  .ahns-admin-shell ${S.EventSaveButton},
  .ahns-admin-shell ${S.FooterSaveButton},
  .ahns-admin-shell ${S.SetNavSaveButton},
  .ahns-admin-shell ${S.NewsSaveButton},
  .ahns-admin-shell ${S.PopSaveButton},
  .ahns-admin-shell ${S.AdminSafetySaveButton},
  .ahns-admin-shell ${S.SelfSaveButton},
  .ahns-admin-shell ${S.ToneSaveButton},
  .ahns-admin-shell ${S.UserSearchButton},
  .ahns-admin-shell ${S.AdminVlogSaveButton} {
    background: #285B44;
    border: 1px solid #285B44;
    border-radius: 8px;
    color: #fff;
    min-height: 40px;
    font-size: 13px;
  }

  .ahns-admin-shell ${S.BoardAddButton},
  .ahns-admin-shell ${S.EventAddButton},
  .ahns-admin-shell ${S.FooterAddButton},
  .ahns-admin-shell ${S.NavAddButton},
  .ahns-admin-shell ${S.NewsAddButton},
  .ahns-admin-shell ${S.PopAddButton},
  .ahns-admin-shell ${S.AdminSafetyAddButton},
  .ahns-admin-shell ${S.SelfAddButton},
  .ahns-admin-shell ${S.AdminVlogAddButton} {
    background: #F0F6F1;
    border: 1px solid #CEDFD1;
    border-radius: 8px;
    color: #285B44;
    font-size: 13px;
  }

  .ahns-admin-shell [data-admin-main] :is(button, a):active {
    /* Operational UIs should not bounce or translate during clicks. */
    transform: none;
  }

  /* Long-form lists: clean white surfaces with low-contrast borders. */
  .ahns-admin-shell [data-admin-main] table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    background: #fff;
    font-size: 13px;
    line-height: 1.55;
    font-variant-numeric: tabular-nums;
  }
  .ahns-admin-shell [data-admin-main] table thead th {
    background: #F6F8F6;
    color: #526459;
    font-size: 12px;
    font-weight: 720;
    letter-spacing: .005em;
    padding: 13px 14px;
    border-bottom: 1px solid #DFE7E0;
    white-space: nowrap;
    text-align: left;
  }
  .ahns-admin-shell [data-admin-main] table tbody td {
    background: #fff;
    color: #33443B;
    padding: 13px 14px;
    border-bottom: 1px solid #EEF1EE;
    vertical-align: middle;
  }
  .ahns-admin-shell [data-admin-main] table tbody tr:last-child td { border-bottom: 0; }
  .ahns-admin-shell [data-admin-main] table tbody tr:hover td { background: #FAFCFA; }
  .ahns-admin-shell [data-admin-main] table tbody td strong {
    color: #243A2C;
    font-weight: 720;
  }

  /* Only plain text inputs: do not tamper with checkbox/radio/file or color swatches. */
  .ahns-admin-shell [data-admin-main] :is(
    input[type="text"], input[type="search"], input[type="email"],
    input[type="password"], input[type="tel"], input[type="number"],
    input[type="url"], input[type="date"], input:not([type]),
    textarea, select
  ) {
    background: #FFF;
    color: #2E4035;
    border: 1px solid #D8E2DA;
    border-radius: 9px;
    min-height: 42px;
    font-size: 13px;
    box-shadow: none;
    transition: border-color .12s ease, box-shadow .12s ease;
  }
  .ahns-admin-shell [data-admin-main] textarea { min-height: 96px; line-height: 1.6; }
  .ahns-admin-shell [data-admin-main] :is(input,textarea)::placeholder { color: #91A198; }
  .ahns-admin-shell [data-admin-main] :is(input,textarea,select):focus-visible {
    outline: none;
    border-color: #54836A;
    box-shadow: 0 0 0 3px rgba(62,119,85,.12);
  }
  .ahns-admin-shell [data-admin-main] :is(input,textarea,select):disabled {
    background: #F5F7F5;
    color: #7E8C82;
    cursor: not-allowed;
  }
  .ahns-admin-shell [data-admin-main] :is(input[type="checkbox"],input[type="radio"]) {
    accent-color: #286447;
  }

  .ahns-admin-shell [data-admin-main] button {
    font-family: inherit;
    font-weight: 650;
    transition: background-color .12s ease, border-color .12s ease, color .12s ease;
  }
  .ahns-admin-shell [data-admin-main] button:disabled { opacity: .5; cursor: not-allowed; }
  .ahns-admin-shell [data-admin-main] :is(label,legend) { line-height: 1.5; }

  /* Turn off unnecessary movement in an operations UI. */
  @media (prefers-reduced-motion: reduce) {
    .ahns-admin-shell *, .ahns-admin-shell *::before, .ahns-admin-shell *::after {
      animation-duration: .01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: .01ms !important;
      scroll-behavior: auto !important;
    }
  }

  @media (max-width: 768px) {
    .ahns-admin-shell [data-admin-main] { padding: 16px; }
    .ahns-admin-shell [data-admin-topbar] [data-admin-topbar-title] { font-size: 13px; }
    .ahns-admin-shell [data-admin-topbar] [data-admin-user] { display: none; }
    .ahns-admin-shell [data-admin-main] table { min-width: 620px; }
  }
`;
