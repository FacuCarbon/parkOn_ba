import { ArrowLeft, Copy } from "lucide-react";
import { useState } from "react";
import type { Parking } from "../types/parking";
import type { Reservation } from "../types/reservation";

const qrCells = [
  1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 1, 1,
  1, 0, 1, 0, 1, 0, 0, 0, 1, 1, 0, 1,
  1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1,
  0, 0, 1, 1, 0, 1, 1, 0, 0, 1, 0, 0,
  1, 0, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0,
  1, 1, 0, 0, 1, 1, 0, 1, 0, 0, 1, 1,
  0, 1, 1, 1, 0, 0, 1, 0, 1, 1, 0, 1,
  1, 0, 0, 1, 1, 1, 0, 1, 1, 0, 1, 0,
  1, 1, 1, 0, 0, 1, 1, 0, 1, 1, 0, 1,
  0, 0, 1, 1, 1, 0, 0, 1, 0, 1, 1, 0,
  1, 0, 1, 0, 1, 1, 0, 1, 1, 0, 0, 1,
  1, 1, 0, 1, 0, 0, 1, 1, 0, 1, 1, 1,
];

export function FinalQrScreen({
  parking,
  reservation,
  onBack,
}: {
  parking: Parking;
  reservation: Reservation | null;
  onBack: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const fallbackStartDate = new Date();
  fallbackStartDate.setMinutes(
    fallbackStartDate.getMinutes() < 30 ? 30 : 60,
    0,
    0,
  );
  const fallbackEndDate = new Date(fallbackStartDate);
  fallbackEndDate.setHours(fallbackEndDate.getHours() + 2);
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
  const code = reservation?.code ?? "PQ5X9K";

  function copyCode() {
    void navigator.clipboard?.writeText(code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  }

  return (
    <section className="flex h-full flex-col overflow-y-auto bg-[#002856] px-[30px] pb-8 pt-12 text-center text-white">
      <div className="flex items-center gap-3 text-left">
        <button
          className="grid h-9 w-9 place-items-center rounded-full border-0 bg-white/10 text-white"
          onClick={onBack}
          type="button"
          aria-label="Volver"
        >
          <ArrowLeft size={19} />
        </button>
        <h1 className="m-0 text-base font-black">Tu reserva esta lista</h1>
      </div>

      <div className="mt-9">
        <h2 className="text-[1.05rem] font-black">{parking.nombre}</h2>
        <p className="mt-3 text-sm font-bold leading-relaxed">
          {reservationDate}
          <br />
          {startTime} a {endTime}
        </p>
      </div>

      <div className="mx-auto mt-7 grid h-[170px] w-[170px] grid-cols-12 grid-rows-12 gap-[3px] rounded-xl bg-white p-5">
        {qrCells.map((cell, index) => (
          <span key={index} className={cell ? "bg-[#071226]" : "bg-white"} />
        ))}
      </div>

      <p className="mx-auto mt-7 max-w-[180px] text-sm font-black leading-relaxed">
        Mostra este codigo al ingresar
      </p>

      <div className="mt-auto rounded-md bg-white px-4 py-3 text-left text-[#071226] shadow-[0_14px_30px_rgba(0,0,0,0.22)]">
        <p className="m-0 text-xs font-bold text-[#4b5870]">Codigo de reserva</p>
        <div className="mt-2 flex items-center justify-between">
          <strong className="text-sm font-black">{code}</strong>
          <button
            className="border-0 bg-transparent p-0 text-[#002856]"
            onClick={copyCode}
            type="button"
            aria-label="Copiar codigo de reserva"
          >
            <Copy size={18} />
          </button>
        </div>
        {copied && (
          <p className="m-0 mt-2 text-xs font-black text-[#2DB84B]">
            Codigo copiado
          </p>
        )}
      </div>
    </section>
  );
}
