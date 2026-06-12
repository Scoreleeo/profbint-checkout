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
          <div className="absolute left-[-8%] top-[-10%] h-96 w-96 rounded-full bg-emerald-400/25 blur-3xl" />
          <div className="absolute right-[-10%] top-[5%] h-[28rem] w-[28rem] rounded-full bg-blue-500/30 blur-3xl" />
          <div className="absolute bottom-[-18%] left-[25%] h-[30rem] w-[30rem] rounded-full bg-orange-500/22 blur-3xl" />
          <div className="absolute bottom-[10%] right-[15%] h-80 w-80 rounded-full bg-fuchsia-500/16 blur-3xl" />
        </div>

        <header className="border-b border-white/10 bg-slate-950/88 shadow-2xl shadow-black/30 backdrop-blur-xl">
          <nav className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <a href="/" className="group flex items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl border border-emerald-400/40 bg-emerald-400/15 text-xs font-black text-emerald-300 shadow-lg shadow-emerald-950/30 sm:h-10 sm:w-10 sm:text-sm">
                PFI
              </span>
              <span>
                <span className="block text-base font-black leading-tight tracking-tight text-white group-hover:text-emerald-200 sm:text-sm">
                  Pro Football Intel
                </span>
                <span className="block text-[10px] font-bold uppercase tracking-[0.22em] text-orange-300 sm:text-[11px] sm:tracking-[0.25em]">
                  Checkout Portal
                </span>
              </span>
            </a>

            <div className="grid grid-cols-2 gap-2 text-[11px] font-black sm:flex sm:flex-wrap sm:items-center sm:text-xs">
              <a
                className="rounded-full border border-blue-400/25 bg-blue-400/12 px-3 py-2 text-center text-blue-100 transition hover:border-blue-300/60 hover:bg-blue-400/25 sm:px-4"
                href="/unlock"
              >
                Unlock
              </a>

              <a
                className="rounded-full border border-orange-400/25 bg-orange-400/12 px-3 py-2 text-center text-orange-100 transition hover:border-orange-300/60 hover:bg-orange-400/25 sm:px-4"
                href="/purchase"
              >
                Purchase
              </a>

              <a
                className="rounded-full border border-fuchsia-400/25 bg-fuchsia-400/12 px-3 py-2 text-center text-fuchsia-100 transition hover:border-fuchsia-300/60 hover:bg-fuchsia-400/25 sm:px-4"
                href="/unlock-history"
              >
                History
              </a>

              <a
                className="rounded-full border border-emerald-400/45 bg-emerald-400/15 px-3 py-2 text-center text-emerald-300 transition hover:bg-emerald-400 hover:text-black sm:px-4"
                href="https://profbint.com"
              >
                Main Site
              </a>
            </div>
          </nav>
        </header>

        <div className="min-h-screen">{children}</div>

        <footer className="border-t border-white/10 bg-slate-950/80 px-5 py-5 text-sm backdrop-blur-xl sm:px-6 sm:py-8">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 text-center sm:gap-6 sm:text-left">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-black text-white">
                  Pro Football Intel Checkout
                </p>
                <p className="mt-1 text-sm text-zinc-500">
                  Secure payments, unlock references, and purchase verification.
                </p>
              </div>

              <a
                className="font-black text-orange-300 hover:text-orange-200"
                href="mailto:support@profbint.com"
              >
                support@profbint.com
              </a>
            </div>

            <div className="flex flex-wrap justify-center gap-x-4 gap-y-3 border-t border-white/10 pt-4 text-xs font-semibold text-zinc-400 sm:justify-start sm:text-sm">
              <a className="hover:text-emerald-300" href="https://profbint.com">
                Home
              </a>
              <a
                className="hover:text-blue-300"
                href="https://profbint.com/predictions"
              >
                Predictions
              </a>
              <a
                className="hover:text-orange-300"
                href="https://profbint.com/privacy"
              >
                Privacy
              </a>
              <a
                className="hover:text-orange-300"
                href="https://profbint.com/terms"
              >
                Terms
              </a>
              <a
                className="hover:text-orange-300"
                href="https://profbint.com/refunds"
              >
                Refunds
              </a>
              <a
                className="hover:text-fuchsia-300"
                href="https://profbint.com/responsible-gambling"
              >
                Responsible Gambling
              </a>
              <a
                className="hover:text-fuchsia-300"
                href="https://profbint.com/legal"
              >
                Legal
              </a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}