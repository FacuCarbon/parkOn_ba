import { CalendarDays, Check, Clock3 } from "lucide-react";
import type { Parking } from "../types/parking";
import type { Reservation } from "../types/reservation";

const qrCells = [
  1, 1, 1, 0, 1, 0, 0, 1, 1, 0,
  1, 0, 1, 0, 0, 1, 1, 0, 1, 1,
  1, 1, 1, 1, 0, 1, 0, 1, 0, 0,
  0, 0, 1, 0, 1, 1, 1, 0, 1, 0,
  1, 0, 0, 1, 1, 0, 1, 1, 0, 1,
  0, 1, 1, 0, 0, 1, 0, 0, 1, 1,
  1, 1, 0, 1, 0, 1, 1, 1, 0, 0,
  0, 1, 0, 1, 1, 0, 0, 1, 1, 0,
  1, 0, 1, 0, 1, 1, 0, 1, 0, 1,
  1, 1, 0, 0, 1, 0, 1, 0, 1, 1,
];

export function ReservationTicket({
  parking,
  reservation,
}: {
  parking: Parking;
  reservation: Reservation;
}) {
  return (
    <section className="bg-[#002856] px-6 pb-6 pt-2 text-white">
      <div className="mb-4 flex items-center gap-3">
        <div className="grid h-14 w-14 place-items-center rounded-full bg-[#2DB84B]">
          <Check size={34} strokeWidth={4} />
        </div>
        <div>
          <h1 className="text-[1.12rem] font-black leading-tight">
            ¡Reserva confirmada!
          </h1>
          <p className="mt-1 text-sm font-bold text-white/85">
            Tu lugar esta asegurado.
          </p>
        </div>
      </div>

      <article className="rounded-[18px] bg-white p-4 text-[#071226] shadow-[0_18px_36px_rgba(0,0,0,0.22)]">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-black">{parking.nombre}</h2>
            <p className="text-sm font-bold text-[#4b5870]">
              A {parking.tiempo} · {parking.distancia}
            </p>
          </div>
          <img
            src={parking.imagen}
            alt={parking.nombre}
            className="h-[70px] w-[92px] rounded-xl object-cover"
          />
        </div>

        <div className="my-4 h-px bg-[#e5eaf1]" />

        <div className="grid gap-3 text-sm font-bold text-[#1d2a3f]">
          <p className="m-0 flex items-center gap-3">
            <CalendarDays size={18} />
            {reservation.dateLabel}
          </p>
          <p className="m-0 flex items-center gap-3">
            <Clock3 size={18} />
            {reservation.startTime} - {reservation.endTime}
          </p>
        </div>

        <div className="my-4 h-px bg-[#e5eaf1]" />

        <div className="flex items-center justify-between text-sm font-black">
          <span>Total pagado</span>
          <strong className="text-lg">
            ${reservation.total.toLocaleString("es-AR")}
          </strong>
        </div>

        <div className="mt-4 flex items-center gap-4 rounded-xl bg-[#f7f9fc] p-3 shadow-[0_8px_20px_rgba(8,20,45,0.08)]">
          <div className="grid h-[92px] w-[92px] grid-cols-10 grid-rows-10 gap-[2px] bg-white p-1">
            {qrCells.map((cell, index) => (
              <span
                key={index}
                className={cell ? "bg-[#071226]" : "bg-white"}
              />
            ))}
          </div>
          <div>
            <p className="m-0 text-sm font-black">Escanea para ingresar</p>
            <span className="text-xs font-bold text-[#4b5870]">
              Mostra este codigo al llegar
            </span>
          </div>
        </div>
      </article>
    </section>
  );
}
