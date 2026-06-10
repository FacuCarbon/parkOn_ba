import type { Parking } from "../types/parking";

const pinPositions = [
  { left: "18%", top: "17%" },
  { left: "84%", top: "12%" },
  { left: "48%", top: "31%" },
  { left: "29%", top: "34%" },
];

const parkingPinPositions: Record<string, { left: string; top: string }> = {
  "parking-palermo": pinPositions[0],
  "parking-nunez": pinPositions[1],
  "parking-belgrano": pinPositions[2],
  "parking-colegiales": pinPositions[3],
};

export function MockMap({
  tall = false,
  className = "",
  parkings = [],
  selectedParkingId,
  onSelectParking,
}: {
  tall?: boolean;
  className?: string;
  parkings?: Parking[];
  selectedParkingId?: string;
  onSelectParking?: (parking: Parking) => void;
}) {
  const mapPins = parkings.map((parking, index) => ({
    ...(parkingPinPositions[parking.id] ?? pinPositions[index % pinPositions.length]),
    parking,
  }));

  return (
    <div
      className={`relative overflow-hidden bg-[#edf0f2] ${
        tall ? "h-[315px]" : "h-[260px]"
      } ${className}`}
    >
      <div className="absolute inset-0 bg-[linear-gradient(32deg,transparent_0_45%,rgba(255,255,255,0.94)_45%_50%,transparent_50%),linear-gradient(145deg,transparent_0_44%,rgba(255,255,255,0.78)_44%_49%,transparent_49%),linear-gradient(78deg,transparent_0_47%,rgba(255,255,255,0.72)_47%_50%,transparent_50%),linear-gradient(90deg,rgba(16,35,68,0.045)_1px,transparent_1px),linear-gradient(0deg,rgba(16,35,68,0.045)_1px,transparent_1px)] bg-[length:92px_92px,118px_118px,150px_150px,34px_34px,34px_34px]" />
      <div
        className="absolute left-[38%] top-[36%] h-[14px] w-[14px] -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-white bg-[#2687d9] shadow-[0_0_0_8px_rgba(38,135,217,0.12)]"
        aria-label="Tu ubicación"
      />
      {mapPins.map((pin) => {
        const isActive = pin.parking.id === selectedParkingId;
        const hasAvailability = pin.parking.disponibilidad > 0;
        const pinColor = hasAvailability
          ? isActive
            ? "bg-[#2DB84B]"
            : "bg-[#002856]"
          : "bg-[#d64242]";

        return (
          <button
            key={pin.parking.id}
            className={`absolute border-0 bg-transparent p-0 -translate-x-1/2 -translate-y-1/2 ${
              isActive ? "h-[58px] w-[58px]" : "h-[50px] w-[50px]"
            }`}
            style={{ left: pin.left, top: pin.top }}
            onClick={() => onSelectParking?.(pin.parking)}
            type="button"
            aria-label={`Seleccionar ${pin.parking.nombre}${
              hasAvailability ? "" : ", sin lugares"
            }`}
          >
            <div
              className={`absolute left-1/2 top-1/2 grid -translate-x-1/2 -translate-y-1/2 -rotate-45 place-items-center rounded-[50%_50%_50%_0] shadow-[0_8px_15px_rgba(9,20,45,0.22)] ${
                isActive ? "h-[46px] w-[46px]" : "h-[40px] w-[40px]"
              } ${pinColor} ${hasAvailability ? "" : "ring-2 ring-white"}`}
            >
              <span
              className={`rotate-45 translate-x-[1px] -translate-y-[1px] text-center font-black leading-none text-white ${
                isActive ? "text-[1.35rem]" : "text-[1.05rem]"
              }`}
              >
                P
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
