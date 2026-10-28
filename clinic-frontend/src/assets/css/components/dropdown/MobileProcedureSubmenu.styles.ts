import styled from 'styled-components';

export const Root = styled.details`
  padding: 0 0 12px 38px;
  border-bottom: 1px solid rgba(118, 147, 122, 0.32);
  color: inherit;
`;

export const Toggle = styled.summary`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 11px 0;
  cursor: pointer;
  list-style: none;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.02em;
  opacity: 0.76;

  &::-webkit-details-marker {
    display: none;
  }

  span {
    display: inline-block;
    transition: transform 0.2s ease;
    font-size: 18px;
  }
`;

export const Items = styled.div`
  display: grid;
  gap: 0;
  padding: 2px 0 12px;
`;

export const ItemLink = styled.a`
  display: block;
  padding: 10px 0;
  text-decoration: none;
  color: inherit;
  font-size: 14px;
  font-weight: 400;
  letter-spacing: -0.02em;
  opacity: 0.88;

  &:hover {
    opacity: 1;
  }

  &:focus-visible {
    outline: 2px solid currentColor;
    outline-offset: 3px;
  }
`;
