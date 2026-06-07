import { CheckCircle2 } from "lucide-react";
import type { Parking } from "../types/parking";

function formatCurrency(value: number) {
  return `$${value.toLocaleString("es-AR")} / hora`;
}

export function ParkingCard({
  parking,
  onReserve,
  compact = false,
}: {
  parking: Parking;
  onReserve?: () => void;
  compact?: boolean;
}) {
  return (
    <article className="rounded-[15px] bg-white p-[18px] shadow-[0_12px_34px_rgba(8,20,45,0.14)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="mb-2 text-[0.74rem] font-black text-[#2DB84B]">
            Disponible
          </p>
          <h2 className="text-[1.08rem] font-black leading-tight text-[#071226]">
            {parking.nombre}
          </h2>
          <p className="mt-2 text-[0.9rem] font-bold text-[#38465c]">
            A {parking.tiempo} · {parking.distancia}
          </p>
          <p className="mt-3 text-[1.06rem] font-black text-[#071226]">
            {formatCurrency(parking.tarifaHora)}
          </p>
        </div>
        <div className="mt-10 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#f2f6fa] text-[#2DB84B]">
          <CheckCircle2 size={22} strokeWidth={2.4} />
        </div>
      </div>

      {!compact && (
        <button
          className="mt-4 min-h-[50px] w-full rounded-lg border-0 bg-[#002856] text-[0.95rem] font-black text-white"
          onClick={onReserve}
          type="button"
        >
          Reservar ahora
        </button>
      )}
    </article>
  );
}
