import { FormEvent, ReactNode, useState } from "react";
import type { LucideIcon } from "lucide-react";
import { Car, Mail, Phone, User } from "lucide-react";
import { useUser } from "../context/UserContext";
import type { UserInput } from "../types/user";

export function ProfileScreen() {
  const { currentUser, updateCurrentUser } = useUser();
  const [form, setForm] = useState<UserInput>(() => ({
    nombre: currentUser?.nombre ?? "",
    email: currentUser?.email ?? "",
    password: currentUser?.password ?? "",
    telefono: currentUser?.telefono ?? "",
    patente: currentUser?.patente ?? "",
    vehiculo: currentUser?.vehiculo ?? "",
  }));
  const [message, setMessage] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = updateCurrentUser(form);
    setMessage(result.ok ? "Datos actualizados." : result.error);
  }

  function updateField(field: keyof UserInput, value: string) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  return (
    <div className="h-full overflow-y-auto px-6 pb-28 pt-5 text-[#071226]">
      <div>
        <span className="text-xs font-black uppercase text-[#2DB84B]">
          Cuenta
        </span>
        <h1 className="mt-1 text-xl font-black">Datos del conductor</h1>
      </div>

      <div className="mt-4 flex items-center gap-[13px] rounded-[18px] bg-[#09142d] p-3.5 text-white">
        <div className="grid h-[52px] w-[52px] place-items-center rounded-2xl bg-[#2DB84B] text-[1.35rem] font-black text-[#06101f]">
          {currentUser?.nombre.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="m-0 font-black">{currentUser?.nombre}</p>
          <span className="text-[0.82rem] font-extrabold text-[#b7c8ea]">
            {currentUser?.patente}
          </span>
        </div>
      </div>

      <form className="mt-3.5 grid gap-3" onSubmit={handleSubmit}>
        <ProfileField icon={User} label="Nombre completo">
          <input
            className="min-h-11 w-full rounded-[13px] border border-[#9db0d6]/25 bg-[#f7f9fc] px-3 font-bold text-[#06101f] outline-0"
            value={form.nombre}
            onChange={(event) => updateField("nombre", event.target.value)}
            required
          />
        </ProfileField>
        <ProfileField icon={Mail} label="Email">
          <input
            className="min-h-11 w-full rounded-[13px] border border-[#9db0d6]/25 bg-[#f7f9fc] px-3 font-bold text-[#06101f] outline-0"
            type="email"
            value={form.email}
            onChange={(event) => updateField("email", event.target.value)}
            required
          />
        </ProfileField>
        <ProfileField icon={Phone} label="Telefono">
          <input
            className="min-h-11 w-full rounded-[13px] border border-[#9db0d6]/25 bg-[#f7f9fc] px-3 font-bold text-[#06101f] outline-0"
            value={form.telefono}
            onChange={(event) => updateField("telefono", event.target.value)}
            required
          />
        </ProfileField>
        <ProfileField icon={Car} label="Patente">
          <input
            className="min-h-11 w-full rounded-[13px] border border-[#9db0d6]/25 bg-[#f7f9fc] px-3 font-bold text-[#06101f] outline-0"
            value={form.patente}
            onChange={(event) => updateField("patente", event.target.value)}
            required
          />
        </ProfileField>
        <ProfileField icon={Car} label="Vehiculo">
          <input
            className="min-h-11 w-full rounded-[13px] border border-[#9db0d6]/25 bg-[#f7f9fc] px-3 font-bold text-[#06101f] outline-0"
            value={form.vehiculo}
            onChange={(event) => updateField("vehiculo", event.target.value)}
            required
          />
        </ProfileField>
        <ProfileField icon={User} label="Contrasena">
          <input
            className="min-h-11 w-full rounded-[13px] border border-[#9db0d6]/25 bg-[#f7f9fc] px-3 font-bold text-[#06101f] outline-0"
            type="password"
            value={form.password}
            onChange={(event) => updateField("password", event.target.value)}
            required
          />
        </ProfileField>

        {message && (
          <p className="m-0 text-[0.82rem] font-black text-[#187a2f]">
            {message}
          </p>
        )}
        <button
          className="min-h-[50px] rounded-[15px] border-0 bg-[#2DB84B] font-black text-[#06101f] shadow-[0_12px_28px_rgba(45,184,75,0.26)]"
          type="submit"
        >
          Guardar cambios
        </button>
      </form>
    </div>
  );
}

function ProfileField({
  children,
  icon: Icon,
  label,
}: {
  children: ReactNode;
  icon: LucideIcon;
  label: string;
}) {
  return (
    <label className="grid gap-[7px]">
      <span className="flex items-center gap-[7px] text-xs font-extrabold text-[#24324a]">
        <Icon size={16} />
        {label}
      </span>
      {children}
    </label>
  );
}
