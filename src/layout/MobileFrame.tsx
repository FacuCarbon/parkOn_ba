import type { ReactNode } from "react";

export function MobileFrame({
  children,
  frameClassName = "",
  label = "ParkOn BA Conductor",
}: {
  children: ReactNode;
  frameClassName?: string;
  label?: string;
}) {
  return (
    <div className="app-shell">
      <main className={`phone-frame ${frameClassName}`} aria-label={label}>
        {children}
      </main>
    </div>
  );
}
