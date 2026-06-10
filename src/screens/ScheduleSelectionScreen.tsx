import {
  ArrowLeft,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Minus,
  Plus,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { BookingSelection } from "../types/booking";
import type { Parking } from "../types/parking";

const hourlySlotStarts = Array.from(
  { length: 24 },
  (_, hour) => `${String(hour).padStart(2, "0")}:00`,
);
const minDurationHours = 1;
const maxDurationHours = 24;

function formatPrice(value: number) {
  return `$${value.toLocaleString("es-AR")}`;
}

function buildDates() {
  const today = new Date();

  return Array.from({ length: 5 }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() + index);

    return {
      date,
      dayName:
        index === 0
          ? "Hoy"
          : date.toLocaleDateString("es-AR", { weekday: "short" }).replace(".", ""),
      day: date.toLocaleDateString("es-AR", { day: "2-digit" }),
      month: date.toLocaleDateString("es-AR", { month: "long" }),
    };
  });
}

function buildSelection(
  selectedDate: Date,
  selectedSlot: string,
  durationHours: number,
  parking: Parking,
): BookingSelection {
  const [hour, minute] = selectedSlot.split(":").map(Number);
  const startDate = new Date(selectedDate);
  startDate.setHours(hour, minute, 0, 0);

  const endDate = new Date(startDate);
  endDate.setHours(endDate.getHours() + durationHours);

  return {
    dateLabel: `${selectedDate.toLocaleDateString("es-AR", {
      weekday: "long",
      day: "numeric",
      month: "long",
    })}`,
    dateISO: startDate.toISOString(),
    startTime: selectedSlot,
    endTime: `${String(endDate.getHours()).padStart(2, "0")}:${String(
      endDate.getMinutes(),
    ).padStart(2, "0")}`,
    durationHours,
    total: parking.tarifaHora * durationHours,
  };
}

function leavesOnNextDay(selectedSlot: string, durationHours: number) {
  const [startHour, startMinute] = selectedSlot.split(":").map(Number);
  const startTotalMinutes = startHour * 60 + startMinute;

  return startTotalMinutes + durationHours * 60 >= 24 * 60;
}

function isSameDate(firstDate: Date, secondDate: Date) {
  return firstDate.toDateString() === secondDate.toDateString();
}

function formatTime(date: Date) {
  return date.toLocaleTimeString("es-AR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

function buildSlotOptions(selectedDate: Date) {
  const now = new Date();

  if (!isSameDate(selectedDate, now)) {
    return hourlySlotStarts.map((time) => ({
      label: time,
      value: time,
    }));
  }

  const nextHour = now.getHours() + 1;
  const nextHourlySlots = hourlySlotStarts.slice(nextHour);

  return [
    {
      label: "Ahora",
      value: formatTime(now),
    },
    ...nextHourlySlots.map((time) => ({
      label: time,
      value: time,
    })),
  ];
}

export function ScheduleSelectionScreen({
  parking,
  onContinue,
  onBack,
}: {
  parking: Parking;
  onContinue: (selection: BookingSelection) => void;
  onBack: () => void;
}) {
  const dates = useMemo(() => buildDates(), []);
  const [selectedDateIndex, setSelectedDateIndex] = useState(0);
  const [selectedSlotIndex, setSelectedSlotIndex] = useState(0);
  const [durationHours, setDurationHours] = useState(1);
  const selectedDate = dates[selectedDateIndex].date;
  const slotOptions = useMemo(() => buildSlotOptions(selectedDate), [selectedDate]);
  const hasAvailableSlots = slotOptions.length > 0;
  const normalizedSlotIndex = Math.min(
    selectedSlotIndex,
    Math.max(0, slotOptions.length - 1),
  );
  const selectedSlot = slotOptions[normalizedSlotIndex]?.value ?? "00:00";
  useEffect(() => {
    if (selectedSlotIndex !== normalizedSlotIndex) {
      setSelectedSlotIndex(normalizedSlotIndex);
    }
  }, [normalizedSlotIndex, selectedSlotIndex]);
  const selection = useMemo(
    () => buildSelection(selectedDate, selectedSlot, durationHours, parking),
    [durationHours, parking, selectedDate, selectedSlot],
  );
  const leavesNextDay = leavesOnNextDay(selectedSlot, durationHours);
  const canDecreaseDuration = durationHours > minDurationHours;
  const canIncreaseDuration = durationHours < maxDurationHours;
  const canSelectPreviousSlot = hasAvailableSlots && selectedSlotIndex > 0;
  const canSelectNextSlot =
    hasAvailableSlots && selectedSlotIndex < slotOptions.length - 1;
  const firstVisibleSlotIndex = Math.min(
    Math.max(selectedSlotIndex - 1, 0),
    Math.max(0, slotOptions.length - 3),
  );
  const visibleSlotIndexes = Array.from(
    { length: 3 },
    (_, index) => firstVisibleSlotIndex + index,
  ).filter((slotIndex) => slotIndex < slotOptions.length);

  return (
    <section className="h-full overflow-y-auto bg-white px-[18px] pb-6 pt-[46px] text-[#071226]">
      <header className="mb-5 flex items-center gap-3">
        <button
          className="grid h-9 w-9 place-items-center rounded-full border-0 bg-[#f2f5f9] text-[#071226]"
          onClick={onBack}
          type="button"
          aria-label="Volver"
        >
          <ArrowLeft size={19} />
        </button>
        <h1 className="text-[1.02rem] font-black">Seleccionar horario</h1>
      </header>

      <div className="flex items-center gap-[15px]">
        <img
          src={parking.imagen}
          alt={parking.nombre}
          className="h-[70px] w-[70px] rounded-[10px] object-cover"
        />
        <div className="min-w-0">
          <h2 className="m-0 text-[1rem] font-black leading-[1.18] text-[#071a36]">
            {parking.nombre}
          </h2>
          <p className="m-0 mt-[7px] text-[0.86rem] font-black text-[#071a36]">
            {formatPrice(parking.tarifaHora)}
            <span className="ml-1 text-[0.72rem] font-bold text-[#6a7485]">
              por hora
            </span>
          </p>
        </div>
      </div>

      <div className="my-[16px] h-px bg-[#e8ecf1]" />

      <section>
        <h2 className="mb-[11px] text-[0.94rem] font-black text-[#071a36]">
          Elegí fecha
        </h2>
        <div className="grid grid-cols-5 gap-[8px]">
          {dates.map((dateOption, index) => {
            const isSelected = selectedDateIndex === index;

            return (
              <button
                key={dateOption.date.toISOString()}
                className={`h-[70px] rounded-[9px] border text-center ${
                  isSelected
                    ? "border-[#22a85f] bg-[#22a85f] text-white"
                    : "border-[#e5e9ef] bg-white text-[#071a36]"
                }`}
                onClick={() => {
                  setSelectedDateIndex(index);
                  setSelectedSlotIndex(0);
                }}
                type="button"
              >
                <span className="block text-[0.67rem] font-bold capitalize">
                  {dateOption.dayName}
                </span>
                <span className="mt-1 block text-[1rem] font-black">
                  {dateOption.day}
                </span>
                <span
                  className={`mt-1 block text-[0.66rem] font-bold capitalize ${
                    isSelected ? "text-white/90" : "text-[#6a7485]"
                  }`}
                >
                  {dateOption.month}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="mt-[16px]">
        <h2 className="mb-[11px] text-[0.94rem] font-black text-[#071a36]">
          Hora de entrada
        </h2>
        {hasAvailableSlots ? (
          <div className="grid grid-cols-[42px_1fr_42px] items-center gap-[8px]">
          <button
            className="grid h-[42px] w-[42px] place-items-center rounded-full border border-[#dfe5ee] bg-white text-[#071a36] disabled:cursor-not-allowed disabled:text-[#a9b2bf]"
            disabled={!canSelectPreviousSlot}
            onClick={() =>
              setSelectedSlotIndex((currentIndex) =>
                Math.max(0, currentIndex - 1),
              )
            }
            type="button"
            aria-label="Horario anterior"
          >
            <ChevronLeft size={19} strokeWidth={3} />
          </button>
          <div className="grid grid-cols-3 gap-[8px]">
            {visibleSlotIndexes.map((slotIndex) => {
              const slotStart = slotOptions[slotIndex];
              const isSelected = selectedSlotIndex === slotIndex;

              return (
                <button
                  key={`${slotStart.label}-${slotStart.value}`}
                  className={`flex h-[46px] items-center justify-center gap-1 rounded-[9px] border text-[0.86rem] font-black ${
                    isSelected
                      ? "border-[#22a85f] bg-[#f4fbf6] text-[#071a36]"
                      : "border-[#e8ecf1] bg-white text-[#6a7485]"
                  }`}
                  onClick={() => setSelectedSlotIndex(slotIndex)}
                  type="button"
                  aria-current={isSelected ? "time" : undefined}
                >
                  {slotStart.label}
                  {isSelected && (
                    <Check
                      size={14}
                      className="text-[#22a85f]"
                      strokeWidth={3}
                    />
                  )}
                </button>
              );
            })}
          </div>
          <button
            className="grid h-[42px] w-[42px] place-items-center rounded-full border border-[#dfe5ee] bg-white text-[#071a36] disabled:cursor-not-allowed disabled:text-[#a9b2bf]"
            disabled={!canSelectNextSlot}
            onClick={() =>
              setSelectedSlotIndex((currentIndex) =>
                Math.min(slotOptions.length - 1, currentIndex + 1),
              )
            }
            type="button"
            aria-label="Horario siguiente"
          >
            <ChevronRight size={19} strokeWidth={3} />
          </button>
          </div>
        ) : (
          <p className="m-0 rounded-[10px] bg-[#f7f9fc] px-[14px] py-[13px] text-[0.86rem] font-bold text-[#6a7485]">
            No quedan horarios disponibles para hoy.
          </p>
        )}
      </section>

      {hasAvailableSlots && (
        <>
          <section className="mt-[16px]">
            <div className="mb-[11px] flex items-end justify-between gap-3">
              <h2 className="text-[0.94rem] font-black text-[#071a36]">
                Duración
              </h2>
            </div>
            <div className="flex items-center justify-between rounded-[10px] border border-[#e8ecf1] bg-[#f7f9fc] px-[12px] py-[10px]">
              <button
                className="grid h-9 w-9 place-items-center rounded-full border border-[#dfe5ee] bg-white text-[#071a36] disabled:cursor-not-allowed disabled:text-[#a9b2bf]"
                disabled={!canDecreaseDuration}
                onClick={() =>
                  setDurationHours((currentDuration) =>
                    Math.max(minDurationHours, currentDuration - 1),
                  )
                }
                type="button"
                aria-label="Reducir duración"
              >
                <Minus size={17} strokeWidth={3} />
              </button>
              <div className="text-center">
                <p className="m-0 text-[1.1rem] font-black text-[#071a36]">
                  {durationHours} hora{durationHours === 1 ? "" : "s"}
                </p>
              </div>
              <button
                className="grid h-9 w-9 place-items-center rounded-full border border-[#dfe5ee] bg-white text-[#071a36] disabled:cursor-not-allowed disabled:text-[#a9b2bf]"
                disabled={!canIncreaseDuration}
                onClick={() =>
                  setDurationHours((currentDuration) =>
                    Math.min(maxDurationHours, currentDuration + 1),
                  )
                }
                type="button"
                aria-label="Aumentar duración"
              >
                <Plus size={17} strokeWidth={3} />
              </button>
            </div>
          </section>

          <section className="mt-[14px] rounded-[10px] bg-[#f7f9fc] px-[14px] py-[12px]">
            <div className="grid grid-cols-3 text-[0.82rem] font-bold text-[#6a7485]">
              <span>Entrada</span>
              <span className="text-center">Salida</span>
              <span className="text-right">Total</span>
            </div>
            <div className="mt-[5px] grid grid-cols-3 items-center font-black text-[#071a36]">
              <span>{selection.startTime}</span>
              <span className="text-center">
                {selection.endTime}
                {leavesNextDay && (
                  <span className="ml-1 text-[0.72rem] font-bold text-[#6a7485]">
                    +1 día
                  </span>
                )}
              </span>
              <span className="text-right">{formatPrice(selection.total)}</span>
            </div>
          </section>
        </>
      )}

      <button
        className="mt-[16px] flex min-h-[50px] w-full items-center justify-center gap-2 rounded-[10px] border-0 bg-[#22a85f] text-[0.98rem] font-black text-white shadow-[0_10px_20px_rgba(34,168,95,0.22)] disabled:cursor-not-allowed disabled:bg-[#a9b2bf] disabled:shadow-none"
        disabled={!hasAvailableSlots}
        onClick={() => onContinue(selection)}
        type="button"
      >
        <Clock3 size={18} />
        Continuar
      </button>
    </section>
  );
}
