import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { getWebsiteSettings } from "@/lib/adminServices";
import LayoutWrapper from "./components/LayoutWrapper";
import { CurrencyProvider } from "@/context/CurrencyContext";
import { headers } from "next/headers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// ==========================
// ✅ Dynamic Metadata (favicon from DB)
// ==========================
export async function generateMetadata() {
  const res = await getWebsiteSettings();

  let settings = {};
  try {
    settings = JSON.parse(res?.plainsettings ?? "{}");
  } catch {
    settings = {};
  }

  const siteName = settings.siteName || "SMM Panel World's Cheapest & Best SMM Panel Services";
  const description =
    settings.metaDescription ||
    "Best SMM Panel for Instagram, YouTube, Facebook & Social Media Marketing services at cheapest prices.";

  const keywords =
    settings.metaKeywords ||
    "SMM Panel, Social Media Marketing Panel, Instagram Followers, YouTube Views, Cheapest SMM Panel";

  return {
    title: {
      default: siteName,
      template: `%s | ${siteName}`,
    },
    description,
    keywords,
    robots: "index, follow",
    openGraph: {
      title: siteName,
      description,
      type: "website",
      siteName,
    },
    twitter: {
      card: "summary_large_image",
      title: siteName,
      description,
    },
    icons: {
      icon: [
        {
          url: settings.favicon?.startsWith("data:")
            ? settings.favicon
            : `${settings.favicon || ""}`,
          sizes: "32x32",
        },
      ],
    },
  };
}


// ==========================
// Root Layout Component
// ==========================
export default async function RootLayout({ children }) {
  const res = await getWebsiteSettings();

  let settings = {};
  try {
    settings = JSON.parse(res?.plainsettings ?? "{}");
  } catch {
    settings = {};
  }

  const h = await headers();
  const referer = h.get("referer");

  let path = "/";
  if (referer) {
    try {
      path = new URL(referer).pathname;
    } catch {}
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <CurrencyProvider>
          <LayoutWrapper logo={settings.logo} siteName={settings.siteName}>
            {children}
          </LayoutWrapper>
        </CurrencyProvider>
      </body>
    </html>
  );
}
