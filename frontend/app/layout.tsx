import type { Metadata } from "next"
import { Inter } from 'next/font/google'
import "./globals.css"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "DeHug - The Decentralized Hugging Face",
  description: "A decentralized, open platform for hosting, sharing, and accessing machine learning models and datasets. Built on Filecoin/IPFS for permanent, censorship-resistant storage.",
  keywords: "machine learning, AI models, datasets, decentralized, IPFS, Filecoin, Hugging Face, open source, ML",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <div className="flex min-h-screen flex-col bg-black text-white">
            <Header />
            <main className="flex-1 pt-16  bg-gradient-to-br from-gray-950 via-slate-900 to-gray-950">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
