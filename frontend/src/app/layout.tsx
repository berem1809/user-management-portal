import type { Metadata } from "next";
import { Providers } from "./providers";
import "./globals.css"; // We will clear this file of Tailwind in the next step

export const metadata: Metadata = {
  title: "User Management Portal",
  description: "A secure and modern user management portal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
