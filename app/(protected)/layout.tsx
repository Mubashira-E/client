import type { Metadata } from "next";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./components/app-sidebar";
import { AuthGuard } from "./components/auth-guard";
import { StickyHeader } from "./components/sticky-header";

export const metadata: Metadata = {
  title: "E-Medical Record",
  description: "E-Medical Record",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthGuard>
      <SidebarProvider>
        <AppSidebar />
        <main className="flex flex-col flex-1 bg-gray-50 overflow-hidden">
          <StickyHeader />
          <section className="max-w-screen-4xl px-4 py-5 overflow-auto">{children}</section>
        </main>
      </SidebarProvider>
    </AuthGuard>
  );
}
