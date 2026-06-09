import { CalendarDays, Check, Clock3, Copy } from "lucide-react";
import { useState } from "react";
import type { Parking } from "../types/parking";
import type { Reservation } from "../types/reservation";

const confettiPieces = [
  "left-[28px] top-[31px] rotate-45 bg-[#ff6f7d]",
  "left-[83px] top-[31px] rotate-45 bg-[#35c78a]",
  "left-[151px] top-[25px] rotate-45 bg-[#f57bd2]",
  "left-[205px] top-[31px] rotate-45 bg-[#9ed243]",
  "right-[31px] top-[28px] rotate-45 bg-[#22c28a]",
  "left-[37px] top-[87px] -rotate-45 bg-[#ff77ad]",
  "left-[83px] top-[72px] rotate-45 bg-[#24bfa3]",
  "left-[180px] top-[74px] rotate-45 bg-[#59a6ff]",
  "right-[61px] top-[75px] -rotate-45 bg-[#6cc6ee]",
  "right-[36px] top-[89px] rotate-45 bg-[#d7e338]",
  "left-[38px] top-[127px] -rotate-45 bg-[#4ab3ff]",
  "left-[79px] top-[119px] rotate-45 bg-[#ffba22]",
  "right-[33px] top-[128px] rotate-45 bg-[#ff4f5d]",
];

function formatPrice(value: number) {
  return `$${value.toLocaleString("es-AR")}`;
}

export function FinalQrScreen({
  parking,
  reservation,
  onOpenReservations,
  onGoHome,
}: {
  parking: Parking;
  reservation: Reservation | null;
  onOpenReservations: () => void;
  onGoHome: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const fallbackStartDate = new Date();
  fallbackStartDate.setMinutes(
    fallbackStartDate.getMinutes() < 30 ? 30 : 60,
    0,
    0,
  );
  const fallbackEndDate = new Date(fallbackStartDate);
  fallbackEndDate.setHours(fallbackEndDate.getHours() + 1);
  const reservationDate =
    reservation?.dateLabel ??
    `Hoy, ${fallbackStartDate.toLocaleDateString("es-AR", {
      day: "numeric",
      month: "long",
    })}`;
  const startTime =
    reservation?.startTime ??
    fallbackStartDate.toLocaleTimeString("es-AR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  const endTime =
    reservation?.endTime ??
    fallbackEndDate.toLocaleTimeString("es-AR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  const durationHours = reservation?.durationHours ?? 1;
  const total = reservation?.total ?? parking.tarifaHora;
  const code = reservation?.code ?? "PON2405240930";

  function copyCode() {
    void navigator.clipboard?.writeText(code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  }

  return (
    <section className="h-full overflow-y-auto bg-white p-0 text-white">
      <div className="relative min-h-full rounded-[20px] bg-[#002856] px-[17px] pb-[19px] pt-[30px] text-center">
        {confettiPieces.map((piece) => (
          <span
            key={piece}
            className={`absolute h-[9px] w-[4px] rounded-sm ${piece}`}
          />
        ))}

        <div className="mx-auto mt-[21px] grid h-[90px] w-[90px] place-items-center rounded-full bg-[#2db84b] shadow-[0_16px_32px_rgba(0,0,0,0.16)]">
          <Check size={57} strokeWidth={4.2} />
        </div>

        <h1 className="mt-[24px] text-[1.45rem] font-black leading-none">
          ¡Reserva confirmada!
        </h1>
        <p className="mt-[11px] text-[0.98rem] font-bold leading-none">
          Tu lugar está asegurado.
        </p>

        <section className="mt-[20px] rounded-[9px] bg-white px-[16px] py-[14px] text-left text-[#071226] shadow-[0_14px_28px_rgba(0,0,0,0.16)]">
          <div className="flex items-start gap-[13px]">
            <img
              src={reservation?.parkingImage ?? parking.imagen}
              alt={reservation?.parkingName ?? parking.nombre}
              className="h-[72px] w-[72px] rounded-[7px] object-cover"
            />
            <div className="min-w-0 pt-[3px]">
              <h2 className="m-0 text-[0.95rem] font-black leading-[1.22]">
                {reservation?.parkingName ?? parking.nombre}
              </h2>
            </div>
          </div>

          <div className="my-[17px] h-px bg-[#e8ecf1]" />

          <div className="grid gap-[12px] text-[0.86rem] font-bold text-[#30415b]">
            <p className="m-0 flex items-center gap-[10px]">
              <CalendarDays size={17} strokeWidth={2.2} />
              {reservationDate}
            </p>
            <p className="m-0 flex items-center gap-[10px]">
              <Clock3 size={17} strokeWidth={2.2} />
              {startTime} - {endTime} ({durationHours} hora
              {durationHours === 1 ? "" : "s"})
            </p>
          </div>

          <p className="m-0 mt-[14px] text-[1.05rem] font-black">
            {formatPrice(total)}
          </p>

          <div className="my-[15px] h-px bg-[#e8ecf1]" />

          <div className="flex items-center justify-between">
            <div>
              <p className="m-0 text-[0.82rem] font-bold text-[#6a7485]">
                Código de reserva
              </p>
              <p className="m-0 mt-[8px] text-[1.02rem] font-black">
                #{code}
              </p>
            </div>
            <button
              className="grid h-9 w-9 place-items-center border-0 bg-transparent p-0 text-[#24324a]"
              onClick={copyCode}
              type="button"
              aria-label="Copiar codigo de reserva"
            >
              <Copy size={22} strokeWidth={1.8} />
            </button>
          </div>
          {copied && (
            <p className="m-0 mt-2 text-[0.72rem] font-black text-[#2DB84B]">
              Código copiado
            </p>
          )}
        </section>

        <p className="mx-auto mt-[16px] max-w-[240px] text-[0.9rem] font-bold leading-[1.45]">
          Te enviamos los detalles a tu correo y a tus notificaciones.
        </p>

        <button
          className="mt-[14px] min-h-[46px] w-full rounded-[9px] border-0 bg-[#22b86f] text-[0.94rem] font-black text-white shadow-[0_10px_20px_rgba(34,184,111,0.18)]"
          onClick={onOpenReservations}
          type="button"
        >
          Ver mis reservas
        </button>
        <button
          className="mt-[14px] min-h-[34px] border-0 bg-transparent text-[0.96rem] font-black text-white"
          onClick={onGoHome}
          type="button"
        >
          Volver al inicio
        </button>
      </div>
    </section>
  );
}
