export const colors = {
  mauve: "#C8A1B4",
  blush: "#EAC9D1",
  ivory: "#FFFAF8",
  gold: "#D9C48E",
  charcoal: "#3E2F35",
};

export const fonts = {
  heading: "Great Vibes",
  body: "Nunito",
  subheading: "Playfair Display",
};

export const gradients = {
  mauveToBlush: [colors.mauve, colors.blush] as const,
};

export const theme = {
  colors,
  fonts,
  gradients,
  radii: {
    card: 24,
    button: 999,
  },
};

export type Theme = typeof theme;
