import { CalendarClock, Clock3, MapPin, QrCode, XCircle } from "lucide-react";
import type { Parking } from "../types/parking";
import type { Reservation } from "../types/reservation";

export function ReservationsScreen({
  parking,
  activeReservations,
  reservationHistory,
  maxActiveReservations,
  onReserve,
  onCancel,
  onOpenQr,
}: {
  parking: Parking;
  activeReservations: Reservation[];
  reservationHistory: Reservation[];
  maxActiveReservations: number;
  onReserve: () => void;
  onCancel: (reservationId: string) => void;
  onOpenQr: (reservation: Reservation) => void;
}) {
  if (activeReservations.length > 0) {
    return (
      <div className="h-full overflow-y-auto bg-[#f6f8fb]">
        <div className="px-6 pb-7 pt-5">
          <div className="mb-3 flex items-center justify-between">
            <h1 className="text-lg font-black text-[#071226]">
              Mis reservas activas
            </h1>
            <span className="rounded-full bg-[#f4f7fb] px-3 py-1 text-xs font-black text-[#4b5870]">
              {activeReservations.length}/{maxActiveReservations} activas
            </span>
          </div>

          <p className="mb-4 text-sm font-bold text-[#5d6a7f]">
            Gestioná tus cocheras reservadas y accedé al QR de ingreso.
          </p>

          {activeReservations.length >= maxActiveReservations && (
            <p className="mb-3 rounded-xl bg-[#fff7e8] p-3 text-xs font-bold text-[#8a5a00]">
              Llegaste al maximo de {maxActiveReservations} reservas activas.
            </p>
          )}

          <div className="grid gap-3">
            {activeReservations.map((reservation) => (
              <div
                key={reservation.id}
                className="rounded-[18px] border border-[#e7edf4] bg-white p-4 shadow-[0_10px_24px_rgba(8,20,45,0.08)]"
              >
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div>
                    <p className="m-0 text-xs font-black uppercase text-[#2DB84B]">
                      Activa
                    </p>
                    <h2 className="mt-1 text-base font-black text-[#071226]">
                      {reservation.parkingName}
                    </h2>
                  </div>
                  <strong className="text-sm font-black text-[#071226]">
                    ${reservation.total.toLocaleString("es-AR")}
                  </strong>
                </div>
                <div className="grid gap-2 text-sm font-bold text-[#25324a]">
                  <p className="m-0 flex items-center gap-2">
                    <MapPin size={17} className="text-[#002856]" />
                    {reservation.parkingAddress ?? parking.direccion}
                  </p>
                  <p className="m-0 flex items-center gap-2">
                    <Clock3 size={17} className="text-[#002856]" />
                    {reservation.dateLabel} · {reservation.startTime} -{" "}
                    {reservation.endTime}
                  </p>
                  <p className="m-0 text-xs font-bold text-[#6a768a]">
                    Pago: {reservation.paymentMethod ?? "**** 4242"}
                  </p>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <button
                    className="flex min-h-[44px] items-center justify-center gap-2 rounded-md border-0 bg-[#002856] text-xs font-black text-white"
                    onClick={() => onOpenQr(reservation)}
                    type="button"
                  >
                    <QrCode size={16} />
                    Ver QR
                  </button>
                  <button
                    className="flex min-h-[44px] items-center justify-center gap-2 rounded-md border border-[#f2caca] bg-white text-xs font-black text-[#d64242]"
                    onClick={() => {
                      if (window.confirm("¿Querés cancelar esta reserva?")) {
                        onCancel(reservation.id);
                      }
                    }}
                    type="button"
                  >
                    <XCircle size={16} />
                    Cancelar
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button
            className="mt-4 min-h-[46px] w-full rounded-xl border-0 bg-[#002856] text-sm font-black text-white disabled:bg-[#b9c3d2]"
            onClick={onReserve}
            disabled={activeReservations.length >= maxActiveReservations}
            type="button"
          >
            Nueva reserva
          </button>

          {reservationHistory.length > 0 && (
            <section className="mt-5">
              <h2 className="mb-3 text-sm font-black text-[#071226]">
                Historial
              </h2>
              <div className="grid gap-2">
                {reservationHistory.map((reservation) => (
                  <div
                    key={reservation.id}
                    className="rounded-xl bg-[#f7f9fc] p-3 text-xs font-bold text-[#4b5870]"
                  >
                    <p className="m-0 font-black text-[#071226]">
                      {reservation.parkingName}
                    </p>
                    <p className="m-0 mt-1">
                      {reservation.dateLabel} · {reservation.startTime} -{" "}
                      {reservation.endTime}
                    </p>
                    <p className="m-0 mt-1 text-[#d64242]">Cancelada</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="grid min-h-[520px] place-items-center px-6 text-center">
      <div>
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#eef3f8] text-[#002856]">
          <CalendarClock size={30} />
        </div>
        <h1 className="mt-4 text-xl font-black text-[#071226]">
          Todavia no tenes reservas
        </h1>
        <p className="mt-2 text-sm font-bold text-[#5c697d]">
          Reservá una cochera para ver tu QR de ingreso.
        </p>
        <button
          className="mt-5 min-h-[48px] w-full rounded-xl border-0 bg-[#002856] px-6 text-sm font-black text-white"
          onClick={onReserve}
          type="button"
        >
          Reservar ahora
        </button>
      </div>
    </div>
  );
}
