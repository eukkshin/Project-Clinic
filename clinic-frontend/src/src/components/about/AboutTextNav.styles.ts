import styled from 'styled-components';

export const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: clamp(18px, 2.1vw, 36px);
  width: 100%;
  min-width: 0;
  color: #718070;
  font-size: 11px;
  font-weight: 400;
  letter-spacing: -0.025em;
  @media (max-width: 768px) {
    gap: 17px;
  }
`;

export const NavIdentity = styled.span`
  display: inline-flex;
  gap: 12px;
  align-items: center;
  flex: none;
  color: #294535;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.14em;
  span {
    color: #9eae9c;
    font-weight: 400;
  }
`;

export const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: clamp(16px, 1.6vw, 30px);
  min-width: 0;
  overflow-x: auto;
  overscroll-behavior-inline: contain;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
  @media (max-width: 768px) {
    padding-right: 24px;
    gap: 22px;
  }
`;

export const NavLink = styled.a<{ $active: boolean }>`
  position: relative;
  display: inline-block;
  flex: none;
  white-space: nowrap;
  color: ${({ $active }) => ($active ? "#203e2c" : "#748373")};
  font-weight: ${({ $active }) => ($active ? 600 : 400)};
  font-size: inherit;
  padding: 4px 0 9px;
  transition: color 250ms ease;
  &::after {
    content: "";
    position: absolute;
    height: 1px;
    left: 0;
    right: 0;
    bottom: 2px;
    background: currentColor;
    transform-origin: left center;
    transform: scaleX(${({ $active }) => ($active ? 1 : 0)});
    transition: transform 350ms cubic-bezier(0.22, 1, 0.36, 1);
  }
  &:hover,
  &:focus-visible {
    color: #1b3528;
  }
  &:hover::after,
  &:focus-visible::after {
    transform: scaleX(1);
  }
  &:focus-visible {
    outline: 1px solid #648569;
    outline-offset: 5px;
  }
`;
