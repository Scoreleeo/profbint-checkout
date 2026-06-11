import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Checkout | Pro Football Intel",
  description:
    "Secure checkout foundation for Pro Football Intel premium football predictions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[#050816] text-white">
        <header className="fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-[#050816]/85 backdrop-blur">
          <nav className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4">
            <a href="/" className="text-sm font-black tracking-tight">
              Pro Football Intel Checkout
            </a>

            <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-zinc-300">
              <a className="transition hover:text-emerald-300" href="/unlock">
                Unlock Lookup
              </a>
              <a className="transition hover:text-emerald-300" href="/purchase">
                Purchase Details
              </a>
              <a
                className="transition hover:text-emerald-300"
                href="/unlock-history"
              >
                Unlock History
              </a>
              <a
                className="rounded-full border border-emerald-400/30 px-4 py-2 text-emerald-300 transition hover:bg-emerald-400/10"
                href="https://profbint.com"
              >
                Return to Pro Football Intel
              </a>
            </div>
          </nav>
        </header>

        <div className="pt-20">{children}</div>
      </body>
    </html>
  );
}