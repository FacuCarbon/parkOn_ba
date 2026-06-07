import type { Parking } from "../types/parking";

const pinPositions = [
  { left: "18%", top: "18%" },
  { left: "42%", top: "8%" },
  { left: "58%", top: "33%" },
  { left: "82%", top: "22%" },
];

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
  const mapPins = pinPositions.map((position, index) => ({
    ...position,
    parking: parkings[index],
  }));

  return (
    <div
      className={`relative overflow-hidden bg-[#edf0f2] ${
        tall ? "h-[315px]" : "h-[260px]"
      } ${className}`}
    >
      <div className="absolute inset-0 bg-[linear-gradient(32deg,transparent_0_45%,rgba(255,255,255,0.94)_45%_50%,transparent_50%),linear-gradient(145deg,transparent_0_44%,rgba(255,255,255,0.78)_44%_49%,transparent_49%),linear-gradient(78deg,transparent_0_47%,rgba(255,255,255,0.72)_47%_50%,transparent_50%),linear-gradient(90deg,rgba(16,35,68,0.045)_1px,transparent_1px),linear-gradient(0deg,rgba(16,35,68,0.045)_1px,transparent_1px)] bg-[length:92px_92px,118px_118px,150px_150px,34px_34px,34px_34px]" />
      <div className="absolute left-[38%] top-[36%] grid h-7 w-7 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-[#2687d9]/20">
        <span className="h-[15px] w-[15px] rounded-full border-[3px] border-white bg-[#2687d9] shadow-md" />
      </div>
      {mapPins.map((pin) => {
        const isActive = pin.parking?.id === selectedParkingId;

        return (
        <button
          key={`${pin.left}-${pin.top}`}
          className={`absolute border-0 bg-transparent p-0 -translate-x-1/2 -translate-y-1/2 ${
            isActive ? "h-[58px] w-[58px]" : "h-[50px] w-[50px]"
          }`}
          style={{ left: pin.left, top: pin.top }}
          onClick={() => pin.parking && onSelectParking?.(pin.parking)}
          type="button"
          aria-label={pin.parking ? `Seleccionar ${pin.parking.nombre}` : "Parking"}
        >
          <div
            className={`absolute left-1/2 top-1/2 grid -translate-x-1/2 -translate-y-1/2 -rotate-45 place-items-center rounded-[50%_50%_50%_0] shadow-[0_8px_15px_rgba(9,20,45,0.22)] ${
              isActive ? "h-[46px] w-[46px]" : "h-[40px] w-[40px]"
            } ${isActive ? "bg-[#2DB84B]" : "bg-[#002856]"}`}
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
