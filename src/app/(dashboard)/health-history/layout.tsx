import { Header } from "@/components/layout/Header";

export default function HealthHistoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      {children}
    </div>
  );
}
