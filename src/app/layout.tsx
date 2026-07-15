import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Solopreneur OS 2026",
  description:
    "Ecosistema base para operar automatizaciones técnicas y de contenido usando herramientas de frontera.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
