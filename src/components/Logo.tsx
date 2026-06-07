import LogoParkOn from "../../public/logo.webp";
import LogoPdf from "../../public/logo-pdf.png";
import LogoPdfHeaderExact from "../../public/logo-pdf-header-exact.png";
import LogoPdfLoginExact from "../../public/logo-pdf-login-exact.png";
import LogoPdfWhite from "../../public/logo-pdf-white.png";

export function Logo({
  dark = false,
  variant = "pdfLoginExact",
}: {
  dark?: boolean;
  variant?: "pdfColor" | "pdfWhite" | "pdfHeaderExact" | "pdfLoginExact" | "legacy";
}) {
  const logo =
    variant === "pdfHeaderExact"
      ? LogoPdfHeaderExact
      : variant === "pdfLoginExact"
        ? LogoPdfLoginExact
        : variant === "pdfWhite"
      ? LogoPdfWhite
      : variant === "pdfColor"
        ? LogoPdf
        : LogoParkOn;

  return (
    <img
      src={logo}
      alt="ParkOn"
      className={`h-auto object-contain ${dark ? "w-32" : "w-[126px]"}`}
    />
  );
}
