"use client";

import { createGlobalStyle } from "styled-components";

/**
 * Authored as an operational design system, scoped to the admin workspace only.
 * Existing page state, API calls, mutation handlers and imported styled components stay intact.
 */
export const AdminWorkspaceTheme = createGlobalStyle`
  .ahns-ops-main {
    --ahns-brand:#244f39;
    --ahns-brand-dark:#173c2a;
    --ahns-soft:#eff4ee;
    --ahns-ink:#24382d;
    --ahns-muted:#738277;
    --ahns-border:#e2e9df;
    --ahns-canvas:#f6f7f3;
    --ahns-white:#fff;
    color:var(--ahns-ink);
    font-size:13px;
    line-height:1.55;
    -webkit-font-smoothing:antialiased;
    min-width:0;
  }

  .ahns-ops-main * { box-sizing: border-box; }
  .ahns-ops-main > div, .ahns-ops-main > div > div { min-width:0; }

  /* Fully redesigned page hero / hierarchy for all 15 administrator pages. */
  .ahns-ops-main .admin-page-header {
    display:flex;
    align-items:center;
    justify-content:space-between;
    flex-wrap:wrap;
    column-gap:22px;
    row-gap:18px;
    margin:0 0 25px;
    padding:0 0 21px;
    border-bottom:1px solid #dce6da;
    min-height:90px;
  }
  .ahns-ops-main .admin-page-title-block { min-width:0; }
  .ahns-ops-main .admin-page-eyebrow {
    display:block;
    margin:0 0 7px;
    color:#6e9478;
    font-size:10px;
    letter-spacing:.16em;
    line-height:1.5;
    font-weight:800;
  }
  .ahns-ops-main .admin-page-title-block h1 {
    font-size:clamp(23px,2.2vw,29px);
    font-weight:780;
    color:#1d392a;
    margin:0;
    letter-spacing:-.055em;
    line-height:1.3;
    text-decoration:none;
  }
  .ahns-ops-main .admin-page-description {
    color:#7a897c;
    margin:7px 0 0;
    font-size:12px;
    font-weight:470;
    letter-spacing:-.025em;
    line-height:1.6;
  }

  /* A striking change from the former uniformly flat panels: generous white
     surfaces with top accents, clear title bands, strong editing/list hierarchy. */
  .ahns-ops-main .admin-panel,
  .ahns-ops-main .admin-filter-panel {
    min-width:0;
    background:#fff;
    border:1px solid #dfe7dd;
    border-radius:16px;
    box-shadow:0 6px 24px rgba(30,58,36,.035), 0 1px 2px rgba(30,58,36,.025);
    overflow:hidden;
  }
  .ahns-ops-main .admin-panel-head {
    background:#fff;
    padding:19px 22px;
    border-bottom:1px solid #e8ede5;
    position:relative;
  }
  .ahns-ops-main .admin-panel-head::before {
    content:"";
    position:absolute;
    width:3px;
    left:0;
    top:18px;
    bottom:18px;
    background:#8cac94;
    border-radius:0 3px 3px 0;
  }
  .ahns-ops-main .admin-panel-head h6,
  .ahns-ops-main .admin-panel-head h3,
  .ahns-ops-main .admin-panel-head h2 {
    margin:0;
    font-size:14px;
    line-height:1.4;
    font-weight:750;
    color:#294533;
    letter-spacing:-.027em;
  }
  .ahns-ops-main .admin-panel-body {
    padding:23px 23px 26px;
    color:#425447;
  }

  /* Editing experience vs. saved content: compact left workspace, roomy list. */
  .ahns-ops-main .admin-page-grid {
    display:grid;
    grid-template-columns:minmax(322px, .78fr) minmax(0, 1.45fr);
    gap:20px;
    align-items:start;
  }
  .ahns-ops-main .admin-editor-column,
  .ahns-ops-main .admin-record-column { min-width:0; width:100%; }
  .ahns-ops-main .admin-editor-column .admin-panel {
    box-shadow:0 5px 24px rgba(24,72,45,.045);
  }
  .ahns-ops-main .admin-editor-column .admin-panel-head { background:#f4f8f2; }
  .ahns-ops-main .admin-editor-column .admin-panel-head::before { background:#2f7350; }
  .ahns-ops-main .admin-record-column .admin-panel-head { background:#fff; }

  /* Settings panels may need multi-card layout and are not forced into an editor. */
  .ahns-ops-main .admin-settings-grid {
    display:grid;
    grid-template-columns:repeat(2,minmax(0,1fr));
    gap:19px;
    align-items:start;
  }
  .ahns-ops-main .admin-footer-grid { gap:19px; align-items:start; }

  /* Large, calm metrics using existing real values; no fake counts introduced. */
  .ahns-ops-main .admin-kpi-grid {
    display:grid;
    grid-template-columns:repeat(4,minmax(0,1fr));
    gap:16px;
    margin:0 0 21px;
  }
  .ahns-ops-main .admin-kpi-card {
    position:relative;
    min-width:0;
    border:1px solid #e3eae0;
    border-left:1px solid #e3eae0;
    border-radius:15px;
    background:#fff;
    box-shadow:0 4px 20px rgba(27,60,38,.035);
    padding:23px 22px 26px;
    overflow:hidden;
  }
  .ahns-ops-main .admin-kpi-card::before {
    content:"";
    position:absolute;
    left:0;
    top:0;
    right:0;
    height:3px;
    background:linear-gradient(90deg,#2a6344,#a6bda4);
  }
  .ahns-ops-main .admin-kpi-card:nth-child(2)::before {background:#8ba791;}
  .ahns-ops-main .admin-kpi-card:nth-child(3)::before {background:#bfaa81;}
  .ahns-ops-main .admin-kpi-card:nth-child(4)::before {background:#617c6b;}
  .ahns-ops-main .admin-kpi-label {
    color:#6d8270;
    font-size:11.5px;
    letter-spacing:-.015em;
    font-weight:650;
    text-transform:none;
    margin-bottom:13px;
  }
  .ahns-ops-main .admin-kpi-value {
    color:#1d3829;
    font-size:clamp(22px,2.1vw,31px);
    letter-spacing:-.06em;
    font-weight:800;
    font-variant-numeric:tabular-nums;
    line-height:1.2;
  }
  .ahns-ops-main .admin-kpi-icon {
    display:flex;
    width:46px;
    height:46px;
    border-radius:12px;
    align-items:center;
    justify-content:center;
    background:#ecf3ed;
    color:#42664c;
  }
  .ahns-ops-main .admin-kpi-icon svg {width:22px;height:22px;}
  .ahns-ops-main .admin-charts-grid {gap:19px; margin-bottom:19px;}
  .ahns-ops-main .admin-systems-grid {gap:19px;}
  .ahns-ops-main .admin-charts-grid .admin-panel-head {
    background:linear-gradient(90deg,#f2f7f1,#fff 60%);
  }
  /* Existing CSS bar charts keep their existing values and gradients. */
  .ahns-ops-main .admin-charts-grid [class*="BarChartContainer"] {
    border-color:#e7ede6;
  }

  /* Search/filter stage is visually separate from the results. */
  .ahns-ops-main .admin-filter-panel {
    display:flex;
    align-items:center;
    flex-wrap:wrap;
    gap:13px;
    padding:19px 21px;
    margin-bottom:19px;
    background:#fdfefd;
    border-color:#dce8dd;
  }
  .ahns-ops-main .admin-search-row {
    display:flex;
    align-items:center;
    flex-wrap:wrap;
    gap:10px;
    flex:1 1 auto;
    min-width:0;
  }

  /* All tables receive a proper operations-grid treatment, including
     columns, hover clarity and consistent density. */
  .ahns-ops-main .admin-table-scroll {
    width:100%;
    min-width:0;
    overflow-x:auto;
    padding:0;
    scrollbar-width:thin;
    scrollbar-color:#cddace transparent;
  }
  .ahns-ops-main .admin-data-table {
    width:100%;
    border-collapse:separate;
    border-spacing:0;
    background:#fff;
    text-align:left;
    color:#415348;
    font-size:12.5px;
    line-height:1.55;
    font-variant-numeric:tabular-nums;
  }
  .ahns-ops-main .admin-data-table thead th {
    color:#607365;
    background:#f4f7f3;
    border-bottom:1px solid #e1e9df;
    padding:14px 17px;
    text-align:left;
    white-space:nowrap;
    font-size:11px;
    letter-spacing:.015em;
    font-weight:750;
    box-shadow:none;
  }
  .ahns-ops-main .admin-data-table tbody td {
    color:#35473c;
    background:#fff;
    border-bottom:1px solid #edf0eb;
    padding:14px 17px;
    text-align:left;
    vertical-align:middle;
    font-size:12.5px;
  }
  .ahns-ops-main .admin-data-table tbody tr:last-child td {border-bottom:0;}
  .ahns-ops-main .admin-data-table tbody tr:hover td {background:#f7faf5;}
  .ahns-ops-main .admin-data-table strong {font-weight:750;color:#254331;}
  .ahns-ops-main .admin-data-table img {max-width:100%;object-fit:cover;}

  /* Forms: consistent label hierarchy and accessible focus without jump effects. */
  .ahns-ops-main .admin-form-field { margin-bottom:19px; }
  .ahns-ops-main label {color:#4e6254; font-size:12px; font-weight:650;}
  .ahns-ops-main .admin-form-field > label:first-child {display:block; margin-bottom:7px;}
  .ahns-ops-main input:not([type="file"]):not([type="checkbox"]):not([type="radio"]):not([type="color"]),
  .ahns-ops-main select,
  .ahns-ops-main textarea {
    background:#fff;
    border:1px solid #d9e3da;
    border-radius:9px;
    color:#263e2d;
    font-size:12.5px;
    min-height:43px;
    box-shadow:none;
    transition:border-color .12s ease, box-shadow .12s ease;
    max-width:100%;
  }
  .ahns-ops-main .admin-form-field input:not([type="file"]):not([type="checkbox"]):not([type="radio"]):not([type="color"]),
  .ahns-ops-main .admin-form-field select,
  .ahns-ops-main .admin-form-field textarea {width:100%;}
  .ahns-ops-main textarea {min-height:102px;line-height:1.6;}
  .ahns-ops-main input::placeholder,.ahns-ops-main textarea::placeholder {color:#98a69b;}
  .ahns-ops-main :is(input,textarea,select):focus-visible {
    outline:none;
    border-color:#648b70;
    box-shadow:0 0 0 3px rgba(80,130,90,.11);
  }
  .ahns-ops-main :is(input,textarea,select):disabled {background:#f4f5f1;color:#8b998f;}
  .ahns-ops-main input:is([type="radio"],[type="checkbox"]) {accent-color:#2b6845;}

  /* Human-scale actions, no bouncing / scaling / long transitions. */
  .ahns-ops-main button {font-family:inherit; cursor:pointer;}
  .ahns-ops-main .admin-primary-action {
    display:inline-flex;
    align-items:center;
    justify-content:center;
    gap:8px;
    min-height:43px;
    padding:10px 19px;
    border-radius:9px;
    background:#285c3e;
    color:#fff;
    border:1px solid #285c3e;
    box-shadow:none;
    font-size:12.5px;
    font-weight:750;
    white-space:nowrap;
    transition:background-color .12s ease,border-color .12s ease;
  }
  .ahns-ops-main .admin-primary-action:hover {
    background:#1d4830;
    border-color:#1d4830;
    color:#fff;
  }
  .ahns-ops-main .admin-outline-action {
    display:inline-flex;
    align-items:center;
    justify-content:center;
    gap:8px;
    min-height:42px;
    padding:10px 15px;
    border:1px dashed #adc9b3;
    border-radius:9px;
    background:#f0f6ef;
    color:#2b6442;
    font-size:12px;
    font-weight:720;
    box-shadow:none;
    transition:background-color .12s ease,border-color .12s ease;
  }
  .ahns-ops-main .admin-outline-action:hover {background:#e4f0e5;border-color:#7eac8a;color:#275b3b;}
  .ahns-ops-main .admin-delete-action {
    color:#b8615b;
    border:1px solid transparent;
    border-radius:9px;
    background:#fff;
    box-shadow:none;
    transition:background-color .12s ease,color .12s ease;
  }
  .ahns-ops-main .admin-delete-action:hover {color:#a33c36;background:#fff0ed;}
  .ahns-ops-main .admin-icon-action {border-radius:9px; transition:background-color .12s ease;}
  .ahns-ops-main .admin-icon-action:hover {background:#edf4ed;}
  .ahns-ops-main button:disabled {opacity:.52;cursor:not-allowed;}
  .ahns-ops-main :is(a,button):focus-visible {outline:2px solid #5b926b;outline-offset:2px;}

  .ahns-ops-main .admin-repeat-row {
    border:1px solid #e5ebe2;
    border-radius:10px;
    background:#f9fbf8;
  }

  /* Status and type badges are quiet but distinguishable. */
  .ahns-ops-main [class*="Badge"] {
    font-size:11px;
    letter-spacing:-.02em;
    font-weight:720;
  }

  @media (max-width:1440px) {
    .ahns-ops-main .admin-kpi-grid {grid-template-columns:repeat(2,minmax(0,1fr));}
    .ahns-ops-main .admin-page-grid {grid-template-columns:minmax(300px, .8fr) minmax(0, 1.2fr);}
  }
  @media (max-width:1180px) {
    .ahns-ops-main .admin-page-grid {grid-template-columns:minmax(0,1fr);}
    .ahns-ops-main .admin-page-grid .admin-editor-column {max-width:unset;}
    .ahns-ops-main .admin-settings-grid {grid-template-columns:minmax(0,1fr);}
  }
  @media (max-width:780px) {
    .ahns-ops-main .admin-page-header {align-items:flex-start;margin-bottom:17px;padding-bottom:17px;}
    .ahns-ops-main .admin-page-header > button {width:100%;}
    .ahns-ops-main .admin-kpi-grid {gap:10px;}
    .ahns-ops-main .admin-kpi-card {padding:16px 14px 18px;}
    .ahns-ops-main .admin-kpi-value {font-size:22px;}
    .ahns-ops-main .admin-panel-head {padding:15px 17px;}
    .ahns-ops-main .admin-panel-body {padding:18px 17px 21px;}
    .ahns-ops-main .admin-filter-panel {padding:16px 13px;}
    .ahns-ops-main .admin-data-table {min-width:610px;}
  }
  @media (max-width:460px) {
    .ahns-ops-main .admin-kpi-grid {grid-template-columns:repeat(2,minmax(0,1fr));}
    .ahns-ops-main .admin-page-eyebrow {font-size:9px;}
    .ahns-ops-main .admin-page-title-block h1 {font-size:23px;}
  }
  @media (prefers-reduced-motion:reduce) {
    .ahns-ops-shell *, .ahns-ops-shell *::before, .ahns-ops-shell *::after {
      scroll-behavior:auto!important;
      transition-duration:.01ms!important;
      animation-duration:.01ms!important;
      animation-iteration-count:1!important;
    }
  }
`;
