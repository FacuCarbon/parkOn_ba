import type { ReactNode } from "react";
import { AppHeader } from "../components/AppHeader";
import { BottomNav, type TabId } from "../components/BottomNav";
import { MobileFrame } from "./MobileFrame";

export function DriverLayout({
  activeTab,
  children,
  showHeader = true,
  showBottomNav = true,
  onTabChange,
}: {
  activeTab: TabId;
  children: ReactNode;
  showHeader?: boolean;
  showBottomNav?: boolean;
  onTabChange: (tab: TabId) => void;
}) {
  return (
    <MobileFrame>
      {showHeader && <AppHeader />}
      <section
        className="relative min-h-0 overflow-hidden bg-white"
        style={!showHeader && !showBottomNav ? { gridRow: "1 / -1" } : undefined}
      >
        {children}
      </section>
      {showBottomNav && <BottomNav activeTab={activeTab} onTabChange={onTabChange} />}
    </MobileFrame>
  );
}
