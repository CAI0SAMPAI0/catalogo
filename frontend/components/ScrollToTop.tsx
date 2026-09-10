"use client";

import { ChevronUp } from "lucide-react";
import { useEffect, useState } from "react";

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let ticking = false;

    function toggleVisibility() {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsVisible(window.scrollY > 300);
          ticking = false;
        });
        ticking = true;
      }
    }

    window.addEventListener("scroll", toggleVisibility, { passive: true });
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Voltar ao topo com animação suave"
      title="Voltar ao topo"
      className={`fixed bottom-6 right-6 z-40 p-3 rounded-2xl bg-white/90 backdrop-blur-md border border-slate-200 text-slate-700 shadow-lg hover:shadow-xl hover:bg-white hover:text-blue-600 hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer ${isVisible
        ? "opacity-100 translate-y-0 pointer-events-auto"
        : "opacity-0 translate-y-4 pointer-events-none"
        }`}
    >
      <ChevronUp className="w-5 h-5 stroke-[2.5]" />
    </button>
  );
}

