import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { NotificationBell } from "@/components/NotificationBell";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen overflow-hidden bg-white dark:bg-zinc-950">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden transition-all duration-300 relative">
        <Header />
        {/* Floating Actions for Mobile */}
        <div className="md:hidden fixed top-6 left-6 z-50 flex items-center gap-2">
          <ThemeToggle />
          <NotificationBell />
        </div>

        <main className="flex-1 px-2 md:px-4 lg:p-6 py-4 md:py-6 overflow-y-auto overflow-x-hidden custom-scrollbar pb-24 md:pb-6">
          {children}
        </main>
        <BottomNav />
      </div>
    </div>
  );
}
