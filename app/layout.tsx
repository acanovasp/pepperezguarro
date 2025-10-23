import type { Metadata } from "next";
import "./globals.css";
import MenuBelt from "@/components/menu/MenuBelt";
import SiteHeader from "@/components/ui/SiteHeader";
import SiteFooter from "@/components/ui/SiteFooter";
import { getProjects } from "@/lib/data";

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

  return (
    <html lang="en">
      <body>
        <SiteHeader />
        <SiteFooter />
        <MenuBelt projects={projects} />
        {children}
      </body>
    </html>
  );
}
