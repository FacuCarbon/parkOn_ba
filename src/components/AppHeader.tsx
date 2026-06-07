import { BatteryFull, Bell, LogOut, Signal, Wifi } from "lucide-react";
import { useUser } from "../context/UserContext";
import { Logo } from "./Logo";

export function AppHeader() {
  const { logout } = useUser();

  return (
    <header
      className="relative flex min-h-[86px] items-center justify-between bg-[#002856] px-[30px] pb-[14px] pt-[30px] text-white"
    >
      <div className="absolute right-[27px] top-[13px] flex items-center gap-[4px] text-white">
        <Signal size={13} strokeWidth={3} />
        <Wifi size={13} strokeWidth={3} />
        <BatteryFull size={18} strokeWidth={2.4} />
      </div>
      <Logo variant="pdfHeaderExact" />
      <div className="flex items-center gap-1">
        <button
          className="grid h-10 w-10 place-items-center rounded-full border-0 bg-transparent text-white"
          type="button"
          aria-label="Notificaciones"
        >
          <Bell size={22} />
        </button>
        <button
          className="grid h-10 w-10 place-items-center rounded-full border-0 bg-transparent text-white"
          onClick={logout}
          type="button"
          aria-label="Cerrar sesion"
        >
          <LogOut size={21} />
        </button>
      </div>
    </header>
  );
}
