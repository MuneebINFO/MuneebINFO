import type { Metadata } from "next";
import "./globals.css";
import { BudgetProvider } from "@/context/BudgetContext";
import Navigation from "@/components/Navigation";

export const metadata: Metadata = {
  title: "ING Budget — Gérez vos dépenses",
  description: "Application de gestion budgétaire par catégories avec insights IA",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className="h-full">
      <body className="min-h-full flex flex-col antialiased">
        <BudgetProvider>
          <Navigation />
          <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8">
            {children}
          </main>
        </BudgetProvider>
      </body>
    </html>
  );
}
