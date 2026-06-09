import { ArrowLeft, Check, Clock3 } from "lucide-react";
import { useMemo, useState } from "react";
import type { BookingSelection } from "../types/booking";
import type { Parking } from "../types/parking";

const slotStarts = ["09:00", "10:00", "11:00", "12:00", "13:00"];

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
  parking: Parking,
): BookingSelection {
  const [hour, minute] = selectedSlot.split(":").map(Number);
  const startDate = new Date(selectedDate);
  startDate.setHours(hour, minute, 0, 0);

  const endDate = new Date(startDate);
  endDate.setHours(endDate.getHours() + 1);

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
    durationHours: 1,
    total: parking.tarifaHora,
  };
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
  const [selectedSlot, setSelectedSlot] = useState(slotStarts[0]);
  const selectedDate = dates[selectedDateIndex].date;
  const selection = useMemo(
    () => buildSelection(selectedDate, selectedSlot, parking),
    [parking, selectedDate, selectedSlot],
  );

  return (
    <section className="h-full overflow-y-auto bg-white px-[26px] pb-6 pt-[18px] text-[#071226]">
      <header className="relative mb-[22px] flex min-h-[32px] items-center justify-center">
        <button
          className="absolute left-[-4px] grid h-9 w-9 place-items-center border-0 bg-transparent text-[#071226]"
          onClick={onBack}
          type="button"
          aria-label="Volver"
        >
          <ArrowLeft size={21} />
        </button>
        <h1 className="m-0 text-[1rem] font-black text-[#071a36]">
          Seleccionar horario
        </h1>
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

      <div className="my-[20px] h-px bg-[#e8ecf1]" />

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
                onClick={() => setSelectedDateIndex(index)}
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

      <section className="mt-[18px]">
        <h2 className="mb-[11px] text-[0.94rem] font-black text-[#071a36]">
          Elegí horario
        </h2>
        <div className="grid gap-[10px]">
          {slotStarts.map((slotStart) => {
            const [hour] = slotStart.split(":").map(Number);
            const slotEnd = `${String(hour + 1).padStart(2, "0")}:00`;
            const isSelected = selectedSlot === slotStart;

            return (
              <button
                key={slotStart}
                className={`flex h-[43px] items-center justify-between rounded-[8px] border px-[12px] text-[0.86rem] ${
                  isSelected
                    ? "border-[#22a85f] bg-white text-[#071a36]"
                    : "border-[#e8ecf1] bg-white text-[#071a36]"
                }`}
                onClick={() => setSelectedSlot(slotStart)}
                type="button"
              >
                <span className="font-black">
                  {slotStart} - {slotEnd}
                </span>
                <span className="flex items-center gap-[12px] font-black">
                  <span className={isSelected ? "text-[#22a85f]" : "text-[#6a7485]"}>
                    {formatPrice(parking.tarifaHora)}
                  </span>
                  {isSelected && (
                    <span className="grid h-[21px] w-[21px] place-items-center rounded-full bg-[#22a85f] text-white">
                      <Check size={15} strokeWidth={3} />
                    </span>
                  )}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <button
        className="mt-[22px] flex min-h-[50px] w-full items-center justify-center gap-2 rounded-[10px] border-0 bg-[#22a85f] text-[0.98rem] font-black text-white shadow-[0_10px_20px_rgba(34,168,95,0.22)]"
        onClick={() => onContinue(selection)}
        type="button"
      >
        <Clock3 size={18} />
        Continuar
      </button>
    </section>
  );
}
