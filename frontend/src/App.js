import React, { useEffect, Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Landing from "./pages/Landing";
import { Toaster } from "./components/ui/sonner";
import { throttleRAF } from "./utils/throttle";
import { GiveawayBanner } from "./components/GiveawayBanner";
import { GiveawayNotification } from "./components/GiveawayNotification";

// Lazy load AIChatWidget for better initial bundle size
const AIChatWidget = lazy(() => import('./components/AIChatWidget').then(module => ({ default: module.AIChatWidget })));
const SorteioPage = lazy(() => import('./pages/Sorteio'));

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = BACKEND_URL ? `${BACKEND_URL}/api` : null;

const Ping = () => {
  const helloWorldApi = async () => {
    try {
      if (!API) return; // no backend configured in dev
      const response = await fetch(`${API}/`);
      const data = await response.json();
      console.log(data.message);
    } catch (e) {
      console.error(e, `errored out requesting / api`);
    }
  };
  useEffect(() => {
    helloWorldApi();
  }, []);
  return null;
};

function App() {
  // Force light theme on mobile
  useEffect(() => {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) 
      || window.matchMedia('(max-width: 768px)').matches;
    
    if (isMobile) {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
  }, []);

  // DNS prefetch for external domains after initial load
  useEffect(() => {
    const prefetchDomain = (href) => {
      const link = document.createElement('link');
      link.rel = 'dns-prefetch';
      link.href = href;
      document.head.appendChild(link);
    };
    
    // Delay prefetch to not block initial render
    const timer = setTimeout(() => {
      prefetchDomain('https://us.i.posthog.com');
      prefetchDomain('https://us-assets.i.posthog.com');
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  // Warmup backend connection on idle to reduce first-token latency for AI
  useEffect(() => {
    if (!API) return;
    const warmup = () => {
      try {
        fetch(`${API}/`, { method: 'GET', keepalive: true, cache: 'no-cache' }).catch(() => {});
      } catch {}
    };
    if ('requestIdleCallback' in window) {
      // @ts-ignore
      requestIdleCallback(() => warmup());
    } else {
      setTimeout(warmup, 0);
    }
  }, []);

  // Prefetch AI widget chunk on idle to remove first-interaction lag
  useEffect(() => {
    const prefetch = () => {
      import(/* webpackPrefetch: true */ './components/AIChatWidget');
    };
    if ('requestIdleCallback' in window) {
      // @ts-ignore
      requestIdleCallback(prefetch);
    } else {
      setTimeout(prefetch, 1000);
    }
  }, []);

  useEffect(() => {
    const isTouch = matchMedia('(hover: none), (pointer: coarse)').matches;
    const isMobile = window.matchMedia('(max-width: 768px)').matches;

    // Disable all glow effects on mobile - they don't work well with touch
    if (isMobile) {
      return;
    }

    let clearId = null;
    let lastX = 0;
    let lastY = 0;

    const applyGlowVars = (x, y) => {
      lastX = x; lastY = y;
      document.documentElement.style.setProperty('--mx', `${x}px`);
      document.documentElement.style.setProperty('--my', `${y}px`);
      // Proximity aura for buttons
      const buttons = document.querySelectorAll('.liquid-btn');
      const radius = 160;
      buttons.forEach((btn) => {
        const rect = btn.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = cx - x;
        const dy = cy - y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        const proximity = Math.max(0, 1 - dist / radius);
        btn.style.setProperty('--mx', `${x - rect.left}px`);
        btn.style.setProperty('--my', `${y - rect.top}px`);
        btn.style.setProperty('--btn-glow-opacity', `${proximity * 0.9}`);
        btn.style.setProperty('--btn-neon-opacity', `${proximity * 0.8}`);
      });

      // Proximity aura for glass panels
      const panels = document.querySelectorAll('.mouse-glow');
      const panelRadius = 240;
      panels.forEach((el) => {
        const rect = el.getBoundingClientRect();
        // Closest point on rect to the cursor
        const px = Math.max(rect.left, Math.min(x, rect.right));
        const py = Math.max(rect.top, Math.min(y, rect.bottom));
        const dx = px - x;
        const dy = py - y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        const proximity = Math.max(0, 1 - dist / panelRadius);
        el.style.setProperty('--mx', `${x - rect.left}px`);
        el.style.setProperty('--my', `${y - rect.top}px`);
        el.style.setProperty('--glow-opacity', `${proximity}`);
      });
    };

    // Throttle mouse move com RAF para melhor performance
    const handleMouseMove = throttleRAF((e) => {
      if (isTouch) return;
      applyGlowVars(e.clientX, e.clientY);
    });

    const handleTouchStart = (e) => {
      if (!isTouch) return;
      const t = e.touches[0];
      applyGlowVars(t.clientX, t.clientY);

      // Mobile pulse: briefly boost neon on nearby buttons
      const buttons = document.querySelectorAll('.liquid-btn');
      buttons.forEach((btn) => btn.classList.add('pulse-glow'));
      if (clearId) clearTimeout(clearId);
      clearId = setTimeout(() => {
        buttons.forEach((btn) => btn.classList.remove('pulse-glow'));
      }, 420);
    };

    const handleTouchMove = () => {
      // Keep glow active while scrolling by reapplying proximity
      if (!isTouch) return;
      applyGlowVars(lastX, lastY);
    };

    const handleTouchEnd = () => {
      const buttons = document.querySelectorAll('.liquid-btn');
      buttons.forEach((btn) => {
        btn.style.removeProperty('--btn-glow-opacity');
        btn.style.removeProperty('--btn-neon-opacity');
      });
      const panels = document.querySelectorAll('.mouse-glow');
      panels.forEach((el) => el.style.removeProperty('--glow-opacity'));
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      if (clearId) clearTimeout(clearId);
    };
  }, []);

  return (
    <BrowserRouter>
      <div className="min-h-screen">
        <Ping />
        <Toaster richColors position="top-right" />
        <GiveawayBanner />
        <GiveawayNotification />
        
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/sorteio" element={
            <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Carregando...</div>}>
              <SorteioPage />
            </Suspense>
          } />
        </Routes>
        
        <Suspense fallback={null}>
          <AIChatWidget />
        </Suspense>
      </div>
    </BrowserRouter>
  );
}

export default App;