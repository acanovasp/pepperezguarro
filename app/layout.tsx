import type { Metadata } from "next";
import "./globals.css";
import MenuBelt from "@/components/menu/MenuBelt";
import { getProjects } from "@/lib/data";

export const metadata: Metadata = {
  title: "Pep Perez Guarro - Photography",
  description: "Photography portfolio of Pep Perez Guarro. Based between Paris and Barcelona, exploring timelessness, texture and authenticity.",
  openGraph: {
    title: "Pep Perez Guarro - Photography",
    description: "Photography portfolio showcasing projects from around the world",
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
        <MenuBelt projects={projects} />
        {children}
      </body>
    </html>
  );
}
