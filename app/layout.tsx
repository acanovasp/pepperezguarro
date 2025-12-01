import type { Metadata } from "next";
import "./globals.css";
import MenuBelt from "@/components/menu/MenuBelt";
import SiteHeader from "@/components/ui/SiteHeader";
import { getProjects, getAboutInfo } from "@/lib/data";

// Enable ISR: Revalidate every 60 seconds
export const revalidate = 60;

export const metadata: Metadata = {
  title: "Pep Perez Guarro",
  description: "Pep Perez Guarro — photographer based between Paris and Barcelona.",
  openGraph: {
    title: "Pep Perez Guarro",
    description: "Pep Perez Guarro — photographer based between Paris and Barcelona.",
    type: "website",
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
  themeColor: '#ffffff',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const projects = await getProjects();
  const aboutInfo = await getAboutInfo();

  return (
    <html lang="en">
      <head>
        {/* Preconnect to Sanity CDN for faster image loading */}
        <link rel="preconnect" href="https://cdn.sanity.io" />
        <link rel="dns-prefetch" href="https://cdn.sanity.io" />
      </head>
      <body>
        <SiteHeader />
        <MenuBelt projects={projects} aboutInfo={aboutInfo} />
        {children}
      </body>
    </html>
  );
}
