import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import LanguageProvider from "./components/LanguageProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = "https://k18to21-election2.vercel.app";
const TITLE = "한국 대통령 선거 대시보드 | Korean Presidential Election Dashboard";
const DESCRIPTION =
  "18대~21대 한국 대통령 선거 결과 분석 대시보드 (2012–2025) · methodology, swing, counterfactuals, anomaly detection, bilingual.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  applicationName: "Electoral Insights Hub",
  authors: [{ name: "Electoral Insights" }],
  keywords: [
    "Korea",
    "presidential election",
    "대통령선거",
    "18대",
    "19대",
    "20대",
    "21대",
    "swing analysis",
    "counterfactual",
    "K-value",
    "재확인표",
    "NEC",
    "중앙선거관리위원회",
  ],
  alternates: {
    canonical: "/",
    languages: {
      ko: "/?lang=ko",
      en: "/?lang=en",
    },
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    alternateLocale: ["en_US"],
    url: SITE_URL,
    siteName: "Electoral Insights Hub",
    title: TITLE,
    description: DESCRIPTION,
    images: [
      {
        url: "/images/major_party_vote_share.png",
        width: 1200,
        height: 630,
        alt: "Korean Presidential Election vote share (18th–21st)",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/images/major_party_vote_share.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Dataset",
  name: "Korean Presidential Elections 18th–21st (2012–2025)",
  description: DESCRIPTION,
  url: SITE_URL,
  creator: { "@type": "Organization", name: "Electoral Insights Hub" },
  spatialCoverage: { "@type": "Country", name: "Republic of Korea" },
  temporalCoverage: "2012/2025",
  license: "https://creativecommons.org/licenses/by/4.0/",
  isBasedOn: "https://www.nec.go.kr",
  variableMeasured: [
    "Total votes",
    "Turnout rate",
    "Two-block vote share",
    "K-value (R2/R1)",
    "Regional swing",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
        />
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
