import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  Heart,
  MapPin,
  ShieldCheck,
  Video,
  Footprints,
  Car,
} from "lucide-react";
import { useState } from "react";
import type { Parking } from "../types/parking";

const FAVORITES_STORAGE_KEY = "parkonba.favoriteParkings";

function readFavoriteParkings() {
  const storedFavorites = window.localStorage.getItem(FAVORITES_STORAGE_KEY);

  if (!storedFavorites) {
    return [];
  }

  try {
    return JSON.parse(storedFavorites) as string[];
  } catch {
    return [];
  }
}

function formatPrice(value: number) {
  return `$${value.toLocaleString("es-AR")}`;
}

export function ParkingDetailScreen({
  parking,
  onReserve,
  onBack,
}: {
  parking: Parking;
  onReserve: () => void;
  onBack: () => void;
}) {
  const [favoriteParkingIds, setFavoriteParkingIds] = useState<string[]>(() =>
    readFavoriteParkings(),
  );
  const isFavorite = favoriteParkingIds.includes(parking.id);
  const hasAvailability = parking.disponibilidad > 0;

  function toggleFavorite() {
    setFavoriteParkingIds((currentFavorites) => {
      const nextFavorites = currentFavorites.includes(parking.id)
        ? currentFavorites.filter((id) => id !== parking.id)
        : [...currentFavorites, parking.id];

      window.localStorage.setItem(
        FAVORITES_STORAGE_KEY,
        JSON.stringify(nextFavorites),
      );

      return nextFavorites;
    });
  }

  return (
    <section className="h-full overflow-y-auto bg-white text-[#071226]">
      <div className="relative h-[304px]">
        <img
          src={parking.imagen}
          alt={parking.nombre}
          className="h-[246px] w-full rounded-b-[14px] object-cover"
        />
        <div className="absolute left-0 right-0 top-0 flex items-center justify-between px-[18px] pt-[18px]">
          <button
            className="grid h-9 w-9 place-items-center rounded-full border-0 bg-white/80 text-[#071226] shadow-[0_8px_18px_rgba(8,20,45,0.12)]"
            onClick={onBack}
            type="button"
            aria-label="Volver"
          >
            <ArrowLeft size={20} />
          </button>
          <button
            className="grid h-9 w-9 place-items-center rounded-full border-0 bg-white/80 text-[#071226] shadow-[0_8px_18px_rgba(8,20,45,0.12)]"
            onClick={toggleFavorite}
            type="button"
            aria-label={
              isFavorite
                ? "Quitar estacionamiento de favoritos"
                : "Agregar estacionamiento a favoritos"
            }
          >
            <Heart
              size={22}
              strokeWidth={1.9}
              className={
                isFavorite ? "fill-[#22b86f] text-[#22b86f]" : undefined
              }
            />
          </button>
        </div>

        <div className="absolute bottom-0 left-0 right-0 rounded-t-[20px] bg-white px-[20px] pb-[18px] pt-[15px] shadow-[0_-10px_22px_rgba(8,20,45,0.08)]">
          <h1 className="text-[1.58rem] font-black leading-[1.05] text-[#071a36]">
            {parking.nombre}
          </h1>
          <p className="mt-[11px] flex items-center gap-2 text-[0.74rem] font-bold text-[#6c7788]">
            <MapPin size={15} strokeWidth={2.2} />
            {parking.direccion}, CABA
          </p>
          <div className="mt-[13px] flex items-center gap-4 text-[0.74rem] font-black">
            <span className="flex items-center gap-2 text-[#22b86f]">
              <CalendarDays size={15} strokeWidth={2.2} />
              {parking.disponibilidad} disponibles
            </span>
            <span className="flex items-center gap-2 text-[#6c7788]">
              <Car size={15} strokeWidth={2.2} /> a {parking.tiempo}
            </span>
          </div>
        </div>
      </div>

      <div className="px-[20px] pb-5">
        <div className="h-px bg-[#e8ecf1]" />

        <section className="py-[16px]">
          <h2 className="mb-[13px] text-[0.86rem] font-black text-[#071a36]">
            Información
          </h2>
          <div className="grid gap-[12px] text-[0.78rem] font-bold text-[#6a7485]">
            <p className="m-0 flex items-center gap-3">
              <Clock3 size={16} strokeWidth={2.2} /> Abierto 24 hs
            </p>
            <p className="m-0 flex items-center gap-3">
              <Video size={16} strokeWidth={2.2} /> Vigilancia
            </p>
            <p className="m-0 flex items-center gap-3">
              <Footprints size={16} strokeWidth={2.2} /> Acceso peatonal cercano
            </p>
            <p className="m-0 flex items-center gap-3">
              <ShieldCheck size={16} strokeWidth={2.2} /> Cancelación gratuita
              hasta 1 hs antes
            </p>
          </div>
        </section>

        <div className="h-px bg-[#e8ecf1]" />

        <section className="py-[14px]">
          <h2 className="mb-[8px] text-[0.86rem] font-black text-[#071a36]">
            Precio
          </h2>
          <p className="m-0 text-[1.28rem] font-black text-[#071a36]">
            {formatPrice(parking.tarifaHora)}
            <span className="ml-1 text-[0.84rem] font-bold text-[#6a7485]">
              por hora
            </span>
          </p>
        </section>

        <button
          className="mt-1 min-h-[50px] w-full rounded-[10px] border-0 bg-[#22a85f] text-[0.92rem] font-black text-white shadow-[0_10px_20px_rgba(34,168,95,0.22)] disabled:bg-[#aeb8c5] disabled:shadow-none"
          disabled={!hasAvailability}
          onClick={onReserve}
          type="button"
        >
          {hasAvailability ? "Seleccionar horario" : "Sin lugares disponibles"}
        </button>
      </div>
    </section>
  );
}
