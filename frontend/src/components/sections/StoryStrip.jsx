import React, { memo } from "react";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Card, CardContent } from "../../components/ui/card";
import { OptimizedImage } from "../OptimizedImage";
import { useInView } from "../../hooks/useInView";
// Individual icon imports for better tree-shaking
import Check from "lucide-react/dist/esm/icons/check";
import ShoppingCart from "lucide-react/dist/esm/icons/shopping-cart";
import Sparkles from "lucide-react/dist/esm/icons/sparkles";
import TrendingUp from "lucide-react/dist/esm/icons/trending-up";

export const StoryStrip = memo(({ title, subtitle, bullets = [], imageUrl, imageSrcSet, imageAvifSrcSet, imageFallbackSrc, sizes, onBuy, priceLabel }) => {
  const [ref, inView] = useInView({ threshold: 0.1, rootMargin: '0px 0px -10% 0px' });
  const [bulletsRef, bulletsInView] = useInView({ threshold: 0.2, rootMargin: '0px 0px -5% 0px' });

  return (
    <section ref={ref} className="relative mx-auto max-w-6xl px-4 py-12 md:py-16">
      {/* Gradient background blobs for visual appeal */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-emerald-400/20 to-amber-400/20 rounded-full blur-3xl opacity-60 animate-pulse" style={{ animationDuration: '4s' }}></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-amber-400/20 to-emerald-400/20 rounded-full blur-3xl opacity-40 animate-pulse" style={{ animationDuration: '6s' }}></div>
      </div>

      <div className="relative grid md:grid-cols-2 gap-8 md:gap-10 items-center">
        {/* Content side */}
        <div className={`transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          <Badge className="bg-gradient-to-r from-emerald-100 to-amber-100 text-emerald-900 border border-emerald-200 mb-4 animate-pulse shadow-lg">
            <Sparkles className="mr-1.5 h-3.5 w-3.5" />
            Comece aqui
          </Badge>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-white leading-tight">
            {title}
          </h2>
          
          <p className="mt-4 text-base md:text-lg text-zinc-700 dark:text-zinc-300 leading-relaxed text-justify">
            {subtitle}
          </p>
          
          <ul ref={bulletsRef} className="mt-6 space-y-3 text-sm md:text-base text-zinc-700 dark:text-zinc-300">
            {bullets.map((b, i) => (
              <li 
                key={i} 
                className={`flex items-start gap-3 transition-all duration-700 ease-out ${bulletsInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-6'}`}
                style={{ transitionDelay: `${i * 150}ms` }}
              >
                <div className={`mt-0.5 p-1 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-lg transition-all duration-500 ${bulletsInView ? 'scale-100 rotate-0' : 'scale-0 -rotate-180'}`}
                     style={{ transitionDelay: `${i * 150}ms` }}>
                  <Check className="h-3.5 w-3.5 md:h-4 md:w-4 text-white flex-shrink-0" strokeWidth={3} />
                </div>
                <span className="flex-1 text-justify">{b}</span>
              </li>
            ))}
          </ul>
          
          {/* CTA Button - Full width on mobile, auto on desktop */}
          <div className="mt-8 md:mt-10">
            <Button 
              onClick={onBuy} 
              size="lg"
              className="w-full md:w-auto liquid-btn hover-glow buy-btn text-base md:text-lg px-8 py-6 md:py-7 shadow-2xl hover:shadow-emerald-500/50 transition-all duration-300 hover:scale-105 active:scale-95 relative overflow-hidden group"
            >
              {/* Animated shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
              
              <ShoppingCart className="mr-2.5 h-5 w-5 md:h-6 md:w-6" /> 
              <span className="font-bold">Comprar — {priceLabel}</span>
            </Button>
            
            {/* Trust badge below button */}
            <div className="mt-4 flex items-center justify-center md:justify-start gap-2 text-xs md:text-sm text-zinc-600 dark:text-zinc-400">
              <TrendingUp className="h-4 w-4 text-emerald-600" />
              <span className="font-medium">Transforme sua jornada hoje</span>
            </div>
          </div>
        </div>

        {/* Image side */}
        <div className={`order-first md:order-last transition-all duration-700 delay-150 ${inView ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}>
          <div className="mouse-glow rounded-2xl" onMouseMove={(e) => {
            const el = e.currentTarget;
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            el.style.setProperty('--mx', `${x}px`);
            el.style.setProperty('--my', `${y}px`);
          }}>
            <Card className="glass-panel shadow-2xl border-0 rounded-2xl hover:shadow-emerald-500/20 transition-shadow duration-500 relative overflow-hidden">
              {/* Decorative corner accent */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-emerald-500/30 to-transparent rounded-bl-[100%] pointer-events-none"></div>
              
              <CardContent className="p-3 md:p-4">
                <div className="relative rounded-xl overflow-hidden">
                  <OptimizedImage
                    src="/images/capa-1024w"
                    alt="Superando Limites - Capa do livro"
                    sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 580px"
                    widths={[640, 768, 1024]}
                    width={640}
                    height={853}
                    priority={true}
                    preferWebpForLcp={true}
                    className="shadow-lg hover:shadow-2xl transition-shadow duration-300"
                    objectFit="cover"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}, (prevProps, nextProps) => {
  // Custom comparison para evitar re-renders desnecessários
  return prevProps.title === nextProps.title &&
         prevProps.subtitle === nextProps.subtitle &&
         prevProps.bullets === nextProps.bullets &&
         prevProps.imageUrl === nextProps.imageUrl &&
         prevProps.priceLabel === nextProps.priceLabel;
});