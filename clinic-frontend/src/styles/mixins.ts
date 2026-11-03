import { css } from "styled-components";

import { color, motion, radius, shadow } from "@/styles/tokens";

export const FlexCenter = css`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const InlineFlexCenter = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

export const FlexBetween = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const FlexColumn = css`
  display: flex;
  flex-direction: column;
`;

export const FlexEnd = css`
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

export const FlexStart = css`
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

export const BlueButtonTheme = css`
  background-color: ${color.admin.primary};
  color: ${color.canvas.white};
  border-radius: ${radius.pill};

  &:hover {
    background-color: ${color.admin.primaryHover};
  }
`;

export const LinearGradient = css`
  background-image: linear-gradient(
    180deg,
    ${color.admin.primary} 10%,
    ${color.admin.primaryDeep} 100%
  );
`;

export const BoxShadow = css`
  box-shadow: ${shadow.card};
`;

export const TextShadow = css`
  text-shadow: ${shadow.text};
`;

export const TransitionAll = css`
  transition: all ${motion.fast};
`;

export const ButtonBasic = css`
  width: 100%;
  padding: 0.75rem 1rem;
  font-size: 0.8rem;
  border-radius: ${radius.pill};
  font-weight: bold;
  cursor: pointer;
`;

export const TextCenter = css`
  text-align: center;
`;

export const TextLeft = css`
  text-align: left;
`;

export const TextRight = css`
  text-align: right;
`;


export const NoDrag = css`
-webkit-user-select: none; 
-moz-user-select: none;    
-ms-user-select: none;    
user-select: none;        
`;