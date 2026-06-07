import { Search } from "lucide-react";
import { type FormEvent, useMemo, useState } from "react";
import { MockMap } from "../components/MockMap";
import { ParkingCard } from "../components/ParkingCard";
import { useUser } from "../context/UserContext";
import type { Parking } from "../types/parking";

export function HomeScreen({
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
  const { currentUser } = useUser();
  const [query, setQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

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

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (matchingParkings[0]) {
      onSelectParking(matchingParkings[0]);
      setQuery(matchingParkings[0].nombre);
      setShowSuggestions(false);
    }
  }

  return (
    <div className="flex h-full flex-col bg-white">
      <div className="relative z-20 px-[27px] pb-[13px] pt-[12px]">
        <p className="mb-[13px] text-[1.02rem] font-black leading-none text-[#071226]">
          ¡Hola, {currentUser?.nombre.split(" ")[0] ?? "conductor"}!
        </p>
        <form className="relative" onSubmit={handleSearch}>
          <label className="flex min-h-[47px] items-center gap-3 rounded-xl bg-white px-[15px] shadow-[0_8px_18px_rgba(8,20,45,0.16)]">
            <input
              className="min-w-0 flex-1 border-0 bg-transparent text-[0.88rem] font-bold text-[#071226] outline-0 placeholder:text-[#17243a]"
              placeholder="¿A dónde vas?"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
            />
            <button
              className="border-0 bg-transparent p-0 text-[#1d2a3f]"
              type="submit"
              aria-label="Buscar cochera"
            >
              <Search size={20} strokeWidth={2.4} />
            </button>
          </label>
          {showSuggestions && query.trim().length > 0 && matchingParkings.length > 0 && (
            <div className="absolute left-0 right-0 top-[52px] z-30 mt-2 overflow-hidden rounded-[14px] border border-[#e7ecf2] bg-white shadow-[0_12px_28px_rgba(8,20,45,0.14)]">
              {matchingParkings.slice(0, 3).map((item) => (
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
                  <span className="shrink-0 rounded-full bg-[#eef8f0] px-2 py-1 text-[0.62rem] font-black text-[#2DB84B]">
                    {item.disponibilidad} libres
                  </span>
                </button>
              ))}
            </div>
          )}
        </form>
      </div>

      <div className="relative min-h-0 flex-1">
        <MockMap
          className="h-full"
          parkings={parkings}
          selectedParkingId={parking.id}
          onSelectParking={onSelectParking}
        />
        <div className="absolute bottom-[18px] left-[27px] right-[27px]">
          <ParkingCard parking={parking} onReserve={onReserve} />
        </div>
      </div>
    </div>
  );
}
