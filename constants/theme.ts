export const colors = {
  primary: "#0e179d",
  accent: "#6e56cf",
  btnBlue: "#1e40af",
  border: "#e5e5e5",
  muted: "#737373",
  footerBg: "rgba(191,193,222,0.27)",
  card: "#fbfcfe",
  background: "#ffffff",
  foreground: "#0a0a0a",
} as const;

export const spacing = {
  "2xs": 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
} as const;

export const radius = {
  sm: 4,
  md: 6,
  lg: 8,
} as const;

export const typography = {
  mini: { fontSize: 12, lineHeight: 16 },
  small: { fontSize: 14, lineHeight: 20 },
  regular: { fontSize: 16, lineHeight: 24 },
  large: { fontSize: 20, lineHeight: 28 },
  logo: { fontSize: 40, lineHeight: 48 },
} as const;
