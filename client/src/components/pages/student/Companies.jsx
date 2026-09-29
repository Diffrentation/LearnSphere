import React from "react";

const LOGOS = [
  { name: "Bloom", value: "Bloom" },
  { name: "DPS", value: "DPS" },
  { name: "Genius", value: "Genius" },
  { name: "Deepak", value: "Deepak" },
  { name: "Memorial", value: "Memorial" },
  { name: "Adharsh", value: "Adharsh" },
];

export default function Companies() {
  const duplicated = [...LOGOS, ...LOGOS];

  return (
    <section className="relative w-full py-10 bg-cyan-100/5 mt-14">
      <h2 className="text-center text-sm md:text-base font-medium text-white mb-16">
        Trusted by leading Schools
      </h2>

      <div className="relative overflow-hidden group">
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-white to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-white to-transparent z-10" />

        <ul className="animate-marquee group-hover:[animation-play-state:paused] w-max flex items-center gap-12">
          {duplicated.map((logo, i) => (
            <li
              key={i}
              className="shrink-0 text-xl font-semibold text-gray-700 border border-gray-300 px-6 py-2 rounded-xl bg-white shadow-sm"
            >
              {logo.name}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
