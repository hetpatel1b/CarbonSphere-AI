import { Sidebar } from "@/components/layout/Sidebar";
import { TopHeader } from "@/components/layout/TopHeader";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0 h-screen overflow-y-auto">
        <TopHeader />
        <main className="flex-1 flex flex-col gap-4 p-4 md:gap-8 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
