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
      <body className="min-h-full text-white">
        <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute left-[-10%] top-[-10%] h-72 w-72 rounded-full bg-emerald-400/20 blur-3xl" />
          <div className="absolute right-[-8%] top-[8%] h-80 w-80 rounded-full bg-blue-500/20 blur-3xl" />
          <div className="absolute bottom-[-12%] left-[35%] h-96 w-96 rounded-full bg-fuchsia-500/10 blur-3xl" />
        </div>

        <header className="fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-slate-950/75 shadow-2xl shadow-black/30 backdrop-blur-xl">
          <nav className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-4">
            <a href="/" className="group flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-2xl border border-emerald-400/30 bg-emerald-400/10 text-sm font-black text-emerald-300 shadow-lg shadow-emerald-950/30">
                PFI
              </span>
              <span className="text-sm font-black tracking-tight text-white group-hover:text-emerald-200">
                Pro Football Intel Checkout
              </span>
            </a>

            <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-zinc-300">
              <a
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 transition hover:border-emerald-400/40 hover:bg-emerald-400/10 hover:text-emerald-200"
                href="/unlock"
              >
                Unlock Lookup
              </a>

              <a
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 transition hover:border-blue-400/40 hover:bg-blue-400/10 hover:text-blue-200"
                href="/purchase"
              >
                Purchase Details
              </a>

              <a
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 transition hover:border-fuchsia-400/40 hover:bg-fuchsia-400/10 hover:text-fuchsia-200"
                href="/unlock-history"
              >
                Unlock History
              </a>

              <a
                className="rounded-full border border-emerald-400/40 bg-emerald-400/10 px-4 py-2 text-emerald-300 transition hover:bg-emerald-400 hover:text-black"
                href="https://profbint.com"
              >
                Return to Pro Football Intel
              </a>
            </div>
          </nav>
        </header>

        <div className="pt-24">{children}</div>
      </body>
    </html>
  );
}