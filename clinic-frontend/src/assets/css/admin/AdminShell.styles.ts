"use client";

import Link from "next/link";
import styled from "styled-components";

export const Shell = styled.div`
  --ink: #22382d;
  --muted: #758578;
  --border: #e4e9e1;
  --brand: #244d36;
  --surface: #ffffff;
  --canvas: #f6f7f3;
  display: flex;
  height: 100dvh;
  min-height: 520px;
  overflow: hidden;
  background: var(--canvas);
  color: var(--ink);
  font-family: var(--ahns-body);

  *, *::before, *::after { box-sizing: border-box; }

  @media (max-width: 880px) { min-height: 0; }
`;

export const SidebarScrim = styled.button<{ $open: boolean }>`
  display: none;
  @media (max-width: 880px) {
    display: ${({ $open }) => ($open ? "block" : "none")};
    position: fixed;
    inset: 0;
    z-index: 79;
    border: 0;
    background: rgba(12, 29, 20, 0.48);
    cursor: pointer;
  }
`;

export const Sidebar = styled.aside<{ $collapsed: boolean; $mobileOpen: boolean }>`
  flex: 0 0 ${({ $collapsed }) => ($collapsed ? "78px" : "258px")};
  width: ${({ $collapsed }) => ($collapsed ? "78px" : "258px")};
  display: flex;
  flex-direction: column;
  height: 100%;
  min-width: 0;
  background: #18382b;
  color: #e8f0e5;
  border-right: 1px solid #315543;
  transition: flex-basis .16s ease, width .16s ease;
  position: relative;
  z-index: 80;

  @media (max-width: 880px) {
    position: fixed;
    inset: 0 auto 0 0;
    width: 272px;
    flex-basis: 272px;
    transform: translateX(${({ $mobileOpen }) => ($mobileOpen ? "0" : "-100%")});
    transition: transform .18s ease;
    box-shadow: ${({ $mobileOpen }) => ($mobileOpen ? "15px 0 45px rgba(0,0,0,.18)" : "none")};
  }
`;

export const Brand = styled(Link)<{ $collapsed: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: ${({ $collapsed }) => ($collapsed ? "22px 15px" : "23px 21px")};
  border-bottom: 1px solid rgba(224, 238, 221, .11);
  text-decoration: none;
  color: inherit;
  min-height: 89px;
  &:hover { color: #fff; }
  @media (max-width: 880px) { padding: 23px 21px; }
`;

export const BrandMark = styled.div`
  flex: 0 0 43px;
  width: 43px;
  height: 43px;
  border: 1px solid rgba(238,245,226,.42);
  border-radius: 13px;
  background: #335c43;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--ahns-display);
  font-size: 29px;
  line-height: 1;
  color: #f7f4e9;
`;

export const BrandText = styled.div`
  min-width: 0;
  strong { display:block; font-family: var(--ahns-display); font-size:20px; font-weight:600; letter-spacing:.035em; line-height:1.05; }
  small { display:block; margin-top:7px; letter-spacing:.16em; font-size:9px; color:#acc6b0; font-weight:650; }
`;

export const Navigation = styled.nav`
  padding: 13px 11px 20px;
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: auto;
  overscroll-behavior: contain;
  scrollbar-width: thin;
  scrollbar-color: #456450 transparent;
`;

export const NavigationGroup = styled.div`
  margin: 8px 0 20px;
`;

export const NavigationLabel = styled.div<{ $collapsed: boolean }>`
  padding: ${({ $collapsed }) => ($collapsed ? "10px 0" : "10px 13px")};
  font-size: 10px;
  letter-spacing: .15em;
  color: #8dab96;
  font-weight: 750;
  text-align: ${({ $collapsed }) => ($collapsed ? "center" : "left")};
  height: 36px;
`;

export const NavItem = styled(Link)<{ $active: boolean; $collapsed: boolean }>`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: ${({ $collapsed }) => ($collapsed ? "center" : "flex-start")};
  gap: 12px;
  min-height: 43px;
  padding: ${({ $collapsed }) => ($collapsed ? "9px" : "9px 13px")};
  margin: 2px 0;
  border-radius: 10px;
  background: ${({ $active }) => ($active ? "#e5eee2" : "transparent")};
  color: ${({ $active }) => ($active ? "#1e5135" : "#cbdace")};
  font-size: 12.5px;
  font-weight: ${({ $active }) => ($active ? 750 : 550)};
  text-decoration: none;
  white-space: nowrap;
  transition: background-color .12s ease, color .12s ease;
  svg { flex-shrink: 0; width:18px; height:18px; opacity:${({ $active }) => ($active ? 1 : .86)}; }
  &:hover { background:${({ $active }) => ($active ? "#e5eee2" : "rgba(241,249,235,.095)")}; color:${({ $active }) => ($active ? "#1e5135" : "#fff")}; }
  &:focus-visible { outline:2px solid #9ec8a7; outline-offset:-2px; }
`;

export const SidebarBottom = styled.div`
  border-top: 1px solid rgba(222,240,223,.12);
  padding: 15px 11px 16px;
`;

export const SidebarHint = styled.div`
  border-radius: 11px;
  background: rgba(255,255,255,.055);
  padding: 13px 12px;
  margin-bottom: 12px;
  strong { display:block; font-size:11px; color:#e5f2e4; }
  p { color:#9db8a3; font-size:10.5px; line-height:1.6; margin:7px 0 0; }
`;

export const CollapseButton = styled.button`
  width: 100%;
  min-height: 38px;
  display:flex;
  gap:9px;
  align-items:center;
  justify-content:center;
  background:rgba(255,255,255,.065);
  border:1px solid rgba(255,255,255,.11);
  border-radius:9px;
  color:#d5e4d7;
  font-size:11px;
  cursor:pointer;
  &:hover { background:rgba(255,255,255,.13); }
  &:focus-visible { outline:2px solid #a3c9ac; }
  @media (max-width: 880px) {display:none;}
`;

export const Workspace = styled.div`
  display:flex;
  flex-direction:column;
  flex:1 1 0;
  min-width:0;
  min-height:0;
  height:100%;
`;

export const Topbar = styled.header`
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:18px;
  height:74px;
  min-height:74px;
  padding:0 32px;
  background:#fff;
  border-bottom:1px solid var(--border);
  @media (max-width: 880px) { padding:0 17px; height:64px; min-height:64px; }
`;

export const TopbarLead = styled.div`
  min-width:0;
  display:flex;
  align-items:center;
  gap:15px;
`;

export const MobileMenuButton = styled.button`
  display:none;
  width:38px;
  height:38px;
  align-items:center;
  justify-content:center;
  border:1px solid #e1e8e0;
  border-radius:10px;
  background:#fff;
  color:#294a36;
  cursor:pointer;
  @media (max-width:880px) { display:flex; }
`;

export const TopbarTitle = styled.div`
  display:flex;
  flex-direction:column;
  gap:5px;
  min-width:0;
  strong { color:#243c2e; font-size:15px; letter-spacing:-.035em; font-weight:760; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  small { color:#7d9381; font-size:10px; font-weight:550; letter-spacing:.035em; }
`;

export const TopbarActions = styled.div`
  display:flex;
  align-items:center;
  gap:14px;
  @media (max-width:680px) {gap:7px;}
`;

export const SiteLink = styled(Link)`
  display:inline-flex;
  gap:7px;
  align-items:center;
  padding:8px 12px;
  border:1px solid #e1e8df;
  border-radius:9px;
  text-decoration:none;
  color:#48604d;
  font-size:11.5px;
  font-weight:700;
  &:hover {background:#f6f8f4;}
  @media (max-width:680px) {padding:8px; span{display:none;}}
`;

export const Operator = styled.div`
  display:flex;
  align-items:center;
  gap:9px;
  border-left:1px solid #e7ece6;
  padding-left:15px;
  @media (max-width:680px) {display:none;}
`;
export const OperatorAvatar = styled.div`
  width:32px;height:32px;border-radius:50%;
  display:flex;align-items:center;justify-content:center;
  background:#e3eee4;color:#315b3f;font-weight:760;font-size:12px;
`;
export const OperatorText = styled.div`
  strong {display:block;font-size:11.5px;color:#2c4534;}
  small {display:block;margin-top:2px;font-size:10px;color:#839487;}
`;

export const Logout = styled.button`
  display:inline-flex;
  align-items:center;
  justify-content:center;
  gap:6px;
  padding:9px 12px;
  border:1px solid #e2e8df;
  background:#fff;
  color:#5a7060;
  border-radius:9px;
  font-size:11.5px;
  font-weight:650;
  cursor:pointer;
  &:hover {background:#f4f7f3;color:#254934;}
  @media (max-width:680px) {padding:9px; span{display:none;}}
`;

export const Main = styled.main`
  flex:1 1 auto;
  overflow-x:hidden;
  overflow-y:auto;
  overscroll-behavior:contain;
  padding:32px clamp(21px, 3vw, 46px) 60px;
  background:
    linear-gradient(180deg,rgba(232,239,225,.65),rgba(246,247,243,0) 225px),
    #f6f7f3;
  scrollbar-color:#c7d2c7 transparent;
  scrollbar-width:thin;
  @media (max-width:880px) {padding:22px 15px 48px;}
`;
