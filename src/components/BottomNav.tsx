import type { LucideIcon } from "lucide-react";
import { CalendarDays, Search, UserRound } from "lucide-react";

export type TabId = "inicio" | "buscar" | "reservas" | "perfil";

const tabs = [
  { id: "inicio", label: "Inicio", icon: null },
  { id: "buscar", label: "Buscar", icon: Search },
  { id: "reservas", label: "Reservas", icon: CalendarDays },
  { id: "perfil", label: "Perfil", icon: UserRound },
] satisfies Array<{ id: TabId; label: string; icon: LucideIcon | null }>;

export function BottomNav({
  activeTab,
  onTabChange,
}: {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}) {
  return (
    <nav
      className="grid min-h-[72px] grid-cols-4 gap-1 border-t border-[#e6ebf2] bg-white px-[18px] pb-[max(8px,env(safe-area-inset-bottom))] pt-2 shadow-[0_-10px_28px_rgba(8,20,45,0.06)]"
      aria-label="Navegacion principal"
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            className={`grid min-h-[54px] min-w-0 place-items-center rounded-2xl border-0 bg-transparent text-[0.64rem] font-extrabold ${
              isActive ? "text-[#2DB84B]" : "text-[#1d2a3f]"
            }`}
            onClick={() => onTabChange(tab.id)}
            aria-current={isActive ? "page" : undefined}
            type="button"
          >
            {tab.id === "inicio" ? (
              <HomeIcon active={isActive} />
            ) : (
              Icon && (
                <Icon
                  size={21}
                  strokeWidth={isActive ? 2.7 : 2.1}
                />
              )
            )}
            <span>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

function HomeIcon({ active }: { active: boolean }) {
  return (
    <svg
      className="block h-[22px] w-[22px]"
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      {active ? (
        <>
          <path
            d="M3.5 11.3 12 4l8.5 7.3v7.4a1.25 1.25 0 0 1-1.25 1.25H4.75A1.25 1.25 0 0 1 3.5 18.7z"
            fill="#2DB84B"
          />
          <path
            d="M9.3 19v-5.25h5.4V19"
            fill="none"
            stroke="#ffffff"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.9"
          />
          <path
            d="M7.6 11.6 12 7.85l4.4 3.75"
            fill="none"
            stroke="#ffffff"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.9"
          />
        </>
      ) : (
        <>
          <path
            d="M3.5 11.3 12 4l8.5 7.3"
            fill="none"
            stroke="#1d2a3f"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.1"
          />
          <path
            d="M5.5 10.6V19.2h13V10.6"
            fill="none"
            stroke="#1d2a3f"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.1"
          />
          <path
            d="M10 19.2v-5h4v5"
            fill="none"
            stroke="#1d2a3f"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.1"
          />
        </>
      )}
    </svg>
  );
}
