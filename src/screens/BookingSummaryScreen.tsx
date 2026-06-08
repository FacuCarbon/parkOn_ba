import { ArrowLeft, CreditCard, LockKeyhole, ShieldCheck } from "lucide-react";
import { useState } from "react";
import type { BookingSelection } from "../types/booking";
import type { Parking } from "../types/parking";

export function BookingSummaryScreen({
  parking,
  selection,
  onPay,
  onBack,
}: {
  parking: Parking;
  selection: BookingSelection | null;
  onPay: (paymentMethod: string) => void;
  onBack: () => void;
}) {
  const fallbackStartDate = new Date();
  fallbackStartDate.setMinutes(
    fallbackStartDate.getMinutes() < 30 ? 30 : 60,
    0,
    0,
  );
  const fallbackEndDate = new Date(fallbackStartDate);
  fallbackEndDate.setHours(fallbackEndDate.getHours() + 2);
  const dateLabel =
    selection?.dateLabel ??
    `Hoy, ${fallbackStartDate.toLocaleDateString("es-AR", {
      day: "numeric",
      month: "long",
    })}`;
  const startTime =
    selection?.startTime ??
    fallbackStartDate.toLocaleTimeString("es-AR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  const endTime =
    selection?.endTime ??
    fallbackEndDate.toLocaleTimeString("es-AR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  const durationHours = selection?.durationHours ?? 2;
  const total = selection?.total ?? 2400;
  const [paymentMethod, setPaymentMethod] = useState("**** 4242");
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);

  return (
    <section className="h-full overflow-y-auto bg-white px-[18px] pb-5 pt-5 text-[#071226]">
      <div className="mb-5 flex items-center gap-3">
        <button
          className="grid h-9 w-9 place-items-center rounded-full border-0 bg-[#f2f5f9] text-[#071226]"
          onClick={onBack}
          type="button"
          aria-label="Volver"
        >
          <ArrowLeft size={19} />
        </button>
        <h1 className="text-[1.02rem] font-black">Resumen de reserva</h1>
      </div>

      <div className="flex items-start gap-3">
        <img
          src={parking.imagen}
          alt={parking.nombre}
          className="h-[52px] w-[72px] rounded-md object-cover"
        />
        <div>
          <h2 className="text-sm font-black">{parking.nombre}</h2>
          <p className="mt-1 text-xs font-bold text-[#4b5870]">
            A 2 min · {parking.distancia}
          </p>
        </div>
      </div>

      <div className="my-4 h-px bg-[#e5eaf1]" />

      <div className="grid gap-4 text-xs font-bold">
        <div>
          <p className="m-0 text-[#4b5870]">Fecha</p>
          <p className="m-0 mt-1 text-[#071226]">{dateLabel}</p>
        </div>
        <div>
          <p className="m-0 text-[#4b5870]">Horario</p>
          <p className="m-0 mt-1 text-[#071226]">
            {startTime} a {endTime} ({durationHours} hs)
          </p>
        </div>
      </div>

      <div className="my-4 h-px bg-[#e5eaf1]" />

      <div className="flex items-center justify-between text-sm font-black">
        <span>Total a pagar</span>
        <strong className="text-lg">${total.toLocaleString("es-AR")}</strong>
      </div>

      <div className="my-4 h-px bg-[#e5eaf1]" />

      <div>
        <p className="mb-2 text-xs font-bold text-[#4b5870]">Metodo de pago</p>
        <div className="flex items-center justify-between">
          <p className="m-0 flex items-center gap-2 text-xs font-black">
            <CreditCard size={16} className="text-[#002856]" />
            {paymentMethod}
          </p>
          <button
            className="border-0 bg-transparent text-xs font-black text-[#2DB84B]"
            onClick={() => setShowPaymentOptions((current) => !current)}
            type="button"
          >
            Cambiar
          </button>
        </div>
        {showPaymentOptions && (
          <div className="mt-3 grid gap-2">
            {["**** 4242", "Mercado Pago", "Efectivo al llegar"].map(
              (method) => (
                <button
                  key={method}
                  className={`rounded-lg border px-3 py-2 text-left text-xs font-black ${
                    paymentMethod === method
                      ? "border-[#2DB84B] bg-[#f4fbf5] text-[#071226]"
                      : "border-[#e5eaf1] bg-white text-[#4b5870]"
                  }`}
                  onClick={() => {
                    setPaymentMethod(method);
                    setShowPaymentOptions(false);
                  }}
                  type="button"
                >
                  {method}
                </button>
              ),
            )}
          </div>
        )}
      </div>

      <p className="mt-5 flex items-center gap-2 text-sm font-black text-[#25324a]">
        <LockKeyhole size={16} className="text-[#2DB84B]" />
        Pago 100% seguro
      </p>

      <div className="mt-7 flex items-start gap-3 rounded-md bg-white text-xs font-bold text-[#25324a]">
        <ShieldCheck size={28} className="shrink-0 text-[#2DB84B]" />
        <p className="m-0">
          Tu reserva esta garantizada
          <br />
          Recibiras el QR por correo y en la app.
        </p>
      </div>

      <div className="-mx-[18px] mt-6 border-t border-[#e5eaf1] bg-[#f7f9fc] px-[18px] py-4">
        <button
          className="min-h-[47px] w-full rounded-md border-0 bg-[#2DB84B] text-sm font-black text-white shadow-[0_10px_22px_rgba(45,184,75,0.24)]"
          onClick={() => onPay(paymentMethod)}
          type="button"
        >
          Pagar y confirmar
        </button>
      </div>
    </section>
  );
}
