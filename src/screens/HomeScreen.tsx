import { Car, ChevronRight, Heart, Search, SlidersHorizontal } from "lucide-react";
import { type FormEvent, useMemo, useState } from "react";
import homeHero from "../assets/home-reference/home-hero.png";
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

export function HomeScreen({
  parking,
  parkings,
  onExplore,
  onReserve,
  onSelectParking,
}: {
  parking: Parking;
  parkings: Parking[];
  onExplore: () => void;
  onReserve: () => void;
  onSelectParking: (parking: Parking) => void;
}) {
  const [query, setQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [favoriteParkingIds, setFavoriteParkingIds] = useState<string[]>(() =>
    readFavoriteParkings(),
  );
  const nearbyParkings = parkings.slice(0, 3);
  const matchingParkings = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return [];
    }

    return parkings.filter((item) =>
      `${item.nombre} ${item.direccion} ${item.zona}`
        .toLowerCase()
        .includes(normalizedQuery),
    );
  }, [parkings, query]);
  const matchedParking = useMemo(() => {
    return matchingParkings[0] ?? null;
  }, [matchingParkings]);

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (matchedParking) {
      onSelectParking(matchedParking);
      setQuery(matchedParking.nombre);
      setShowSuggestions(false);
      onExplore();
      return;
    }

    onSelectParking(parking);
    onExplore();
  }

  function selectNearby(nextParking: Parking) {
    onSelectParking(nextParking);
    onReserve();
  }

  function toggleFavorite(parkingId: string) {
    setFavoriteParkingIds((currentFavorites) => {
      const nextFavorites = currentFavorites.includes(parkingId)
        ? currentFavorites.filter((id) => id !== parkingId)
        : [...currentFavorites, parkingId];

      window.localStorage.setItem(
        FAVORITES_STORAGE_KEY,
        JSON.stringify(nextFavorites),
      );

      return nextFavorites;
    });
  }

  return (
    <div className="h-full overflow-y-auto bg-white px-[26px] pb-2 pt-[12px] text-[#071226]">
      <form className="relative" onSubmit={handleSearch}>
        <label className="flex h-[38px] items-center gap-2 rounded-[11px] border border-[#e7ebf0] bg-white px-3 text-[#5d6979] shadow-[0_6px_14px_rgba(8,20,45,0.06)]">
          <Search size={17} strokeWidth={2.2} />
          <input
            className="min-w-0 flex-1 border-0 bg-transparent text-[0.76rem] font-bold text-[#071226] outline-0 placeholder:text-[#7f8a98]"
            placeholder="¿A dónde vas?"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
          />
          <button
            className="grid h-7 w-7 place-items-center border-0 bg-transparent p-0 text-[#0b1f3b]"
            onClick={onExplore}
            type="button"
            aria-label="Filtrar busqueda"
          >
            <SlidersHorizontal size={17} strokeWidth={2.2} />
          </button>
        </label>
        {showSuggestions &&
          query.trim().length > 0 &&
          matchingParkings.length > 0 && (
            <div className="absolute left-0 right-0 top-[42px] z-30 overflow-hidden rounded-[13px] border border-[#e7ecf2] bg-white shadow-[0_12px_28px_rgba(8,20,45,0.14)]">
              {matchingParkings.slice(0, 3).map((item) => (
                <button
                  key={item.id}
                  className="flex w-full items-center justify-between gap-3 border-0 border-b border-[#eef2f6] bg-white px-4 py-3 text-left last:border-b-0"
                  onClick={() => {
                    onSelectParking(item);
                    setQuery(item.nombre);
                    setShowSuggestions(false);
                    onExplore();
                  }}
                  type="button"
                >
                  <div className="min-w-0">
                    <p className="m-0 truncate text-[0.78rem] font-black text-[#071226]">
                      {item.nombre}
                    </p>
                    <p className="m-0 mt-1 truncate text-[0.66rem] font-bold text-[#4b5870]">
                      {item.direccion}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full bg-[#eef8f0] px-2 py-1 text-[0.6rem] font-black text-[#22b86f]">
                    {item.disponibilidad} libres
                  </span>
                </button>
              ))}
            </div>
          )}
      </form>

      <section className="relative mt-[14px] h-[197px] overflow-hidden rounded-[8px] bg-[#eef4fb]">
        <img
          className="h-full w-full object-fill"
          src={homeHero}
          alt="Encontrá tu estacionamiento ideal"
        />
        <button
          className="absolute bottom-[14px] left-[12px] h-[31px] w-[139px] rounded-[8px] border-0 bg-transparent"
          onClick={onExplore}
          type="button"
          aria-label="Buscar estacionamiento"
        />
      </section>

      <section className="mt-[14px]">
        <div className="mb-[9px] flex items-center justify-between">
          <h2 className="text-[0.94rem] font-black leading-none text-[#091b36]">
            Cerca de ti
          </h2>
          <button
            className="flex items-center gap-0.5 border-0 bg-transparent p-0 text-[0.68rem] font-black text-[#22b86f]"
            onClick={onExplore}
            type="button"
          >
            Ver mapa
            <ChevronRight size={13} strokeWidth={2.7} />
          </button>
        </div>

        <div className="divide-y divide-[#eef1f5]">
          {nearbyParkings.map((nearbyParking, index) => {
            const isFavorite = favoriteParkingIds.includes(nearbyParking.id);

            return (
            <div
              key={nearbyParking.id}
              className="grid h-[79px] w-full grid-cols-[62px_minmax(0,1fr)_66px_28px] items-center gap-[10px] border-0 bg-white py-[9px] text-left"
            >
              <button
                className="contents text-left"
                onClick={() => selectNearby(nearbyParking)}
                type="button"
              >
                <img
                  className="h-[58px] w-[62px] rounded-[10px] object-cover"
                  src={nearbyParking.imagen}
                  alt={nearbyParking.nombre}
                />
                <div className="min-w-0">
                  <p className="m-0 truncate text-[0.72rem] font-black leading-[1.16] text-[#081a34]">
                    {nearbyParking.nombre}
                  </p>
                  <p className="m-0 truncate text-[0.68rem] font-black leading-[1.16] text-[#081a34]">
                    ({nearbyParking.zona})
                  </p>
                  <p className="m-0 mt-1 text-[0.68rem] font-black leading-none text-[#22b86f]">
                    {nearbyParking.disponibilidad} disponibles
                  </p>
                  <p className="m-0 mt-1 flex items-center gap-1 text-[0.64rem] font-bold leading-none text-[#667386]">
                    <Car size={12} strokeWidth={2.2} /> a {nearbyParking.tiempo}
                  </p>
                </div>
                <div className="text-left">
                  <p className="m-0 text-[0.82rem] font-black leading-none text-[#081a34]">
                    {formatPrice(nearbyParking.tarifaHora)}
                  </p>
                  <p className="m-0 mt-1 text-[0.62rem] font-bold leading-none text-[#667386]">
                    por hora
                  </p>
                </div>
              </button>
              <button
                className="grid h-8 w-8 place-items-center border-0 bg-transparent p-0 text-[#17233a]"
                onClick={() => toggleFavorite(nearbyParking.id)}
                type="button"
                aria-label={
                  isFavorite
                    ? "Quitar estacionamiento de favoritos"
                    : "Agregar estacionamiento a favoritos"
                }
              >
                <Heart
                  size={22}
                  strokeWidth={1.8}
                  className={
                    isFavorite
                      ? "fill-[#22b86f] text-[#22b86f]"
                      : "text-[#17233a]"
                  }
                />
              </button>
            </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
