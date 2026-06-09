import LogoParkOn from "../../public/logo.webp";
import LogoPdf from "../../public/logo-pdf.png";
import LogoPdfHeaderExact from "../../public/logo-pdf-header-exact.png";
import LogoPdfLoginExact from "../../public/logo-pdf-login-exact.png";
import LogoPdfWhite from "../../public/logo-pdf-white.png";
import LogoHeaderClient from "../assets/logo_header_client.png";

export function Logo({
  dark = false,
  variant = "pdfLoginExact",
}: {
  dark?: boolean;
  variant?:
    | "clientHeader"
    | "pdfColor"
    | "pdfWhite"
    | "pdfHeaderExact"
    | "pdfLoginExact"
    | "legacy";
}) {
  const logo =
    variant === "clientHeader"
      ? LogoHeaderClient
      : variant === "pdfHeaderExact"
      ? LogoPdfHeaderExact
      : variant === "pdfLoginExact"
        ? LogoPdfLoginExact
        : variant === "pdfWhite"
      ? LogoPdfWhite
      : variant === "pdfColor"
        ? LogoPdf
        : LogoParkOn;
  const widthClass = variant === "clientHeader" ? "w-[168px]" : dark ? "w-32" : "w-[126px]";

  return (
    <img
      src={logo}
      alt="ParkOn"
      className={`h-auto object-contain ${widthClass}`}
    />
  );
}
