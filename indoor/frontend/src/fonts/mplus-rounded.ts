import localFont from "next/font/local";

export const mplusRounded = localFont({
  src: [
    {
      path: "./MPLUSRounded1c-Light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "./MPLUSRounded1c-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./MPLUSRounded1c-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "./MPLUSRounded1c-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "./MPLUSRounded1c-ExtraBold.ttf",
      weight: "800",
      style: "normal",
    },
  ],
  variable: "--font-mplus-rounded",
  display: "swap",
  fallback: [
    "system-ui",
    "-apple-system",
    "BlinkMacSystemFont",
    "Segoe UI",
    "Roboto",
    "Hiragino Sans",
    "Hiragino Kaku Gothic ProN",
    "Yu Gothic",
    "YuGothic",
    "Meiryo",
    "sans-serif",
  ],
});
