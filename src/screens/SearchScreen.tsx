import { ListFilter, MapPinned, Search, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import { MockMap } from "../components/MockMap";
import type { Parking } from "../types/parking";

type FilterId = "Disponible" | "Cerca" | "Cubierto";
const filters: FilterId[] = ["Disponible", "Cerca", "Cubierto"];

export function SearchScreen({
  parking,
  parkings,
  onReserve,
  onSelectParking,
}: {
  parking: Parking;
  parkings: Parking[];
  onReserve: () => void;
  onSelectParking: (parking: Parking) => void;
}) {
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterId>("Disponible");
  const [showList, setShowList] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const filteredParkings = useMemo(() => {
    return parkings.filter((item) => {
      const matchesQuery = `${item.nombre} ${item.direccion} ${item.zona}`
        .toLowerCase()
        .includes(query.trim().toLowerCase());
      const matchesFilter =
        activeFilter === "Disponible"
          ? item.disponibilidad > 0
          : activeFilter === "Cerca"
            ? Number(item.distancia.replace(",", ".").replace(" km", "")) <= 0.7
            : item.servicios.includes("Cubierto");

      return matchesQuery && matchesFilter;
    });
  }, [activeFilter, parkings, query]);
  const selectedParkingMatchesFilter = filteredParkings.some(
    (item) => item.id === parking.id,
  );
  const visibleParking = selectedParkingMatchesFilter
    ? parking
    : filteredParkings[0];
  const displayedParkings = filteredParkings;
  const visibleParkingHasAvailability =
    (visibleParking?.disponibilidad ?? 0) > 0;

  return (
    <div className="flex h-full flex-col bg-white">
      <div className="relative z-20 px-[26px] pb-[13px] pt-[13px]">
        <div className="mb-3 flex items-center justify-between gap-3">
          <p className="m-0 text-[1.02rem] font-black leading-none text-[#071226]">
            Buscar cochera
          </p>
          <button
            className="grid h-9 w-9 place-items-center rounded-full border border-[#e2e7ef] bg-white text-[#071226]"
            type="button"
            aria-label="Filtros"
          >
            <SlidersHorizontal size={18} />
          </button>
        </div>
        <div className="relative">
          <label className="flex min-h-[47px] items-center gap-3 rounded-xl bg-white px-[15px] shadow-[0_8px_18px_rgba(8,20,45,0.16)]">
            <input
              className="min-w-0 flex-1 border-0 bg-transparent text-[0.88rem] font-bold text-[#071226] outline-0 placeholder:text-[#17243a]"
              placeholder="Zona, direccion o lugar"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
            />
            <Search size={20} strokeWidth={2.4} className="text-[#1d2a3f]" />
          </label>
          {showSuggestions && query.trim().length > 0 && filteredParkings.length > 0 && (
            <div className="absolute left-0 right-0 top-[52px] z-30 mt-2 overflow-hidden rounded-[14px] border border-[#e7ecf2] bg-white shadow-[0_12px_28px_rgba(8,20,45,0.14)]">
              {filteredParkings.slice(0, 3).map((item) => (
                <button
                  key={item.id}
                  className="flex w-full items-center justify-between gap-3 border-0 border-b border-[#eef2f6] bg-white px-4 py-3 text-left last:border-b-0"
                  onClick={() => {
                    onSelectParking(item);
                    setQuery(item.nombre);
                    setShowSuggestions(false);
                  }}
                  type="button"
                >
                  <div className="min-w-0">
                    <p className="m-0 truncate text-[0.82rem] font-black text-[#071226]">
                      {item.nombre}
                    </p>
                    <p className="m-0 mt-1 truncate text-[0.68rem] font-bold text-[#4b5870]">
                      {item.direccion}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2 py-1 text-[0.62rem] font-black ${
                      item.disponibilidad > 0
                        ? "bg-[#eef8f0] text-[#2DB84B]"
                        : "bg-[#fff1f1] text-[#d14343]"
                    }`}
                  >
                    {item.disponibilidad > 0
                      ? `${item.disponibilidad} libres`
                      : "Sin lugares"}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="mt-3 flex gap-2 overflow-hidden">
          {filters.map((filter) => (
            <button
              key={filter}
              className={`rounded-full border px-3 py-2 text-[0.68rem] font-black ${
                activeFilter === filter
                  ? "border-[#2DB84B] bg-[#2DB84B] text-white"
                  : "border-[#dfe6ef] bg-[#f7f9fc] text-[#24324a]"
              }`}
              onClick={() => setActiveFilter(filter)}
              type="button"
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      <div className="px-[26px] pb-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 rounded-full bg-[#f7f9fc] px-3 py-2 text-[0.68rem] font-black text-[#24324a]">
            <MapPinned size={15} className="text-[#2DB84B]" />
            {filteredParkings.length} cocheras cerca
          </div>
          <button
            className="border-0 bg-transparent text-[0.68rem] font-black text-[#2DB84B]"
            onClick={() => setShowList((current) => !current)}
            type="button"
          >
            {showList ? "Ver mapa" : "Ver lista"}
          </button>
        </div>
      </div>

      <div className="relative min-h-0 flex-1">
        <MockMap
          className="h-full"
          parkings={displayedParkings}
          selectedParkingId={parking.id}
          onSelectParking={onSelectParking}
        />
        <div className="absolute bottom-[18px] left-[18px] right-[18px] rounded-[18px] bg-white p-3 shadow-[0_12px_34px_rgba(8,20,45,0.16)]">
          <div className="mb-3 flex items-center justify-between">
            <p className="m-0 flex items-center gap-2 text-[0.72rem] font-black text-[#4b5870]">
              <ListFilter size={15} />
              Resultados cercanos
            </p>
          </div>
          {showList ? (
            <div className="grid max-h-[190px] gap-2 overflow-y-auto">
              {filteredParkings.length === 0 ? (
                <p className="m-0 rounded-xl bg-[#f7f9fc] p-3 text-xs font-bold text-[#4b5870]">
                  No encontramos cocheras con esos filtros.
                </p>
              ) : (
                filteredParkings.map((item) => (
                  <button
                    key={item.id}
                    className={`rounded-xl border p-3 text-left ${
                      item.id === parking.id
                        ? "border-[#2DB84B] bg-[#f4fbf5]"
                        : "border-[#edf1f6] bg-[#fbfcfe]"
                    }`}
                    onClick={() => onSelectParking(item)}
                    type="button"
                  >
                    <p className="m-0 text-[0.85rem] font-black text-[#071226]">
                      {item.nombre}
                    </p>
                    <p className="m-0 mt-1 text-[0.7rem] font-bold text-[#4b5870]">
                      A {item.tiempo} · {item.distancia} ·{" "}
                      {item.disponibilidad > 0
                        ? `${item.disponibilidad} lugares`
                        : "Sin lugares"}
                    </p>
                  </button>
                ))
              )}
            </div>
          ) : !visibleParking ? (
            <p className="m-0 rounded-xl bg-[#f7f9fc] p-3 text-xs font-bold text-[#4b5870]">
              No encontramos cocheras con esos filtros.
            </p>
          ) : (
            <button
              className={`flex w-full items-center justify-between gap-3 rounded-xl border p-3 text-left ${
                visibleParkingHasAvailability
                  ? "border-[#edf1f6] bg-[#fbfcfe]"
                  : "border-[#f2d4d4] bg-[#fff8f8]"
              }`}
              onClick={() => {
                if (!visibleParkingHasAvailability) {
                  return;
                }

                onSelectParking(visibleParking);
                onReserve();
              }}
              disabled={!visibleParkingHasAvailability}
              type="button"
            >
              <div>
                <h2 className="text-[0.9rem] font-black leading-tight text-[#071226]">
                  {visibleParking.nombre}
                </h2>
                <p className="mt-1 text-[0.72rem] font-bold text-[#4b5870]">
                  A {visibleParking.tiempo} · {visibleParking.distancia} ·{" "}
                  {visibleParkingHasAvailability
                    ? `${visibleParking.disponibilidad} lugares`
                    : "Sin lugares disponibles"}
                </p>
                <p className="mt-2 text-[0.82rem] font-black text-[#071226]">
                  ${visibleParking.tarifaHora.toLocaleString("es-AR")} / hora
                </p>
              </div>
              <span
                className={`shrink-0 whitespace-nowrap rounded-full px-3 py-1.5 text-[0.66rem] font-black ${
                  visibleParkingHasAvailability
                    ? "bg-[#eef8f0] text-[#2DB84B]"
                    : "bg-[#fff1f1] text-[#d14343]"
                }`}
              >
                {visibleParkingHasAvailability ? "Disponible" : "Sin lugares"}
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
