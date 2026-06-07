import { FormEvent, ReactNode, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Apple,
  Car,
  Eye,
  LockKeyhole,
  Mail,
  Phone,
  UserRound,
} from "lucide-react";
import { Logo } from "../components/Logo";
import { useUser } from "../context/UserContext";
import { MobileFrame } from "../layout/MobileFrame";
import type { UserInput } from "../types/user";

type AuthMode = "login" | "register";

const emptyRegisterForm: UserInput = {
  nombre: "",
  email: "",
  password: "",
  telefono: "",
  patente: "",
  vehiculo: "",
};

export function AuthScreen() {
  const { login, register } = useUser();
  const [mode, setMode] = useState<AuthMode>("login");
  const [loginForm, setLoginForm] = useState({
    email: "juan@parkonba.com",
    password: "123456",
  });
  const [registerForm, setRegisterForm] =
    useState<UserInput>(emptyRegisterForm);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = login(loginForm.email, loginForm.password);
    setError(result.ok ? "" : result.error);
  }

  function handleRegister(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const missingField = Object.values(registerForm).some(
      (value) => value.trim().length === 0,
    );

    if (missingField) {
      setError("Completa todos los campos para crear tu cuenta.");
      return;
    }

    const result = register(registerForm);
    setError(result.ok ? "" : result.error);
  }

  function switchMode(nextMode: AuthMode) {
    setMode(nextMode);
    setError("");
  }

  function showDemoOnlyMessage() {
    setError("Demo funcional: usá email y contrasena para continuar.");
  }

  return (
    <MobileFrame label="Acceso ParkOn BA" frameClassName="auth-frame">
      <section className="h-full min-h-0 overflow-y-auto bg-white px-[26px] pb-[calc(24px+env(safe-area-inset-bottom))] pt-[42px] text-[#071226]">
        <div className={mode === "login" ? "mb-[42px]" : "mb-6"}>
          <Logo dark variant="pdfLoginExact" />
        </div>

        <div>
          <h1 className="text-[1rem] font-black leading-tight">
            {mode === "login" ? "¡Bienvenido!" : "Crear cuenta"}
          </h1>
          <p className="mt-1 text-[0.72rem] font-bold text-[#24324a]">
            {mode === "login"
              ? "Inicia sesion para continuar"
              : "Completa tus datos para empezar"}
          </p>
        </div>

        <div className={mode === "login" ? "mt-7" : "mt-4"}>
          {mode === "login" ? (
            <form className="grid gap-[15px]" onSubmit={handleLogin}>
              <AuthField icon={Mail} label="Email o celular">
                <input
                  className="min-h-[39px] w-full rounded-md border border-[#e2e7ef] bg-white px-3 text-[0.72rem] font-bold text-[#071226] outline-0 placeholder:text-[#98a5b8]"
                  type="email"
                  placeholder="ej: usuario@email.com"
                  value={loginForm.email}
                  onChange={(event) =>
                    setLoginForm((form) => ({
                      ...form,
                      email: event.target.value,
                    }))
                  }
                  required
                />
              </AuthField>
              <AuthField icon={LockKeyhole} label="Contrasena">
                <div className="flex min-h-[39px] items-center gap-2 rounded-md border border-[#e2e7ef] bg-white px-3">
                  <input
                    className="min-w-0 flex-1 border-0 bg-transparent text-[0.72rem] font-bold text-[#071226] outline-0"
                    type={showPassword ? "text" : "password"}
                    value={loginForm.password}
                    onChange={(event) =>
                      setLoginForm((form) => ({
                        ...form,
                        password: event.target.value,
                      }))
                    }
                    required
                  />
                  <button
                    className="border-0 bg-transparent p-0 text-[#6c788b]"
                    onClick={() => setShowPassword((current) => !current)}
                    type="button"
                    aria-label="Mostrar u ocultar contrasena"
                  >
                    <Eye size={17} />
                  </button>
                </div>
              </AuthField>
              <button
                className="-mt-1 ml-auto border-0 bg-transparent text-[0.66rem] font-black text-[#2DB84B]"
                onClick={showDemoOnlyMessage}
                type="button"
              >
                ¿Olvidaste tu contrasena?
              </button>
              {error && (
                <p className="m-0 text-[0.72rem] font-extrabold text-[#d12f2f]">
                  {error}
                </p>
              )}
              <button
                className="min-h-[44px] rounded-md border-0 bg-[#002856] text-[0.78rem] font-black text-white shadow-[0_10px_22px_rgba(0,40,86,0.22)]"
                type="submit"
              >
                Iniciar sesion
              </button>
            </form>
          ) : (
            <form className="grid gap-2.5" onSubmit={handleRegister}>
              <AuthField icon={UserRound} label="Nombre completo">
                <input
                  className="min-h-[38px] w-full rounded-md border border-[#e2e7ef] bg-white px-3 text-[0.72rem] font-bold text-[#071226] outline-0"
                  value={registerForm.nombre}
                  placeholder="Nombre y apellido"
                  onChange={(event) =>
                    setRegisterForm((form) => ({
                      ...form,
                      nombre: event.target.value,
                    }))
                  }
                  required
                />
              </AuthField>
                <AuthField icon={Mail} label="Email">
                <input
                  className="min-h-[38px] w-full rounded-md border border-[#e2e7ef] bg-white px-3 text-[0.72rem] font-bold text-[#071226] outline-0"
                  type="email"
                  value={registerForm.email}
                  placeholder="tu@email.com"
                  onChange={(event) =>
                    setRegisterForm((form) => ({
                      ...form,
                      email: event.target.value,
                    }))
                  }
                  required
                />
              </AuthField>
              <AuthField icon={LockKeyhole} label="Contrasena">
                <input
                  className="min-h-[38px] w-full rounded-md border border-[#e2e7ef] bg-white px-3 text-[0.72rem] font-bold text-[#071226] outline-0"
                  type="password"
                  value={registerForm.password}
                  placeholder="Minimo 6 caracteres"
                  onChange={(event) =>
                    setRegisterForm((form) => ({
                      ...form,
                      password: event.target.value,
                    }))
                  }
                  required
                />
              </AuthField>
              <AuthField icon={Phone} label="Telefono">
                <input
                  className="min-h-[38px] w-full rounded-md border border-[#e2e7ef] bg-white px-3 text-[0.72rem] font-bold text-[#071226] outline-0"
                  value={registerForm.telefono}
                  placeholder="11 2345-6789"
                  onChange={(event) =>
                    setRegisterForm((form) => ({
                      ...form,
                      telefono: event.target.value,
                    }))
                  }
                  required
                />
              </AuthField>
              <div className="grid grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] gap-2.5">
                <AuthField icon={Car} label="Patente">
                  <input
                    className="min-h-[38px] w-full rounded-md border border-[#e2e7ef] bg-white px-3 text-[0.72rem] font-bold text-[#071226] outline-0"
                    value={registerForm.patente}
                    placeholder="AA123BB"
                    onChange={(event) =>
                      setRegisterForm((form) => ({
                        ...form,
                        patente: event.target.value,
                      }))
                    }
                    required
                  />
                </AuthField>
                <AuthField icon={Car} label="Vehiculo">
                  <input
                    className="min-h-[38px] w-full rounded-md border border-[#e2e7ef] bg-white px-3 text-[0.72rem] font-bold text-[#071226] outline-0"
                    value={registerForm.vehiculo}
                    placeholder="Auto, moto, SUV"
                    onChange={(event) =>
                      setRegisterForm((form) => ({
                        ...form,
                        vehiculo: event.target.value,
                      }))
                    }
                    required
                  />
                </AuthField>
              </div>
              {error && (
                <p className="m-0 text-[0.72rem] font-extrabold text-[#d12f2f]">
                  {error}
                </p>
              )}
              <button
                className="min-h-[44px] rounded-md border-0 bg-[#002856] text-[0.78rem] font-black text-white shadow-[0_10px_22px_rgba(0,40,86,0.22)]"
                type="submit"
              >
                Crear cuenta
              </button>
            </form>
          )}

          <div className="mt-4 text-center text-[0.72rem] font-bold text-[#24324a]">
            {mode === "login" ? "¿No tenes cuenta?" : "¿Ya tenes cuenta?"}{" "}
            <button
              className="border-0 bg-transparent font-black text-[#2DB84B]"
              onClick={() =>
                switchMode(mode === "login" ? "register" : "login")
              }
              type="button"
            >
              {mode === "login" ? "Registrate" : "Iniciar sesion"}
            </button>
          </div>

          {mode === "login" && (
            <>
              <div className="my-5 flex items-center gap-3">
                <span className="h-px flex-1 bg-[#e5eaf1]" />
                <span className="text-[0.66rem] font-bold text-[#9aa6b8]">
                  O continua con
                </span>
                <span className="h-px flex-1 bg-[#e5eaf1]" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button
                  className="flex min-h-[39px] items-center justify-center gap-2 rounded-md border border-[#e2e7ef] bg-white text-[0.72rem] font-black text-[#071226]"
                  onClick={showDemoOnlyMessage}
                  type="button"
                >
                  <span className="font-black text-[#4285f4]">G</span>
                  Google
                </button>
                <button
                  className="flex min-h-[39px] items-center justify-center gap-2 rounded-md border border-[#e2e7ef] bg-white text-[0.72rem] font-black text-[#071226]"
                  onClick={showDemoOnlyMessage}
                  type="button"
                >
                  <Apple size={17} className="fill-[#071226]" />
                  Apple
                </button>
              </div>
            </>
          )}
        </div>
      </section>
    </MobileFrame>
  );
}

function AuthField({
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
      <span className="flex items-center gap-[7px] text-[0.68rem] font-black text-[#24324a]">
        <Icon size={14} />
        {label}
      </span>
      {children}
    </label>
  );
}
