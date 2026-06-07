import type { ReactNode } from "react";
import { AppHeader } from "../components/AppHeader";
import { BottomNav, type TabId } from "../components/BottomNav";
import { MobileFrame } from "./MobileFrame";

export function DriverLayout({
  activeTab,
  children,
  showBottomNav = true,
  onTabChange,
}: {
  activeTab: TabId;
  children: ReactNode;
  showBottomNav?: boolean;
  onTabChange: (tab: TabId) => void;
}) {
  return (
    <MobileFrame>
      <AppHeader />
      <section className="relative min-h-0 overflow-hidden bg-white">
        {children}
      </section>
      {showBottomNav && <BottomNav activeTab={activeTab} onTabChange={onTabChange} />}
    </MobileFrame>
  );
}
