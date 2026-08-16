import "./globals.css";

// Passthrough: quem emite <html>/<body> é app/[locale]/layout.tsx,
// que é onde o locale existe.
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
