import React, { memo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { OptimizedImage } from "../OptimizedImage";
import { useInView } from "../../hooks/useInView";
// Individual icon imports for better tree-shaking
import Quote from "lucide-react/dist/esm/icons/quote";
import Star from "lucide-react/dist/esm/icons/star";
import ShoppingCart from "lucide-react/dist/esm/icons/shopping-cart";
import { Button } from "../../components/ui/button";

export const PreviewStrip = memo(({ quotes = [], coverUrl, coverSrcSet, coverAvifSrcSet, coverFallbackSrc, coverSizes, onBuy, priceLabel }) => {
  const [ref, inView] = useInView({ threshold: 0.2 });

  return (
    <section ref={ref} className="mx-auto max-w-6xl px-4 py-16">
      <div className="grid md:grid-cols-2 gap-10 items-start">
        <div
          className={`mouse-glow rounded-2xl transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
          onMouseMove={(e) => {
            const el = e.currentTarget;
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            el.style.setProperty('--mx', `${x}px`);
            el.style.setProperty('--my', `${y}px`);
          }}
        >
          <Card className="relative glass-panel shadow-2xl rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Star className="h-5 w-5 text-amber-500" /> Trechos marcantes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {quotes.map((q, i) => (
                <div key={i} className="p-4 rounded-2xl glass-panel border-0">
                  <div className="flex items-start gap-2 text-zinc-800 dark:text-zinc-200">
                    <Quote className="h-5 w-5 text-emerald-600 mt-0.5" />
                    <p className="text-sm">{q.text}</p>
                  </div>
                  {/* Source intentionally hidden on mobile: remove chapter/page mentions */}
                </div>
              ))}
              <div className="pt-4 flex justify-center">
                <Button onClick={onBuy} className="liquid-btn hover-glow buy-btn">
                  <ShoppingCart className="mr-2 h-5 w-5" /> Comprar — {priceLabel}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className={`transition-all duration-700 delay-150 ${inView ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}>
          <div className="relative rounded-2xl overflow-hidden shadow-2xl">
            <OptimizedImage
              src="/images/Palmeiras-768w"
              alt="Treino no Palmeiras"
              sizes="(max-width: 768px) 92vw, 640px"
              widths={[640, 768, 873]}
              width={873}
              height={655}
              priority={false}
              objectFit="cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}, (prevProps, nextProps) => {
  // Custom comparison para evitar re-renders desnecessários
  return prevProps.quotes === nextProps.quotes &&
         prevProps.coverUrl === nextProps.coverUrl &&
         prevProps.priceLabel === nextProps.priceLabel;
});