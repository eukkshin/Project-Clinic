import styled, { css, keyframes, Keyframes } from "styled-components";

import {
  BoxShadow,
  CircleBtn,
  FlexBetween,
  FlexCenter,
  FlexColumn,
  FlexStart,
  FlexTopBetween,
  FlexWrap,
  LinearGradient,
  TransitionAll,
  Transparent,
} from "./Common.styles";

interface AdminSidebarProps {
  $isCollapsed: boolean;
}

export const AdminContainer = styled.div`
  display: flex;
  height: 100vh;
  overflow: hidden;
`;

export const AdminSidebar = styled.ul<AdminSidebarProps>`
  width: ${(props) => (props.$isCollapsed ? "6.5rem" : "14rem")};
  background-image: linear-gradient(135deg, #1b4d3e 0%, #3b7a57 100%);
  transition: all 0.4s ease-in-out;
  ${FlexColumn}
  min-height: 100vh;

  margin: 0;
  padding: 0;
  list-style: none;
  color: white;
  z-index: 100;
`;

export const AdminSidebarBrand = styled.div<AdminSidebarProps>`
  height: 4.375rem;
  ${FlexCenter}
  font-size: ${(props) => (props.$isCollapsed ? "1rem" : "1.2rem")};
  font-weight: 800;
  letter-spacing: 0.05rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  cursor: pointer;
`;

export const AdminLeftTitle = styled.h1`
  font-family: "Times New Roman", serif;
  font-size: 34px;
  font-weight: 900;
  color: #f4fbf7;
  text-shadow: 0 1px 2px rgba(255, 255, 255, 0.1);
  margin: 0;
`;

export const AdminNavItem = styled.li<AdminSidebarProps>`
  padding: 1rem 1.5rem;
  font-size: 0.85rem;
  font-weight: bold;
  cursor: pointer;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  ${TransitionAll}
  color: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: ${(props) => (props.$isCollapsed ? "center" : "flex-start")};
  gap: 0.8rem;

  span {
    display: inline-block;
    white-space: nowrap;
    overflow: hidden;

    opacity: ${(props) => (props.$isCollapsed ? 0 : 1)};
    width: ${(props) => (props.$isCollapsed ? "0" : "auto")};

    transition:
      opacity 0.2s ease-in-out,
      width 0.4s ease-in-out;
  }

  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
    color: #fff;
  }
`;

export const SidebarTogglerWrapper = styled.div`
  display: flex;
  justify-content: center;
  padding: 1rem;
  margin-top: auto;
`;

export const SidebarToggler = styled.button`
  ${CircleBtn}
  background-color: rgba(255, 255, 255, 0.2);
  ${FlexCenter}
  ${TransitionAll}

  &:hover {
    background-color: rgba(255, 255, 255, 0.3);
  }
`;

export const AdminContentWrapper = styled.div`
  ${FlexColumn}
  flex: 1;
  background-color: #f8f9fc;
  overflow-x: hidden;
`;

export const AdminTopBar = styled.nav`
  height: 4.375rem;
  background-color: #fff;
  ${FlexBetween}
  padding: 0 1.5rem;
  z-index: 10;
  box-shadow: 0px 8px 10px -6px rgba(0, 0, 0, 0.15);
`;

export const AdminMain = styled.main`
  flex: 1;
  padding: 1.5rem;
  overflow-y: auto;
`;

export const AdminTopbarBrand = styled.div`
  font-size: 1.5rem;
  color: #1b4d3e;
  font-weight: 800;
  letter-spacing: 0.05rem;
`;

export const AdminTopbarRight = styled.div`
  display: flex;
  align-items: center;
  gap: 1.2rem;
`;

export const AdminTopBarUser = styled.span`
  font-size: 0.9rem;
  color: #858796;
  font-weight: 600;
`;

export const AdminLogoutBtn = styled.button`
  ${Transparent}
  color: #858796;
  border: 1px solid #1b4d3e;
  ${FlexCenter}
  gap: 0.3rem;
  ${TransitionAll}

  &:hover {
    color: #fff;
    background-color: #246652;
    border-color: #246652;
  }
`;

export const DashboardContainer = styled.div`
  width: 100%;
`;

export const DashboardPageTitle = styled.h1`
  font-size: 1.5rem;
  color: #5a5c69;
  font-weight: 700;
  margin-bottom: 1.5rem;
`;

export const DashboardCardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;

  @media (max-width: 1400px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(1, 1fr);
  }
`;

export const DashboardSummaryCard = styled.div<{ $borderColor: string }>`
  ${FlexTopBetween}
  background-color: #fff;
  border-radius: 0.35rem;
  border-left: 0.25rem solid ${(props) => props.$borderColor};
  ${BoxShadow}
  padding: 1.25rem;
`;

export const DashboardCardInfo = styled.div`
  ${FlexColumn}
  gap: 0.2rem;
  flex: 1;
`;

export const DashboardCardLabel = styled.span<{ $textColor: string }>`
  font-size: 0.75rem;
  font-weight: 800;
  color: ${(props) => props.$textColor};
  text-transform: uppercase;
  margin-bottom: 0.2rem;
`;

export const DashboardCardMainValue = styled.span`
  font-size: 1.5rem;
  font-weight: bold;
  color: #5a5c69;
  margin-bottom: 0.8rem;
`;

export const DashboardCardSubGrid = styled.div`
  ${FlexWrap}
  gap: 0.8rem;
  font-size: 0.8rem;
  color: #858796;
  border-top: 1px solid #eaecf4;
  padding-top: 0.8rem;
  width: 100%;
`;

export const DashboardCardSubItem = styled.div`
  display: flex;
  gap: 0.3rem;

  strong {
    color: #5a5c69;
  }
`;

export const DashboardCardIconWrapper = styled.div`
  opacity: 0.8;
  margin-top: 0.5rem;
`;

export const DashboardBottomSection = styled.div`
  background-color: #fff;
  border-radius: 0.35rem;
  ${BoxShadow}
  border: 1px solid #e3e6f0;
  min-height: 300px;
  ${FlexCenter}
`;
