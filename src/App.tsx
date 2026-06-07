import {
  CalendarClock,
  Home,
  Search,
  User,
  Bell,
  MapPin,
  Calendar,
} from "lucide-react";
import { useState } from "react";
import LogoParkOn from "../public/logo.webp";
import ImagenDemo from "../public/imagen.jpg";
type TabId = "inicio" | "buscar" | "reservas" | "perfil";

const tabs = [
  { id: "inicio", label: "Inicio", icon: Home },
  { id: "buscar", label: "Buscar", icon: Search },
  { id: "reservas", label: "Reservas", icon: CalendarClock },
  { id: "perfil", label: "Perfil", icon: User },
] satisfies Array<{ id: TabId; label: string; icon: typeof Home }>;

function App() {
  const [activeTab, setActiveTab] = useState<TabId>("inicio");

  return (
    <div className="app-shell">
      <main className="phone-frame" aria-label="ParkOn BA Conductor">
        <header className="top-bar">
          <div className="flex items-center justify-between">
            <figure className="">
              <img src={LogoParkOn} alt="Logo ParkOn" className="w-[40%]" />
            </figure>

            <button className="">
              <Bell size={26} className="text-white" />
            </button>
          </div>
        </header>

        <section className="content-area bg-[#ffff] rounded-t-lg">
          {activeTab === "inicio" && <Inicio />}
          {activeTab === "buscar" && <div>MAPA</div>}
          {activeTab === "reservas" && <div>RESERVAS</div>}
          {activeTab === "perfil" && <div>PERFIL</div>}
        </section>

        <nav
          className="bottom-tabs border-t-2 border-gray-300"
          aria-label="Navegacion principal"
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                className={"tab-button"}
                onClick={() => setActiveTab(tab.id)}
                aria-current={isActive ? "page" : undefined}
              >
                <Icon size={24} className={isActive ? "text-[#2DB84B]" : ""} />
                <p
                  className={`font-extrabold ${isActive ? "text-[#2DB84B]" : ""}`}
                >
                  {tab.label}
                </p>
              </button>
            );
          })}
        </nav>
      </main>
    </div>
  );
}

function Inicio() {
  const meses = [
    "enero",
    "febrero",
    "marzo",
    "abril",
    "mayo",
    "junio",
    "julio",
    "agosto",
    "septiembre",
    "octubre",
    "noviembre",
    "diciembre",
  ];
  const getCurrentDate = () => {
    const date = new Date();
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `Hoy, ${day} de ${meses[month - 1]}`;
  };
  return (
    <div className="p-1">
      <p className="my-2 font-bold text-lg">¡Hola, Juan!</p>
      <label className="search-box shadow-md">
        <input placeholder="¿A dónde vas?" />
        <MapPin size={20} className="text-black" />
      </label>

      <div className="flex items-center gap-10 mt-5">
        <button className="flex items-center gap-4 rounded-md shadow-md p-2 w-[55%] font-bold">
          <Calendar size={24} className="text-black" />
          <span className="font-semibold">{getCurrentDate()}</span>
        </button>
        <button className="flex items-center gap-4 rounded-md shadow-md p-2 font-bold">
          <CalendarClock size={24} className="text-black" />
          <span className="font-semibold">1 hora</span>
        </button>
      </div>

      <div className="mt-5 bg-slate-400 h-[180px]">
        <p>CONTENIDO MAPA</p>
      </div>

      <div className="rounded-md p-3 mt-3 shadow-lg ">
        <div className="flex items-center gap-6">
          <figure>
            <img
              src={ImagenDemo}
              alt="Imagen de demo"
              className="w-32 h-32 rounded-md"
            />
          </figure>

          <div>
            <p className="font-bold text-lg">Garage Belgrano</p>
            <span className="text-[#2DB84B] font-bold mt-1">Disponible</span>
            <p className="my-1">A 3 min • 0,2 km</p>
            <p className="font-bold my-2">$1.200 / hora</p>
          </div>
        </div>
        <div className="flex justify-center mt-4">
          <button className="bg-[#09142d] text-white p-3 font-semibold rounded-lg w-[98%]">
            Reservar ahora
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
