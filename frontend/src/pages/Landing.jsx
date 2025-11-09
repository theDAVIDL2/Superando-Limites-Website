import React, { useEffect, useMemo, lazy, Suspense } from "react";
import { bookData } from "../mock";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Separator } from "../components/ui/separator";
// Lazy load componentes below-the-fold
const Accordion = lazy(() => import("../components/ui/accordion").then(m => ({ default: m.Accordion })));
const AccordionContent = lazy(() => import("../components/ui/accordion").then(m => ({ default: m.AccordionContent })));
const AccordionItem = lazy(() => import("../components/ui/accordion").then(m => ({ default: m.AccordionItem })));
const AccordionTrigger = lazy(() => import("../components/ui/accordion").then(m => ({ default: m.AccordionTrigger })));
const Tooltip = lazy(() => import("../components/ui/tooltip").then(m => ({ default: m.Tooltip })));
const TooltipContent = lazy(() => import("../components/ui/tooltip").then(m => ({ default: m.TooltipContent })));
const TooltipProvider = lazy(() => import("../components/ui/tooltip").then(m => ({ default: m.TooltipProvider })));
const TooltipTrigger = lazy(() => import("../components/ui/tooltip").then(m => ({ default: m.TooltipTrigger })));
const AspectRatio = lazy(() => import("../components/ui/aspect-ratio").then(m => ({ default: m.AspectRatio })));
// Componentes críticos above-the-fold carregam normal
import { Toaster } from "../components/ui/sonner";
import { StickyBuyBar } from "../components/StickyBuyBar";
import { StoryStrip } from "../components/sections/StoryStrip";
// PreviewStrip é below-the-fold, lazy load
const PreviewStrip = lazy(() => import("../components/sections/PreviewStrip").then(m => ({ default: m.PreviewStrip })));
import { OptimizedImage } from "../components/OptimizedImage";
// Individual icon imports for better tree-shaking
import ShoppingCart from "lucide-react/dist/esm/icons/shopping-cart";
import Check from "lucide-react/dist/esm/icons/check";
import Truck from "lucide-react/dist/esm/icons/truck";
import Shield from "lucide-react/dist/esm/icons/shield";
import BookOpen from "lucide-react/dist/esm/icons/book-open";
import Star from "lucide-react/dist/esm/icons/star";
import Target from "lucide-react/dist/esm/icons/target";
import ShieldCheck from "lucide-react/dist/esm/icons/shield-check";
import Users from "lucide-react/dist/esm/icons/users";
import GraduationCap from "lucide-react/dist/esm/icons/graduation-cap";
import TrendingUp from "lucide-react/dist/esm/icons/trending-up";
import Heart from "lucide-react/dist/esm/icons/heart";
import Award from "lucide-react/dist/esm/icons/award";
import Clock from "lucide-react/dist/esm/icons/clock";
import MessageCircle from "lucide-react/dist/esm/icons/message-circle";
import Sparkles from "lucide-react/dist/esm/icons/sparkles";
import CheckCircle from "lucide-react/dist/esm/icons/check-circle";
import Quote from "lucide-react/dist/esm/icons/quote";
import MessageSquare from "lucide-react/dist/esm/icons/message-square";
import Globe from "lucide-react/dist/esm/icons/globe";

const currencyFormat = (value) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: bookData.currency });

const GradientBlob = ({ className = "" }) => (
  <div
    className={`pointer-events-none absolute rounded-full blur-3xl opacity-40 ${className}`}
    aria-hidden
  />
);

const Section = ({ id, className = "", children }) => (
  <section id={id} className={`scroll-mt-24 ${className}`}>{children}</section>
);

export default function Landing() {
  const handleMouseGlow = (e) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    el.style.setProperty("--mx", `${x}px`);
    el.style.setProperty("--my", `${y}px`);
  };

  useEffect(() => {
    const visits = JSON.parse(localStorage.getItem("lp_visits") || "[]");
    visits.push({ ts: Date.now() });
    localStorage.setItem("lp_visits", JSON.stringify(visits));

    // Check if user is returning from checkout (back button)
    const wasNavigatingToCheckout = sessionStorage.getItem('navigating_to_checkout');
    if (wasNavigatingToCheckout) {
      // User returned from checkout - clean up Yampi cache again
      sessionStorage.removeItem('navigating_to_checkout');
      
      try {
        // Clear any Yampi-related storage accumulated during checkout visit
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && (key.includes('yampi') || key.includes('cart') || key.includes('checkout'))) {
            keysToRemove.push(key);
          }
        }
        keysToRemove.forEach(key => localStorage.removeItem(key));
        
        const sessionKeysToRemove = [];
        for (let i = 0; i < sessionStorage.length; i++) {
          const key = sessionStorage.key(i);
          if (key && (key.includes('yampi') || key.includes('cart') || key.includes('checkout'))) {
            sessionKeysToRemove.push(key);
          }
        }
        sessionKeysToRemove.forEach(key => sessionStorage.removeItem(key));
      } catch (e) {
        console.warn('Could not clear storage on return:', e);
      }
    }
  }, []);

  const handleBuyOpen = () => {
    // Direct link to Yampi product page - Most robust approach
    // Add timestamp to prevent cache issues and ensure fresh cart
    const timestamp = new Date().getTime();
    const sessionId = Math.random().toString(36).substring(2, 15);
    
    // Clear any Yampi-related cookies/storage to prevent empty cart issues
    try {
      // Clear localStorage items that might affect cart
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.includes('yampi') || key.includes('cart') || key.includes('checkout'))) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key));
      
      // Clear sessionStorage as well
      const sessionKeysToRemove = [];
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key && (key.includes('yampi') || key.includes('cart') || key.includes('checkout'))) {
          sessionKeysToRemove.push(key);
        }
      }
      sessionKeysToRemove.forEach(key => sessionStorage.removeItem(key));
    } catch (e) {
      console.warn('Could not clear storage:', e);
    }
    
    // Mark that we're navigating to checkout (for cleanup on return)
    sessionStorage.setItem('navigating_to_checkout', timestamp.toString());
    
    // Redirect to product page with cache-busting parameters
    const productUrl = `https://superandolimites.pay.yampi.com.br/r/CF3J8HWOZM?t=${timestamp}&sid=${sessionId}`;
    
    // Use window.location.href to allow back button to work
    window.location.href = productUrl;
  };

  const Highlights = useMemo(() => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {bookData.highlights.map((h, idx) => (
        <div
          key={idx}
          className="mouse-glow rounded-2xl"
          onMouseMove={handleMouseGlow}
        >
          <Card className="relative glass-panel backdrop-blur-2xl shadow-xl rounded-2xl">
            <CardHeader className="flex flex-row items-center gap-3">
              <Badge className="bg-emerald-600 text-white hover:bg-emerald-700 rounded-lg">
                {h.icon === "BookOpen" ? <BookOpen size={16} /> : null}
                {h.icon === "Target" ? <Target size={16} /> : null}
                {h.icon === "ShieldCheck" ? <ShieldCheck size={16} /> : null}
              </Badge>
              <CardTitle className="text-base font-semibold">{h.title}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">{h.text}</CardContent>
          </Card>
        </div>
      ))}
    </div>
  ), []);

  return (
    <TooltipProvider>
      <div className="relative min-h-screen bg-gradient-to-b from-amber-50 via-neutral-50 to-white dark:from-zinc-900 dark:via-zinc-950 dark:to-black overflow-x-hidden">
        <Toaster richColors position="top-right" />

        {/* Decorative blobs */}
        <GradientBlob className="w-[34rem] h-[34rem] top-[-6rem] left-[-8rem] bg-amber-200" />
        <GradientBlob className="w-[28rem] h-[28rem] top-[20rem] right-[-10rem] bg-emerald-200" />

        {/* Header */}
        <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/60 dark:bg-zinc-900/60 border-b">
          <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
            <a href="#inicio" className="font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">Superando Limites</a>
            <nav className="hidden md:flex items-center gap-6 text-sm text-zinc-700 dark:text-zinc-300">
              <a href="#conteudo" className="hover:text-zinc-950 dark:hover:text-white transition-colors">Conteúdo</a>
              <a href="#preco" className="hover:text-zinc-950 dark:hover:text-white transition-colors">Preço</a>
              <a href="#faq" className="hover:text-zinc-950 dark:hover:text-white transition-colors">FAQ</a>
              <a href="#autor" className="hover:text-zinc-950 dark:hover:text-white transition-colors">Autor</a>
            </nav>
            <div className="flex items-center gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button onClick={handleBuyOpen} className="liquid-btn hover-glow buy-btn">
                    <ShoppingCart className="mr-2 h-4 w-4" /> Comprar
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Sistema de pagamento seguro</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </header>

        {/* Sticky buy bar */}
        <StickyBuyBar priceLabel={currencyFormat(bookData.price)} onBuy={handleBuyOpen} />

        {/* Story-driven hero */}
        <Section id="inicio" className="relative">
          <StoryStrip
            title={bookData.title}
            subtitle={bookData.subtitle}
            bullets={bookData.bullets}
            onBuy={handleBuyOpen}
            priceLabel={currencyFormat(bookData.price)}
            imageUrl="/images/capa-1024w.webp"
            imageFallbackSrc="/images/capa-1024w.webp"
            imageSrcSet="/images/capa-640w.webp 640w, /images/capa-768w.webp 768w, /images/capa-1024w.webp 1024w"
            sizes="(max-width: 768px) 92vw, (max-width: 1024px) 50vw, 640px"
          />
        </Section>

        <Separator className="my-2" />

        {/* Preview and persuasion */}
        <Section id="conteudo" className="relative">
          <PreviewStrip
            quotes={bookData.quotes}
            onBuy={handleBuyOpen}
            priceLabel={currencyFormat(bookData.price)}
            coverUrl="/images/Palmeiras-873w.webp"
            coverFallbackSrc="/images/Palmeiras-873w.webp"
            coverSrcSet="/images/Palmeiras-640w.webp 640w, /images/Palmeiras-768w.webp 768w, /images/Palmeiras-873w.webp 873w"
            coverSizes="(max-width: 768px) 92vw, 640px"
          />
        </Section>

        {/* Target Audience - Who Should Read This Book */}
        <Section className="relative bg-gradient-to-b from-white via-amber-50/30 to-white dark:from-black dark:via-zinc-900/30 dark:to-black">
          <div className="mx-auto max-w-6xl px-4 py-16">
            <div className="text-center mb-12">
              <Badge className="bg-amber-100 text-amber-900 border border-amber-200 mb-4">
                <Users className="mr-2 h-3.5 w-3.5" /> Para quem é este livro
              </Badge>
              <h3 className="text-2xl md:text-3xl font-bold tracking-tight">{bookData.targetAudience.title}</h3>
              <p className="mt-3 text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">{bookData.targetAudience.subtitle}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {bookData.targetAudience.profiles.map((profile, idx) => (
                <div
                  key={idx}
                  className="mouse-glow rounded-2xl"
                  onMouseMove={handleMouseGlow}
                >
                  <Card className="h-full glass-panel backdrop-blur-2xl shadow-xl hover:shadow-2xl transition-all rounded-2xl">
                    <CardHeader className="flex flex-row items-start gap-4">
                      <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-100 to-emerald-50 dark:from-emerald-900/30 dark:to-emerald-800/20">
                        {profile.icon === "Users" && <Users className="h-6 w-6 text-emerald-700 dark:text-emerald-400" />}
                        {profile.icon === "GraduationCap" && <GraduationCap className="h-6 w-6 text-emerald-700 dark:text-emerald-400" />}
                        {profile.icon === "TrendingUp" && <TrendingUp className="h-6 w-6 text-emerald-700 dark:text-emerald-400" />}
                        {profile.icon === "Heart" && <Heart className="h-6 w-6 text-emerald-700 dark:text-emerald-400" />}
                      </div>
                      <CardTitle className="text-lg font-semibold flex-1">{profile.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-zinc-700 dark:text-zinc-300">{profile.text}</CardContent>
                  </Card>
                </div>
              ))}
            </div>
            <div className="mt-12 flex justify-center">
              <Button onClick={handleBuyOpen} size="lg" className="liquid-btn hover-glow buy-btn">
                <ShoppingCart className="mr-2 h-5 w-5" /> Garanta seu exemplar — {currencyFormat(bookData.price)}
              </Button>
            </div>
          </div>
        </Section>

        {/* Value bullets with CTA */}
        <Section className="relative">
          <div className="mx-auto max-w-6xl px-4 py-10">
            <h3 className="text-2xl md:text-3xl font-bold tracking-tight">Dentro do livro</h3>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">O que você vai encontrar nas páginas.</p>
            <div className="mt-6">{Highlights}</div>
            <div className="mt-10 flex justify-center">
              <Button onClick={handleBuyOpen} className="liquid-btn hover-glow buy-btn">
                <ShoppingCart className="mr-2 h-5 w-5" /> Comprar — {currencyFormat(bookData.price)}
              </Button>
            </div>
          </div>
        </Section>

        {/* Testimonials - Social Proof */}
        <Section className="relative bg-gradient-to-b from-white via-emerald-50/20 to-white dark:from-black dark:via-emerald-900/10 dark:to-black">
          <div className="mx-auto max-w-6xl px-4 py-16">
            <div className="text-center mb-12">
              <Badge className="bg-emerald-100 text-emerald-900 border border-emerald-200 mb-4">
                <Star className="mr-2 h-3.5 w-3.5" /> Depoimentos
              </Badge>
              <h3 className="text-2xl md:text-3xl font-bold tracking-tight">O que os leitores estão dizendo</h3>
              <p className="mt-3 text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
                Histórias reais de pessoas que se inspiraram e transformaram suas vidas
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {bookData.testimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="mouse-glow rounded-2xl"
                  onMouseMove={handleMouseGlow}
                >
                  <Card className="h-full glass-panel backdrop-blur-2xl shadow-xl hover:shadow-2xl transition-all rounded-2xl">
                    <CardHeader>
                      <div className="flex items-start gap-4">
                        <div className="relative">
                          {/* Profile image */}
                          {testimonial.imageUrl ? (
                            <img
                              src={testimonial.imageUrl}
                              alt={testimonial.name}
                              width="56"
                              height="56"
                              className="w-14 h-14 rounded-full object-cover border-2 border-gradient-to-br from-purple-500 via-pink-500 to-orange-400"
                            />
                          ) : (
                            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 flex items-center justify-center">
                              <Users className="h-7 w-7 text-white" />
                            </div>
                          )}
                          {testimonial.verified && (
                            <div className="absolute -bottom-1 -right-1 bg-emerald-600 rounded-full p-1">
                              <CheckCircle className="h-3.5 w-3.5 text-white" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-base">{testimonial.name}</CardTitle>
                          <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">{testimonial.role}</p>
                          <div className="flex gap-0.5 mt-2">
                            {[...Array(testimonial.rating)].map((_, i) => (
                              <Star key={i} className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-zinc-700 dark:text-zinc-300 italic">"{testimonial.text}"</p>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
            {/* AI Assistant CTA after testimonials */}
            <div className="mt-12 text-center">
              <Card className="glass-panel border-emerald-200 dark:border-emerald-800 mx-auto max-w-2xl rounded-2xl">
                <CardContent className="p-6 flex items-start gap-4">
                  <MessageCircle className="h-6 w-6 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-1" />
                  <div className="text-left">
                    <p className="text-sm text-zinc-700 dark:text-zinc-300">
                      {bookData.aiAssistantCTA.afterTestimonials}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="mt-8 flex justify-center">
              <Button onClick={handleBuyOpen} size="lg" className="liquid-btn hover-glow buy-btn">
                <ShoppingCart className="mr-2 h-5 w-5" /> Comprar agora — {currencyFormat(bookData.price)}
              </Button>
            </div>
          </div>
        </Section>

        {/* What Makes This Book Different */}
        <Section className="relative">
          <div className="mx-auto max-w-6xl px-4 py-16">
            <div className="text-center mb-12">
              <Badge className="bg-amber-100 text-amber-900 border border-amber-200 mb-4">
                <Sparkles className="mr-2 h-3.5 w-3.5" /> Diferenciais
              </Badge>
              <h3 className="text-2xl md:text-3xl font-bold tracking-tight">{bookData.differentiators.title}</h3>
              <p className="mt-3 text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">{bookData.differentiators.subtitle}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {bookData.differentiators.points.map((point, idx) => (
                <div
                  key={idx}
                  className="mouse-glow rounded-2xl"
                  onMouseMove={handleMouseGlow}
                >
                  <Card className="h-full glass-panel backdrop-blur-2xl shadow-xl hover:shadow-2xl transition-all border-l-4 border-l-emerald-600 rounded-2xl">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-start gap-3">
                        <Check className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-1" />
                        {point.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-zinc-700 dark:text-zinc-300">
                      {point.text}
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
            <div className="mt-12 flex justify-center">
              <Button onClick={handleBuyOpen} size="lg" className="liquid-btn hover-glow buy-btn w-full md:w-auto">
                <ShoppingCart className="mr-2 h-5 w-5" /> 
                <span className="block md:inline">Quero transformar minha história</span>
                <span className="hidden md:inline"> — {currencyFormat(bookData.price)}</span>
              </Button>
            </div>
          </div>
        </Section>

        {/* Pricing */}
        <Section id="preco" className="relative">
          <div className="mx-auto max-w-6xl px-4 py-12">
            <div
              className="relative overflow-hidden rounded-2xl glass-panel shadow-2xl mouse-glow"
              onMouseMove={handleMouseGlow}
            >
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-emerald-100/40 via-transparent to-amber-100/40" />
              <div className="relative grid md:grid-cols-2">
                <div className="p-8 md:p-10">
                  <Badge className="bg-emerald-100 text-emerald-900 border border-emerald-200 mb-3">
                    <Award className="mr-2 h-3.5 w-3.5" /> Melhor investimento em você
                  </Badge>
                  <h3 className="text-2xl font-bold">Edição física — única opção</h3>
                  <p className="mt-2 text-zinc-600 dark:text-zinc-400">Qualidade premium, papel confortável, capa resistente.</p>
                  <div className="mt-6 flex items-baseline gap-3">
                    <span className="text-4xl font-extrabold tracking-tight">{currencyFormat(bookData.price)}</span>
                    <span className="text-sm text-zinc-500">+ frete</span>
                  </div>
                  <p className="mt-2 text-sm text-zinc-500">{bookData.shippingNote}</p>
                  
                  {/* Trust Signals */}
                  <div className="mt-8 grid grid-cols-2 gap-3">
                    {bookData.trustSignals.map((signal, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300">
                        {signal.icon === "ShieldCheck" && <ShieldCheck className="h-4 w-4 text-emerald-600" />}
                        {signal.icon === "Truck" && <Truck className="h-4 w-4 text-emerald-600" />}
                        {signal.icon === "Award" && <Award className="h-4 w-4 text-emerald-600" />}
                        {signal.icon === "Clock" && <Clock className="h-4 w-4 text-emerald-600" />}
                        <span>{signal.text}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 flex flex-col items-center gap-3">
                    <Button onClick={handleBuyOpen} size="lg" className="liquid-btn hover-glow buy-btn w-full">
                      <ShoppingCart className="mr-2 h-5 w-5" /> Comprar agora — {currencyFormat(bookData.price)}
                    </Button>
                    <p className="text-xs text-zinc-500 text-center">Frete e parcelamento calculados no pagamento</p>
                  </div>

                  {/* AI Assistant CTA in pricing */}
                  <div className="mt-6 p-4 rounded-lg bg-amber-50/50 dark:bg-amber-900/10 border border-amber-200/50 dark:border-amber-800/30">
                    <div className="flex items-start gap-3">
                      <MessageCircle className="h-5 w-5 text-amber-700 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-zinc-700 dark:text-zinc-300">
                        {bookData.aiAssistantCTA.default}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-8 md:p-10 border-t md:border-t-0 md:border-l space-y-6">
                  <div>
                    <h4 className="font-semibold mb-4">O que você leva</h4>
                    <ul className="space-y-2 text-sm text-zinc-700 dark:text-zinc-300">
                      {bookData.bullets.map((b, i) => (
                        <li key={i} className="flex items-start gap-2"><Check className="h-4 w-4 text-emerald-600 mt-0.5" /> {b}</li>
                      ))}
                    </ul>
                  </div>
                  
                  {/* Imagem do livro físico */}
                  <div className="relative">
                    <AspectRatio ratio={4/3} className="overflow-hidden rounded-xl border relative">
                      <OptimizedImage
                        src="/images/livro-1536w"
                        alt="Edição Física Premium - Superando Limites"
                        sizes="(max-width: 768px) 92vw, 640px"
                        widths={[640, 768, 1024, 1280, 1536, 1920, 2048]}
                        width={1536}
                        height={1152}
                        priority={false}
                        objectFit="cover"
                      />
                    </AspectRatio>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* FAQ */}
        <Section id="faq" className="relative">
          <div className="mx-auto max-w-6xl px-4 py-8">
            <h3 className="text-2xl md:text-3xl font-bold tracking-tight">Perguntas frequentes</h3>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">Tire suas dúvidas antes de comprar.</p>
            <Accordion type="single" collapsible className="mt-6 space-y-3">
              {bookData.faqs.map((f, i) => (
                <AccordionItem key={i} value={`item-${i}`} className="rounded-2xl glass-panel border-0">
                  <AccordionTrigger className="px-4">{f.q}</AccordionTrigger>
                  <AccordionContent className="px-4 pb-4 text-zinc-700 dark:text-zinc-300">{f.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            
            {/* AI Assistant CTA after FAQ */}
            <div className="mt-8 mx-auto max-w-2xl">
              <Card className="glass-panel border-emerald-200 dark:border-emerald-800 rounded-2xl">
                <CardContent className="p-6 flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-100 to-emerald-50 dark:from-emerald-900/30 dark:to-emerald-800/20">
                    <MessageCircle className="h-6 w-6 text-emerald-700 dark:text-emerald-400" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold mb-2">Precisa de ajuda?</h4>
                    <p className="text-sm text-zinc-700 dark:text-zinc-300">
                      {bookData.aiAssistantCTA.afterFAQ}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="mt-8 flex justify-center">
              <Button onClick={handleBuyOpen} className="liquid-btn hover-glow buy-btn">
                <ShoppingCart className="mr-2 h-4 w-4" /> Comprar agora — {currencyFormat(bookData.price)}
              </Button>
            </div>
          </div>
        </Section>

        {/* Author - Enhanced with Professional Credibility */}
        <Section id="autor" className="relative bg-gradient-to-b from-white via-zinc-50 to-white dark:from-black dark:via-zinc-900 dark:to-black">
          <div className="mx-auto max-w-6xl px-4 py-16">
            <div className="text-center mb-12">
              <Badge className="bg-emerald-100 text-emerald-900 border border-emerald-200 mb-4">
                <BookOpen className="mr-2 h-3.5 w-3.5" /> Conheça o autor
              </Badge>
              <h3 className="text-2xl md:text-3xl font-bold tracking-tight">{bookData.author.name}</h3>
              <p className="mt-2 text-lg text-emerald-700 dark:text-emerald-400">{bookData.author.role}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-10 items-start">
              <div className="space-y-6">
                <div>
                  <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">{bookData.author.bio}</p>
                  <p className="mt-4 text-zinc-700 dark:text-zinc-300 leading-relaxed">{bookData.author.extendedBio}</p>
                </div>

                {/* Professional Credibility Card */}
                <Card className="glass-panel backdrop-blur-2xl shadow-xl border-l-4 border-l-emerald-600 rounded-2xl">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Award className="h-5 w-5 text-emerald-600" />
                      {bookData.professionalCredibility.currentRole}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-zinc-700 dark:text-zinc-300">
                      {bookData.professionalCredibility.clinic.description}
                    </p>
                    <div className="space-y-2">
                      {bookData.professionalCredibility.clinic.achievements.map((achievement, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-zinc-700 dark:text-zinc-300">{achievement}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Bridge Quote */}
                <Card className="glass-panel backdrop-blur-2xl shadow-xl bg-gradient-to-br from-emerald-50/50 to-amber-50/50 dark:from-emerald-900/10 dark:to-amber-900/10 rounded-2xl">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3">
                      <Quote className="h-6 w-6 text-emerald-600 flex-shrink-0 mt-1" />
                      <p className="text-sm italic text-zinc-800 dark:text-zinc-200">
                        {bookData.professionalCredibility.bridgeMessage}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-center md:justify-start">
                  <Button onClick={handleBuyOpen} size="lg" className="liquid-btn hover-glow buy-btn">
                    <ShoppingCart className="mr-2 h-5 w-5" /> Comprar — {currencyFormat(bookData.price)}
                  </Button>
                </div>
              </div>

              <div className="space-y-6">
                {/* Author Photo */}
                <div className="mouse-glow rounded-2xl" onMouseMove={handleMouseGlow}>
                  <Card className="glass-panel border-0 shadow-xl rounded-2xl">
                    <CardContent className="p-4">
                      <AspectRatio ratio={1} className="overflow-hidden rounded-xl border relative">
                        <OptimizedImage
                          src="/images/japao-1066w"
                          alt="Foto do autor"
                          sizes="(max-width: 768px) 92vw, 420px"
                          widths={[640, 768, 1024, 1066]}
                          width={1066}
                          height={1066}
                          priority={false}
                          objectFit="cover"
                        />
                      </AspectRatio>
                    </CardContent>
                  </Card>
                </div>

                {/* Clinic Photo */}
                <div className="mouse-glow rounded-2xl" onMouseMove={handleMouseGlow}>
                  <Card className="glass-panel border-0 shadow-xl rounded-2xl">
                    <CardContent className="p-4 space-y-3">
                      <AspectRatio ratio={16/9} className="overflow-hidden rounded-xl border relative">
                        <OptimizedImage
                          src="/images/clinica-1280w"
                          alt={bookData.professionalCredibility.clinic.name}
                          sizes="(max-width: 768px) 92vw, 420px"
                          widths={[640, 768, 1024, 1280, 1536, 1920, 2048]}
                          width={1280}
                          height={720}
                          priority={false}
                          objectFit="cover"
                        />
                      </AspectRatio>
                      <h4 className="font-semibold text-center">Excelência em Odontologia</h4>
                    </CardContent>
                  </Card>
                </div>

                {/* Values Card */}
                <Card className="glass-panel backdrop-blur-2xl shadow-xl rounded-2xl">
                  <CardHeader>
                    <CardTitle className="text-base">Valores que conectam</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="grid grid-cols-2 gap-3 text-sm">
                      <li className="flex items-start gap-2 text-zinc-700 dark:text-zinc-300">
                        <Shield className="h-4 w-4 text-emerald-600 mt-0.5" /> Disciplina
                      </li>
                      <li className="flex items-start gap-2 text-zinc-700 dark:text-zinc-300">
                        <Target className="h-4 w-4 text-emerald-600 mt-0.5" /> Foco
                      </li>
                      <li className="flex items-start gap-2 text-zinc-700 dark:text-zinc-300">
                        <Star className="h-4 w-4 text-amber-500 mt-0.5" /> Humildade
                      </li>
                      <li className="flex items-start gap-2 text-zinc-700 dark:text-zinc-300">
                        <BookOpen className="h-4 w-4 text-emerald-600 mt-0.5" /> Aprendizado contínuo
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </Section>

        {/* WhatsApp - Dedicatória Especial e Envio Internacional */}
        <Section className="relative bg-gradient-to-b from-white via-green-50/30 to-white dark:from-black dark:via-green-900/10 dark:to-black">
          <div className="mx-auto max-w-6xl px-4 py-16">
            <div className="text-center mb-8">
              <Badge className="bg-green-100 text-green-900 border border-green-200 mb-4">
                <MessageSquare className="mr-2 h-3.5 w-3.5" /> Contato Direto
              </Badge>
              <h3 className="text-2xl md:text-3xl font-bold tracking-tight">Fale diretamente com o autor</h3>
              <p className="mt-3 text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
                Solicite dedicatória personalizada ou envio internacional pelo WhatsApp
              </p>
            </div>

            <div className="max-w-4xl mx-auto space-y-6">
              {/* Card Dedicatória */}
              <div
                className="mouse-glow rounded-2xl"
                onMouseMove={handleMouseGlow}
              >
                <Card className="glass-panel backdrop-blur-2xl shadow-xl border-l-4 border-l-green-600 rounded-2xl overflow-hidden">
                  <div className="relative">
                    {/* Background gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 via-emerald-50/30 to-green-50/50 dark:from-green-900/20 dark:via-emerald-900/10 dark:to-green-900/20"></div>
                    
                    <CardContent className="relative p-6 md:p-8">
                      <div className="flex flex-col md:flex-row items-center gap-6">
                        {/* WhatsApp Icon */}
                        <div className="flex-shrink-0">
                          <div className="relative w-16 h-16 md:w-20 md:h-20">
                            {/* Glow effect */}
                            <div className="absolute inset-0 bg-green-500/30 blur-2xl rounded-full"></div>
                            {/* Icon container */}
                            <div className="relative w-full h-full bg-gradient-to-br from-green-500 via-green-600 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300">
                              <svg className="w-10 h-10 md:w-12 md:h-12 text-white" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                              </svg>
                            </div>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 text-center md:text-left">
                          <h4 className="text-lg md:text-xl font-bold mb-2">✍️ Dedicatória Personalizada</h4>
                          <p className="text-sm text-zinc-700 dark:text-zinc-300 mb-4">
                            Receba seu livro autografado com uma dedicatória exclusiva do autor Silvio Bernardes
                          </p>
                          <div className="flex flex-col sm:flex-row gap-3 items-center justify-center md:justify-start">
                            <Button
                              onClick={() => {
                                const message = encodeURIComponent("Olá! Gostaria de solicitar uma dedicatória especial no meu livro. Meu nome é: ");
                                window.open(`https://wa.me/5534991089679?text=${message}`, '_blank');
                              }}
                              size="default"
                              className="bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                            >
                              <MessageSquare className="mr-2 h-4 w-4" />
                              Solicitar Dedicatória
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              </div>

              {/* Card Envio Internacional - DESTAQUE */}
              <div
                className="mouse-glow rounded-2xl"
                onMouseMove={handleMouseGlow}
              >
                <Card className="glass-panel backdrop-blur-2xl shadow-2xl border-l-4 border-l-blue-600 rounded-2xl overflow-hidden animate-pulse-subtle">
                  <div className="relative">
                    {/* Background gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50/70 via-indigo-50/50 to-blue-50/70 dark:from-blue-900/30 dark:via-indigo-900/20 dark:to-blue-900/30"></div>
                    
                    <CardContent className="relative p-6 md:p-8">
                      <div className="flex flex-col md:flex-row items-center gap-6">
                        {/* Globe Icon */}
                        <div className="flex-shrink-0">
                          <div className="relative w-16 h-16 md:w-20 md:h-20">
                            {/* Glow effect */}
                            <div className="absolute inset-0 bg-blue-500/40 blur-2xl rounded-full animate-pulse"></div>
                            {/* Icon container */}
                            <div className="relative w-full h-full bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl hover:scale-110 transition-transform duration-300">
                              <Globe className="w-10 h-10 md:w-12 md:h-12 text-white" />
                            </div>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 text-center md:text-left">
                          <h4 className="text-lg md:text-xl font-bold mb-2 text-blue-900 dark:text-blue-100">
                            🌎 Envio Internacional Disponível
                          </h4>
                          <p className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-4">
                            <strong>Mora fora do Brasil?</strong> Entre em contato pelo WhatsApp para calcular o frete internacional e receber seu livro onde você estiver!
                          </p>
                          <div className="flex flex-col sm:flex-row gap-3 items-center justify-center md:justify-start">
                            <Button
                              onClick={() => {
                                const message = encodeURIComponent("Olá! Gostaria de solicitar envio internacional do livro. Meu país/endereço é: ");
                                window.open(`https://wa.me/5534991089679?text=${message}`, '_blank');
                              }}
                              size="default"
                              className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 font-semibold"
                            >
                              <Globe className="mr-2 h-4 w-4" />
                              Solicitar Envio Internacional
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              </div>

              {/* Contact Info */}
              <div className="text-center">
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  WhatsApp: <span className="font-semibold text-green-600 dark:text-green-400">+55 (34) 99108-9679</span>
                </p>
              </div>
            </div>
          </div>
        </Section>

        {/* Redes Sociais */}
        <Section className="relative">
          <div className="mx-auto max-w-6xl px-4 py-16">
            <div className="text-center mb-12">
              <h3 className="text-2xl md:text-3xl font-bold tracking-tight">Conecte-se</h3>
              <p className="mt-2 text-zinc-600 dark:text-zinc-400">Acompanhe mais conteúdo e inspire-se</p>
            </div>
            
            <div className="flex justify-center items-center gap-6 flex-wrap">
              {/* YouTube Card */}
              <a
                href="https://www.youtube.com/@silviobernardes9"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative"
              >
                <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-2xl overflow-hidden transition-all duration-300 hover:scale-110 active:scale-95">
                  {/* Background com gradiente */}
                  <div className="absolute inset-0 bg-gradient-to-br from-red-500 via-red-600 to-red-700"></div>
                  
                  {/* Efeito de brilho */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/30 via-white/10 to-transparent opacity-80"></div>
                  
                  {/* Glow effect */}
                  <div className="absolute -inset-1 bg-red-500/50 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                  
                  {/* Ícone YouTube */}
                  <div className="relative flex items-center justify-center h-full w-full">
                    <svg className="w-8 h-8 md:w-10 md:h-10 text-white drop-shadow-lg" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                  </div>
                  
                  {/* Shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                </div>
                
                {/* Label */}
                <div className="mt-3 text-center">
                  <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                    YouTube
                  </p>
                </div>
              </a>

              {/* Instagram Card */}
              <a
                href="https://www.instagram.com/silviobernardes9/"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative"
              >
                <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-2xl overflow-hidden transition-all duration-300 hover:scale-110 active:scale-95">
                  {/* Background com gradiente Instagram */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400"></div>
                  
                  {/* Efeito de brilho */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/30 via-white/10 to-transparent opacity-80"></div>
                  
                  {/* Glow effect */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                  
                  {/* Ícone Instagram */}
                  <div className="relative flex items-center justify-center h-full w-full">
                    <svg className="w-8 h-8 md:w-10 md:h-10 text-white drop-shadow-lg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                    </svg>
                  </div>
                  
                  {/* Shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                </div>
                
                {/* Label */}
                <div className="mt-3 text-center">
                  <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300 group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors">
                    Instagram
                  </p>
                </div>
              </a>
            </div>
            
            {/* Mensagem adicional */}
            <div className="mt-12 text-center">
              <p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
                Confira vídeos, histórias e mantenha-se atualizado das novidades! Me siga nas redes sociais!
              </p>
            </div>
          </div>
        </Section>

        {/* Patrocinadores */}
        <Section className="relative bg-white dark:bg-zinc-950">
          <div className="mx-auto max-w-6xl px-4 py-16">
            <div className="text-center mb-12">
              <Badge className="bg-amber-100 text-amber-900 border border-amber-200 mb-4">
                <Heart className="mr-2 h-3.5 w-3.5" /> Apoiadores
              </Badge>
              <h3 className="text-2xl md:text-3xl font-bold tracking-tight">Nossos Patrocinadores</h3>
              <p className="mt-3 text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
                Empresas e parceiros que acreditam e apoiam este projeto
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {[
                {
                  name: "DVI_LOGO_COLOR (1)-Photoroom",
                  srcSet: "/images/patrocinadores/DVI_LOGO_COLOR (1)-Photoroom-640w.webp 640w, /images/patrocinadores/DVI_LOGO_COLOR (1)-Photoroom-768w.webp 768w, /images/patrocinadores/DVI_LOGO_COLOR (1)-Photoroom-1024w.webp 1024w",
                  src: "/images/patrocinadores/DVI_LOGO_COLOR (1)-Photoroom-640w.webp",
                  width: 640,
                  height: 200
                },
                {
                  name: "evento final",
                  srcSet: "/images/patrocinadores/evento final-640w.webp 640w, /images/patrocinadores/evento final-768w.webp 768w, /images/patrocinadores/evento final-839w.webp 839w",
                  src: "/images/patrocinadores/evento final-640w.webp",
                  width: 640,
                  height: 200
                },
                {
                  name: "Generated Image September 21, 2025 - 10_58AM",
                  srcSet: "/images/patrocinadores/Generated Image September 21, 2025 - 10_58AM-640w.webp 640w, /images/patrocinadores/Generated Image September 21, 2025 - 10_58AM-768w.webp 768w, /images/patrocinadores/Generated Image September 21, 2025 - 10_58AM-941w.webp 941w",
                  src: "/images/patrocinadores/Generated Image September 21, 2025 - 10_58AM-640w.webp",
                  width: 640,
                  height: 200
                },
                {
                  name: "IMG-20250828-WA0185",
                  srcSet: "/images/patrocinadores/IMG-20250828-WA0185-640w.webp 640w, /images/patrocinadores/IMG-20250828-WA0185-768w.webp 768w, /images/patrocinadores/IMG-20250828-WA0185-1024w.webp 1024w",
                  src: "/images/patrocinadores/IMG-20250828-WA0185-640w.webp",
                  width: 640,
                  height: 200
                },
                {
                  name: "IMG-20250828-WA0186",
                  srcSet: "/images/patrocinadores/IMG-20250828-WA0186-640w.webp 640w, /images/patrocinadores/IMG-20250828-WA0186-768w.webp 768w, /images/patrocinadores/IMG-20250828-WA0186-1024w.webp 1024w",
                  src: "/images/patrocinadores/IMG-20250828-WA0186-640w.webp",
                  width: 640,
                  height: 200
                },
                {
                  name: "logo_02",
                  srcSet: "/images/patrocinadores/logo_02-640w.webp 640w, /images/patrocinadores/logo_02-768w.webp 768w, /images/patrocinadores/logo_02-1000w.webp 1000w",
                  src: "/images/patrocinadores/logo_02-640w.webp",
                  width: 640,
                  height: 200
                },
                {
                  name: "Screenshot_20250828_194103_Adobe Acrobat",
                  srcSet: "/images/patrocinadores/Screenshot_20250828_194103_Adobe Acrobat-640w.webp 640w, /images/patrocinadores/Screenshot_20250828_194103_Adobe Acrobat-768w.webp 768w, /images/patrocinadores/Screenshot_20250828_194103_Adobe Acrobat-1024w.webp 1024w",
                  src: "/images/patrocinadores/Screenshot_20250828_194103_Adobe Acrobat-640w.webp",
                  width: 640,
                  height: 200
                },
                {
                  name: "Screenshot_3",
                  srcSet: "/images/patrocinadores/Screenshot_3-640w.webp 640w, /images/patrocinadores/Screenshot_3-768w.webp 768w, /images/patrocinadores/Screenshot_3-896w.webp 896w",
                  src: "/images/patrocinadores/Screenshot_3-640w.webp",
                  width: 640,
                  height: 200
                }
              ].map((sponsor, idx) => (
                <div
                  key={idx}
                  className="mouse-glow rounded-2xl"
                  onMouseMove={handleMouseGlow}
                >
                  <Card className="h-full bg-white dark:bg-zinc-900 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 rounded-2xl border border-zinc-200 dark:border-zinc-800">
                    <CardContent className="p-6 flex items-center justify-center bg-white dark:bg-zinc-900 rounded-2xl">
                      <div className="w-full h-32 flex items-center justify-center">
                        <img
                          srcSet={sponsor.srcSet}
                          sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 300px"
                          src={sponsor.src}
                          alt={`Patrocinador ${sponsor.name}`}
                          width={sponsor.width}
                          height={sponsor.height}
                          className="max-w-full max-h-full object-contain filter hover:brightness-110 transition-all duration-300"
                          loading="lazy"
                          decoding="async"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Agradecemos o apoio de todos que tornaram este projeto possível
              </p>
            </div>
          </div>
        </Section>

        {/* Footer */}
        <footer className="mt-8 border-t bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl">
          <div className="mx-auto max-w-6xl px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
            <p className="text-zinc-600 dark:text-zinc-400">© {new Date().getFullYear()} Silvio Bernardes. Todos os direitos reservados.</p>
            <div className="flex items-center gap-4 text-zinc-700 dark:text-zinc-300">
              <a href="#preco" className="hover:text-emerald-700 dark:hover:text-emerald-400">Comprar</a>
              <a href="#faq" className="hover:text-emerald-700 dark:hover:text-emerald-400">FAQ</a>
              <a href="#autor" className="hover:text-emerald-700 dark:hover:text-emerald-400">Autor</a>
            </div>
          </div>
        </footer>
      </div>
    </TooltipProvider>
  );
}