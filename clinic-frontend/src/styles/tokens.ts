export const color = {
  brand: {
    ink: "#244535",
    primary: "#69826B",
    deep: "#1b4d3e",
    forest: "#246652",
    sage: "#3b7a57",
  },
  canvas: {
    cream: "#F5F2E9",
    admin: "#f8f9fc",
    white: "#ffffff",
  },
  admin: {
    ink: "#5a5c69",
    muted: "#858796",
    border: "#e3e6f0",
    primary: "#4e73df",
    primaryHover: "#2e59d9",
    primaryDeep: "#224abe",
  },
} as const;

export const shadow = {
  card: "0 0.15rem 1.75rem 0 rgba(58, 59, 69, 0.15)",
  text: "2px 2px 8px rgba(0, 0, 0, 0.5)",
} as const;

export const radius = {
  sm: "0.35rem",
  md: "10px",
  pill: "10rem",
  full: "50%",
} as const;

export const motion = {
  fast: "0.15s ease-in-out",
} as const;
