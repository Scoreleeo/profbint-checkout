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
    "Secure checkout and unlock portal for Pro Football Intel premium football predictions.",
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
          <div className="absolute left-[-8%] top-[-10%] h-96 w-96 rounded-full bg-emerald-400/20 blur-3xl" />
          <div className="absolute right-[-10%] top-[5%] h-[28rem] w-[28rem] rounded-full bg-blue-500/25 blur-3xl" />
          <div className="absolute bottom-[-18%] left-[25%] h-[30rem] w-[30rem] rounded-full bg-orange-500/16 blur-3xl" />
          <div className="absolute bottom-[10%] right-[15%] h-80 w-80 rounded-full bg-fuchsia-500/12 blur-3xl" />
        </div>

        <header className="fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-slate-950/75 shadow-2xl shadow-black/30 backdrop-blur-xl">
          <nav className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-4">
            <a href="/" className="group flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-emerald-400/30 bg-emerald-400/10 text-sm font-black text-emerald-300 shadow-lg shadow-emerald-950/30">
                PFI
              </span>
              <span className="text-sm font-black tracking-tight text-white group-hover:text-emerald-200">
                Pro Football Intel Checkout
              </span>
            </a>

            <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-zinc-300">
              <a
                className="rounded-full border border-blue-400/20 bg-blue-400/10 px-4 py-2 text-blue-100 transition hover:border-blue-300/50 hover:bg-blue-400/20"
                href="/unlock"
              >
                Unlock Lookup
              </a>

              <a
                className="rounded-full border border-orange-400/20 bg-orange-400/10 px-4 py-2 text-orange-100 transition hover:border-orange-300/50 hover:bg-orange-400/20"
                href="/purchase"
              >
                Purchase Details
              </a>

              <a
                className="rounded-full border border-fuchsia-400/20 bg-fuchsia-400/10 px-4 py-2 text-fuchsia-100 transition hover:border-fuchsia-300/50 hover:bg-fuchsia-400/20"
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

        <div className="min-h-screen pt-24">{children}</div>

        <footer className="border-t border-white/10 bg-slate-950/75 px-6 py-8 text-sm backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl flex-col gap-5 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
            <div>
              <p className="font-black text-white">
                Pro Football Intel Checkout
              </p>
              <p className="mt-1 text-zinc-500">
                Secure payments, unlock references, and purchase verification.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-4 font-semibold text-zinc-400 sm:justify-end">
              <a className="hover:text-emerald-300" href="https://profbint.com">
                Home
              </a>
              <a
                className="hover:text-emerald-300"
                href="https://profbint.com/predictions"
              >
                Predictions
              </a>
              <a
                className="hover:text-emerald-300"
                href="https://profbint.com/privacy"
              >
                Privacy Policy
              </a>
              <a
                className="hover:text-emerald-300"
                href="https://profbint.com/terms"
              >
                Terms of Service
              </a>
              <a
                className="hover:text-emerald-300"
                href="https://profbint.com/refunds"
              >
                Refund Policy
              </a>
              <a
                className="hover:text-emerald-300"
                href="https://profbint.com/responsible-gambling"
              >
                Responsible Gambling
              </a>
              <a
                className="hover:text-emerald-300"
                href="https://profbint.com/legal"
              >
                Legal & Disclaimer
              </a>
              <a
                className="hover:text-emerald-300"
                href="mailto:support@profbint.com"
              >
                Support
              </a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}