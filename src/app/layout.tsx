import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FormataFácil - Editor ABNT",
  description: "Sistema para formatação de documentos acadêmicos nos padrões ABNT",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}