import React from "react";
import { Building2, Command, Globe, Hexagon, Component, Layers, Box, Cpu } from "lucide-react";

const LOGOS = [
  { name: "Acme Corp", icon: Building2 },
  { name: "Globex", icon: Globe },
  { name: "Soylent", icon: Hexagon },
  { name: "Initech", icon: Command },
  { name: "Umbrella", icon: Component },
  { name: "Massive Dynamic", icon: Layers },
  { name: "Cyberdyne", icon: Cpu },
  { name: "Stark Ind", icon: Box },
];

export function TrustedByLogos() {
  return (
    <div className="w-full bg-white py-12 border-b border-border overflow-hidden flex flex-col items-center">
      <div className="max-w-[1200px] w-full px-5 md:px-12 lg:px-24 mb-8">
        <p className="text-center text-[12px] font-bold text-gray-400 uppercase tracking-[0.1em]">
          Trusted by 500+ fast-growing startups
        </p>
      </div>
      <div className="relative w-full max-w-[1440px] flex overflow-hidden">
        {/* Gradient overlays for smooth fading at the edges */}
        <div className="absolute top-0 left-0 bottom-0 w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute top-0 right-0 bottom-0 w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
        
        <div className="flex w-max animate-marquee">
          <div className="flex items-center px-4 gap-12 md:gap-20">
            {LOGOS.map((Logo, i) => (
              <div key={i} className="flex items-center gap-2.5 text-gray-400 opacity-60 grayscale hover:opacity-100 hover:text-primary hover:grayscale-0 transition-all duration-300 cursor-default">
                <Logo.icon className="w-6 h-6 md:w-7 md:h-7" strokeWidth={2.5} />
                <span className="font-extrabold text-[18px] md:text-[20px] tracking-tight">{Logo.name}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center px-4 gap-12 md:gap-20" aria-hidden="true">
            {LOGOS.map((Logo, i) => (
              <div key={`duplicate-${i}`} className="flex items-center gap-2.5 text-gray-400 opacity-60 grayscale hover:opacity-100 hover:text-primary hover:grayscale-0 transition-all duration-300 cursor-default">
                <Logo.icon className="w-6 h-6 md:w-7 md:h-7" strokeWidth={2.5} />
                <span className="font-extrabold text-[18px] md:text-[20px] tracking-tight">{Logo.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
