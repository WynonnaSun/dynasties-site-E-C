import React, { useMemo } from "react";

export function Footer() {
  const year = useMemo(() => new Date().getFullYear(), []);

  return (
    <footer className="w-full bg-brand-yellow text-black">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-10 md:flex-row md:items-center md:justify-between">
        <div className="max-w-md">
          <p className="text-sm leading-relaxed">
            Whether you are a brand seeking to extend into new categories,<br></br>
            or a manufacturer looking for brands to collaborate with,<br></br>
            {" "}
            <span className="font-semibold">let's chat!</span>
          </p>
        </div>
        <div className="text-sm">
          <div className="font-semibold">Contact Email:</div>
          <div className="mt-1 text-black/80">Contact@dynastiescapital.com</div>
          <div className="mt-2 text-xs text-black/60">© {year} Romance of Dynasties Investment Management Limited</div>
        </div>
      </div>
    </footer>
  );
}
