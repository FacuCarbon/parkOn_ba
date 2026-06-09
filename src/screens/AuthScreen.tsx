import { FormEvent, ReactNode, useState } from "react";
import type { LucideIcon } from "lucide-react";
import { Eye, LockKeyhole, Mail, UserRound } from "lucide-react";
import logoFull from "../assets/logo_full_white.jpeg";
import vehicleScene from "../assets/vehicle.jpeg";
import { useUser } from "../context/UserContext";
import { MobileFrame } from "../layout/MobileFrame";
import type { UserInput } from "../types/user";

type AuthMode = "login" | "register";

const emptyRegisterForm: UserInput = {
  nombre: "",
  email: "",
  password: "",
  telefono: "Pendiente",
  patente: "PENDIENTE",
  vehiculo: "Vehiculo pendiente",
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
    const missingField =
      registerForm.nombre.trim().length === 0 ||
      registerForm.email.trim().length === 0 ||
      registerForm.password.trim().length === 0;

    if (missingField) {
      setError("Completa todos los campos para crear tu cuenta.");
      return;
    }

    const hasValidPassword =
      registerForm.password.length >= 8 &&
      /[A-Za-z]/.test(registerForm.password) &&
      /\d/.test(registerForm.password);

    if (!hasValidPassword) {
      setError("La contrasena debe tener minimo 8 caracteres, una letra y un numero.");
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
    setError("Demo funcional: usa email y contrasena para continuar.");
  }

  return (
    <MobileFrame label="Acceso ParkOn BA" frameClassName="auth-frame">
      <section className="h-full min-h-0 overflow-y-auto bg-[#fbfbfd] px-[30px] pb-[calc(18px+env(safe-area-inset-bottom))] pt-[14px] text-[#071226]">
        <header className="grid justify-items-center text-center">
          <img
            className="h-auto w-[142px] object-contain"
            src={logoFull}
            alt="ParkOn"
          />
          <p className="mt-1 text-[0.78rem] font-extrabold leading-[1.32] text-[#101c31]">
            Encuentra, reserva y estaciona
            <span className="block text-[#22bf7d]">en tiempo real.</span>
          </p>
        </header>

        <div className="relative -mx-[18px] mt-2">
          <img
            className="mx-auto h-[132px] w-full object-contain"
            src={vehicleScene}
            alt="Auto junto a mapa de estacionamientos disponibles"
          />
        </div>

        <div className="mt-4 text-center">
          <h1 className="text-[1.26rem] font-black leading-tight text-[#081c3d]">
            {mode === "login" ? "Inicia sesión" : "Crea tu cuenta"}
          </h1>
          <p className="mt-1.5 text-[0.82rem] font-bold text-[#7a8492]">
            {mode === "login"
              ? "Encuentra tu lugar en segundos."
              : "Es rápido, fácil y seguro."}
          </p>
        </div>

        <div className="mt-5">
          {mode === "login" ? (
            <form className="grid gap-[11px]" onSubmit={handleLogin}>
              <AuthField icon={Mail}>
                <input
                  className="min-w-0 flex-1 border-0 bg-transparent text-[0.92rem] font-semibold text-[#071226] outline-0 placeholder:text-[#8c95a1]"
                  type="email"
                  placeholder="Correo electrónico"
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
              <AuthField icon={LockKeyhole}>
                <input
                  className="min-w-0 flex-1 border-0 bg-transparent text-[0.92rem] font-semibold text-[#071226] outline-0 placeholder:text-[#8c95a1]"
                  type={showPassword ? "text" : "password"}
                  placeholder="Contraseña"
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
                  className="grid h-9 w-9 place-items-center border-0 bg-transparent p-0 text-[#707b87]"
                  onClick={() => setShowPassword((current) => !current)}
                  type="button"
                  aria-label="Mostrar u ocultar contrasena"
                >
                  <Eye size={22} />
                </button>
              </AuthField>
              {/* <button
                className="-mt-1 ml-auto border-0 bg-transparent text-[0.72rem] font-black text-[#22bf7d]"
                onClick={showDemoOnlyMessage}
                type="button"
              >
                ¿Olvidaste tu contrasena?
              </button> */}
              {error && (
                <p className="m-0 text-center text-[0.76rem] font-extrabold text-[#d12f2f]">
                  {error}
                </p>
              )}
              <button
                className="mt-1 min-h-[52px] rounded-[22px] border-0 bg-[#22bf7d] text-[0.96rem] font-black text-white shadow-[0_12px_24px_rgba(34,191,125,0.28)]"
                type="submit"
              >
                Iniciar sesión
              </button>
            </form>
          ) : (
            <form className="grid gap-[11px]" onSubmit={handleRegister}>
              <AuthField icon={UserRound}>
                <input
                  className="min-w-0 flex-1 border-0 bg-transparent text-[0.92rem] font-semibold text-[#071226] outline-0 placeholder:text-[#8c95a1]"
                  value={registerForm.nombre}
                  placeholder="Nombre completo"
                  onChange={(event) =>
                    setRegisterForm((form) => ({
                      ...form,
                      nombre: event.target.value,
                    }))
                  }
                  required
                />
              </AuthField>
              <AuthField icon={Mail}>
                <input
                  className="min-w-0 flex-1 border-0 bg-transparent text-[0.92rem] font-semibold text-[#071226] outline-0 placeholder:text-[#8c95a1]"
                  type="email"
                  value={registerForm.email}
                  placeholder="Correo electrónico"
                  onChange={(event) =>
                    setRegisterForm((form) => ({
                      ...form,
                      email: event.target.value,
                    }))
                  }
                  required
                />
              </AuthField>
              <AuthField icon={LockKeyhole}>
                <input
                  className="min-w-0 flex-1 border-0 bg-transparent text-[0.92rem] font-semibold text-[#071226] outline-0 placeholder:text-[#8c95a1]"
                  type={showPassword ? "text" : "password"}
                  value={registerForm.password}
                  placeholder="Contraseña"
                  onChange={(event) =>
                    setRegisterForm((form) => ({
                      ...form,
                      password: event.target.value,
                    }))
                  }
                  required
                />
                <button
                  className="grid h-9 w-9 place-items-center border-0 bg-transparent p-0 text-[#707b87]"
                  onClick={() => setShowPassword((current) => !current)}
                  type="button"
                  aria-label="Mostrar u ocultar contrasena"
                >
                  <Eye size={22} />
                </button>
              </AuthField>
              <p className="-mt-1 mb-1 pl-10 text-[0.66rem] font-bold text-[#707b87]">
                Mínimo 8 caracteres, con letra y número.
              </p>
              {error && (
                <p className="m-0 text-center text-[0.76rem] font-extrabold text-[#d12f2f]">
                  {error}
                </p>
              )}
              <button
                className="min-h-[52px] rounded-[22px] border-0 bg-[#22bf7d] text-[0.96rem] font-black text-white shadow-[0_12px_24px_rgba(34,191,125,0.28)]"
                type="submit"
              >
                Registrarse
              </button>
            </form>
          )}

          <div className="my-4 flex items-center gap-3">
            <span className="h-px flex-1 bg-[#dfe3e8]" />
            <span className="text-[0.72rem] font-bold text-[#8a929d]">
              o {mode === "login" ? "continúa" : "regístrate"} con
            </span>
            <span className="h-px flex-1 bg-[#dfe3e8]" />
          </div>
          <div className="grid gap-2">
            <button
              className="flex min-h-[46px] items-center justify-center gap-4 rounded-[15px] border border-[#e2e5ea] bg-white text-[0.84rem] font-black text-[#1b2430]"
              onClick={showDemoOnlyMessage}
              type="button"
            >
              <GoogleIcon />
              Continuar con Google
            </button>
            <button
              className="flex min-h-[46px] items-center justify-center gap-4 rounded-[15px] border border-[#e2e5ea] bg-white text-[0.84rem] font-black text-[#1b2430]"
              onClick={showDemoOnlyMessage}
              type="button"
            >
              <AppleIcon />
              Continuar con Apple
            </button>
          </div>

          <div className="mt-5 text-center text-[0.8rem] font-bold text-[#7d8792]">
            {mode === "login" ? "¿No tienes cuenta?" : "¿Ya tienes cuenta?"}{" "}
            <button
              className="border-0 bg-transparent font-black text-[#22bf7d]"
              onClick={() =>
                switchMode(mode === "login" ? "register" : "login")
              }
              type="button"
            >
              {mode === "login" ? "Regístrate" : "Inicia sesión"}
            </button>
          </div>
        </div>
      </section>
    </MobileFrame>
  );
}

function AuthField({
  children,
  icon: Icon,
}: {
  children: ReactNode;
  icon: LucideIcon;
}) {
  return (
    <label className="flex min-h-[50px] items-center gap-[16px] rounded-[14px] border border-[#d9dde4] bg-white px-[16px] text-[#707b87]">
      <Icon size={20} strokeWidth={2.1} />
      {children}
    </label>
  );
}

function GoogleIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-6 w-6 shrink-0"
      viewBox="0 0 24 24"
    >
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06L5.84 9.9C6.71 7.3 9.14 5.38 12 5.38z"
        fill="#EA4335"
      />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-6 w-6 shrink-0"
      viewBox="0 0 24 24"
      fill="none"
    >
      <g transform="translate(12 12) scale(1.18) translate(-12 -12)">
        <path
          d="M16.68 12.18c-.02-2.16 1.78-3.19 1.86-3.24-1.02-1.49-2.59-1.69-3.14-1.71-1.32-.14-2.6.79-3.27.79-.69 0-1.72-.77-2.84-.75-1.45.02-2.81.86-3.55 2.17-1.54 2.66-.39 6.58 1.08 8.73.74 1.06 1.6 2.24 2.74 2.2 1.11-.04 1.52-.7 2.86-.7 1.33 0 1.72.7 2.88.68 1.2-.02 1.96-1.06 2.67-2.13.86-1.22 1.2-2.43 1.22-2.49-.03-.01-2.49-.95-2.51-3.55z"
          fill="#111111"
        />
        <path
          d="M14.54 5.83c.6-.75 1.01-1.76.9-2.79-.87.04-1.96.6-2.58 1.33-.56.65-1.06 1.7-.93 2.68.98.08 1.98-.49 2.61-1.22z"
          fill="#111111"
        />
      </g>
    </svg>
  );
}
