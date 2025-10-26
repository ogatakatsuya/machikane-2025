import localFont from "next/font/local";

export const notoSansJP = localFont({
  src: [
    {
      path: "./NotoSansJP-Light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "./NotoSansJP-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./NotoSansJP-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "./NotoSansJP-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "./NotoSansJP-Black.woff2",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-noto-sans-jp",
  display: "swap",
});
