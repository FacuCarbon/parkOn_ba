import { ArrowLeft, CalendarDays, Check, Clock3, Minus, Plus, Shield, Star } from "lucide-react";
import { useMemo, useState } from "react";
import type { Parking } from "../types/parking";
import type { BookingSelection } from "../types/booking";

const availabilityValues = [12, 8, 5, 3, 7];

function formatTime(date: Date) {
  return date.toLocaleTimeString("es-AR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

function formatDateLabel(date: Date) {
  const today = new Date();
  const isToday = date.toDateString() === today.toDateString();
  const dateText = date.toLocaleDateString("es-AR", {
    day: "numeric",
    month: "long",
  });

  return `${isToday ? "Hoy" : "Fecha"}, ${dateText}`;
}

function buildInitialStartDate() {
  const date = new Date();
  date.setMinutes(date.getMinutes() < 30 ? 30 : 60, 0, 0);
  return date;
}

function addHours(date: Date, hours: number) {
  const nextDate = new Date(date);
  nextDate.setHours(nextDate.getHours() + hours);
  return nextDate;
}

function buildSlots(startDate: Date, availability: number) {
  return availabilityValues.map((value, index) => {
    const slotDate = addHours(startDate, index);

    return {
      date: slotDate,
      time: formatTime(slotDate),
      value: Math.max(0, Math.min(value, availability - index)),
    };
  });
}

export function ParkingDetailScreen({
  parking,
  onReserve,
  onBack,
}: {
  parking: Parking;
  onReserve: (selection: BookingSelection) => void;
  onBack: () => void;
}) {
  const [baseStartDate] = useState(() => buildInitialStartDate());
  const [selectedStartDate, setSelectedStartDate] = useState(() =>
    buildInitialStartDate(),
  );
  const [durationHours, setDurationHours] = useState(2);
  const hasAvailability = parking.disponibilidad > 0;
  const slots = useMemo(
    () => buildSlots(baseStartDate, parking.disponibilidad),
    [baseStartDate, parking.disponibilidad],
  );
  const selection = useMemo<BookingSelection>(() => {
    const endDate = addHours(selectedStartDate, durationHours);

    return {
      dateLabel: formatDateLabel(selectedStartDate),
      dateISO: selectedStartDate.toISOString(),
      startTime: formatTime(selectedStartDate),
      durationHours,
      endTime: formatTime(endDate),
      total: parking.tarifaHora * durationHours,
    };
  }, [durationHours, parking.tarifaHora, selectedStartDate]);

  function decreaseDuration() {
    setDurationHours((current) => Math.max(1, current - 1));
  }

  function increaseDuration() {
    setDurationHours((current) => Math.min(8, current + 1));
  }

  return (
    <section className="h-full overflow-y-auto bg-[#f6f8fb] text-[#071226]">
      <div className="bg-white px-[22px] pb-4 pt-5">
        <div className="mb-4 flex items-center gap-3">
          <button
            className="grid h-9 w-9 place-items-center rounded-full border-0 bg-[#f2f5f9] text-[#071226]"
            onClick={onBack}
            type="button"
            aria-label="Volver"
          >
            <ArrowLeft size={19} />
          </button>
          <p className="m-0 text-sm font-black text-[#071226]">
            Detalle del estacionamiento
          </p>
        </div>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-[1.18rem] font-black leading-tight">
              {parking.nombre}
            </h1>
            <p className="mt-1 text-xs font-bold text-[#3f4d63]">
              {parking.direccion}
            </p>
            <p className="mt-2 flex items-center gap-1 text-xs font-black text-[#24324a]">
              <Star size={13} className="fill-[#f2b233] text-[#f2b233]" />
              <span className="text-[#f2b233]">{parking.rating}</span>
              <span>(128)</span>
              <span className="text-[#8b97aa]">· A 2 min</span>
            </p>
          </div>
          <span className="inline-flex shrink-0 items-center whitespace-nowrap rounded-full bg-[#eef8f0] px-3 py-1 text-xs font-black leading-none text-[#2DB84B]">
            {hasAvailability ? `${parking.disponibilidad} libres` : "Sin lugares"}
          </span>
        </div>

        <img
          src={parking.imagen}
          alt={parking.nombre}
          className="mt-4 h-[118px] w-full rounded-[16px] object-cover"
        />
      </div>

      <div className="grid gap-3 px-[22px] py-4">
        <section className="rounded-[18px] bg-white p-4 shadow-[0_10px_24px_rgba(8,20,45,0.07)]">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-black">Elegí horario</h2>
              <p className="mt-1 flex items-center gap-2 text-xs font-bold text-[#4b5870]">
                <CalendarDays size={15} />
                {selection.dateLabel}
              </p>
            </div>
            <span className="inline-flex shrink-0 items-center whitespace-nowrap rounded-full bg-[#f4fbf5] px-3 py-1 text-xs font-black leading-none text-[#2DB84B]">
              {hasAvailability ? "Disponible" : "Sin disponibilidad"}
            </span>
          </div>

          <div className="mt-4 grid grid-cols-5 gap-2">
            {slots.map((slot) => {
              const isSelected =
                selectedStartDate.getTime() === slot.date.getTime();

              return (
                <button
                  key={slot.time}
                  className={`min-w-0 rounded-xl border px-1 py-2 text-center ${
                    isSelected
                      ? "border-[#2DB84B] bg-[#2DB84B] text-white"
                      : "border-[#e6edf4] bg-white text-[#071226]"
                  }`}
                  onClick={() => setSelectedStartDate(slot.date)}
                  type="button"
                >
                  <span className="block text-[0.66rem] font-black">
                    {slot.time}
                  </span>
                  <span
                    className={`mt-1 block whitespace-nowrap text-[0.56rem] font-bold leading-none ${
                      isSelected ? "text-white/85" : "text-[#2DB84B]"
                    }`}
                  >
                    {slot.value} libres
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-4 flex items-center justify-between rounded-xl bg-[#f7f9fc] p-3">
            <p className="m-0 flex items-center gap-2 text-xs font-black text-[#24324a]">
              <Clock3 size={16} />
              Duración
            </p>
            <div className="flex items-center gap-3">
              <button
                className="grid h-8 w-8 place-items-center rounded-full border-0 bg-white text-[#002856] shadow-sm"
                onClick={decreaseDuration}
                type="button"
              >
                <Minus size={15} />
              </button>
              <strong className="w-10 text-center text-sm">
                {durationHours} h
              </strong>
              <button
                className="grid h-8 w-8 place-items-center rounded-full border-0 bg-white text-[#002856] shadow-sm"
                onClick={increaseDuration}
                type="button"
              >
                <Plus size={15} />
              </button>
            </div>
          </div>
        </section>

        <section className="rounded-[18px] bg-white p-4 shadow-[0_10px_24px_rgba(8,20,45,0.07)]">
          <h2 className="text-sm font-black">Tarifas</h2>
          <div className="mt-3 grid gap-2 text-xs font-bold text-[#25324a]">
            <div className="flex items-center justify-between">
              <span>Hora</span>
              <strong>${parking.tarifaHora.toLocaleString("es-AR")}</strong>
            </div>
            <div className="flex items-center justify-between">
              <span>8 horas</span>
              <strong>
                ${parking.tarifaOchoHoras.toLocaleString("es-AR")}
              </strong>
            </div>
          </div>
        </section>

        <section className="rounded-[18px] bg-white p-4 shadow-[0_10px_24px_rgba(8,20,45,0.07)]">
          <h2 className="text-sm font-black">Servicios</h2>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {parking.servicios.map((service) => (
              <p
                key={service}
                className="m-0 flex items-center gap-2 text-xs font-bold text-[#25324a]"
              >
                <Check size={14} className="text-[#2DB84B]" />
                {service}
              </p>
            ))}
          </div>
          <p className="mt-4 flex items-center gap-2 rounded-xl bg-[#f7f9fc] p-3 text-xs font-bold text-[#25324a]">
            <Shield size={16} className="text-[#2DB84B]" />
            Tu lugar queda reservado durante 15 minutos de tolerancia.
          </p>
        </section>
      </div>

      <div className="sticky bottom-0 border-t border-[#e5eaf1] bg-white px-[22px] py-3">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="m-0 text-xs font-bold text-[#4b5870]">
              {selection.startTime} a {selection.endTime}
            </p>
            <p className="m-0 mt-1 text-xs font-bold text-[#4b5870]">
              {selection.durationHours} hs
            </p>
          </div>
          <strong className="text-xl font-black">
            ${selection.total.toLocaleString("es-AR")}
          </strong>
        </div>
        <button
          className="min-h-[48px] w-full rounded-md border-0 bg-[#002856] text-sm font-black text-white shadow-[0_10px_22px_rgba(0,40,86,0.22)] disabled:bg-[#aeb8c5] disabled:shadow-none"
          disabled={!hasAvailability}
          onClick={() => onReserve(selection)}
          type="button"
        >
          {hasAvailability ? "Continuar reserva" : "Sin lugares disponibles"}
        </button>
      </div>
    </section>
  );
}
