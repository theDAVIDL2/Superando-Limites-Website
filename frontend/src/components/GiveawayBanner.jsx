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
        className="fixed top-0 left-0 right-0 z-[100] bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 shadow-xl"
      >
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            <motion.div
              animate={{ rotate: [0, -10, 10, -10, 0], scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              <Gift className="h-6 w-6 text-white" />
            </motion.div>
            
            <div className="flex-1">
              <p className="text-white font-bold text-sm md:text-base">
                🎁 Sorteio: {giveawayData.prize}!
                <span className="ml-2 text-amber-100 font-normal hidden sm:inline">
                  Participe grátis e concorra!
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={handleParticipate}
              size="sm"
              className="bg-white text-orange-600 hover:bg-amber-50 font-bold shadow-lg hover:shadow-xl transition-all"
            >
              Participar
            </Button>
            
            <button
              onClick={handleDismiss}
              className="text-white hover:text-amber-100 transition-colors p-1"
              aria-label="Fechar"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

