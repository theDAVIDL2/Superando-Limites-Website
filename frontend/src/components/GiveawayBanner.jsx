import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import Gift from 'lucide-react/dist/esm/icons/gift';
import X from 'lucide-react/dist/esm/icons/x';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = BACKEND_URL ? `${BACKEND_URL}/api` : null;

export function GiveawayBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [giveawayData, setGiveawayData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStatus = async () => {
      if (!API) return;
      
      // Check if user already participated
      const participated = localStorage.getItem('giveaway-participated');
      if (participated) return;
      
      try {
        const response = await fetch(`${API}/giveaway/status`);
        const data = await response.json();
        if (data.active) {
          setGiveawayData(data);
          
          // Check if user has dismissed banner
          const dismissed = localStorage.getItem('giveaway-banner-dismissed');
          if (!dismissed) {
            setIsVisible(true);
          }
        }
      } catch (error) {
        console.error('Error fetching giveaway status:', error);
      }
    };

    fetchStatus();
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('giveaway-banner-dismissed', 'true');
  };

  const handleParticipate = () => {
    navigate('/sorteio');
  };

  if (!giveawayData || !isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -100, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed top-0 left-0 right-0 z-[100]"
        style={{
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          background: 'linear-gradient(135deg, rgba(251, 146, 60, 0.95) 0%, rgba(249, 115, 22, 0.95) 50%, rgba(234, 88, 12, 0.95) 100%)',
          boxShadow: '0 8px 32px 0 rgba(249, 115, 22, 0.37), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.18)'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-1">
            <motion.div
              animate={{ 
                rotate: [0, -10, 10, -10, 0], 
                scale: [1, 1.15, 1],
                filter: ['drop-shadow(0 0 0px rgba(255,255,255,0))', 'drop-shadow(0 0 8px rgba(255,255,255,0.6))', 'drop-shadow(0 0 0px rgba(255,255,255,0))']
              }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              className="p-2 rounded-xl"
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                boxShadow: 'inset 0 2px 4px rgba(255, 255, 255, 0.3)'
              }}
            >
              <Gift className="h-5 w-5 text-white" strokeWidth={2.5} />
            </motion.div>
            
            <div className="flex-1">
              <p className="text-white font-bold text-sm md:text-base tracking-wide" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
                Sorteio Especial: {giveawayData.prize}
              </p>
              <p className="text-white/90 text-xs md:text-sm hidden sm:block" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
                Participe gratuitamente e concorra agora!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={handleParticipate}
              size="sm"
              className="font-bold shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20"
              style={{
                background: 'rgba(255, 255, 255, 0.95)',
                color: '#ea580c',
                backdropFilter: 'blur(10px)'
              }}
            >
              Participar
            </Button>
            
            <button
              onClick={handleDismiss}
              className="transition-all duration-300 p-2 rounded-lg hover:scale-110"
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                boxShadow: 'inset 0 2px 4px rgba(255, 255, 255, 0.2)'
              }}
              aria-label="Fechar"
            >
              <X className="h-4 w-4 text-white" strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

