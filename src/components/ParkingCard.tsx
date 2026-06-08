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
  const hasAvailability = parking.disponibilidad > 0;

  return (
    <article className="rounded-[15px] bg-white p-[18px] shadow-[0_12px_34px_rgba(8,20,45,0.14)]">
      <img
        src={parking.imagen}
        alt={parking.nombre}
        className="mb-4 h-[112px] w-full rounded-xl object-cover"
      />
      <div className="flex items-start justify-between gap-3">
        <div>
          <p
            className={`mb-2 text-[0.74rem] font-black ${
              hasAvailability ? "text-[#2DB84B]" : "text-[#d33f49]"
            }`}
          >
            {hasAvailability
              ? `${parking.disponibilidad} lugares libres`
              : "Sin disponibilidad"}
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
        <div
          className={`mt-10 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#f2f6fa] ${
            hasAvailability ? "text-[#2DB84B]" : "text-[#d33f49]"
          }`}
        >
          <CheckCircle2 size={22} strokeWidth={2.4} />
        </div>
      </div>

      {!compact && (
        <button
          className="mt-4 min-h-[50px] w-full rounded-lg border-0 bg-[#002856] text-[0.95rem] font-black text-white disabled:bg-[#aeb8c5]"
          disabled={!hasAvailability}
          onClick={onReserve}
          type="button"
        >
          {hasAvailability ? "Reservar ahora" : "Sin lugares"}
        </button>
      )}
    </article>
  );
}
