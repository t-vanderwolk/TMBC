import localFont from "next/font/local";
import { Caveat } from "next/font/google";

export const greatVibes = localFont({
  src: "../public/fonts/GreatVibes-Regular.ttf",
  variable: "--font-great-vibes",
  display: "swap",
});

export const nunito = localFont({
  src: "../public/fonts/Nunito-Regular.ttf",
  variable: "--font-nunito",
  display: "swap",
});

export const playfair = localFont({
  src: "../public/fonts/PlayfairDisplay-Regular.ttf",
  variable: "--font-playfair",
  display: "swap",
});

export const caveat = Caveat({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});
