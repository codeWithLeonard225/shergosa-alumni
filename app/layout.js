import "./globals.css";
// app/layout.js

export const metadata = {
  title:
    "SHERGOSA – SOS Hermann Gmeiner Old Students' Association | Sierra Leone",
  description:
    "SHERGOSA (SOS Hermann Gmeiner Old Students' Association) is a registered alumni association in Sierra Leone dedicated to unity, empowerment, and community development among former SOS Hermann Gmeiner School students.",

  manifest: "/manifest.webmanifest",

  icons: {
    icon: [
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" }
    ],
    shortcut: "/icons/icon-192x192.png",
    apple: "/icons/icon-192x192.png"
  },

  keywords: [
    "SHERGOSA",
    "SOS Hermann Gmeiner Old Students Association",
    "SOS Hermann Gmeiner Alumni",
    "Alumni Association Sierra Leone",
    "Former SOS Students Sierra Leone",
    "Community Development Alumni",
    "Student Alumni Portal",
    "SHERGOSA Portal"
  ],

  authors: [{ name: "SOS Hermann Gmeiner Old Students' Association" }],
  creator: "SOS Hermann Gmeiner Old Students' Association",
  publisher: "SOS Hermann Gmeiner Old Students' Association",

  metadataBase: new URL("https://www.shergosa.org"), // update if different
  applicationName: "SHERGOSA Portal",
  classification: "Alumni / Community Association",

  robots: { index: true, follow: true },
  referrer: "strict-origin-when-cross-origin",

  alternates: {
    canonical: "https://www.shergosa.org"
  },

  openGraph: {
    title:
      "SHERGOSA – SOS Hermann Gmeiner Old Students' Association",
    description:
      "SHERGOSA unites former SOS Hermann Gmeiner School students to promote lifelong connections, mutual support, and community development in Sierra Leone.",
    url: "https://www.shergosa.org",
    siteName: "SHERGOSA",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/images/alumni-hero.jpg", // optional
        width: 1200,
        height: 630,
        alt: "SHERGOSA Alumni Community"
      }
    ]
  },

  twitter: {
    card: "summary_large_image",
    title: "SHERGOSA – SOS Hermann Gmeiner Old Students' Association",
    description:
      "The official digital platform for SOS Hermann Gmeiner Old Students' Association (SHERGOSA).",
    images: ["/images/alumni-hero.jpg"]
  }
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0ea5e9"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
