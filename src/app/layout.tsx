import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Baba — Sorteio de times",
  description: "Organize a lista de atletas e sorteie os times do baba.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
