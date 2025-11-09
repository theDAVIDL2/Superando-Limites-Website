import React, { useEffect, useRef, useState, memo } from "react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { throttle } from "../utils/throttle";
// Individual icon import for better tree-shaking
import ShoppingCart from "lucide-react/dist/esm/icons/shopping-cart";

export const StickyBuyBar = memo(({ priceLabel, onBuy }) => {
  const [show, setShow] = useState(false);
  const [footerVisible, setFooterVisible] = useState(false);

  const barRef = useRef(null);

  useEffect(() => {
    const onScroll = throttle(() => {
      const y = window.scrollY || 0;
      const h = document.body.scrollHeight - window.innerHeight;
      setShow(y > 280 && h > 0); // aparece depois do herói
    }, 100);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    // Observe footer visibility to avoid covering it
    const footer = document.querySelector('footer');
    if (!footer) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => setFooterVisible(e.isIntersecting));
    }, { threshold: 0.01 });
    io.observe(footer);
    return () => io.disconnect();
  }, []);

  // Expose sticky bar height as a CSS variable so floating widgets can avoid overlap
  useEffect(() => {
    const updateSpace = () => {
      const active = show && !footerVisible;
      const height = active && barRef.current ? barRef.current.getBoundingClientRect().height : 0;
      const space = active ? Math.ceil(height + 8) : 0; // small cushion
      document.documentElement.style.setProperty('--sticky-buybar-space', `${space}px`);
    };
    updateSpace();
    window.addEventListener('resize', updateSpace);
    return () => window.removeEventListener('resize', updateSpace);
  }, [show, footerVisible]);

  return (
    <>
      {/* SVG Filters para Liquid Glass Effect */}
      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <defs>
          <filter id="liquid-glass-filter" x="-50%" y="-50%" width="200%" height="200%">
            {/* Turbulência para criar distorção */}
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.012"
              numOctaves="3"
              result="turbulence"
            />
            
            {/* Displacement map para refração */}
            <feDisplacementMap
              in="SourceGraphic"
              in2="turbulence"
              scale="30"
              xChannelSelector="R"
              yChannelSelector="G"
              result="displacement"
            />
            
            {/* Blur gaussiano suave */}
            <feGaussianBlur in="displacement" stdDeviation="1.5" result="blur" />
            
            {/* Aumentar saturação para cores mais vivas */}
            <feColorMatrix
              in="blur"
              type="saturate"
              values="1.3"
              result="saturate"
            />
            
            {/* Componente especular para brilho */}
            <feSpecularLighting
              in="blur"
              surfaceScale="3"
              specularConstant="0.8"
              specularExponent="20"
              result="specular"
            >
              <fePointLight x="-100" y="-100" z="200" />
            </feSpecularLighting>
            
            {/* Composição final */}
            <feComposite
              in="saturate"
              in2="specular"
              operator="arithmetic"
              k1="0"
              k2="1"
              k3="1"
              k4="0"
              result="composite"
            />
          </filter>
        </defs>
      </svg>

      <div
        ref={barRef}
        className={`fixed inset-x-0 bottom-4 z-[60] transition-all duration-300 px-4 pr-[env(safe-area-inset-right,0px)] pl-[env(safe-area-inset-left,0px)] pb-[env(safe-area-inset-bottom,0px)] ${
          show && !footerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6 pointer-events-none"
        }`}
      >
        <div className="mx-auto max-w-3xl w-[min(100%,_calc(100vw_-_2rem))]">
          <Card 
            className="relative flex items-center justify-between gap-3 rounded-2xl shadow-2xl px-4 py-3 overflow-visible border-white/20 dark:border-white/10"
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'url(#liquid-glass-filter) blur(20px) saturate(180%)',
              WebkitBackdropFilter: 'url(#liquid-glass-filter) blur(20px) saturate(180%)',
            }}
          >
            {/* Borda interna brilhante */}
            <div className="absolute inset-0 rounded-2xl" style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.3) 100%)',
              pointerEvents: 'none'
            }} />
            
            {/* Highlight superior */}
            <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/60 to-transparent" />
            
            {/* Conteúdo */}
            <div className="relative text-base md:text-lg font-semibold truncate text-zinc-900 dark:text-white drop-shadow-[0_1px_2px_rgba(255,255,255,0.5)]">
              {priceLabel}
            </div>
            <Button onClick={onBuy} className="relative liquid-btn hover-glow h-12 md:h-11 px-5 md:px-6 text-sm md:text-base">
              <ShoppingCart className="mr-2 h-5 w-5 md:h-4 md:w-4" /> Comprar agora
            </Button>
          </Card>
        </div>
      </div>
    </>
  );
}, (prevProps, nextProps) => {
  // Evita re-render se props não mudarem
  return prevProps.priceLabel === nextProps.priceLabel &&
         prevProps.onBuy === nextProps.onBuy;
});