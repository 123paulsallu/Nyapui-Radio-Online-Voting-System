import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const argentum = localFont({
  src: [
    {
      path: "../public/fonts/argentum-sans/ArgentumSans-Light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../public/fonts/argentum-sans/ArgentumSans-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/argentum-sans/ArgentumSans-Medium.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/argentum-sans/ArgentumSans-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../public/fonts/argentum-sans/ArgentumSans-Bold.otf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-argentum",
});

const sequel = localFont({
  src: [
    {
      path: "../public/fonts/Sequel100 Font Family (1)/Sequel100Wide-55.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/Sequel100 Font Family (1)/Sequel100Wide-65.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/Sequel100 Font Family (1)/Sequel100Wide-75.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../public/fonts/Sequel100 Font Family (1)/Sequel100Wide-85.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-sequel",
});

export const metadata: Metadata = {
  title: "Nyapui Radio Online Voting System | Admin",
  description: "Nyapui Radio Online Voting System | Admin",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${argentum.variable} ${sequel.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
